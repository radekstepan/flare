import {expect} from '@jest/globals';
import getFlags from '../getFlags';
import loadYaml from '../loadYaml';
import { Jwt } from '../interfaces';

describe('us2-location', () => {
  const data = loadYaml('us2-location');

  it('should include everyone in us2', async () => {
    const jwt = {} as Jwt;
    const parameters = {location: 'us2'};
    const flags = await getFlags(data, jwt, parameters);

    expect(flags['feature/foo']).toBe(true);
  });

  it('should exclude everyone not in us2', async () => {
    const jwt = {} as Jwt;
    const parameters = {location: 'us1'};
    const flags = await getFlags(data, jwt, parameters);

    expect(flags['feature/foo']).toBe(false);
  });
});
