# rest-api-testing

An example of automated testing a REST API using Jest and SuperTest.

## Setup

Open a terminal, clone the repository, change to the directory and install dependencies:

```bash
git clone git@github.com:ashleydavis/javascript-testing-examples.git
cd javascript-testing-examples
cd rest-api-testing
npm install
```

## Run the REST API

To test the REST API manually you can run it like this:

```bash
npm start
```

To try out the REST API manually, point your browser at http://localhost:3000/an-example-api.

## Run the automated tests

Note: to run these tests there is no need to manually start the REST API, runing the tests will take care of that.

Run the automated tests (Jest and SuperTest) like this:

```bash
npm test
```