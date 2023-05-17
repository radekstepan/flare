export type Operation = 'exclude' | 'include';

export type Kind = 'jwt' | 'parameter';

export type Condition = {
  id: string;
  operation: Operation;
  kind: Kind;
  path: string;
  value: string[];
};

export type Gate = {
  eval: string;
  conditions: Condition[];
};

export type Data = Record<string, Gate>;

export interface Jwt {
  company: string;
  user: string;
};

export type Params = Record<string, any>;

export type Flags = Record<string, boolean>;

export type Context = Record<string, boolean>;
