import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = yaml.readYamlGates("test/fixtures/us2-location.yml");
  engine = new Flare(gates);
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
