import Joi from "joi";

export const conditionSchema = Joi.object()
  .keys({
    id: Joi.string().alphanum().required(),
    operation: Joi.string().valid("exclude", "include").required(),
    kind: Joi.string().valid("context").required(),
    path: Joi.string()
      .pattern(/^[a-z0-9]+(\.[a-z0-9]+)*$/i) // file path with "."
      .required(),
    value: Joi.array()
      .items(Joi.alternatives().try(Joi.string(), Joi.number()))
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
  .pattern(
    /^[a-z0-9]+(\/[a-z0-9]+)*$/i, // slug delimited by a "/"
    gateSchema
  )
  .required()
  .min(1);
