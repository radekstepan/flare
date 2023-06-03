import { expect } from "@jest/globals";
import Flare from "../../Flare";
import { readYaml } from "../../utils";

describe("gates/acme-but-danny", () => {
  const data = readYaml(`${__dirname}/../../../fixtures/acme-but-danny.yml`);
  const engine = new Flare(data);

  it("should exclude danny from acme", async () => {
    const input = { company: "acme", user: "danny", location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(false);
  });

  it("should include other users from acme", async () => {
    const input = { company: "acme", user: "johnny", location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should exclude users from other companies", async () => {
    const input = { company: "foobar", user: "johnny", location: "us2" };
    const flags = await engine.evaluateAll(input);

    expect(flags["feature/foo"]).toBe(false);
  });
});
