import {expect} from '@jest/globals';
import Aft from '../../Aft';
import loadYaml from '../../loadYaml';

describe('gates/acme-but-danny', () => {
  const data = loadYaml('acme-but-danny');
  const aft = new Aft(data);

  it('should exclude danny from acme', async () => {
    const jwt = {company: 'acme', user: 'danny'};
    const parameters = {location: 'us2'};
    const flags = await aft.evaluate(jwt, parameters);

    expect(flags['feature/foo']).toBe(false);
  });

  it('should include other users from acme', async () => {
    const jwt = {company: 'acme', user: 'johnny'};
    const parameters = {location: 'us2'};
    const flags = await aft.evaluate(jwt, parameters);

    expect(flags['feature/foo']).toBe(true);
  });

  it('should exclude users from other companies', async () => {
    const jwt = {company: 'foobar', user: 'johnny'};
    const parameters = {location: 'us2'};
    const flags = await aft.evaluate(jwt, parameters);

    expect(flags['feature/foo']).toBe(false);
  });
});
