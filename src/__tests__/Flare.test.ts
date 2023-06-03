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
        engine.evaluateAll({
          company: "acme",
          user: "tony",
        })
      ).resolves.toEqual({
        foo: true,
      });
    });
  });

  describe("evaluate", () => {
    it("Should evaluate a single gate", () => {
      const engine = new Flare({
        foo: {
          eval: "user && company",
          conditions: [
            {
              kind: "context",
              id: "user",
              operation: "include",
              path: "user",
              value: ["tony"],
            },
            {
              kind: "context",
              id: "company",
              operation: "include",
              path: "company",
              value: ["acme"],
            },
          ],
        },
      });

      return expect(
        engine.evaluate("foo", {
          company: "acme",
          user: "tony",
        })
      ).resolves.toEqual({
        foo: true,
      });
    });

    it("Should default to false if a gate is not found", () => {
      const engine = new Flare({});

      return expect(
        engine.evaluate("bar", {
          company: "acme",
          user: "tony",
        })
      ).resolves.toEqual({
        bar: false,
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
