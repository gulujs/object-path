const DISALLOWED_KEYS = [
  '__proto__',
  'prototype',
  'constructor'
];

export class ObjectValue {
  constructor(options = {}) {
    this.disallowedKeys = options.disallowedKeys || DISALLOWED_KEYS;
  }

  get(obj, path) {
    for (const key of path) {
      if (
        obj === undefined
        || obj === null
        || this.disallowedKeys.includes(key)
      ) {
        return undefined;
      }

      obj = obj[key];
    }

    return obj;
  }

  set(obj, path, value) {
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (
        obj === undefined
        || obj === null
        || this.disallowedKeys.includes(key)
      ) {
        break;
      }

      if (i === path.length - 1) {
        obj[key] = value;
        return true;
      }

      obj = obj[key];
    }

    return false;
  }

  del(obj, path) {
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (
        obj === undefined
        || obj === null
        || this.disallowedKeys.includes(key)
      ) {
        break;
      }

      if (i === path.length - 1) {
        return delete obj[key];
      }

      obj = obj[key];
    }

    return false;
  }

  has(obj, path) {
    if (path.length === 0) {
      return false;
    }

    for (const key of path) {
      if (
        obj === undefined
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
