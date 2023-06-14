core:
- return false from eval if the result isn't boolean

validator:
- put the name of the gate into the rejected promise
- make sure condition ids are unique
- make sure gate name is a string (slug)
- return the gates from validateGates
- throw an error if there are no gates; e.g. "5555" is {}

extras:
- run benchmarks for comparison (memory, CPU, speed)
- share a URL with the input to playground
- Netlify badge
- GitHub Actions CI
