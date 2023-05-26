import { getProperty } from "../object";

describe("object", () => {
  describe("getProperty", () => {
    const object = {
      name: "Alice",
      age: 27,
      address: {
        city: "New York",
        zip: 10001,
      },
    };

    test("Should return the property value when the path exists", () => {
      expect(getProperty(object, "name")).toBe("Alice");
      expect(getProperty(object, "age")).toBe(27);
      expect(getProperty(object, "address.city")).toBe("New York");
      expect(getProperty(object, "address.zip")).toBe(10001);
    });

    test("Should return null when the path does not exist", () => {
      expect(getProperty(object, "unknown")).toBeNull();
      expect(getProperty(object, "name.first")).toBeNull();
      expect(getProperty(object, "address.state")).toBeNull();
    });

    test("Should return null when the object is null", () => {
      expect(getProperty(null as any, "name")).toBeNull();
    });

    test("Should return null when the path is an empty string", () => {
      expect(getProperty(object, "")).toBeNull();
    });

    test("Should return null when the path is not a string", () => {
      expect(getProperty(object, 123 as any)).toBeNull();
    });

    test("Should return null when the result is not a string or a number", () => {
      expect(getProperty({ foo: {} }, "foo")).toBeNull();
    });
  });
});
