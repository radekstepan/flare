import Flare from "../Flare";

describe("Flare", () => {
  describe("constructor", () => {
    it("Should allow a promise to initialize data", () => {
      const engine = new Flare(
        Promise.resolve({
          foo: {
            eval: "true",
            conditions: [],
          },
        })
      );

      return expect(
        engine.evaluate({
          company: "acme",
          user: "tony",
        })
      ).resolves.toEqual({
        foo: true,
      });
    });
  });
});
