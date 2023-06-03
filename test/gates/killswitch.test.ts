import test from "ava";
import Flare from "../../src/Flare.js";
import { readYaml } from "../../src/utils.js";

let engine: Flare;
test.before("setup", () => {
  const path = new URL("../fixtures/killswitch.yml", import.meta.url);
  const data = readYaml(path);
  engine = new Flare(data);
});

test("should exclude everyone", async (t) => {
  const input = { location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/off"]);
});
