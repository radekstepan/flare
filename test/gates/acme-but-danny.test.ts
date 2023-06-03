import test from "ava";
import Flare from "../../src/Flare.js";
import { readYaml } from "../../src/utils.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/acme-but-danny.yml", import.meta.url);
  const data = readYaml(path);
  engine = new Flare(data);
});

test("should exclude danny from acme", async (t) => {
  const input = { company: "acme", user: "danny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});

test("should include other users from acme", async (t) => {
  const input = { company: "acme", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should exclude users from other companies", async (t) => {
  const input = { company: "foobar", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});
