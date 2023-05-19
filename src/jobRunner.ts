type Job<T> = () => Promise<T>;

type DoJob<T> = (job: Job<T>) => Promise<T>;

function jobRunner<T>(init: Promise<void>): DoJob<T> {
  let initialized = false;
  let failed = false;
  let jobQueue: Array<() => Promise<any>> = [];

  Promise.allSettled([init]).then(([result]) => {
    if (result.status === "fulfilled") {
      initialized = true;
    } else {
      failed = true;
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
          return reject(new Error("Initialization has failed"));
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
