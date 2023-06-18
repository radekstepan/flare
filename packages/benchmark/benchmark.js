import process from "node:process";
import { spawn } from "node:child_process";
import meow from "meow";
import autocannon from "autocannon";
import scaffold from "./scaffolds/index.js";

const cli = meow({
  importMeta: import.meta,
  flags: {
    // Total number of requests to send to the server; if not set defaults to 10s worth.
    requests: {
      shortFlag: "r",
      type: "number",
    },
    // The server to send the requests to.
    server: {
      shortFlag: "s",
      type: "string",
      default: "ping",
      choices: ["ping", "quickEval", "fullEval"],
    },
    // How many requests should fire at the same time.
    connections: {
      shortFlag: "c",
      type: "number",
      default: 10,
    },
    // Number of Flare gates to generate.
    gates: {
      shortFlag: "g",
      type: "number",
      default: 10,
    },
    // Number of Flare conditions that each gate should have.
    conditions: {
      shortFlag: "o",
      type: "number",
      default: 10,
    },
    // Number of Flare values that each condition should have.
    values: {
      shortFlag: "v",
      type: "number",
      default: 10,
    },
  },
});

let instance;

const run = async () => {
  // Scaffold any fixtures.
  const args = await scaffold[cli.flags.server](cli.flags);

  // Run the server as a subprocess.
  const serverProcess = spawn("node", args, {
    stdio: ["ipc"],
  });

  // Start when the server is ready.
  serverProcess.on("message", (message) => {
    if (typeof message !== "object") {
      return;
    }

    // When we get the port from the subprocess.
    if (message?.port) {
      serverProcess.send("bench:start");

      // Run the bench tracking the process and displaying the result.
      instance = autocannon(
        {
          url: `http://localhost:${message.port}`,
          connections: cli.flags.connections,
          amount: cli.flags.requests,
        },
        (err) => {
          serverProcess.kill();

          if (err) {
            console.error("Request error:", err);
            process.exit(1);
          }

          process.exit(0);
        }
      );

      autocannon.track(instance, { renderProgressBar: true });

      return;
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
};

// this is used to kill the instance on CTRL-C
process.once("SIGINT", () => {
  instance?.stop();
});

run();
