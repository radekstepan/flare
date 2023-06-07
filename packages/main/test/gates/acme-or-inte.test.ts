import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = yaml.readYamlGates("test/fixtures/acme-or-inte.yml");
  engine = new Flare(gates);
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
