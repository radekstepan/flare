# flare-benchmark

This package is designed to perform load testing on a Node HTTP server which evaluates Flare gates on each request. It leverages [autocannon](https://github.com/mcollina/autocannon) under the hood.

The tool offers the flexibility to customize parameters such as the number of requests, server type, simultaneous connections, gates, conditions, and values.

## Usage

The script can be executed from the command line using Node.js with optional flags to configure the load test.

```sh
yarn start --requests <requests> --server <server> --connections <connections> --gates <gates> --conditions <conditions> --values <values>
```

### Flags

- `requests (-r)`: Total number of requests to send to the server. Defaults to a 10s worth of requests if not specified otherwise.
- `server (-s)`: The server to send the requests to. Defaults to `ping`. Other choices include `quickEval` and `fullEval`.
- `connections (-c)`: Number of requests to fire at the same time. Defaults to 10.
- `gates (-g)`: Number of Flare gates to generate. Defaults to 10.
- `conditions (-o)`: Number of Flare conditions that each gate should have. Defaults to 10.
- `values (-v)`: Number of Flare values that each gate condition should have. Defaults to 10.

#### `server="ping"`

Use this server to measure the baseline performance of an http server that returns a 200 response and does not evaluate any Flare gates

#### `server="quickEval"`

A server that evaluates all Flare gates on each request. Each gate "eval" expression is set to "true" meaning that conditions need not be evaluated.

#### `server="fullEval"`

A server that evaluates all Flare gates on each request. Each gate "eval" expression uses all conditions.
