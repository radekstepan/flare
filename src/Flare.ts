import {
  CompiledGate,
  Condition,
  Context,
  Data,
  EvalReturn,
  Flags,
  Jwt,
  Operation,
  Params,
} from "./interfaces";
import compile from "./compile";
import jobRunner, { type DoJob } from "./jobRunner";

class Flare {
  gates = new Map<string, CompiledGate>();
  jobRunner: DoJob<Flags>;

  // Compile the expressions and save gates.
  constructor(dataOrPromise: Data | Promise<Data>) {
    const promise = Promise.resolve(dataOrPromise).then((data) => {
      for (let name in data) {
        const gate = data[name];

        this.gates.set(name, {
          conditions: gate.conditions.map((condition) => ({
            ...condition,
            value: new Set(condition.value),
          })),
          eval: compile(gate.eval),
        });
      }
    });
    this.jobRunner = jobRunner(promise);
  }

  // Known gate condition operations.
  static conditionOperations: Record<
    Operation,
    (set: Set<string>, value: string) => boolean
  > = {
    exclude: (set, value) => !set.has(value),
    include: (set, value) => set.has(value),
  };

  // Known gate conditions.
  static evaluateCondition(
    condition: Condition<Set<string>>,
    jwt: Jwt,
    parameters: Params
  ): boolean {
    let value: string;
    switch (condition.kind) {
      case "jwt":
        value = jwt[condition.path.split(".")[1]];
        return Flare.conditionOperations[condition.operation](
          condition.value,
          value
        );
      case "parameter":
        value = parameters[condition.path];
        return Flare.conditionOperations[condition.operation](
          condition.value,
          value
        );
      default:
        return false;
    }
  }

  // Eval the gates given a context.
  async evaluate(jwt: Jwt, parameters: Params) {
    return this.jobRunner(async () => {
      const promises: [string, EvalReturn][] = [];

      for (const [name, gate] of this.gates) {
        const context: Context = {};
        for (let condition of gate.conditions) {
          context[condition.id] = Flare.evaluateCondition(
            condition,
            jwt,
            parameters
          );
        }

        promises.push([name, gate.eval(context)]);
      }

      const res: [string, Awaited<EvalReturn>][] = await Promise.all(
        promises.map(async ([name, promise]) => [name, await promise])
      );

      return res.reduce<Flags>((acc, [name, bool]) => {
        // can get undefined when some of the vars in context are not populated
        acc[name] = bool || false;
        return acc;
      }, {});
    });
  }
}

export default Flare;
