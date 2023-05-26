import {
  CompiledGate,
  Condition,
  Data,
  EvalContext,
  EvalReturn,
  Flags,
  InputContext,
  Operation,
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
    input: InputContext
  ): boolean {
    let value: string;
    switch (condition.kind) {
      case "context":
        // TODO opa
        value = input[condition.path] as string;
        return Flare.conditionOperations[condition.operation](
          condition.value,
          value
        );
      default:
        return false;
    }
  }

  // Eval the gates given an input context.
  async evaluate(input: InputContext) {
    return this.jobRunner(async () => {
      const promises: [string, EvalReturn][] = [];

      for (const [name, gate] of this.gates) {
        const context: EvalContext = {};
        for (let condition of gate.conditions) {
          context[condition.id] = Flare.evaluateCondition(condition, input);
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