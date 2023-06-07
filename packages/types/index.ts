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

export type ContextValue = string | number;

export type Context = {
  [key: string]: ContextValue | Context;
};

export type EvalContext = Record<string, boolean>;

export type EvalReturn = Promise<boolean | undefined>;

export type Eval = (context: EvalContext) => EvalReturn;

export interface Gate {
  eval: string;
  conditions: Condition<ContextValue[]>[];
}

export type Gates = Record<string, Gate>;

export interface CompiledGate {
  eval: Eval;
  conditions: Condition<Set<ContextValue>>[];
}

export type Flags = Record<string, boolean>;
