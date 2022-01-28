import { expect } from 'chai';
import { EscapeDotStyleKeyPath } from '../lib/index.js';

describe('EscapeDotStyleKeyPath', () => {
  const keyPath = new EscapeDotStyleKeyPath();

  describe('escape', () => {
    it('nothing changed', () => {
      expect(keyPath.escape('foobar')).to.equal('foobar');
      expect(keyPath.escape('foo bar')).to.equal('foo bar');
    });

    it('should be escaped', () => {
      expect(keyPath.escape('foo.bar')).to.equal('foo\\.bar');
      expect(keyPath.escape('foo[0]')).to.equal('foo\\[0]');
      expect(keyPath.escape('\\')).to.equal('\\\\');
      expect(keyPath.escape('\\.')).to.equal('\\\\\\.');
    });
  });

  describe('unescape', () => {
    it('nothing changed', () => {
      expect(keyPath.unescape('foobar')).to.equal('foobar');
      expect(keyPath.unescape('foo bar')).to.equal('foo bar');
    });

    it('should be unescaped', () => {
      expect(keyPath.unescape('foo\\.bar')).to.equal('foo.bar');
      expect(keyPath.unescape('foo\\[0]')).to.equal('foo[0]');
      expect(keyPath.unescape('\\\\')).to.equal('\\');
      expect(keyPath.unescape('\\\\\\.')).to.equal('\\.');
    });
  });

  describe('parse', () => {
    it('basic', () => {
      // eslint-disable-next-line quotes
      const key = `users[0].user \\. data.user ' name.first " name`;
      expect(keyPath.parse(key)).to.deep.equal([
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ]);

      expect(keyPath.parse('foo.')).to.deep.equal(['foo', '']);
      expect(keyPath.parse('foo.\\')).to.deep.equal(['foo', '\\']);
      expect(keyPath.parse('\\foo')).to.deep.equal(['\\foo']);
      expect(keyPath.parse('\\[[0]')).to.deep.equal(['[', 0]);
      expect(keyPath.parse('[0][0]')).to.deep.equal([0, 0]);
    });

    it('empty string', () => {
      expect(keyPath.parse('')).to.deep.equal(['']);
    });

    it('array', () => {
      expect(keyPath.parse('[0]')).to.deep.equal([0]);
      expect(keyPath.parse('\\\\[0]')).to.deep.equal(['\\', 0]);
    });

    it('invalid key', () => {
      expect(() => keyPath.parse('[[0]')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('foo[')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('[0]foo')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('[foo]')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('[.]')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('[\\]')).to.throw(/^Invalid key/);
      expect(() => keyPath.parse('[0]\\')).to.throw(/^Invalid key/);
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
      expect(keyPath.stringify(path)).to.equal(`users[0].user \\. data.user ' name.first " name`);
    });
  });
});
