export interface ObjectPathOptions {
  /**
   * @default '[\\w-]+'
   */
  keySegment: string;
}

export class ObjectPath {
  static escape(key: string): string;
  static unescape(key: string): string;
  static parseKey(key: string): Array<string | number>;
  static stringifyKey(path: Array<string | number>): string;

  constructor(options?: ObjectPathOptions);
  escape(key: string): string;
  unescape(key: string): string;
  parseKey(key: string): Array<string | number>;
  stringifyKey(path: Array<string | number>): string;
}
