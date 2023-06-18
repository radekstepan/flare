import http from "node:http";
import { listen } from "./_shared.js";

const server = http.createServer(async (_req, res) => res.end("ok"));

server.listen(listen);
