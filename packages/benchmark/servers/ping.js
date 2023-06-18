import http from "node:http";
import process from "node:process";

// A basic ping, no Flare evaluation.
const server = http.createServer(async (_req, res) => res.end("ok"));

server.listen(() => {
  const { port } = server.address();
  process.send({ port });
});
