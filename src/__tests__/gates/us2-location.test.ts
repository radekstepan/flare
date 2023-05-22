import { expect } from "@jest/globals";
import Flare from "../../Flare";
import loadYaml from "../../loadYaml";
import { Jwt } from "../../interfaces";

describe("gates/us2-location", () => {
  const data = loadYaml("us2-location");
  const engine = new Flare(data);

  it("should include everyone in us2", async () => {
    const jwt = {} as Jwt;
    const parameters = { location: "us2" };
    const flags = await engine.evaluate(jwt, parameters);

    expect(flags["feature/foo"]).toBe(true);
  });

  it("should exclude everyone not in us2", async () => {
    const jwt = {} as Jwt;
    const parameters = { location: "us1" };
    const flags = await engine.evaluate(jwt, parameters);

    expect(flags["feature/foo"]).toBe(false);
  });
});
