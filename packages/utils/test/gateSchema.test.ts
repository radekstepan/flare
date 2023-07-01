import test from "ava";
import { gateSchema } from "../src/schema.js";

const validCondition = {
  id: "foo",
  operation: "exclude",
  kind: "context",
  path: "valid.path",
  value: ["a"],
};

test("should throw an error for invalid root value", async (t) => {
  const [res] = await Promise.allSettled([gateSchema.validateAsync("foo")]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" must be of type object'
  );
});

test("should throw an error for missing root value", async (t) => {
  const [res] = await Promise.allSettled([gateSchema.validateAsync(undefined)]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"value" is required');
});

test('should throw an error for missing "eval"', async (t) => {
  const [res] = await Promise.allSettled([gateSchema.validateAsync({})]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"eval" is required');
});

test('should throw an error for invalid "eval"', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: 1,
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"eval" must be one of [string, boolean]'
  );
});

test('should throw an error for missing "conditions"', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"conditions" is required'
  );
});

test('should throw an error for empty "conditions"', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
      conditions: [],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"conditions" does not contain 1 required value(s)'
  );
});

test('should throw an error for invalid "conditions"', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
      conditions: ["invalid_condition"],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"conditions[0]" must be of type object'
  );
});

test('should throw an error for one invalid "conditions"', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
      conditions: [validCondition, {}],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"conditions[1].id" is required'
  );
});

test('should throw an error when "conditions[].id" is not unique', async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
      conditions: [validCondition, validCondition],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" failed custom validation because each condition must have a unique "id"'
  );
});

test("should throw an error when an eval condition is missing", async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "foo || bar",
      conditions: [validCondition],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" failed custom validation because condition "bar" is missing'
  );
});

test("should validate a valid gate schema", async (t) => {
  const [res] = await Promise.allSettled([
    gateSchema.validateAsync({
      eval: "true",
      conditions: [validCondition],
    }),
  ]);

  t.like(res, {
    status: "fulfilled",
    value: {
      eval: "true",
      conditions: [validCondition],
    },
  });
});
