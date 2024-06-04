let isScheduled: boolean = false;
const jobs: AnyFunction[] = [];

export function enqueueJob(job: AnyFunction): void {
  jobs.push(job);
  scheduleUpdate();
}

function scheduleUpdate(): void {
  if (isScheduled) return;

  isScheduled = true;

  queueMicrotask(processJobs);
}

function processJobs(): void {
  while (jobs.length > 0) {
    const job = jobs.shift();
    const result = job();

    Promise.resolve(result).then(
      () => {
        // Job completed successfully
      },
      (error) => {
        console.error(`[scheduler]: ${error}`);
      }
    );
  }

  isScheduled = false;
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve));
}

export function nextTick() {
  scheduleUpdate();
  return flushPromises();
}
