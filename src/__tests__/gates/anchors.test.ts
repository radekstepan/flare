import {expect} from '@jest/globals';
import Aft from '../../Aft';
import loadYaml from '../../loadYaml';

describe('gates/anchors', () => {
  const data = loadYaml('anchors');
  const aft = new Aft(data);

  it('should enable feature/foo and feature/bar for vortex', async () => {
    const jwt = { company: 'vortex', user: 'johnny' };
    const flags = await aft.evaluate(jwt, {});

    expect(flags).toEqual({
      'feature/foo': true,
      'feature/bar': true,
    });
  });

  it('should enable feature/bar for acme', async () => {
    const jwt = { company: 'acme', user: 'danny' };
    const flags = await aft.evaluate(jwt, {});

    expect(flags).toEqual({
      'feature/foo': false,
      'feature/bar': true,
    });
  });

  it('should disable feature/foo and feature/bar for foobar', async () => {
    const jwt = { company: 'foobar', user: 'johnny' }
    const flags = await aft.evaluate(jwt, {});

    expect(flags).toEqual({
      'feature/foo': false,
      'feature/bar': false,
    });
  });
});