import http from "node:http";
import { Flare } from "@radekstepan/flare";
import { listen } from "./_shared.js";

const gates = {
  test: {
    eval: "true && isCompany",
    conditions: [
      {
        id: "isCompany",
        kind: "context",
        operation: "include",
        path: "company",
        value: ["acme"],
      },
    ],
  },
};

const flare = new Flare(gates);

const server = http.createServer(async (_req, res) => {
  await flare.evaluateAll({ company: "acme" });
  return res.end("ok");
});

server.listen(listen);
