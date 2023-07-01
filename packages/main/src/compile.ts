import { parseScript } from "esprima";
import type {
  Directive,
  Statement,
  ModuleDeclaration,
  ExpressionStatement,
  Expression,
  SimpleLiteral,
  Identifier,
  UnaryExpression,
  LogicalExpression,
} from "estree";
import type { Eval, EvalContext, Gate } from "@radekstepan/flare-types";

const EMPTY_SET = new Set<string>();

// Type guards to identify different types of nodes in the AST.
function isExpressionStatement(
  node: Directive | Statement | ModuleDeclaration
): node is ExpressionStatement {
  return node.type === "ExpressionStatement";
}

function isLiteral(node: Expression): node is SimpleLiteral {
  return node.type === "Literal";
}

function isIdentifier(node: Expression): node is Identifier {
  return node.type === "Identifier";
}

function isUnaryExpression(node: Expression): node is UnaryExpression {
  return node.type === "UnaryExpression";
}

function isLogicalExpression(node: Expression): node is LogicalExpression {
  return node.type === "LogicalExpression";
}

// Compile function takes an expression string and returns an Eval function.
const compile = (expression: Gate["eval"]): [Eval, Set<string>] => {
  if (typeof expression === "boolean") {
    return [() => expression, EMPTY_SET];
  } else if (typeof expression !== "string") {
    throw new Error("expression is not a string");
  }

  // Parse the expression into an Abstract Syntax Tree (AST).
  const syntax = parseScript(expression);

  // We expect the syntax to contain at least one statement.
  if (!syntax.body.length) {
    throw new Error("Syntax is empty");
  }
  // We extract the first statement and if it's an ExpressionStatement,
  // we compile it into a function.
  if (isExpressionStatement(syntax.body[0])) {
    const { expression } = syntax.body[0];
    // Collect the condition identifiers.
    const conditions = new Set<string>();
    // Compile the AST into a function
    return [compileAST(expression, conditions), conditions];
  }

  throw new Error("ExpressionStatement is not found");
};

// This function takes an Expression node from the AST
//  and returns a function that evaluates that expression.
function compileAST(
  node: Expression,
  conditions: Set<string>
): (evalContext: EvalContext) => boolean {
  // If the node is a LogicalExpression, it's an expression with a logical operator
  //  like '&&' (logical AND) or '||' (logical OR).
  if (isLogicalExpression(node)) {
    // We recursively compile the left and right parts of the expression into functions.
    const leftFunc = compileAST(node.left, conditions);
    const rightFunc = compileAST(node.right, conditions);

    // Return a function that performs the correct operation.
    if (node.operator === "&&") {
      return (evalContext) => leftFunc(evalContext) && rightFunc(evalContext);
    }
    if (node.operator === "||") {
      return (evalContext) => leftFunc(evalContext) || rightFunc(evalContext);
    }
  } else if (isLiteral(node)) {
    if (typeof node.value === "boolean") {
      const bool = node.value;
      return () => bool;
    }
    throw new Error(`Literal node type "${typeof node.value}" is invalid`);
    // Lookup the value of a condition in the context.
  } else if (isIdentifier(node)) {
    conditions.add(node.name);
    return (evalContext) => evalContext(node.name);
    // Negate an expression.
  } else if (isUnaryExpression(node)) {
    if (node.operator === "!") {
      const argumentFunc = compileAST(node.argument, conditions);
      return (evalContext) => !argumentFunc(evalContext);
    }
    throw new Error(`UnaryExpression operator "${node.operator}" is invalid`);
  }
  throw new Error(`Expression type "${node.type}" is invalid`);
}

export default compile;
