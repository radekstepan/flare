import jexl from 'jexl';
import { Condition, Context, Data, Flags, Gate, JexlEvalReturn, Jwt, Operation, Params } from "./interfaces";

class Aft {
  gates = new Map<string, Gate>();

  // Compile the expressions and save gates.
  constructor(data: Data) {
    for (let name in data) {
      const gate = data[name];

      this.gates.set(name, {
        conditions: gate.conditions,
        eval: gate.eval,
        expr: jexl.compile(gate.eval)
      });
    }
  }

  // Known gate condition operations.
  static conditionOperations: Record<Operation, (list: string[], value: string) => boolean> = {
    'exclude': (list, value) => !list.includes(value),
    'include': (list, value) => list.includes(value),
  };

  // Known gate conditions.
  static evaluateCondition(
    condition: Condition,
    jwt: Jwt,
    parameters: Params
  ): boolean {
    let value: string;
    switch (condition.kind) {
      case 'jwt':
        value = jwt[condition.path.split('.')[1]];
        return Aft.conditionOperations[condition.operation](condition.value, value);
      case 'parameter':
        value = parameters[condition.path];
        return Aft.conditionOperations[condition.operation](condition.value, value);
      default:
        return false;  
    }
  }

  // Eval the gates given a context.
  async evaluate(jwt: Jwt, parameters: Params) {
    const promises: [string, JexlEvalReturn][] = [];

    for (const [name, gate] of this.gates) {
      const context: Context = {};
      for (let condition of gate.conditions) {
        context[condition.id] = Aft.evaluateCondition(condition, jwt, parameters);
      }
  
      promises.push([name, gate.expr.eval(context)]);
    }
  
    const res: [string, Awaited<JexlEvalReturn>][] = await Promise.all(promises.map(async ([name, promise]) =>
      [name, await promise]
    ));
  
    return res.reduce<Flags>((acc, [name, bool]) => {
      // can get undefined when some of the vars in context are not populated
      acc[name] = bool || false;
      return acc;
    }, {});
  }
}

export default Aft;
