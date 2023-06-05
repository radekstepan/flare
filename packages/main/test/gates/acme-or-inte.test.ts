import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/acme-or-inte.yml", import.meta.url);
  const data = yaml.readYamlData(path);
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
