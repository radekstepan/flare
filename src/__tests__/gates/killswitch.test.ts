import { expect } from "@jest/globals";
import After from "../../After";
import loadYaml from "../../loadYaml";
import { Jwt } from "../../interfaces";

describe("gates/killswitch", () => {
  const data = loadYaml("killswitch");
  const after = new After(data);

  it("should exclude everyone", async () => {
    const jwt = {} as Jwt;
    const parameters = { location: "us2" };
    const flags = await after.evaluate(jwt, parameters);

    expect(flags["feature/off"]).toBe(false);
  });
});
