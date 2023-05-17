import {expect} from '@jest/globals';
import getFlags from '../getFlags';
import loadYaml from '../loadYaml';

describe('acme-but-danny', () => {
  const data = loadYaml('acme-but-danny');

  it('should exclude danny from acme', async () => {
    const jwt1 = {company: 'acme', user: 'danny'};
    const parameters1 = {location: 'us2'};
    const flags = await getFlags(data, jwt1, parameters1);

    expect(flags['feature/foo']).toBe(false);
  });

  it('should include other users from acme', async () => {
    const jwt2 = {company: 'acme', user: 'johnny'};
    const parameters2 = {location: 'us2'};
    const flags = await getFlags(data, jwt2, parameters2);

    expect(flags['feature/foo']).toBe(true);
  });

  it('should exclude users from other companies', async () => {
    const jwt3 = {company: 'foobar', user: 'johnny'};
    const parameters3 = {location: 'us2'};
    const flags = await getFlags(data, jwt3, parameters3);

    expect(flags['feature/foo']).toBe(false);
  });
});
