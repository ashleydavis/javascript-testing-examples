# replay-testing

An example of recording and replaying HTTP tests for use in automated testing.

See instructions in subdirectories for starting the various pieces of this example.

Start the [./backend](./backend) in one terminal.

Start the [./frontend](./frontend) in another terminal.

Start the [./recorder-proxy](./recorder-proxy) in another terminal.

Interact with the frontend and the requests and responses are recorded to the data file [./data/request.log](./data/request.log).

Now stop the frontend and backend.

Use [./replay-tool](./replay-tool) to replay the requests to the backend and test that responses from the backend are correct.

