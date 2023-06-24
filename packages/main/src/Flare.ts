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
  // Map to store compiled gates.
  gates = new Map<string, CompiledGate>();
  // Job runner for async tasks.
  jobRunner: DoJob<Flags>;

  // The constructor compiles the gates.
  constructor(dataOrPromise: Gates | Promise<Gates>) {
    const promise = Promise.resolve(dataOrPromise).then((data) => {
      // Compile each gate and store it in the `gates` Map.
      for (let name in data) {
        const gate = data[name];

        // Convert the conditions of each gate into a Map for easy access.
        const conditions = new Map(
          gate.conditions.map((condition) => [
            condition.id,
            {
              ...condition,
              // A list of values turned into a Set (faster eval, slower boot).
              value: new Set(condition.value),
            },
          ])
        );

        // Compile the gate's expression and save it in the `gates` Map.
        this.gates.set(name, {
          conditions,
          eval: compile(gate.eval),
        });
      }
    });
    // Initialize the job runner with the promise that resolves with the compiled gates.
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

  // Evaluate a condition given a context.
  evaluateCondition(
    condition: Condition<Set<ContextValue>>,
    context: Context,
    strict = false
  ): boolean {
    try {
      if (condition.kind === Kind.CONTEXT) {
        // Get the value from the context using the condition's path.
        const value = getProperty<ContextValue>(context, condition.path);
        if (strict && value === null) {
          throw new Error(
            `condition "${condition.id}" missing context value "${condition.path}"`
          );
        }
        // Evaluate the condition using the operation defined for the condition.
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
      // Default to false.
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
          // The gate's eval function is called with a function that evaluates a condition by its id.
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

  // Eval all gates given an input context.
  async evaluateAll(context: Context, strict = false) {
    return this.jobRunner(async () => {
      const res: Flags[] = await Promise.all(
        Array.from(this.gates.keys()).map((name) =>
          this.evaluate(name, context, strict)
        )
      );

      // Merge the results of each gate evaluation into a single object.
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
