import http from "node:http";
import process from "node:process";
import fs from "node:fs/promises";
import { Flare } from "@radekstepan/flare";

const start = +new Date();
const gates = Promise.resolve().then(async () => {
  const data = await fs.readFile(process.argv[2], "utf8");
  return JSON.parse(data);
});

const flare = new Flare(gates);

const server = http.createServer(async (_req, res) => {
  await flare.evaluateAll({ company: "acme" });
  return res.end("ok");
});

server.listen(async () => {
  await gates;
  console.log("Boot time:", +new Date() - start, "ms");

  const { port } = server.address();
  process.send({ port });
});
