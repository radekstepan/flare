import {expect} from '@jest/globals';
import getFlags from '../getFlags';
import loadYaml from '../loadYaml';

describe('anchors', () => {
  const data = loadYaml('anchors');

  it('should enable feature/foo and feature/bar for vortex', async () => {
    const jwt1 = { company: 'vortex', user: 'johnny' };
    const flags = await getFlags(data, jwt1, {});
    expect(flags).toEqual({
      'feature/foo': true,
      'feature/bar': true,
    });
  });

  it('should enable feature/bar for acme', async () => {
    const jwt2 = { company: 'acme', user: 'danny' };
    const flags = await getFlags(data, jwt2, {});
    expect(flags).toEqual({
      'feature/foo': false,
      'feature/bar': true,
    });
  });

  it('should disable feature/foo and feature/bar for foobar', async () => {
    const jwt3 = { company: 'foobar', user: 'johnny' }
    const flags = await getFlags(data, jwt3, {});
    expect(flags).toEqual({
      'feature/foo': false,
      'feature/bar': false,
    });
  });
});
