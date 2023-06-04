import test from "ava";
import { yaml } from "@radekstepan/flare-utils";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/killswitch.yml", import.meta.url);
  const data = yaml.readYaml(path);
  engine = new Flare(data);
});

test("should exclude everyone", async (t) => {
  const input = { location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/off"]);
});
