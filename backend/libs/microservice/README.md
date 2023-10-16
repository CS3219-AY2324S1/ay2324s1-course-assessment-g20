### Peerprep microservice library
This NestJS library holds the helpers and utilities for our interservice communication.

The gRPC protobuf files can be found under the directory `src/interservice-proto`.
- We can programatically generate the corresponding `.ts` files via the `ts-proto` library.
- To use it, we must first install `protoc` (e.g. `brew install protoc` if on MacOS)
- To automatically generate the corresponding `.ts` files, run `yarn protoc`
- More information on `ts-proto` can be found [here](https://github.com/stephenh/ts-proto)
