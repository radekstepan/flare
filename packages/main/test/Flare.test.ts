import test from "ava";
import Flare from "../src/Flare.js";
import { Kind, Operation } from "@radekstepan/flare-types";

test("should allow a promise to initialize data", async (t) => {
  const engine = new Flare(
    Promise.resolve({
      foo: {
        eval: "true",
        conditions: [],
      },
    })
  );

  const flags = await engine.evaluateAll({
    company: "acme",
    user: "tony",
  });

  t.like(flags, { foo: true });
});

test("should evaluate a single gate", async (t) => {
  const engine = new Flare({
    foo: {
      eval: "user && company",
      conditions: [
        {
          kind: Kind.CONTEXT,
          id: "user",
          operation: Operation.INCLUDE,
          path: "user",
          value: ["tony"],
        },
        {
          kind: Kind.CONTEXT,
          id: "company",
          operation: Operation.INCLUDE,
          path: "company",
          value: ["acme"],
        },
      ],
    },
  });

  const flags = await engine.evaluate("foo", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { foo: true });
});

test("should return false if the expression result isn't boolean", async (t) => {
  const engine = new Flare({
    foo: {
      eval: "0 + 1",
      conditions: [
        {
          kind: Kind.CONTEXT,
          id: "user",
          operation: Operation.INCLUDE,
          path: "user",
          value: ["tony"],
        },
        {
          kind: Kind.CONTEXT,
          id: "company",
          operation: Operation.INCLUDE,
          path: "company",
          value: ["acme"],
        },
      ],
    },
  });

  const flags = await engine.evaluate("foo", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { foo: false });
});

test("should return false if a gate is not found", async (t) => {
  const engine = new Flare({});

  const flags = await engine.evaluate("bar", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { bar: false });
});

test("should return false if the condition.kind is unknown", (t) => {
  t.false(
    Flare.evaluateCondition(
      {
        kind: "unknown" as any,
        id: "",
        operation: Operation.INCLUDE,
        path: "",
        value: new Set(),
      },
      {}
    )
  );
});

test("should return false if the condition.path doesn't exist", (t) => {
  t.false(
    Flare.evaluateCondition(
      {
        kind: Kind.CONTEXT,
        id: "",
        operation: Operation.INCLUDE,
        path: "foo",
        value: new Set("tommy"),
      },
      { user: "tommy" }
    )
  );
});
