import { expect } from "@jest/globals";
import After from "../../After";
import loadYaml from "../../loadYaml";

describe("gates/acme-or-inte", () => {
  const data = loadYaml("acme-or-inte");
  const after = new After(data);

  it("should include volantis from inte", async () => {
    const jwt = { company: "volantis", user: "danny" };
    const parameters = { location: "inte" };
    const flags = await after.evaluate(jwt, parameters);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should include acme from us2", async () => {
    const jwt = { company: "acme", user: "johnny" };
    const parameters = { location: "us2" };
    const flags = await after.evaluate(jwt, parameters);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should exclude vortex from us2", async () => {
    const jwt = { company: "vortex", user: "johnny" };
    const parameters = { location: "us2" };
    const flags = await after.evaluate(jwt, parameters);

    expect(flags["feature/foo"]).toBe(false);
  });
});
