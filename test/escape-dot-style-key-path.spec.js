import { expect } from 'chai';
import { EscapeDotStyleKeyPath } from '../lib/index.js';

describe('EscapeDotStyleKeyPath', () => {
  const keyPath = new EscapeDotStyleKeyPath();

  describe('encode', () => {
    it('nothing changed', () => {
      expect(keyPath.encode('foobar')).to.equal('foobar');
      expect(keyPath.encode('foo bar')).to.equal('foo bar');
    });

    it('should be encoded', () => {
      expect(keyPath.encode('foo.bar')).to.equal('foo\\.bar');
      expect(keyPath.encode('foo[0]')).to.equal('foo\\[0]');
      expect(keyPath.encode('\\')).to.equal('\\\\');
      expect(keyPath.encode('\\.')).to.equal('\\\\\\.');
    });
  });

  describe('decode', () => {
    it('nothing changed', () => {
      expect(keyPath.decode('foobar')).to.equal('foobar');
      expect(keyPath.decode('foo bar')).to.equal('foo bar');
    });

    it('should be decoded', () => {
      expect(keyPath.decode('foo\\.bar')).to.equal('foo.bar');
      expect(keyPath.decode('foo\\[0]')).to.equal('foo[0]');
      expect(keyPath.decode('\\\\')).to.equal('\\');
      expect(keyPath.decode('\\\\\\.')).to.equal('\\.');
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
      expect(() => keyPath.parse('[0]]')).to.throw(/^Invalid key/);
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
