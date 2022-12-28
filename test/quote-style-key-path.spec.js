import { expect } from 'chai';
import { QuoteStyleKeyPath } from '../lib/index.js';

describe('QuoteStyleKeyPath', () => {
  const keyPath = new QuoteStyleKeyPath();

  describe('encode', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(keyPath.encode(key)).to.equal(key);
    });

    it('should be encoded', () => {
      expect(keyPath.encode('')).to.equal("''");
      expect(keyPath.encode('foo.bar')).to.equal("'foo.bar'");
      expect(keyPath.encode('foo bar')).to.equal("'foo bar'");
      expect(keyPath.encode('foo\'bar')).to.equal('"foo\'bar"');
      expect(keyPath.encode('foo"bar')).to.equal("'foo\"bar'");
    });
  });

  describe('decode', () => {
    it('nothing changed', () => {
      expect(keyPath.decode('foobar')).to.equal('foobar');
      expect(keyPath.decode("'foo.bar")).to.equal("'foo.bar");
    });

    it('should be decoded', () => {
      expect(keyPath.decode("'foo.bar'")).to.equal('foo.bar');
      expect(keyPath.decode("'foo bar'")).to.equal('foo bar');
      expect(keyPath.decode('"foo\'bar"')).to.equal('foo\'bar');
      expect(keyPath.decode("'foo\"bar'")).to.equal('foo"bar');
    });
  });

  describe('parse', () => {
    it('basic', () => {
      // eslint-disable-next-line quotes
      const key = `users[0].'user . data'."user ' name".'first " name'`;
      expect(keyPath.parse(key)).to.deep.equal([
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ]);
    });

    it('invalid key', () => {
      expect(() => keyPath.parse('')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('foo . bar')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('foo.bar.')).to.throw(/^Invalid key/);
    });
  });

  describe('stringify', () => {
    it('basic', () => {
      const path = [
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ];
      // eslint-disable-next-line quotes
      expect(keyPath.stringify(path)).to.equal(`users[0].'user . data'."user ' name".'first " name'`);
    });
  });
});
