# output-testing

An example of simple but powerful testing by checking for change in the output of a program.

This data processing pipeline was created by ChatGPT.

## Setup

Open a terminal, clone the repository, change to the directory and install dependencies:

```bash
git clone git@github.com:ashleydavis/javascript-testing-examples.git
cd javascript-testing-examples
cd output-testing
npm install
```

### Run the test

First run the program:

```bash
npm start
```

Then compare the results.

Use `git status` or `git diff` to see if the output file [output.json](output.json) has changed.

Try making a change to the program to change the content of the output file, run the program again (`npm start`) and then use `git diff` to see the changes.

