export class BaseKeyPath {
  escape(_key) {
    throw new Error('Not implemented');
  }

  unescape(_key) {
    throw new Error('Not implemented');
  }

  parse(_key) {
    throw new Error('Not implemented');
  }

  stringify(path) {
    let key = '';
    for (const segment of path) {
      if (typeof segment === 'string') {
        if (key) {
          key += '.';
        }
        key += this.escape(segment);
        continue;
      }

      if (typeof segment === 'number') {
        key += `[${segment}]`;
        continue;
      }

      throw new Error(`Invalid key "${segment}"`);
    }

    return key;
  }
}
