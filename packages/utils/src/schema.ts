import Joi from "joi";
import type { Condition } from "@radekstepan/flare-types";

export const JS_VAR = /^[$a-z_][0-9a-z_$]*$/i; // JS variable name (kinda)
export const PATH = /^[a-z0-9]+(\.[a-z0-9]+)*$/i; // file path with "."
export const SLUG = /^[a-z0-9]+((?:\/|\-)[a-z0-9]+)*$/i; // slug delimited by a "/" or "-"

export const conditionSchema = Joi.object()
  .keys({
    id: Joi.string().pattern(JS_VAR).required(),
    operation: Joi.string().valid("exclude", "include").required(),
    kind: Joi.string().valid("context").required(),
    path: Joi.string().pattern(PATH).required(),
    value: Joi.array()
      .items(Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()))
      .required()
      .min(1),
  })
  .required();

export const gateSchema = Joi.object()
  .keys({
    eval: Joi.string().required(),
    conditions: Joi.array()
      .items(conditionSchema)
      .required()
      .min(1)
      .custom((value) => {
        const ids = value.map((item: Condition<any>) => item.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          throw new Error('each condition must have a unique "id"');
        }
        return value;
      }, "unique condition id"),
  })
  .required();

export const gatesSchema = Joi.object()
  .pattern(SLUG, gateSchema)
  .required()
  .min(1);
