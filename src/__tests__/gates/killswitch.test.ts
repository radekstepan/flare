import { expect } from "@jest/globals";
import Flare from "../../Flare";
import { readYaml } from "../../utils";

describe("gates/killswitch", () => {
  const data = readYaml(`${__dirname}/../../../fixtures/killswitch.yml`);
  const engine = new Flare(data);

  it("should exclude everyone", async () => {
    const input = { location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/off"]).toBe(false);
  });
});
