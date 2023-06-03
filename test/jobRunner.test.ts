import test from "ava";
import sinon from "sinon";
import jobRunner from "../src/jobRunner.js";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("should run jobs after initialization", async (t) => {
  const init = new Promise<void>((resolve) => {
    setTimeout(resolve, 10);
  });

  const runner = jobRunner(init);

  const job1 = sinon.spy(() => Promise.resolve("Job 1 completed"));
  const job2 = sinon.spy(() => Promise.resolve("Job 2 completed"));

  const job1Promise = runner(job1);
  const job2Promise = runner(job2);

  // Not ready yet.
  t.true(job1.notCalled);
  t.true(job2.notCalled);

  await wait(10);

  // Wait for all promises to resolve.
  await Promise.all([job1Promise, job2Promise]);

  t.true(job1.called);
  t.true(job2.called);
});

test("should handle initialization that has failed", async (t) => {
  const init = new Promise<void>((_resolve, reject) => {
    setTimeout(reject, 10);
  });

  const runner = jobRunner(init);

  const job1 = sinon.spy(() => Promise.resolve("Job 1 completed"));
  const job2 = sinon.spy(() => Promise.resolve("Job 2 completed"));

  const job1Promise = runner(job1);
  const job2Promise = runner(job2);

  // Not ready yet.
  t.true(job1.notCalled);
  t.true(job2.notCalled);

  await wait(10);

  // Wait for all promises to get rejected.
  const [job1Result, job2Result] = await Promise.allSettled([
    job1Promise,
    job2Promise,
  ]);

  const rejection = {
    status: "rejected",
    reason: "Initialization has failed",
  };

  t.like(job1Result, rejection);
  t.like(job2Result, rejection);
});

test("should handle a job that has failed", async (t) => {
  const init = new Promise<void>((resolve) => {
    setTimeout(resolve, 10);
  });

  const runner = jobRunner(init);

  const job1 = sinon.spy(() => Promise.reject("Job 1 failed"));
  const job2 = sinon.spy(() => Promise.resolve("Job 2 completed"));

  const job1Promise = runner(job1);
  const job2Promise = runner(job2);

  // Not ready yet.
  t.true(job1.notCalled);
  t.true(job2.notCalled);

  await wait(10);

  // Wait for all promises to get settled.
  const [job1Result, job2Result] = await Promise.allSettled([
    job1Promise,
    job2Promise,
  ]);

  t.true(job1.called);
  t.true(job2.called);

  t.like(job1Result, {
    status: "rejected",
    reason: "Job 1 failed",
  });
  t.like(job2Result, {
    status: "fulfilled",
    value: "Job 2 completed",
  });
});
