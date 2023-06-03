export type Operation = "exclude" | "include";

export type Kind = "context";

export type Condition<ValueT> = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: ValueT;
};

export type InputContextValue = string | number;

export type InputContext = {
  [key: string]: InputContextValue | InputContext;
};

export type EvalContext = Record<string, boolean>;

export type EvalReturn = Promise<boolean | undefined>;

export type Eval = (context: EvalContext) => EvalReturn;

export interface InputGate {
  eval: string;
  conditions: Condition<InputContextValue[]>[];
}

export type Data = Record<string, InputGate>;

export interface CompiledGate {
  eval: Eval;
  conditions: Condition<Set<InputContextValue>>[];
}

export type Flags = Record<string, boolean>;
