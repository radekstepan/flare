import { expect } from "@jest/globals";
import Flare from "../../Flare";
import loadYaml from "../../loadYaml";

describe("gates/killswitch", () => {
  const data = loadYaml("killswitch");
  const engine = new Flare(data);

  it("should exclude everyone", async () => {
    const input = { location: "us2" };
    const flags = await engine.evaluate(input);

    expect(flags["feature/off"]).toBe(false);
  });
});
