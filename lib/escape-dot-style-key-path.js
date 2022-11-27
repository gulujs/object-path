import { BaseKeyPath } from './base-key-path.js';

export class EscapeDotStyleKeyPath extends BaseKeyPath {
  escape(key) {
    return key.replace(/[\\.[]/g, '\\$&');
  }

  unescape(key) {
    return key.replace(/\\(\\|\.|\[)/g, '$1');
  }

  // eslint-disable-next-line complexity
  parse(key) {
    const path = [];

    let backslash = false;
    let indexStart = false;
    let indexEnd = false;
    let dot = true;
    let segment = '';

    for (const c of key) {
      dot = false;
      switch (c) {
        case '\\':
          if (indexStart || indexEnd) {
            throw new Error(`Invalid key "${key}"`);
          }
          if (backslash) {
            segment += c;
          }
          backslash = !backslash;
          break;

        case '.':
          if (indexStart) {
            throw new Error(`Invalid key "${key}"`);
          }
          if (indexEnd) {
            indexEnd = false;
            break;
          }
          if (backslash) {
            backslash = false;
            segment += c;
            break;
          }

          path.push(segment);
          segment = '';
          dot = true;
          break;

        case '[':
          if (indexStart) {
            throw new Error(`Invalid key "${key}"`);
          }
          if (indexEnd) {
            indexStart = true;
            indexEnd = false;
            break;
          }
          if (backslash) {
            backslash = false;
            segment += c;
            break;
          }
          if (segment) {
            path.push(segment);
            segment = '';
          }
          indexStart = true;
          break;

        case ']':
          if (indexStart) {
            path.push(Number(segment));
            segment = '';
            indexStart = false;
            indexEnd = true;
            break;
          }
          if (indexEnd) {
            throw new Error(`Invalid key "${key}"`);
          }
          // fall through

        default:
          if (indexStart && !'0123456789'.includes(c)) {
            throw new Error(`Invalid key "${key}"`);
          }
          if (indexEnd) {
            throw new Error(`Invalid key "${key}"`);
          }
          if (backslash) {
            segment += '\\';
            backslash = false;
          }
          segment += c;
      }
    }

    if (backslash) {
      segment += '\\';
    }
    if (indexStart) {
      throw new Error(`Invalid key "${key}"`);
    }

    if (segment) {
      path.push(segment);
    } else if (dot) {
      path.push('');
    }

    return path;
  }
}
