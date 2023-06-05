import test from "ava";
import mockFs from "mock-fs";
import { readYamlPath, readYamlData } from "../src/yaml.js";

test.before(() => {
  mockFs({
    root: {
      "foo.yaml": 'value: "foo"',
      "baz.symlink.yaml": mockFs.symlink({
        path: "./subdir/baz.yaml",
      }),
      "readme.txt": "Not a YAML file",
      subdir: {
        "bar.yaml": 'value: "bar"',
        "baz.yaml": 'value: "baz"',
      },
    },
  });
});

test.after(() => mockFs.restore());

test("reads a single yaml file", async (t) => {
  const result = await readYamlPath("root/foo.yaml");
  t.deepEqual(result, { "foo.yaml": { value: "foo" } });
});

test("reads all yaml files in a directory", async (t) => {
  const result = await readYamlPath("root/");
  t.deepEqual(result, {
    "foo.yaml": { value: "foo" },
    "baz.symlink.yaml": { value: "baz" },
    "bar.yaml": { value: "bar" },
    "baz.yaml": { value: "baz" },
  });
});

test("reads all yaml files in a directory and keeps the filenames", async (t) => {
  const result = await readYamlData("root/");
  t.deepEqual(result, {
    value: "baz",
  });
});

test("throws an error for invalid path", async (t) => {
  await t.throwsAsync(readYamlPath("nonexistent/"), {
    message: "ENOENT, no such file or directory 'nonexistent/'",
  });
});
