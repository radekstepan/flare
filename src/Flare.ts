import compile from "./compile.js";
import jobRunner, { type DoJob } from "./jobRunner.js";
import type {
  CompiledGate,
  Condition,
  Data,
  EvalContext,
  Flags,
  InputContext,
  InputContextValue,
  Operation,
} from "./interfaces.js";
import { getProperty } from "./object.js";

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
    (set: Set<InputContextValue>, value: InputContextValue) => boolean
  > = {
    exclude: (set, value) => !set.has(value),
    include: (set, value) => set.has(value),
  };

  // Known gate conditions.
  static evaluateCondition(
    condition: Condition<Set<InputContextValue>>,
    input: InputContext
  ): boolean {
    if (condition.kind === "context") {
      const value = getProperty(input, condition.path);
      if (value === null) {
        return false;
      }
      return Flare.conditionOperations[condition.operation](
        condition.value,
        value
      );
    }

    return false;
  }

  // Eval a gate given an input context.
  async evaluate(name: string, input: InputContext) {
    return this.jobRunner(async () => {
      const gate = this.gates.get(name);
      if (!gate) {
        return Promise.resolve({ [name]: false });
      }

      const context: EvalContext = {};
      for (let condition of gate.conditions) {
        context[condition.id] = Flare.evaluateCondition(condition, input);
      }

      const bool = await gate.eval(context);
      return { [name]: Boolean(bool) };
    });
  }

  // Eval the gates given an input context.
  async evaluateAll(input: InputContext) {
    return this.jobRunner(async () => {
      const res: Flags[] = await Promise.all(
        Array.from(this.gates.keys()).map((name) => this.evaluate(name, input))
      );

      return res.reduce<Flags>(
        (acc, flags) => ({
          ...acc,
          ...flags,
        }),
        {}
      );
    });
  }
}

export default Flare;
