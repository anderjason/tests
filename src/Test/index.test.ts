import { AssertError, Test } from ".";

Test.define("assert works correctly", () => {
  try {
    Test.assert(false, "false should be true");
    throw new Error("Error in Test.assert");
  } catch {
    // OK
  }
});

Test.define("assertThrows catches exceptions correctly", () => {
  try {
    Test.assertThrows(() => {
      throw new Error("Bang!");
    }, "Should throw");
  } catch {
    throw new Error("Error in Test.assertThrows");
  }
});

Test.define("assertThrows throws if the inner function does not", async () => {
  try {
    await Test.assertThrows(() => {
      // empty
    }, "Should throw");

    throw new Error("Error in Test.assertThrows");
  } catch (err) {
    if (err instanceof AssertError) {
      // OK
    } else {
      throw err;
    }
  }
});
