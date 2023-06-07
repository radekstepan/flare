# Glob patterns

Glob patterns are like simplified Regular Expressions for file paths, and they are used to specify sets of filenames with wildcard characters. Below are a few examples of how you could use different glob patterns to parse the YAML files with the `readYamlGates` function (which uses [`node-glob`](https://github.com/isaacs/node-glob#readme)):

1. **Single file:** If you want to parse a single file, you just provide the path to the file.

    ```ts
    const data = yaml.readYamlGates('fixtures/example.yml');
    ```

2. **All YAML files in a directory:** If you want to parse all YAML files in a directory, use the `*` wildcard. 

    ```ts
    const data = yaml.readYamlGates('fixtures/*.yml');
    ```

3. **All YAML files in the current directory and all subdirectories:** If you want to parse all YAML files in the current directory and all its subdirectories, use the `**` wildcard.

    ```ts
    const data = yaml.readYamlGates('fixtures/**/*.yml');
    ```

4. **Multiple specific files:** If you want to parse multiple specific files, you can use a glob pattern like `{file1,file2}`.

    ```ts
    const data = yaml.readYamlGates('fixtures/{example1.yml,example2.yml}');
    ```

5. **All YAML files in multiple specific directories:** If you want to parse all YAML files in multiple specific directories, you can use a glob pattern like `{dir1/*,dir2/*}`.

    ```ts
    const data = yaml.readYamlGates('fixtures/{dir1/*,dir2/*}.yml');
    ```

6. **Excluding files:** If you want to parse all YAML files in a directory but exclude certain files, use the `!` prefix.

    ```ts
    const data = yaml.readYamlGates(['fixtures/*.yml', '!fixtures/example.yml']);
    ```

Note that you need to use an array when you're using negation, because the order of the patterns matters. The above pattern says "match all YAML files in the `fixtures` directory, but not `fixtures/example.yml`".
