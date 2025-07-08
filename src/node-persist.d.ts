/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'node-persist' {
  interface LocalStorage {
    init(options?: InitOptions): Promise<void>;
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
    values(): Promise<any[]>;
    length(): Promise<number>;
    forEach(callback: (key: string, value: any) => void): Promise<void>;
  }

  interface InitOptions {
    dir?: string;
    stringify?: (value: any) => string;
    parse?: (text: string) => any;
    encoding?: string;
    logging?: boolean | ((message: string) => void);
    ttl?: boolean | number;
    expiredInterval?: number;
    forgiveParseErrors?: boolean;
  }

  const storage: LocalStorage;
  export = storage;
}