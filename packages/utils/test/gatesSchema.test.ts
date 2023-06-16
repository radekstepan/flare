import test from "ava";
import { gatesSchema } from "../src/schema.js";

const validGate = {
  eval: "foo",
  conditions: [
    {
      id: "foo",
      operation: "exclude",
      kind: "context",
      path: "valid.path",
      value: ["a"],
    },
  ],
};

test("should throw an error for invalid root value", async (t) => {
  const [res] = await Promise.allSettled([gatesSchema.validateAsync("foo")]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" must be of type object'
  );
});

test("should throw an error for empty root value", async (t) => {
  const [res] = await Promise.allSettled([gatesSchema.validateAsync({})]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" must have at least 1 key'
  );
});

test("should throw an error for invalid gate name", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync({
      "my gate name?": validGate,
    }),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"my gate name?" is not allowed'
  );
});

test("should validate a valid gates schema", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync({
      "foo/bar": validGate,
    }),
  ]);

  t.like(res, {
    status: "fulfilled",
    value: {
      "foo/bar": validGate,
    },
  });
});
