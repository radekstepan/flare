import test from "ava";
import mockFs from "mock-fs";
import { dump } from "js-yaml";
import type { PathBase } from "path-scurry";
import { readYamlFile, readYamlPath, readYamlGates } from "../src/yaml.js";

test.before(() => {
  mockFs({
    root: {
      "foo.yaml": dump({ foo: { value: "foo" } }),
      "baz.symlink.yaml": mockFs.symlink({
        path: "./subdir/baz.yaml",
      }),
      "readme.txt": "Not a YAML file",
      subdir: {
        "bar.yaml": dump({ bar: { value: "bar" } }),
        "baz.yaml": dump({ baz: { value: "baz" } }),
      },
    },
  });
});

test.after(() => mockFs.restore());

test("reads a yaml file", async (t) => {
  const path = { fullpath: () => "root/foo.yaml" } as PathBase;
  const result = await readYamlFile(path);
  t.deepEqual(result, ["root/foo.yaml", { foo: { value: "foo" } }]);
});

test("reads a single yaml file by path", async (t) => {
  const result = await readYamlPath("root/foo.yaml");
  t.deepEqual(result, { "root/foo.yaml": { foo: { value: "foo" } } });
});

test("reads all yaml files in a directory by glob pattern", async (t) => {
  const result = await readYamlPath("root/**/*.yaml");
  t.deepEqual(result, {
    "root/baz.symlink.yaml": { baz: { value: "baz" } },
    "root/foo.yaml": { foo: { value: "foo" } },
    "root/subdir/bar.yaml": { bar: { value: "bar" } },
    "root/subdir/baz.yaml": { baz: { value: "baz" } },
  });
});

test("reads all yaml files in a directory by glob pattern with ignore options", async (t) => {
  const result = await readYamlPath("**", {
    ignore: {
      ignored: (p) => !p.name.endsWith(".yaml"),
    },
  });
  t.deepEqual(result, {
    "root/baz.symlink.yaml": { baz: { value: "baz" } },
    "root/foo.yaml": { foo: { value: "foo" } },
    "root/subdir/bar.yaml": { bar: { value: "bar" } },
    "root/subdir/baz.yaml": { baz: { value: "baz" } },
  });
});

test("reads all yaml files in a directory by glob pattern and keeps the filenames", async (t) => {
  const result = await readYamlGates("root/**/*.yaml");
  t.deepEqual(result, {
    foo: { value: "foo" },
    baz: { value: "baz" },
    bar: { value: "bar" },
  });
});

test("ignores an invalid path", async (t) => {
  const result = await readYamlPath("nonexistent/");
  t.deepEqual(result, {});
});
