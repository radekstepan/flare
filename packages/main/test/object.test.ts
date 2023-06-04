import test from "ava";
import { getProperty } from "../src/object.js";

const object = {
  name: "Alice",
  age: 27,
  address: {
    city: "New York",
    zip: 10001,
  },
};

test("should return the property value when the path exists", (t) => {
  t.is(getProperty(object, "name"), "Alice");
  t.is(getProperty(object, "age"), 27);
  t.is(getProperty(object, "address.city"), "New York");
  t.is(getProperty(object, "address.zip"), 10001);
});

test("should return null when the path does not exist", (t) => {
  t.is(getProperty(object, "unknown"), null);
  t.is(getProperty(object, "name.first"), null);
  t.is(getProperty(object, "address.state"), null);
});

test("should return null when the object is null", (t) => {
  t.is(getProperty(null as any, "name"), null);
});

test("should return null when the path is an empty string", (t) => {
  t.is(getProperty(object, ""), null);
});

test("should return null when the path is not a string", (t) => {
  t.is(getProperty(object, 123 as any), null);
});

test("should return null when the result is not a string or a number", (t) => {
  t.is(getProperty({ foo: {} }, "foo"), null);
});
