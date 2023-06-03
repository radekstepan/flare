import test from "ava";
import Flare from "../../src/Flare.js";
import { readYaml } from "../../src/utils.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/acme-or-inte.yml", import.meta.url);
  const data = readYaml(path);
  engine = new Flare(data);
});

test("should include volantis from inte", async (t) => {
  const input = { company: "volantis", user: "danny", location: "inte" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should include acme from us2", async (t) => {
  const input = { company: "acme", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should exclude vortex from us2", async (t) => {
  const input = { company: "vortex", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});
