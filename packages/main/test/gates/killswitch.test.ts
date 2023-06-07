import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = yaml.readYamlGates("test/fixtures/killswitch.yml");
  engine = new Flare(gates);
});

test("should exclude everyone", async (t) => {
  const input = { location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/off"]);
});
