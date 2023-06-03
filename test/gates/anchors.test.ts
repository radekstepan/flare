import test from "ava";
import Flare from "../../src/Flare.js";
import { readYaml } from "../../src/utils.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/anchors.yml", import.meta.url);
  const data = readYaml(path);
  engine = new Flare(data);
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
