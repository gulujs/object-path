import { BaseKeyPath } from './base-key-path.js';

const CHAR_SINGLE_QUOTE = '\'';
const CHAR_DOUBLE_QUOTE = '"';
const RE_ENCODE_QUOTE_MAP = {
  [CHAR_SINGLE_QUOTE]: /'/g,
  [CHAR_DOUBLE_QUOTE]: /"/g
};
const RE_DECODE_QUOTE_MAP = {
  [CHAR_SINGLE_QUOTE]: /\\'/g,
  [CHAR_DOUBLE_QUOTE]: /\\"/g
};

export class QuoteStyleKeyPath extends BaseKeyPath {
  constructor(options = {}) {
    super();

    const objectKeyPattern = options.objectKeyPattern || '[\\w-]+';
    this.RE_KEY = new RegExp(`(?:(?:(?<!'|")(${objectKeyPattern}))|(?:\\[(0|[1-9]\\d*)\\])|(('|").*?(?:(?:(?<!\\\\)\\4)|(?:(?<=(?<!\\\\)(?:\\\\\\\\)+)\\4))))(\\.|\\[|$)`, 'g');
    this.RE_OBJECT_KEY = new RegExp(`^${objectKeyPattern}$`);
  }

  encode(key) {
    if (this.RE_OBJECT_KEY.test(key)) {
      return key;
    }

    const quote = (!key.includes(CHAR_SINGLE_QUOTE) || key.includes(CHAR_DOUBLE_QUOTE))
      ? CHAR_SINGLE_QUOTE
      : CHAR_DOUBLE_QUOTE;
    return `${quote}${key.replace(/\\/g, '\\\\').replace(RE_ENCODE_QUOTE_MAP[quote], `\\${quote}`)}${quote}`;
  }

  decode(key) {
    const quote = key[0];
    if (quote !== CHAR_SINGLE_QUOTE && quote !== CHAR_DOUBLE_QUOTE) {
      return key;
    }

    const tail = key.length - 1;
    if (quote !== key[tail]) {
      return key;
    }
    return key.substring(1, tail)
      .replace(RE_DECODE_QUOTE_MAP[quote], quote)
      .replace(/\\\\/g, '\\');
  }

  parse(path) {
    const keys = [];

    let lastIndex = 0;
    this.RE_KEY.lastIndex = lastIndex;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matches = this.RE_KEY.exec(path);
      if (!matches || matches.index !== lastIndex) {
        throw new Error(`Invalid key "${path}"`);
      }

      if (matches[1]) {
        keys.push(matches[1]);
      } else if (matches[2]) {
        keys.push(Number(matches[2]));
      } else if (matches[3]) {
        keys.push(this.decode(matches[3]));
      }

      if (this.RE_KEY.lastIndex === path.length) {
        if (matches[5]) {
          throw new Error(`Invalid key "${path}"`);
        }
        break;
      }

      if (matches[5] === '[') {
        this.RE_KEY.lastIndex -= 1;
      }
      lastIndex = this.RE_KEY.lastIndex;
    }

    return keys;
  }
}
