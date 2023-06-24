import { readFile } from "node:fs/promises";
import test from "ava";
import { load } from "js-yaml";
import type { Gates } from "@radekstepan/flare-types";
import Flare from "../../src/Flare.js";

let engine: Flare;
test.before("setup", () => {
  const gates = Promise.resolve().then(async () => {
    const yaml = await readFile("test/fixtures/acme-but-danny.yml");
    return load(yaml.toString()) as Gates;
  });
  engine = new Flare(gates);
});

test("should exclude danny from acme", async (t) => {
  const input = { company: "acme", user: "danny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});

test("should include other users from acme", async (t) => {
  const input = { company: "acme", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should include other users from acme if the user context is empty", async (t) => {
  const input = { company: "acme", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.true(flags["feature/foo"]);
});

test("should exclude users from other companies", async (t) => {
  const input = { company: "foobar", user: "johnny", location: "us2" };
  const flags = await engine.evaluateAll(input);

  t.false(flags["feature/foo"]);
});
