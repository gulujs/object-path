export class ObjectPath {
  constructor(options) {
    this.keyPath = options.keyPath;
    this.objectValue = options.objectValue;
  }

  get(obj, path) {
    return this.objectValue.get(obj, this.parsePath(path));
  }

  set(obj, path, value) {
    return this.objectValue.set(obj, this.parsePath(path), value);
  }

  del(obj, path) {
    return this.objectValue.del(obj, this.parsePath(path));
  }

  has(obj, path) {
    return this.objectValue.has(obj, this.parsePath(path));
  }

  parsePath(path) {
    if (typeof path === 'string') {
      return this.keyPath.parse(path);
    } else if (Array.isArray(path)) {
      return path;
    } else {
      throw new Error('The key is invalid');
    }
  }
}
