export interface KeyPath {
  escape(key: string): string;
  unescape(key: string): string;
  parse(key: string): Array<string | number>;
  stringify(path: Array<string | number>): string;
}

declare abstract class BaseKeyPath {
  abstract escape(key: string): string;
  abstract unescape(key: string): string;
  abstract parse(key: string): Array<string | number>;
  stringify(path: Array<string | number>): string;
}

export class EscapeDotStyleKeyPath extends BaseKeyPath implements KeyPath {
  escape(key: string): string;
  unescape(key: string): string;
  parse(key: string): (string | number)[];
}

export interface QuoteStyleKeyPathOptions {
  /**
   * @default '[\\w$-]+'
   */
   keySegment?: string;
}
export class QuoteStyleKeyPath extends BaseKeyPath implements KeyPath {
  constructor(options?: QuoteStyleKeyPathOptions);
  escape(key: string): string;
  unescape(key: string): string;
  parse(key: string): (string | number)[];
}

export interface ObjectValueOptions {
  /**
   * @default ['__proto__', 'prototype', 'constructor']
   */
   disallowedKeys?: string[];
}
export class ObjectValue {
  constructor(options?: ObjectValueOptions);
  get(obj: unknown, path: string[]): unknown;
  set(obj: unknown, path: string[], value: unknown): boolean;
  del(obj: unknown, path: string[]): boolean;
  has(obj: unknown, path: string[]): boolean;
}

export interface ObjectPathOptions {
  keyPath: KeyPath;
  objectValue: ObjectValue;
}

export class ObjectPath {
  static objectValue: ObjectValue;
  static quoteStyle: ObjectPath;
  static escapeDotStyle: ObjectPath;
  static get(obj: unknown, key: string): unknown;
  static get(obj: unknown, path: string[]): unknown;
  static set(obj: unknown, key: string, value: unknown): boolean;
  static set(obj: unknown, path: string[], value: unknown): boolean;
  static del(obj: unknown, key: string): boolean;
  static del(obj: unknown, path: string[]): boolean;
  static has(obj: unknown, key: string): boolean;
  static has(obj: unknown, path: string[]): boolean;

  keyPath: KeyPath;
  constructor(options?: ObjectPathOptions);
  get(obj: unknown, key: string): unknown;
  get(obj: unknown, path: string[]): unknown;
  set(obj: unknown, key: string, value: unknown): boolean;
  set(obj: unknown, path: string[], value: unknown): boolean;
  del(obj: unknown, key: string): boolean;
  del(obj: unknown, path: string[]): boolean;
  has(obj: unknown, key: string): boolean;
  has(obj: unknown, path: string[]): boolean;
}
