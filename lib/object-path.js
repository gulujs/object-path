export class ObjectPath {
  constructor(options) {
    this.keyPath = options.keyPath;
    this.objectValue = options.objectValue;
  }

  get(obj, key) {
    return this.objectValue.get(obj, this.parseKey(key));
  }

  set(obj, key, value) {
    return this.objectValue.set(obj, this.parseKey(key), value);
  }

  del(obj, key) {
    return this.objectValue.del(obj, this.parseKey(key));
  }

  has(obj, key) {
    return this.objectValue.has(obj, this.parseKey(key));
  }

  parseKey(key) {
    if (typeof key === 'string') {
      return this.keyPath.parse(key);
    } else if (Array.isArray(key)) {
      return key;
    } else {
      throw new Error('The key is invalid');
    }
  }
}
