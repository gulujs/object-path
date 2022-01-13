import { expect } from 'chai';
import { ObjectPath } from './index.js';

describe('ObjectPath', () => {
  describe('escape', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(ObjectPath.escape(key)).to.equal(key);
    });

    it('should be escaped', () => {
      expect(ObjectPath.escape('foo.bar')).to.equal("'foo.bar'");
      expect(ObjectPath.escape('foo bar')).to.equal("'foo bar'");
      expect(ObjectPath.escape('foo\'bar')).to.equal('"foo\'bar"');
      expect(ObjectPath.escape('foo"bar')).to.equal("'foo\"bar'");
    });
  });

  describe('unescape', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(ObjectPath.unescape(key)).to.equal(key);
    });

    it('should be unescaped', () => {
      expect(ObjectPath.unescape("'foo.bar'")).to.equal('foo.bar');
      expect(ObjectPath.unescape("'foo bar'")).to.equal('foo bar');
      expect(ObjectPath.unescape('"foo\'bar"')).to.equal('foo\'bar');
      expect(ObjectPath.unescape("'foo\"bar'")).to.equal('foo"bar');
    });

    it('should throw Error when key is invalid', () => {
      expect(() => ObjectPath.unescape("'foo.bar")).to.throw();
    });
  });

  describe('parseKey', () => {
    it('basic', () => {
      // eslint-disable-next-line quotes
      const key = `users[0].'user . data'."user ' name".'first " name'`;
      expect(ObjectPath.parseKey(key)).to.deep.equal([
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ]);
    });

    it('empty string', () => {
      expect(ObjectPath.parseKey('')).to.deep.equal(['']);
    });

    it('invalid key 1', () => {
      const key = 'foo . bar';
      expect(() => ObjectPath.parseKey(key)).to.throw();
    });

    it('invalid key 2', () => {
      const key = 'foo.bar.';
      expect(() => ObjectPath.parseKey(key)).to.throw();
    });
  });

  describe('stringifyKey', () => {
    it('basic', () => {
      const path = [
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ];
      // eslint-disable-next-line quotes
      expect(ObjectPath.stringifyKey(path)).to.equal(`users[0].'user . data'."user ' name".'first " name'`);
    });
  });
});
