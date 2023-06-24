type Job<T> = () => Promise<T>;
export type DoJob<T> = (job: Job<T>) => Promise<T>;

// The jobRunner function creates a runner for a queue of asynchronous jobs.
// It waits for an initialization process to complete before starting the jobs.
function jobRunner<T>(init: Promise<any>): DoJob<T> {
  let initialized = false;
  let failed = false;
  // The queue of jobs to be run once initialization is complete.
  let jobQueue: Array<() => Promise<any>> = [];

  // The initialization process.
  Promise.allSettled([init]).then(([result]) => {
    // If initialization was successful, mark it as complete.
    if (result.status === "fulfilled") {
      initialized = true;
    } else {
      // If initialization failed, record the error.
      failed = result.reason || "Initialization has failed";
    }

    // Once initialization is complete, start running the jobs in the queue.
    while (jobQueue.length > 0) {
      const run = jobQueue.shift();
      run && run();
    }
  });

  // This function adds a new job to the queue or starts it immediately
  //  if initialization is complete.
  return (job) => {
    return new Promise((resolve, reject) => {
      const runJob = async () => {
        if (failed) {
          return reject(failed);
        }

        try {
          const res = await job();
          resolve(res);
        } catch (err) {
          reject(err);
        }
      };

      // If initialization is complete, run the job immediately.
      // Otherwise, add it to the queue to be run later.
      if (initialized) {
        runJob();
      } else {
        jobQueue.push(runJob);
      }
    });
  };
}

export default jobRunner;
