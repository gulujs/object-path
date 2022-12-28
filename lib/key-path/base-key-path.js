export class BaseKeyPath {
  encode(_key) {
    throw new Error('Not implemented');
  }

  decode(_key) {
    throw new Error('Not implemented');
  }

  parse(_path) {
    throw new Error('Not implemented');
  }

  stringify(keys) {
    let path = '';
    for (const key of keys) {
      if (typeof key === 'string') {
        if (path) {
          path += '.';
        }
        path += this.encode(key);
        continue;
      }

      if (typeof key === 'number') {
        path += `[${key}]`;
        continue;
      }

      throw new Error(`Invalid key "${key}"`);
    }

    return path;
  }
}
