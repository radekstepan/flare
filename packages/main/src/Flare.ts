import {
  Kind,
  type Operation,
  type CompiledGate,
  type Condition,
  type Gates,
  type EvalContext,
  type Flags,
  type Context,
  type ContextValue,
} from "@radekstepan/flare-types";
import compile from "./compile.js";
import jobRunner, { type DoJob } from "./jobRunner.js";
import { getProperty } from "./object.js";

class Flare {
  gates = new Map<string, CompiledGate>();
  jobRunner: DoJob<Flags>;

  // Compile the expressions and save gates.
  constructor(dataOrPromise: Gates | Promise<Gates>) {
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
    (set: Set<ContextValue>, value: ContextValue) => boolean
  > = {
    exclude: (set, value) => !set.has(value),
    include: (set, value) => set.has(value),
  };

  // Known gate conditions.
  static evaluateCondition(
    condition: Condition<Set<ContextValue>>,
    context: Context
  ): boolean {
    if (condition.kind === Kind.CONTEXT) {
      const value = getProperty<ContextValue>(context, condition.path);
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
  async evaluate(name: string, context: Context) {
    return this.jobRunner(async () => {
      const gate = this.gates.get(name);
      if (!gate) {
        return Promise.resolve({ [name]: false });
      }

      const evalContext: EvalContext = {};
      for (let condition of gate.conditions) {
        evalContext[condition.id] = Flare.evaluateCondition(condition, context);
      }

      const bool = await gate.eval(evalContext);
      return { [name]: Boolean(bool) };
    });
  }

  // Eval the gates given an input context.
  async evaluateAll(context: Context) {
    return this.jobRunner(async () => {
      const res: Flags[] = await Promise.all(
        Array.from(this.gates.keys()).map((name) =>
          this.evaluate(name, context)
        )
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
