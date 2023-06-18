import http from "node:http";
import process from "node:process";
import { spawn } from "node:child_process";
import meow from "meow";
import PQueue from "p-queue";

const cli = meow({
  importMeta: import.meta,
  flags: {
    // Total number of requests to send to the server.
    requests: {
      shortFlag: "r",
      type: "number",
      default: 1000,
    },
    // The server to send the requests to.
    server: {
      shortFlag: "s",
      type: "string",
      default: "ping",
      choices: ["ping", "evaluateAll"],
    },
    // How many requests should fire at the same time.
    concurrency: {
      shortFlag: "c",
      type: "number",
      default: 40,
    },
  },
});

// The server is a subprocess to isolate time/memory usage of the scaffold.
const serverProcess = spawn("node", [`servers/${cli.flags.server}.js`], {
  stdio: ["ipc"],
});

// Start when the server is ready.
serverProcess.on("message", (message) => {
  if (typeof message !== "object") {
    return;
  }

  // When we get the port from the subprocess.
  if (message?.port) {
    const url = `http://localhost:${message.port}`;

    let { requests } = cli.flags;

    const q = new PQueue({ concurrency: cli.flags.concurrency });

    q.on("error", (err) => {
      console.error("Request error:", err);
      serverProcess.kill();
      process.exit(1);
    });

    // Stop the bench when all requests have finished and ask for perf stats.
    q.on("idle", () => {
      serverProcess.send("bench:stop");
    });

    // Start the bench and queue the requests.
    serverProcess.send("bench:start");
    for (; requests; requests--) {
      q.add(
        () =>
          new Promise((resolve, reject) => {
            const req = http.get(url, resolve);
            req.on("error", reject);
          })
      );
    }

    return;
  }

  // Display the perf stats and close shop.
  if (message.stats) {
    console.log(
      `${(cli.flags.requests * 1000) / message.stats.duration} ops/s`
    );
    console.log(`Execution Time: ${message.stats.duration} ms`);
    // The Resident Set Size, is the amount of space occupied in the main memory device (that is a subset of the total allocated memory) for the process, including all C++ and JavaScript objects and code.
    console.log(`Memory Usage: ${message.stats.memory / 1024 / 1024} MB`);

    serverProcess.kill();
    process.exit(0);
  }

  console.error("Server process did not provide a port number");
  serverProcess.kill();
  process.exit(1);
});

serverProcess.on("error", (data) => {
  console.error("Failed to start server process:", data.toString());
  process.exit(1);
});

serverProcess.stdout.pipe(process.stdout);
serverProcess.stderr.pipe(process.stderr);
