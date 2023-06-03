import { expect } from "@jest/globals";
import Flare from "../../Flare";
import { readYaml } from "../../utils";

describe("gates/acme-or-inte", () => {
  const data = readYaml(`${__dirname}/../../../fixtures/acme-or-inte.yml`);
  const engine = new Flare(data);

  it("should include volantis from inte", async () => {
    const input = { company: "volantis", user: "danny", location: "inte" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should include acme from us2", async () => {
    const input = { company: "acme", user: "johnny", location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should exclude vortex from us2", async () => {
    const input = { company: "vortex", user: "johnny", location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(false);
  });
});
