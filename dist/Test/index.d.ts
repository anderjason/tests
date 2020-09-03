export declare type TestFunction = () => Promise<any> | void;
export declare class Test {
    private static _allTests;
    static define(label: string, fn: TestFunction): void;
    static assert(value: boolean, failedMessage?: string): void;
    static assertThrows(fn: () => any, failedMessage?: string): Promise<void>;
    static assertIsDeepEqual(actual: any, expected: any, failedMessage?: string): void;
    static runAll(): Promise<void>;
    readonly label: string;
    private _fn;
    private constructor();
    toPromise(): Promise<void>;
}
