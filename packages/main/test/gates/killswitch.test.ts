import { readFile } from "node:fs/promises";
import test from "ava";
import { load } from "js-yaml";
import type { Data } from "@radekstepan/flare-types";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const data = Promise.resolve().then(async () => {
    const yaml = await readFile("test/fixtures/killswitch.yml");
    return load(yaml.toString()) as Data;
  });
  engine = new Flare(data);
});

test("should exclude everyone", async (t) => {
  const input = { location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/off"]);
});
