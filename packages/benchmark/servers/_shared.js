import process from "node:process";
import { performance, PerformanceObserver } from "node:perf_hooks";

// Send perf stats to the parent.
const perfObserver = new PerformanceObserver((items) => {
  const [entry] = items.getEntries();

  process.send({
    stats: {
      duration: entry.duration,
      memory: process.memoryUsage.rss(),
    },
  });

  performance.clearMarks();
});

perfObserver.observe({ entryTypes: ["measure"], buffer: true });

// Start and stop the bench.
process.on("message", (data) => {
  if (data === "bench:start") {
    performance.mark("bench:start");
  }

  if (data === "bench:stop") {
    performance.mark("bench:stop");
    performance.measure("bench", "bench:start", "bench:stop");
  }
});

// Tell the parent what our port number is.
export function listen() {
  const { port } = this.address();
  if (typeof process.send === "function") {
    process.send({ port });
  } else {
    console.log(JSON.stringify({ port }, null, 2));
  }
}
