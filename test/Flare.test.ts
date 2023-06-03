import test from "ava";
import Flare from "../src/Flare.js";

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
          kind: "context",
          id: "user",
          operation: "include",
          path: "user",
          value: ["tony"],
        },
        {
          kind: "context",
          id: "company",
          operation: "include",
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

test("should default to false if a gate is not found", async (t) => {
  const engine = new Flare({});

  const flags = await engine.evaluate("bar", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { bar: false });
});

test("should default to false", (t) => {
  t.false(
    Flare.evaluateCondition(
      {
        kind: "unknown" as any,
        id: "",
        operation: "include",
        path: "",
        value: new Set(),
      },
      {}
    )
  );
});

test("should return false if an input path doesn't exist", (t) => {
  t.false(
    Flare.evaluateCondition(
      {
        kind: "context",
        id: "",
        operation: "include",
        path: "foo",
        value: new Set("tommy"),
      },
      { user: "tommy" }
    )
  );
});
