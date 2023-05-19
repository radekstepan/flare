import {expect} from '@jest/globals';
import jobRunner from '../jobRunner';

jest.useFakeTimers();

describe('jobRunner', () => {
  it('should run jobs after initialization', async () => {
    const init = new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    const runner = jobRunner(init);

    const job1 = jest.fn(() => Promise.resolve('Job 1 completed'));
    const job2 = jest.fn(() => Promise.resolve('Job 2 completed'));

    const job1Promise = runner(job1);
    const job2Promise = runner(job2);

    // Not ready yet.
    expect(job1).not.toHaveBeenCalled();
    expect(job2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    // Wait for all promises to resolve.
    await Promise.all([job1Promise, job2Promise]);

    expect(job1).toHaveBeenCalled();
    expect(job2).toHaveBeenCalled();
  });

  it('should handle initialization that has failed', async () => {
    const init = new Promise<void>((_resolve, reject) => {
      setTimeout(reject, 100);
    });

    const runner = jobRunner(init);

    const job1 = jest.fn(() => Promise.resolve('Job 1 completed'));
    const job2 = jest.fn(() => Promise.resolve('Job 2 completed'));

    const job1Promise = runner(job1);
    const job2Promise = runner(job2);

    // Not ready yet.
    expect(job1).not.toHaveBeenCalled();
    expect(job2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    // Wait for all promises to get rejected.
    const [
      job1Result,
      job2Result
    ] = await Promise.allSettled([job1Promise, job2Promise]);

    const rejection = {
      status: 'rejected',
      reason: new Error('Initialization has failed')
    };

    expect(job1Result).toEqual(expect.objectContaining(rejection));
    expect(job2Result).toEqual(expect.objectContaining(rejection));
  })
});