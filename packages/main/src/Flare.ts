import {
  Kind,
  type Operation,
  type CompiledGate,
  type Condition,
  type Gates,
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

        const conditions = new Map(
          gate.conditions.map((condition) => [
            condition.id,
            {
              ...condition,
              value: new Set(condition.value),
            },
          ])
        );

        this.gates.set(name, {
          conditions,
          eval: compile(gate.eval),
        });
      }
    });
    this.jobRunner = jobRunner(promise);
  }

  // Known gate condition operations.
  static conditionOperations: Record<
    Operation,
    (set: Set<ContextValue>, value: ContextValue | null) => boolean
  > = {
    exclude: (set, value) => (value === null ? true : !set.has(value)),
    include: (set, value) => (value === null ? false : set.has(value)),
  };

  // Known gate conditions.
  evaluateCondition(
    condition: Condition<Set<ContextValue>>,
    context: Context,
    strict = false
  ): boolean {
    try {
      if (condition.kind === Kind.CONTEXT) {
        const value = getProperty<ContextValue>(context, condition.path);
        if (strict && value === null) {
          throw new Error(
            `condition "${condition.id}" missing context value "${condition.path}"`
          );
        }
        return Flare.conditionOperations[condition.operation](
          condition.value,
          value
        );
      }

      throw new Error(
        `condition "${condition.id}" kind "${condition.kind}" is not known`
      );
    } catch (err) {
      if (strict) {
        throw err;
      }
      return false;
    }
  }

  // Eval a gate given an input context.
  async evaluate(name: string, context: Context, strict = false) {
    return this.jobRunner(async () => {
      let bool = false;
      const gate = this.gates.get(name);
      if (gate) {
        // Eval the compiled gate, fetching condition results as necessary.
        try {
          bool = gate.eval((id: string) => {
            const condition = gate.conditions.get(id);
            if (!condition) {
              throw new Error(`condition "${id}" not found`);
            }
            return this.evaluateCondition(condition, context, strict);
          });
        } catch (err) {
          if (strict) {
            return Promise.reject(
              err instanceof Error
                ? `"${name}" ${err.message}`
                : "Something went wrong"
            );
          }
        }
      }

      return {
        [name]: bool,
      };
    });
  }

  // Eval the gates given an input context.
  async evaluateAll(context: Context, strict = false) {
    return this.jobRunner(async () => {
      const res: Flags[] = await Promise.all(
        Array.from(this.gates.keys()).map((name) =>
          this.evaluate(name, context, strict)
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
