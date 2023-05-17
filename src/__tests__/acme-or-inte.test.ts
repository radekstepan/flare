import {expect} from '@jest/globals';
import getFlags from '../getFlags';
import loadYaml from '../loadYaml';

describe('acme-or-inte', () => {
  const data = loadYaml('acme-or-inte');

  it('should include volantis from inte', async () => {
    const jwt1 = {company: 'volantis', user: 'danny'};
    const parameters1 = {location: 'inte'};
    const flags = await getFlags(data, jwt1, parameters1);

    expect(flags['feature/foo']).toBe(true);
  });

  it('should include acme from us2', async () => {
    const jwt2 = {company: 'acme', user: 'johnny'};
    const parameters2 = {location: 'us2'};
    const flags = await getFlags(data, jwt2, parameters2);

    expect(flags['feature/foo']).toBe(true);
  });

  it('should exclude vortex from us2', async () => {
    const jwt3 = {company: 'vortex', user: 'johnny'};
    const parameters3 = {location: 'us2'};
    const flags = await getFlags(data, jwt3, parameters3);

    expect(flags['feature/foo']).toBe(false);
  });
});
