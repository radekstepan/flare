import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/us2-location.yml", import.meta.url);
  const data = yaml.readYaml(path);
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
