import { expect } from "@jest/globals";
import Flare from "../../Flare";
import loadYaml from "../../loadYaml";

describe("gates/us2-location", () => {
  const data = loadYaml("us2-location");
  const engine = new Flare(data);

  it("should include everyone in us2", async () => {
    const input = { location: "us2" };
    const flags = await engine.evaluate(input);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should exclude everyone not in us2", async () => {
    const input = { location: "us1" };
    const flags = await engine.evaluate(input);

    expect(flags["feature/foo"]).toBe(false);
  });
});
