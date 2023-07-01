import Joi from "joi";
import { compile } from "@radekstepan/flare";
import type { Data, Gate } from "@radekstepan/flare-types";

export const JS_VAR = /^[$a-z_][0-9a-z_$]*$/i; // JS variable name (kinda)
export const PATH = /^[a-z0-9]+(\.[a-z0-9]+)*$/i; // object path separating parts with a "."
export const SLUG = /^[a-z0-9]+((?:\/|\-)[a-z0-9]+)*$/i; // slug delimited by a "/" or "-"

// Joi schema for validating condition objects.
export const conditionSchema = Joi.object()
  .keys({
    id: Joi.string().pattern(JS_VAR).required(), // 'id' must be a valid JS variable name (ish)
    operation: Joi.string().valid("exclude", "include").required(), // 'operation' must be either 'exclude' or 'include'
    kind: Joi.string().valid("context").required(), // 'kind' must be 'context'
    path: Joi.string().pattern(PATH).required(), // 'path' must be a valid object path
    value: Joi.array()
      .items(Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean())) // 'value' must be an array of strings, numbers, or booleans
      .required()
      .min(1),
  })
  .required();

// Joi schema for validating gate objects.
export const gateSchema = Joi.object()
  .keys({
    eval: Joi.alternatives()
      .try(Joi.string(), Joi.boolean()) // 'value' must be either a string or a boolean
      .required(),
    conditions: Joi.array()
      .items(conditionSchema) // 'conditions' must be an array of valid condition objects
      .required()
      .min(1),
  })
  .required()
  .custom((gate: Gate) => {
    // Extract the set of known conditions and make sure they are unique.
    let knownConditions = new Set<string>();
    if ("conditions" in gate && Array.isArray(gate.conditions)) {
      for (const condition of gate.conditions) {
        if (condition && typeof condition === "object" && "id" in condition) {
          if (knownConditions.has(condition.id)) {
            throw new Error(`condition id "${condition.id}" is not unique`);
          }
          knownConditions.add(condition.id);
        }
      }
    }
    // Make sure eval compiles and all conditions are defined.
    if ("eval" in gate) {
      const [, evalConditions] = compile(gate.eval);
      for (const cond of evalConditions) {
        if (!knownConditions.has(cond)) {
          throw new Error(`condition "${cond}" is missing`);
        }
      }
    }
    return gate;
  }, "valid compile eval expression and conditions");

// Joi schema for validating an array of map of gate objects.
export const gatesSchema = Joi.array()
  .items(
    Joi.object()
      .pattern(SLUG, gateSchema) // Each key must be a valid slug, and the value must be a valid gate object
      .required()
      .min(1)
  )
  .custom((data: Data) => {
    const names = new Set<string>();
    for (const gates of data) {
      if (gates && typeof gates === "object") {
        for (const name in gates) {
          if (names.has(name)) {
            throw new Error(`gate name "${name}" is not unique`);
          }
          names.add(name);
        }
      }
    }
    return data;
  }, "unique gate names");
