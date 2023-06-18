import test from "ava";
import { JS_VAR, PATH, SLUG } from "../src/schema.js";

test("Valid JS variable names", (t) => {
  t.true(JS_VAR.test("validName"));
  t.true(JS_VAR.test("valid_name"));
  t.true(JS_VAR.test("_validName"));
  t.true(JS_VAR.test("$validName"));
  t.true(JS_VAR.test("VALIDNAME"));
  t.true(JS_VAR.test("validName123"));
  t.true(JS_VAR.test("valid$name"));
});

test("Invalid JS variable names", (t) => {
  t.false(JS_VAR.test("1invalidName"));
  t.false(JS_VAR.test("-invalidName"));
  t.false(JS_VAR.test("invalid-name"));
  t.false(JS_VAR.test("invalid name"));
  t.false(JS_VAR.test("invalidName!"));
  t.false(JS_VAR.test("invalid.Name"));
  t.false(JS_VAR.test("invalid/name"));
});

test("Valid paths", (t) => {
  t.true(PATH.test("validname"));
  t.true(PATH.test("valid.name"));
  t.true(PATH.test("valid.name1"));
  t.true(PATH.test("valid.name.part"));
  t.true(PATH.test("VALIDNAME"));
  t.true(PATH.test("valid1.name2.part3"));
});

test("Invalid paths", (t) => {
  t.false(PATH.test("invalid name"));
  t.false(PATH.test(".invalidname"));
  t.false(PATH.test("invalidname."));
  t.false(PATH.test("invalid..name"));
  t.false(PATH.test("invalid_name"));
  t.false(PATH.test("invalid-name"));
});

test("Valid slugs", (t) => {
  t.true(SLUG.test("validname"));
  t.true(SLUG.test("valid-name"));
  t.true(SLUG.test("valid/name"));
  t.true(SLUG.test("valid-name/part2"));
  t.true(SLUG.test("valid/name/part2"));
  t.true(SLUG.test("valid1-name2-part3"));
  t.true(SLUG.test("valid1/name2/part3"));
});

test("Invalid slugs", (t) => {
  t.false(SLUG.test("invalid name"));
  t.false(SLUG.test("/invalidname"));
  t.false(SLUG.test("invalidname/"));
  t.false(SLUG.test("-invalidname"));
  t.false(SLUG.test("invalidname-"));
  t.false(SLUG.test("invalid//name"));
  t.false(SLUG.test("invalid--name"));
  t.false(SLUG.test("invalid.-name"));
});
