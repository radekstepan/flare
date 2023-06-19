import http from "node:http";
import process from "node:process";

const start = +new Date();

// A basic ping, no Flare evaluation.
const server = http.createServer(async (_req, res) => res.end("ok"));

server.listen(() => {
  console.log("Boot time:", +new Date() - start, "ms");

  const { port } = server.address();
  process.send({ port });
});
