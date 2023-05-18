import {expect} from '@jest/globals';
import Aft from '../Aft';
import loadYaml from '../loadYaml';
import { Jwt } from '../interfaces';

describe('killswitch', () => {
  const data = loadYaml('killswitch');
  const aft = new Aft(data);

  it('should exclude everyone', async () => {
    const jwt = {} as Jwt;
    const parameters = {location: 'us2'};
    const flags = await aft.evaluate(jwt, parameters);

    expect(flags['feature/off']).toBe(false);
  });
});
