export type Operation = 'exclude' | 'include';

export type Kind = 'jwt' | 'parameter';

export type Condition = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: string[];
};

export type Context = Record<string, boolean>;

export type JexlEvalReturn = Promise<boolean | undefined>

export type JexlEval = (context: Context) => JexlEvalReturn;

export interface JexlCompiled {
  eval: JexlEval;
}

export interface GateData {
  eval: string;
  conditions: Condition[];
};

export type Data = Record<string, GateData>;

export interface Gate extends GateData {
  expr: JexlCompiled;
}

export interface Jwt {
  company: string;
  user: string;
};

export type Params = Record<string, any>;

export type Flags = Record<string, boolean>;
