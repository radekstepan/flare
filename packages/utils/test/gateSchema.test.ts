import test from "ava";
import { gateSchema } from "../src/schema.js";

const validCondition = {
  id: "foo",
  operation: "exclude",
  kind: "context",
  path: "valid.path",
  value: [],
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
      eval: true,
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"eval" must be a string'
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
    '"conditions" does not contain at least one required match'
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
