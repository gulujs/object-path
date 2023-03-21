export interface KeyPath {
  encode(key: string): string;
  decode(key: string): string;
  parse(path: string): Array<string | number>;
  stringify(keys: Array<string | number>): string;
}

declare abstract class BaseKeyPath implements KeyPath {
  abstract encode(key: string): string;
  abstract decode(key: string): string;
  abstract parse(path: string): Array<string | number>;
  stringify(keys: Array<string | number>): string;
}

export class EscapeDotStyleKeyPath extends BaseKeyPath {
  encode(key: string): string;
  decode(key: string): string;
  parse(path: string): Array<string | number>;
}

export interface QuoteStyleKeyPathOptions {
  /**
   * @default '[\\w-]+'
   */
  objectKeyPattern?: string;
  preferQuote?: "'" | '"';
}
export class QuoteStyleKeyPath extends BaseKeyPath {
  constructor(options?: QuoteStyleKeyPathOptions);
  encode(key: string): string;
  decode(key: string): string;
  parse(path: string): Array<string | number>;
}

export interface ObjectValueOptions {
  /**
   * @default ['__proto__', 'prototype', 'constructor']
   */
   disallowedKeys?: string[];
}
export class ObjectValue {
  constructor(options?: ObjectValueOptions);
  get(obj: unknown, keys: string[]): unknown;
  set(obj: unknown, keys: string[], value: unknown): boolean;
  del(obj: unknown, keys: string[]): boolean;
  has(obj: unknown, keys: string[]): boolean;
}

export interface ObjectPathOptions {
  keyPath: KeyPath;
  objectValue: ObjectValue;
}

export class ObjectPath {
  static objectValue: ObjectValue;
  static quoteStyle: ObjectPath;
  static escapeDotStyle: ObjectPath;
  static get(obj: unknown, path: string): unknown;
  static get(obj: unknown, keys: string[]): unknown;
  static set(obj: unknown, path: string, value: unknown): boolean;
  static set(obj: unknown, keys: string[], value: unknown): boolean;
  static del(obj: unknown, path: string): boolean;
  static del(obj: unknown, keys: string[]): boolean;
  static has(obj: unknown, path: string): boolean;
  static has(obj: unknown, keys: string[]): boolean;

  keyPath: KeyPath;
  constructor(options?: ObjectPathOptions);
  get(obj: unknown, path: string): unknown;
  get(obj: unknown, keys: string[]): unknown;
  set(obj: unknown, path: string, value: unknown): boolean;
  set(obj: unknown, keys: string[], value: unknown): boolean;
  del(obj: unknown, path: string): boolean;
  del(obj: unknown, keys: string[]): boolean;
  has(obj: unknown, path: string): boolean;
  has(obj: unknown, keys: string[]): boolean;
}
