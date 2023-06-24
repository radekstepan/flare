import test from "ava";
import compile from "../src/compile.js";
import { EvalContext } from "@radekstepan/flare-types";

const newContext = (): [Set<string>, EvalContext] => {
  const called = new Set<string>();
  return [
    called,
    (id: string) => {
      called.add(id);
      switch (id) {
        case "A":
          return true;
        case "B":
          return false;
        default:
          throw new Error(`Identifier "${id}" not found in context`);
      }
    },
  ];
};

// Test literals.
test("Literal: true", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("true");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set([]));
});

test("Literal: false", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("false");
  t.false(evaluate(evalContext));
  t.deepEqual(called, new Set([]));
});

// Test identifiers.
test("Identifier: A", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("A");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set(["A"]));
});

// Test unary expressions.
test("Unary: !A", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("!A");
  t.false(evaluate(evalContext));
  t.deepEqual(called, new Set(["A"]));
});

// Test logical expressions.
test("Logical: A && B", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("A && B");
  t.false(evaluate(evalContext));
  t.deepEqual(called, new Set(["A", "B"]));
});

test("Logical: B || A", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("B || A");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set(["B", "A"]));
});

// Test short-circuiting.
test("Short-circuit: B && A", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("B && A");
  t.false(evaluate(evalContext));
  t.deepEqual(called, new Set(["B"]));
});

test("Short-circuit: A || B", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("A || B");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set(["A"]));
});

// Test complex expressions.
test("Complex: A && !B", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("A && !B");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set(["A", "B"]));
});

test("Complex: (A || B) && !B", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("(A || B) && !B");
  t.true(evaluate(evalContext));
  t.deepEqual(called, new Set(["A", "B"]));
});

// Test invalid identifier.
test("Invalid Identifier: C", (t) => {
  const [called, evalContext] = newContext();
  const evaluate = compile("C");
  const error = t.throws(() => evaluate(evalContext));
  t.is(error?.message, 'Identifier "C" not found in context');
  t.deepEqual(called, new Set(["C"]));
});

// Test invalid expressions.
test("Invalid input expression: {}", (t) => {
  const error = t.throws(() => compile({} as any));
  t.deepEqual(error?.message, "expression is not a string");
});

test('Invalid Syntax: ""', (t) => {
  const error = t.throws(() => compile(""));
  t.deepEqual(error?.message, "Syntax is empty");
});

test('Missing ExpressionStatement: "{}"', (t) => {
  const error = t.throws(() => compile("{}"));
  t.deepEqual(error?.message, "ExpressionStatement is not found");
});

test("Invalid Literal: 123", (t) => {
  const error = t.throws(() => compile("123"));
  t.deepEqual(error?.message, 'Literal node type "number" is invalid');
});

test("Invalid BinaryExpression: A + B", (t) => {
  const error = t.throws(() => compile("A + B"));
  t.deepEqual(error?.message, 'Expression type "BinaryExpression" is invalid');
});

test("Invalid UnaryExpression operator: -A", (t) => {
  const error = t.throws(() => compile("-A"));
  t.deepEqual(error?.message, 'UnaryExpression operator "-" is invalid');
});
