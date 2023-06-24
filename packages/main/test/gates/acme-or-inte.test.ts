import { readFile } from "node:fs/promises";
import test from "ava";
import { load } from "js-yaml";
import type { Gates } from "@radekstepan/flare-types";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = Promise.resolve().then(async () => {
    const yaml = await readFile("test/fixtures/acme-or-inte.yml");
    return load(yaml.toString()) as Gates;
  });
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
