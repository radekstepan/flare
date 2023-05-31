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

  describe("evaluateCondition", () => {
    it("Should default to false", () => {
      expect(
        Flare.evaluateCondition(
          {
            kind: "unknown" as any,
            id: "",
            operation: "include",
            path: "",
            value: new Set(),
          },
          {}
        )
      ).toBeFalsy();
    });

    it("Should return false if an input path doesn't exist", () => {
      expect(
        Flare.evaluateCondition(
          {
            kind: "context",
            id: "",
            operation: "include",
            path: "foo",
            value: new Set("tommy"),
          },
          { user: "tommy" }
        )
      ).toBeFalsy();
    });
  });
});
