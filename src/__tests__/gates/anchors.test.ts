import { expect } from "@jest/globals";
import Flare from "../../Flare";
import { readYaml } from "../../utils";

describe("gates/anchors", () => {
  const data = readYaml(`${__dirname}/../../../fixtures/anchors.yml`);
  const engine = new Flare(data);

  it("should enable feature/foo and feature/bar for vortex", async () => {
    const input = { company: "vortex", user: "johnny" };
    const flags = await engine.evaluateAll(input);

    expect(flags).toEqual({
      "feature/foo": true,
      "feature/bar": true,
    });
  });

  it("should enable feature/bar for acme", async () => {
    const input = { company: "acme", user: "danny" };
    const flags = await engine.evaluateAll(input);

    expect(flags).toEqual({
      "feature/foo": false,
      "feature/bar": true,
    });
  });

  it("should disable feature/foo and feature/bar for foobar", async () => {
    const input = { company: "foobar", user: "johnny" };
    const flags = await engine.evaluateAll(input);

    expect(flags).toEqual({
      "feature/foo": false,
      "feature/bar": false,
    });
  });
});
