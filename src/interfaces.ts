export type Operation = 'exclude' | 'include';

export type Kind = 'jwt' | 'parameter';

export type Condition<ValueT> = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: ValueT;
};

export type Context = Record<string, boolean>;

export type JexlEvalReturn = Promise<boolean | undefined>

export type JexlEval = (context: Context) => JexlEvalReturn;

export interface JexlCompiled {
  eval: JexlEval;
}

export interface InputGate {
  eval: string;
  conditions: Condition<string[]>[];
};

export type Data = Record<string, InputGate>;

export interface CompiledGate {
  expr: JexlCompiled;
  conditions: Condition<Set<string>>[];
}

export interface Jwt {
  company: string;
  user: string;
};

export type Params = Record<string, any>;

export type Flags = Record<string, boolean>;
