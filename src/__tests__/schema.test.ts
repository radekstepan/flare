import { conditionSchema, gateSchema } from "../schema";

describe("schema", () => {
  const validCondition = {
    id: "foo",
    operation: "exclude",
    kind: "context",
    path: "valid.path",
    value: [],
  };

  describe("conditionSchema", () => {
    it("Should throw an error for invalid root value", () => {
      return expect(conditionSchema.validateAsync("foo")).rejects.toThrow(
        '"value" must be of type object'
      );
    });

    it("Should throw an error for missing root value", () => {
      return expect(conditionSchema.validateAsync(undefined)).rejects.toThrow(
        '"value" is required'
      );
    });

    it('Should throw an error for missing "id"', () => {
      return expect(conditionSchema.validateAsync({})).rejects.toThrow(
        '"id" is required'
      );
    });

    it('Should throw an error for invalid "id"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo bar",
        })
      ).rejects.toThrow('"id" must only contain alpha-numeric characters');
    });

    it('Should throw an error for missing "operation"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
        })
      ).rejects.toThrow('"operation" is required');
    });

    it('Should throw an error for invalid "operation"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "dessert torn",
        })
      ).rejects.toThrow('"operation" must be one of [exclude, include]');
    });

    it('Should throw an error for missing "kind"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
        })
      ).rejects.toThrow('"kind" is required');
    });

    it('Should throw an error for invalid "kind"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
          kind: "custom",
        })
      ).rejects.toThrow('"kind" must be [context]');
    });

    it('Should throw an error for missing "path"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
          kind: "context",
        })
      ).rejects.toThrow('"path" is required');
    });

    it('Should throw an error for invalid "path"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
          kind: "context",
          path: "./",
        })
      ).rejects.toThrow(
        '"path" with value "./" fails to match the required pattern: /^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)*$/'
      );
    });

    it('Should throw an error for missing "value"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
          kind: "context",
          path: "key.path",
        })
      ).rejects.toThrow('"value" is required');
    });

    it('Should throw an error for invalid "value"', () => {
      return expect(
        conditionSchema.validateAsync({
          id: "foo",
          operation: "exclude",
          kind: "context",
          path: "key.path",
          value: [{ object: { not: { supported: true } } }],
        })
      ).rejects.toThrow('"value[0]" must be one of [string, number]');
    });

    it("Should validate a valid condition schema", () => {
      return expect(
        conditionSchema.validateAsync(validCondition)
      ).resolves.toBeDefined();
    });
  });

  describe("gateSchema", () => {
    it("Should throw an error for invalid root value", () => {
      return expect(gateSchema.validateAsync("foo")).rejects.toThrow(
        '"value" must be of type object'
      );
    });

    it("Should throw an error for missing root value", () => {
      return expect(gateSchema.validateAsync(undefined)).rejects.toThrow(
        '"value" is required'
      );
    });

    it('Should throw an error for missing "eval"', () => {
      return expect(gateSchema.validateAsync({})).rejects.toThrow(
        '"eval" is required'
      );
    });

    it('Should throw an error for invalid "eval"', () => {
      return expect(
        gateSchema.validateAsync({
          eval: true,
        })
      ).rejects.toThrow('"eval" must be a string');
    });

    it('Should throw an error for missing "conditions"', () => {
      return expect(
        gateSchema.validateAsync({
          eval: "true",
        })
      ).rejects.toThrow('"conditions" is required');
    });

    it('Should throw an error for invalid "conditions"', () => {
      return expect(
        gateSchema.validateAsync({
          eval: "true",
          conditions: ["invalid_condition"],
        })
      ).rejects.toThrow(
        '"conditions" does not contain at least one required match'
      );
    });

    it("Should validate a valid gate schema", () => {
      return expect(
        gateSchema.validateAsync({
          eval: "true",
          conditions: [validCondition],
        })
      ).resolves.toBeDefined();
    });
  });
});
