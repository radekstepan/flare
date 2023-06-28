export const enum Operation {
  EXCLUDE = "exclude",
  INCLUDE = "include",
}

export const enum Kind {
  CONTEXT = "context",
}

export type Condition<ValueT> = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: ValueT;
};

export type ContextValue = string | number | boolean;

export type Context = {
  [key: string]: ContextValue | Context;
};

export type EvalContext = (id: string) => boolean;

export type Eval = (evalContext: EvalContext) => boolean;

export interface Gate {
  eval: string | boolean;
  conditions: Condition<ContextValue[]>[];
}

export type Gates = Record<string, Gate>;

export interface CompiledGate {
  eval: Eval;
  conditions: Map<string, Condition<Set<ContextValue>>>;
}

export type Flags = Record<string, boolean>;
