import { BaseKeyPath } from './base-key-path.js';

const CHAR_SINGLE_QUOTE = '\'';
const CHAR_DOUBLE_QUOTE = '"';
const RE_ESCAPE_QUOTE_MAP = {
  [CHAR_SINGLE_QUOTE]: /'/g,
  [CHAR_DOUBLE_QUOTE]: /"/g
};
const RE_UNESCAPE_QUOTE_MAP = {
  [CHAR_SINGLE_QUOTE]: /\\'/g,
  [CHAR_DOUBLE_QUOTE]: /\\"/g
};

export class QuoteStyleKeyPath extends BaseKeyPath {
  constructor(options = {}) {
    super();

    const keySegment = options.keySegment || '[\\w$-]+';
    this.RE_KEY = new RegExp(`(?:(?:(?<!'|")(${keySegment}))|(?:\\[(0|[1-9]\\d*)\\])|(('|").*?(?:(?:(?<!\\\\)\\4)|(?:(?<=(?<!\\\\)(?:\\\\\\\\)+)\\4))))(\\.|\\[|$)`, 'g');
    this.RE_KEY_SEGMENT = new RegExp(`^${keySegment}$`);
  }

  escape(key) {
    if (this.RE_KEY_SEGMENT.test(key)) {
      return key;
    }

    const quote = (!key.includes(CHAR_SINGLE_QUOTE) || key.includes(CHAR_DOUBLE_QUOTE))
      ? CHAR_SINGLE_QUOTE
      : CHAR_DOUBLE_QUOTE;
    return `${quote}${key.replace(/\\/g, '\\\\').replace(RE_ESCAPE_QUOTE_MAP[quote], `\\${quote}`)}${quote}`;
  }

  unescape(key) {
    const quote = key[0];
    if (quote !== CHAR_SINGLE_QUOTE && quote !== CHAR_DOUBLE_QUOTE) {
      return key;
    }

    const tail = key.length - 1;
    if (quote !== key[tail]) {
      throw new Error(`Invalid key "${key}"`);
    }
    return key.substring(1, tail)
      .replace(RE_UNESCAPE_QUOTE_MAP[quote], quote)
      .replace(/\\\\/g, '\\');
  }

  parse(key) {
    const path = [];

    let lastIndex = 0;
    this.RE_KEY.lastIndex = lastIndex;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matches = this.RE_KEY.exec(key);
      if (!matches || matches.index !== lastIndex) {
        throw new Error(`Invalid key "${key}"`);
      }

      if (matches[1]) {
        path.push(matches[1]);
      } else if (matches[2]) {
        path.push(Number(matches[2]));
      } else if (matches[3]) {
        path.push(this.unescape(matches[3]));
      }

      if (this.RE_KEY.lastIndex === key.length) {
        if (matches[5]) {
          throw new Error(`Invalid key "${key}"`);
        }
        break;
      }

      if (matches[5] === '[') {
        this.RE_KEY.lastIndex -= 1;
      }
      lastIndex = this.RE_KEY.lastIndex;
    }

    return path;
  }
}
