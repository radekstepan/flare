import jexl from 'jexl';
import {Condition, Jwt, Params, Operation, Data, Flags, Context} from './interfaces';

const operations: Record<Operation, (list: string[], value: string) => boolean> = {
  'exclude': (list, value) => !list.includes(value),
  'include': (list, value) => list.includes(value),
};

function evaluateCondition(condition: Condition, jwt: Jwt, parameters: Params): boolean {
  let value: string;
  switch (condition.kind) {
    case 'jwt':
      value = jwt[condition.path.split('.')[1]];
      return operations[condition.operation](condition.value, value);
    case 'parameter':
      value = parameters[condition.path];
      return operations[condition.operation](condition.value, value);
    default:
      return false;  
  }
}

async function getFlags(data: Data, jwt: Jwt, parameters: Params) {
  const promises: [string, Promise<boolean>][] = [];

  for (let name in data) {
    const gate = data[name];

    const context: Context = {};
    for (let condition of gate.conditions) {
      context[condition.id] = evaluateCondition(condition, jwt, parameters);
    }

    promises.push([name, jexl.eval(gate.eval, context)]);
  }

  const res: [string, boolean][] = await Promise.all(promises.map(async ([name, promise]) =>
    [name, await promise]
  ));

  return res.reduce<Flags>((acc, [name, bool]) => {
    // can get undefined when some of the vars in context are not populated
    acc[name] = bool || false;
    return acc;
  }, {});
}

export default getFlags;
