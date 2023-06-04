import test from "ava";
import { conditionSchema } from "../../src/schema.js";

const validCondition = {
  id: "foo",
  operation: "exclude",
  kind: "context",
  path: "valid.path",
  value: [],
};

test("should throw an error for invalid root value", async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync("foo"),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" must be of type object'
  );
});

test("should throw an error for missing root value", async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync(undefined),
  ]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"value" is required');
});

test('should throw an error for missing "id"', async (t) => {
  const [res] = await Promise.allSettled([conditionSchema.validateAsync({})]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"id" is required');
});

test('should throw an error for invalid "id"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo bar",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"id" must only contain alpha-numeric characters'
  );
});

test('should throw an error for missing "operation"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"operation" is required'
  );
});

test('should throw an error for invalid "operation"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "dessert torn",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"operation" must be one of [exclude, include]'
  );
});

test('should throw an error for missing "kind"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"kind" is required');
});

test('should throw an error for invalid "kind"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
      kind: "custom",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"kind" must be [context]'
  );
});

test('should throw an error for missing "path"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
      kind: "context",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"path" is required');
});

test('should throw an error for invalid "path"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
      kind: "context",
      path: "./",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"path" with value "./" fails to match the required pattern: /^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*$/'
  );
});

test('should throw an error for missing "value"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
      kind: "context",
      path: "key.path",
    }),
  ]);

  t.is(res.status, "rejected");
  t.is((res as PromiseRejectedResult).reason.message, '"value" is required');
});

test('should throw an error for invalid "value"', async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync({
      id: "foo",
      operation: "exclude",
      kind: "context",
      path: "key.path",
      value: [{ object: { not: { supported: true } } }],
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value[0]" must be one of [string, number]'
  );
});

test("should validate a valid condition schema", async (t) => {
  const [res] = await Promise.allSettled([
    conditionSchema.validateAsync(validCondition),
  ]);

  t.like(res, {
    status: "fulfilled",
    value: validCondition,
  });
});