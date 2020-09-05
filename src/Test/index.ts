let currentAssertionIndex: number = 0;

export type TestFunction = () => Promise<any> | void;

async function asyncSequenceGivenArrayAndCallback<T>(
  array: T[],
  fn: (item: T, idx: number, array: T[]) => Promise<any>
): Promise<void> {
  if (array == null) {
    return;
  }

  const length = array.length;
  for (let index = 0; index < length; index++) {
    await fn(array[index], index, array);
  }
}

function objectIsDeepEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b;
  } else {
    return objEquiv(a, b);
  }
}

function isArguments(object: any) {
  return Object.prototype.toString.call(object) == "[object Arguments]";
}

function isBuffer(x: any) {
  if (!x || typeof x !== "object" || typeof x.length !== "number") {
    return false;
  }

  if (typeof x.copy !== "function" || typeof x.slice !== "function") {
    return false;
  }

  if (x.length > 0 && typeof x[0] !== "number") {
    return false;
  }

  return true;
}

function objEquiv(a: any, b: any) {
  let i, key;

  if (a == null || b == null) {
    return false;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = Array.prototype.slice.call(a);
    b = Array.prototype.slice.call(b);
    return objectIsDeepEqual(a, b);
  }

  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  let ka, kb;

  try {
    ka = Object.keys(a);
    kb = Object.keys(b);
  } catch (e) {
    return false;
  }

  if (ka.length != kb.length) {
    return false;
  }

  ka.sort();
  kb.sort();

  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) {
      return false;
    }
  }

  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!objectIsDeepEqual(a[key], b[key])) {
      return false;
    }
  }

  return typeof a === typeof b;
}

export class Test {
  private static _allTests: Test[] = [];

  static define(label: string, fn: TestFunction): void {
    if (label == null) {
      throw new Error("label is required");
    }

    if (fn == null) {
      throw new Error("fn is required");
    }

    Test._allTests.push(new Test(label, fn));
  }

  static assert(value: boolean, failedMessage?: string): void {
    currentAssertionIndex += 1;

    if (!value) {
      throw new Error(
        failedMessage || `Assertion ${currentAssertionIndex} failed`
      );
    }
  }

  static async assertThrows(
    fn: () => any,
    failedMessage?: string
  ): Promise<void> {
    currentAssertionIndex += 1;

    try {
      await fn();

      // fn is expected to throw, so if we get here, it's an error
      throw new Error(
        failedMessage || `Assertion ${currentAssertionIndex} failed`
      );
    } catch {
      // OK
    }
  }

  static assertIsDeepEqual(
    actual: any,
    expected: any,
    failedMessage?: string
  ): void {
    currentAssertionIndex += 1;

    if (!objectIsDeepEqual(actual, expected)) {
      throw new Error(
        failedMessage || `Assertion ${currentAssertionIndex} failed`
      );
    }
  }

  static async runAll(): Promise<void> {
    await asyncSequenceGivenArrayAndCallback(Test._allTests, async (test) => {
      await test.toPromise();
    });
  }

  readonly label: string;

  private _fn: TestFunction;

  private constructor(label: string, fn: TestFunction) {
    this.label = label;
    this._fn = fn;
  }

  async toPromise(): Promise<void> {
    currentAssertionIndex = 0;

    console.log(this.label);

    await this._fn();
  }
}
