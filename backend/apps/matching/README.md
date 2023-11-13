## Matching microservice
1. In order to match users and inform them of their matches, matching service uses websockets
1. Websockets are stored and managed in the websocket-gateway service, as a direct connection is required for websockets
1. When a user wants to find a match, websocket-gateway pings matching service via GRPC in order to request a match
1. If no immediate matches are found, the matching entries are stored in a redis store
1. When a match is found, a session id is emitted back to all gateways (via redis), which would trigger websocket-gateway containing matches' websockets to emit the session id back to users
