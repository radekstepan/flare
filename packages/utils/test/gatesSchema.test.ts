import test from "ava";
import { gatesSchema } from "../src/schema.js";
import { Operation, Kind, type Gate } from "@radekstepan/flare-types";

const validGate: Gate = {
  eval: "foo",
  conditions: [
    {
      id: "foo",
      operation: Operation.EXCLUDE,
      kind: Kind.CONTEXT,
      path: "valid.path",
      value: ["a"],
    },
  ],
};

test("should throw an error on invalid root value", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync(validGate),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" must be an array'
  );
});

test("should throw an error on invalid gates object", async (t) => {
  const [res] = await Promise.allSettled([gatesSchema.validateAsync(["foo"])]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"[0]" must be of type object'
  );
});

test("should throw an error on empty gates object", async (t) => {
  const [res] = await Promise.allSettled([gatesSchema.validateAsync([{}])]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"[0]" must have at least 1 key'
  );
});

test("should throw an error on invalid gate name", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync([
      {
        "my gate name?": validGate,
      },
    ]),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"[0].my gate name?" is not allowed'
  );
});

test("should throw an error on a non-unique gate name", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync([
      {
        foo: validGate,
      },
      {
        foo: validGate,
      },
    ]),
  ]);

  t.is(res.status, "rejected");
  t.is(
    (res as PromiseRejectedResult).reason.message,
    '"value" failed custom validation because gate name "foo" is not unique'
  );
});

test("should validate a valid gates schema", async (t) => {
  const [res] = await Promise.allSettled([
    gatesSchema.validateAsync([
      {
        "foo/bar-baz": validGate,
      },
    ]),
  ]);

  t.like(res, {
    status: "fulfilled",
    value: [
      {
        "foo/bar-baz": validGate,
      },
    ],
  });
});
