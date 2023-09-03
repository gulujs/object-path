export type EncodedPath = string;
export type DecodedPath = Array<string | number>
export type Key = EncodedPath | DecodedPath;

export interface KeyPath {
  encode(key: string): string;
  decode(key: string): string;
  parse(path: EncodedPath): DecodedPath;
  stringify(keys: DecodedPath): EncodedPath;
}

declare abstract class BaseKeyPath implements KeyPath {
  abstract encode(key: string): string;
  abstract decode(key: string): string;
  abstract parse(path: EncodedPath): DecodedPath;
  stringify(keys: DecodedPath): EncodedPath;
}

export class EscapeDotStyleKeyPath extends BaseKeyPath {
  encode(key: string): string;
  decode(key: string): string;
  parse(path: EncodedPath): DecodedPath;
}

export interface QuoteStyleKeyPathOptions {
  /**
   * @default '[\\w-]+'
   */
  bareKeyPattern?: string;
  /**
   * @default "'"
   */
  preferQuote?: "'" | '"';
  /**
   * @default false
   */
  escapeTabChar?: boolean;
}
export class QuoteStyleKeyPath extends BaseKeyPath {
  constructor(options?: QuoteStyleKeyPathOptions);
  encode(key: string): string;
  decode(key: string): string;
  parse(path: EncodedPath): DecodedPath;
}

export interface ObjectPathOptions {
  keyPath: KeyPath;
  /**
   * @default ['__proto__', 'prototype', 'constructor']
   */
   disallowedKeys?: string[];
}

export class ObjectPath {
  static objectValue: ObjectValue;
  static quoteStyle: ObjectPath;
  static escapeDotStyle: ObjectPath;
  static get(obj: unknown, path: Key): unknown;
  static set(obj: unknown, path: Key, value: unknown): boolean;
  static del(obj: unknown, path: Key): boolean;
  static has(obj: unknown, path: Key): boolean;

  keyPath: KeyPath;
  constructor(options: ObjectPathOptions);
  get(obj: unknown, path: Key): unknown;
  set(obj: unknown, path: Key, value: unknown): boolean;
  del(obj: unknown, path: Key): boolean;
  has(obj: unknown, path: Key): boolean;
}
