import { readFile } from "node:fs/promises";
import test from "ava";
import { load } from "js-yaml";
import type { Data } from "@radekstepan/flare-types";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const data = Promise.resolve().then(async () => {
    const yaml = await readFile("test/fixtures/us2-location.yml");
    return load(yaml.toString()) as Data;
  });
  engine = new Flare(data);
});

test("should include everyone in us2", async (t) => {
  const input = { location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should exclude everyone not in us2", async (t) => {
  const input = { location: "us1" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});
