import { BaseKeyPath } from './base-key-path.js';

const DIGIT_STR = '0123456789';

export class EscapeDotStyleKeyPath extends BaseKeyPath {
  encode(key) {
    return key.replace(/[\\.[]/g, '\\$&');
  }

  decode(key) {
    return key.replace(/\\(\\|\.|\[)/g, '$1');
  }

  // eslint-disable-next-line complexity
  parse(path) {
    const keys = [];

    let backslash = false;
    let indexStart = false;
    let indexEnd = false;
    let dot = true;
    let key = '';

    for (let i = 0, len = path.length; i < len; i++) {
      const c = path[i];
      dot = false;
      switch (c) {
        case '\\':
          if (indexStart || indexEnd) {
            throw new Error(`Invalid key "${path}"`);
          }
          if (backslash) {
            key += c;
          }
          backslash = !backslash;
          break;

        case '.':
          if (indexStart) {
            throw new Error(`Invalid key "${path}"`);
          }
          if (indexEnd) {
            indexEnd = false;
            break;
          }
          if (backslash) {
            backslash = false;
            key += c;
            break;
          }

          keys.push(key);
          key = '';
          dot = true;
          break;

        case '[':
          if (indexStart) {
            throw new Error(`Invalid key "${path}"`);
          }
          if (indexEnd) {
            indexStart = true;
            indexEnd = false;
            break;
          }
          if (backslash) {
            backslash = false;
            key += c;
            break;
          }
          if (key) {
            keys.push(key);
            key = '';
          }
          indexStart = true;
          break;

        case ']':
          if (indexStart) {
            keys.push(Number(key));
            key = '';
            indexStart = false;
            indexEnd = true;
            break;
          }
          if (indexEnd) {
            throw new Error(`Invalid key "${path}"`);
          }
          // fall through

        default:
          if (indexStart && !DIGIT_STR.includes(c)) {
            throw new Error(`Invalid key "${path}"`);
          }
          if (indexEnd) {
            throw new Error(`Invalid key "${path}"`);
          }
          if (backslash) {
            key += '\\';
            backslash = false;
          }
          key += c;
      }
    }

    if (backslash) {
      key += '\\';
    }
    if (indexStart) {
      throw new Error(`Invalid key "${path}"`);
    }

    if (key) {
      keys.push(key);
    } else if (dot) {
      keys.push('');
    }

    return keys;
  }
}
