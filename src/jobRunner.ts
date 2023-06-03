type Job<T> = () => Promise<T>;
export type DoJob<T> = (job: Job<T>) => Promise<T>;

function jobRunner<T>(init: Promise<any>): DoJob<T> {
  let initialized = false;
  let failed = false;
  let jobQueue: Array<() => Promise<any>> = [];

  Promise.allSettled([init]).then(([result]) => {
    if (result.status === "fulfilled") {
      initialized = true;
    } else {
      failed = result.reason || "Initialization has failed";
    }

    while (jobQueue.length > 0) {
      const run = jobQueue.shift();
      run && run();
    }
  });

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

      if (initialized) {
        runJob();
      } else {
        jobQueue.push(runJob);
      }
    });
  };
}

export default jobRunner;
