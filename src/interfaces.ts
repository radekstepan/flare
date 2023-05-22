export type Operation = "exclude" | "include";

export type Kind = "jwt" | "parameter";

export type Condition<ValueT> = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: ValueT;
};

export type Context = Record<string, boolean>;

export type EvalReturn = Promise<boolean | undefined>;

export type Eval = (context: Context) => EvalReturn;

export interface InputGate {
  eval: string;
  conditions: Condition<string[]>[];
}

export type Data = Record<string, InputGate>;

export interface CompiledGate {
  eval: Eval;
  conditions: Condition<Set<string>>[];
}

// TODO: move to parameters, make this generic.
export interface Jwt {
  company: string;
  user: string;
}

export type Params = Record<string, any>;

export type Flags = Record<string, boolean>;
