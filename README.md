# @anderjason/tests

A simple, lightweight test system for Typescript projects.

## Installation

`npm install --save @anderjason/tests`

### Setting up the test system for your project

The instructions below assume that you already have a Typescript project.

Step 1: In your `tsconfig.json` file, exclude any test files (which will end with `.test.ts`) from your main build:

```
{
  "exclude": ["src/**/*.test.ts"],
  "include": ["src/**/*"]
}
```

Step 2: Add a `tsconfig.test.json` file in the root of your project with these contents:

```
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": false,
    "outDir": "./test/",
    "sourceMap": false
  },
  "exclude": []
}
```

Step 3: Add a script entry to your `package.json` file:

```
  "scripts": {
    "test": "tsc -p tsconfig.test.json && node test/index.test && rm -rf test"
  },
```

Step 4: Create a file at `src/index.test.ts` with the following contents:

```
import { Test } from "@anderjason/tests";
// TODO: Import your test files here

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
```

### Adding a simple example test

Step 1: Create a file containing one or more tests. The file can be anywhere in your project, and the filename should end with `.test.ts`

```
import { Test } from "@anderjason/tests";

Test.define("Hello has 5 characters", () => {
  Test.assert("hello".length === 5);
});

Test.define("Hello has 3 characters", () => {
  // this test will fail
  Test.assert("hello".length === 3);
});

// You can use async tests too
Test.define("This callback returns Promise<void>", async () => {

});
```

Step 2: From your root test file (`src/index.test.ts`) import the test file you created in the previous step:

```
import { Test } from "@anderjason/tests";
import "./mytest.test"

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
```

### Running tests

Run your tests using npm test:

```
$ npm test
```
