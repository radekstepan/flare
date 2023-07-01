import test from "ava";
import Flare from "../src/Flare.js";
import { Kind, Operation } from "@radekstepan/flare-types";

test("should allow a promise to initialize data", async (t) => {
  const engine = new Flare(
    Promise.resolve([
      {
        foo: {
          eval: "true",
          conditions: [],
        },
      },
    ])
  );

  const flags = await engine.evaluateAll({
    company: "acme",
    user: "tony",
  });

  t.like(flags, { foo: true });
});

test("should evaluate a single gate", async (t) => {
  const engine = new Flare([
    {
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
    },
  ]);

  const flags = await engine.evaluate("foo", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { foo: true });
});

test("should throw an error if the eval expression cannot be compiled", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "0 + 1",
        conditions: [],
      },
    },
  ]);

  const evalPromise = engine.evaluate("foo", {});

  const [evalResult] = await Promise.allSettled([evalPromise]);

  const rejection = {
    status: "rejected",
    reason: new Error('Expression type "BinaryExpression" is invalid'),
  };

  t.like(evalResult, rejection);
});

test("should throw an error if an eval expression has a condition missing (strict)", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "bar",
        conditions: [],
      },
    },
  ]);

  const evalPromise = engine.evaluate("foo", {}, true);

  const [evalResult] = await Promise.allSettled([evalPromise]);

  const rejection = {
    status: "rejected",
    reason: '"foo" condition "bar" not found',
  };

  t.like(evalResult, rejection);
});

test("should throw a generic error on an unexpected eval error (strict)", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "user",
        conditions: [
          {
            kind: Kind.CONTEXT,
            id: "user",
            operation: Operation.INCLUDE,
            path: "user",
            value: ["tony"],
          },
        ],
      },
    },
  ]);

  engine.evaluateCondition = () => {
    throw "💣";
  };
  const evalPromise = engine.evaluate("foo", {}, true);

  const [evalResult] = await Promise.allSettled([evalPromise]);

  const rejection = {
    status: "rejected",
    reason: "Something went wrong",
  };

  t.like(evalResult, rejection);
});

test("should throw an error on missing context value (strict)", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "isUser",
        conditions: [
          {
            kind: Kind.CONTEXT,
            id: "isUser",
            operation: Operation.INCLUDE,
            path: "user",
            value: ["tony"],
          },
        ],
      },
    },
  ]);

  const evalPromise = engine.evaluate("foo", {}, true);

  const [evalResult] = await Promise.allSettled([evalPromise]);

  const rejection = {
    status: "rejected",
    reason: '"foo" condition "isUser" missing context value "user"',
  };

  t.like(evalResult, rejection);
});

test("should throw an error on invalid context kind (strict)", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "isUser",
        conditions: [
          {
            kind: 5 as any,
            id: "isUser",
            operation: Operation.INCLUDE,
            path: "user",
            value: ["tony"],
          },
        ],
      },
    },
  ]);

  const evalPromise = engine.evaluate("foo", {}, true);

  const [evalResult] = await Promise.allSettled([evalPromise]);

  const rejection = {
    status: "rejected",
    reason: '"foo" condition "isUser" kind "5" is not known',
  };

  t.like(evalResult, rejection);
});

test("should default to false on invalid context kind", async (t) => {
  const engine = new Flare([
    {
      foo: {
        eval: "isUser",
        conditions: [
          {
            kind: 5 as any,
            id: "isUser",
            operation: Operation.INCLUDE,
            path: "user",
            value: ["tony"],
          },
        ],
      },
    },
  ]);

  const flags = await engine.evaluate("foo", {});

  t.like(flags, { foo: false });
});

test("should return false if a gate is not found", async (t) => {
  const engine = new Flare([{}]);

  const flags = await engine.evaluate("bar", {
    company: "acme",
    user: "tony",
  });

  t.like(flags, { bar: false });
});

test("should return true on an exclude condition operation with a null value", async (t) => {
  t.true(Flare.conditionOperations.exclude(new Set(), null));
});

test("should return true on an include condition operation with a null value", async (t) => {
  t.false(Flare.conditionOperations.include(new Set(), null));
});
