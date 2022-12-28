const DEFAULT_DISALLOWED_KEYS = [
  '__proto__',
  'prototype',
  'constructor'
];

function isObject(value) {
  return (typeof value === 'object' && value !== null) || typeof value === 'function';
}

export class ObjectValue {
  constructor(options = {}) {
    this.disallowedKeys = options.disallowedKeys || DEFAULT_DISALLOWED_KEYS;
  }

  get(obj, keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        typeof obj === 'undefined'
        || obj === null
        || this.disallowedKeys.includes(key)
      ) {
        return undefined;
      }

      obj = obj[key];
    }

    return obj;
  }

  set(obj, keys, value) {
    if (!isObject(obj) && !Array.isArray(obj)) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this.disallowedKeys.includes(key)) {
        break;
      }

      if (i === keys.length - 1) {
        obj[key] = value;
        return true;
      }

      if (typeof keys[i + 1] === 'number') {
        if (!Array.isArray(obj[key])) {
          obj[key] = [];
        }
      } else {
        if (!isObject(obj[key])) {
          obj[key] = {};
        }
      }

      obj = obj[key];
    }

    return false;
  }

  del(obj, keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        typeof obj === 'undefined'
        || obj === null
        || this.disallowedKeys.includes(key)
      ) {
        break;
      }

      if (i === keys.length - 1) {
        return delete obj[key];
      }

      obj = obj[key];
    }

    return false;
  }

  has(obj, keys) {
    if (keys.length === 0) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        typeof obj === 'undefined'
        || obj === null
        || this.disallowedKeys.includes(key)
        || !(key in obj)
      ) {
        return false;
      }

      obj = obj[key];
    }

    return true;
  }
}
