"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = exports.AssertError = void 0;
let currentAssertionIndex = 0;
class AssertError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, AssertError.prototype);
    }
}
exports.AssertError = AssertError;
async function asyncSequenceGivenArrayAndCallback(array, fn) {
    if (array == null) {
        return;
    }
    const length = array.length;
    for (let index = 0; index < length; index++) {
        await fn(array[index], index, array);
    }
}
function objectIsDeepEqual(a, b) {
    if (a === b) {
        return true;
    }
    else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    else if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
        return a === b;
    }
    else {
        return objEquiv(a, b);
    }
}
function objEquiv(a, b) {
    let i, key;
    if (a == null || b == null) {
        return false;
    }
    if (a.prototype !== b.prototype) {
        return false;
    }
    let ka, kb;
    try {
        ka = Object.keys(a);
        kb = Object.keys(b);
    }
    catch (e) {
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
class Test {
    constructor(label, fn) {
        this.label = label;
        this._fn = fn;
    }
    static define(label, fn) {
        if (label == null) {
            throw new Error("label is required");
        }
        if (fn == null) {
            throw new Error("fn is required");
        }
        Test._allTests.push(new Test(label, fn));
    }
    static assert(value, failedMessage) {
        currentAssertionIndex += 1;
        if (!value) {
            throw new AssertError(failedMessage || `Assertion ${currentAssertionIndex} failed`);
        }
    }
    static async assertThrows(fn, failedMessage) {
        currentAssertionIndex += 1;
        try {
            await fn();
            // fn is expected to throw, so if we get here, it's an error
            throw new AssertError(failedMessage || `Assertion ${currentAssertionIndex} failed`);
        }
        catch (err) {
            if (err instanceof AssertError) {
                throw err;
            }
            else {
                // OK
            }
        }
    }
    static assertIsEqual(actual, expected, failedMessage) {
        currentAssertionIndex += 1;
        if (actual !== expected) {
            throw new AssertError(failedMessage || `Assertion ${currentAssertionIndex} failed`);
        }
    }
    static assertIsDeepEqual(actual, expected, failedMessage) {
        currentAssertionIndex += 1;
        if (!objectIsDeepEqual(actual, expected)) {
            throw new AssertError(failedMessage || `Assertion ${currentAssertionIndex} failed`);
        }
    }
    static async runAll() {
        await asyncSequenceGivenArrayAndCallback(Test._allTests, async (test) => {
            await test.toPromise();
        });
    }
    async toPromise() {
        currentAssertionIndex = 0;
        console.log(this.label);
        await this._fn();
    }
}
exports.Test = Test;
Test._allTests = [];
//# sourceMappingURL=index.js.map