import { readFile } from "node:fs/promises";
import test from "ava";
import { load } from "js-yaml";
import type { Gates } from "@radekstepan/flare-types";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = Promise.resolve().then(async () => {
    const yaml = await readFile("test/fixtures/anchors.yml");
    return load(yaml.toString()) as Gates;
  });
  engine = new Flare(gates);
});

test("should enable feature/foo and feature/bar for vortex", async (t) => {
  const input = { company: "vortex", user: "johnny" };
  const flags = await engine.evaluateAll(input);

  t.like(flags, {
    "feature/foo": true,
    "feature/bar": true,
  });
});

test("should enable feature/bar for acme", async (t) => {
  const input = { company: "acme", user: "danny" };
  const flags = await engine.evaluateAll(input);

  t.like(flags, {
    "feature/foo": false,
    "feature/bar": true,
  });
});

test("should disable feature/foo and feature/bar for foobar", async (t) => {
  const input = { company: "foobar", user: "johnny" };
  const flags = await engine.evaluateAll(input);

  t.like(flags, {
    "feature/foo": false,
    "feature/bar": false,
  });
});
