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
import { Eval, EvalContext } from "@radekstepan/flare-types";

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

// Evaluate an expression given a context.
const compile = (expression: string): Eval => {
  if (typeof expression !== "string") {
    throw new Error("expression is not a string");
  }

  const syntax = parseScript(expression);

  if (!syntax.body.length) {
    throw new Error("Syntax is empty");
  }
  if (isExpressionStatement(syntax.body[0])) {
    const { expression } = syntax.body[0];
    // Compile the AST into a function
    return compileAST(expression);
  }

  throw new Error("ExpressionStatement is not found");
};

function compileAST(node: Expression): (evalContext: EvalContext) => boolean {
  if (isLogicalExpression(node)) {
    const leftFunc = compileAST(node.left);
    const rightFunc = compileAST(node.right);

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
  } else if (isIdentifier(node)) {
    return (evalContext) => evalContext(node.name);
  } else if (isUnaryExpression(node)) {
    if (node.operator === "!") {
      const argumentFunc = compileAST(node.argument);
      return (evalContext) => !argumentFunc(evalContext);
    }
    throw new Error(`UnaryExpression operator "${node.operator}" is invalid`);
  }
  throw new Error(`Expression type "${node.type}" is invalid`);
}

export default compile;
