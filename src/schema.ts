import Joi from "joi";

export const conditionSchema = Joi.object()
  .keys({
    id: Joi.string().alphanum().required(),
    operation: Joi.string().valid("exclude", "include").required(),
    kind: Joi.string().valid("context").required(),
    path: Joi.string()
      .pattern(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/)
      .required(),
    value: Joi.array()
      .items(Joi.alternatives().try(Joi.string(), Joi.number()))
      .required(),
  })
  .required();

export const gateSchema = Joi.object()
  .keys({
    eval: Joi.string().required(),
    conditions: Joi.array().has(conditionSchema).required(),
  })
  .required();
