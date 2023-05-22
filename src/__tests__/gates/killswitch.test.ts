import { expect } from "@jest/globals";
import Flare from "../../Flare";
import loadYaml from "../../loadYaml";
import { Jwt } from "../../interfaces";

describe("gates/killswitch", () => {
  const data = loadYaml("killswitch");
  const engine = new Flare(data);

  it("should exclude everyone", async () => {
    const jwt = {} as Jwt;
    const parameters = { location: "us2" };
    const flags = await engine.evaluate(jwt, parameters);

    expect(flags["feature/off"]).toBe(false);
  });
});
