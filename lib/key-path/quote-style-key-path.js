/* eslint-disable no-control-regex */
import { BaseKeyPath } from './base-key-path.js';

const CHAR_SINGLE_QUOTE = '\'';
const CHAR_DOUBLE_QUOTE = '"';

const RE_SINGLE_QUOTE_AND_CTRL_CHAR_INCLUDE_TAB_CHAR = /[\u0000-\u001F\u007F']/;
const RE_SINGLE_QUOTE_AND_CTRL_CHAR_EXCLUDE_TAB_CHAR = /[\u0000-\u0008\u000A-\u001F\u007F']/;
const RE_ENCODE_REPLACE_PATTERN_INCLUDE_TAB_CHAR = /[\u0000-\u001F\u007F"\\]/g;
const RE_ENCODE_REPLACE_PATTERN_EXCLUDE_TAB_CHAR = /[\u0000-\u0008\u000A-\u001F\u007F"\\]/g;
const RE_DECODE_REPLACE_PATTERN = /\\b|\\t|\\n|\\f|\\r|\\"|\\\\|\\u([\da-fA-F]{4})|\\U([\da-fA-F]{8})/g;

const ENCODE_CHAR_MAP = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"': '\\"',
  '\\': '\\\\',
  '\u007F': '\\u007F'
};
for (let i = 0; i <= 0x1F; i++) {
  const char = String.fromCodePoint(i);
  if (ENCODE_CHAR_MAP[char]) {
    continue;
  }
  ENCODE_CHAR_MAP[char] = `\\u${`000${i.toString(16)}`.toUpperCase().slice(-4)}`;
}

const DECODE_CHAR_MAP = {
  '\\b': '\b',
  '\\t': '\t',
  '\\n': '\n',
  '\\f': '\f',
  '\\r': '\r',
  '\\"': '"',
  '\\\\': '\\'
};

export class QuoteStyleKeyPath extends BaseKeyPath {
  constructor(options = {}) {
    super();

    this.preferQuote = options.preferQuote || CHAR_SINGLE_QUOTE;

    const bareKeyPattern = options.bareKeyPattern || '[\\w-]+';
    this.RE_BARE_KEY = new RegExp(`^${bareKeyPattern}$`);
    this.RE_KEY = new RegExp(`(?:(?:(?<!'|")(${bareKeyPattern}))|(?:(?<=\\[)(0|[1-9]\\d*)\\])|(('|").*?(?:(?:(?<!\\\\)\\4)|(?:(?<=(?<!\\\\)(?:\\\\\\\\)+)\\4))))(\\.|\\[|$)`, 'g');

    this.RE_SINGLE_QUOTE_AND_CONTROL_CHAR = RE_SINGLE_QUOTE_AND_CTRL_CHAR_INCLUDE_TAB_CHAR;
    this.RE_ENCODE_REPLACE_PATTERN = RE_ENCODE_REPLACE_PATTERN_INCLUDE_TAB_CHAR;
    if (options.escapeTabChar !== true) {
      this.RE_SINGLE_QUOTE_AND_CONTROL_CHAR = RE_SINGLE_QUOTE_AND_CTRL_CHAR_EXCLUDE_TAB_CHAR;
      this.RE_ENCODE_REPLACE_PATTERN = RE_ENCODE_REPLACE_PATTERN_EXCLUDE_TAB_CHAR;
    }
  }

  encode(key) {
    if (this.RE_BARE_KEY.test(key)) {
      return key;
    }

    if (this.preferQuote === CHAR_SINGLE_QUOTE && !this.RE_SINGLE_QUOTE_AND_CONTROL_CHAR.test(key)) {
      return `'${key}'`;
    }

    return `"${key.replace(this.RE_ENCODE_REPLACE_PATTERN, char => ENCODE_CHAR_MAP[char])}"`;
  }

  decode(key) {
    const firstChar = key[0];
    if (firstChar !== CHAR_SINGLE_QUOTE && firstChar !== CHAR_DOUBLE_QUOTE) {
      return key;
    }

    const tail = key.length - 1;
    if (firstChar !== key[tail]) {
      return key;
    }

    if (firstChar === CHAR_SINGLE_QUOTE) {
      return key.substring(1, tail);
    }

    return key.substring(1, tail)
      .replace(RE_DECODE_REPLACE_PATTERN, (match, u1, u2) => {
        if (u1) {
          const code = parseInt(u1, 16);
          if ((0 <= code && code <= 0xD7FF) || (0xE000 <= code && code <= 0x10FFFF)) {
            return String.fromCodePoint(code);
          }

        } else if (u2) {
          const code = parseInt(u2, 16);
          if ((0 <= code && code <= 0xD7FF) || (0xE000 <= code && code <= 0x10FFFF)) {
            return String.fromCodePoint(code);
          }

        } else {
          const c = DECODE_CHAR_MAP[match];
          if (c) {
            return c;
          }
        }

        throw new SyntaxError(`Invalid escape code ${match}`);
      });
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

      lastIndex = this.RE_KEY.lastIndex;
    }

    return keys;
  }
}
