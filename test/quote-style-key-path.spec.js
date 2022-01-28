import { expect } from 'chai';
import { QuoteStyleKeyPath } from '../lib/index.js';

describe('QuoteStyleKeyPath', () => {
  const keyPath = new QuoteStyleKeyPath();

  describe('escape', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(keyPath.escape(key)).to.equal(key);
    });

    it('should be escaped', () => {
      expect(keyPath.escape('')).to.equal("''");
      expect(keyPath.escape('foo.bar')).to.equal("'foo.bar'");
      expect(keyPath.escape('foo bar')).to.equal("'foo bar'");
      expect(keyPath.escape('foo\'bar')).to.equal('"foo\'bar"');
      expect(keyPath.escape('foo"bar')).to.equal("'foo\"bar'");
    });
  });

  describe('unescape', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(keyPath.unescape(key)).to.equal(key);
    });

    it('should be unescaped', () => {
      expect(keyPath.unescape("'foo.bar'")).to.equal('foo.bar');
      expect(keyPath.unescape("'foo bar'")).to.equal('foo bar');
      expect(keyPath.unescape('"foo\'bar"')).to.equal('foo\'bar');
      expect(keyPath.unescape("'foo\"bar'")).to.equal('foo"bar');
    });

    it('should throw Error when key is invalid', () => {
      expect(() => keyPath.unescape("'foo.bar")).to.throw();
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
