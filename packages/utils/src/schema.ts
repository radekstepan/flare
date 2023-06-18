import Joi from "joi";

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
    conditions: Joi.array().items(conditionSchema).required().min(1),
  })
  .required();

export const gatesSchema = Joi.object()
  .pattern(SLUG, gateSchema)
  .required()
  .min(1);
