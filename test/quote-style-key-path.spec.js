import { describe, it, expect } from 'vitest';
import { QuoteStyleKeyPath } from '../lib/index.js';

describe('QuoteStyleKeyPath', () => {
  const keyPath = new QuoteStyleKeyPath();

  describe('encode', () => {
    it('nothing changed', () => {
      const key = 'foobar';
      expect(keyPath.encode(key)).toBe(key);
    });

    it('should be encoded', () => {
      expect(keyPath.encode('')).toBe("''");
      expect(keyPath.encode('foo.bar')).toBe("'foo.bar'");
      expect(keyPath.encode('foo bar')).toBe("'foo bar'");
      expect(keyPath.encode('foo\'bar')).toBe('"foo\'bar"');
      expect(keyPath.encode('foo"bar')).toBe("'foo\"bar'");
    });

    it('should encode control characters', () => {
      expect(keyPath.encode(`${String.fromCodePoint(0)}\n"\\${String.fromCodePoint(0x1F)}`)).toBe('"\\u0000\\n\\"\\\\\\u001F"');
    });
  });

  describe('decode', () => {
    it('nothing changed', () => {
      expect(keyPath.decode('foobar')).toBe('foobar');
      expect(keyPath.decode("'foo.bar")).toBe("'foo.bar");
    });

    it('should be decoded', () => {
      expect(keyPath.decode("'foo.bar'")).toBe('foo.bar');
      expect(keyPath.decode("'foo bar'")).toBe('foo bar');
      expect(keyPath.decode('"foo\'bar"')).toBe('foo\'bar');
      expect(keyPath.decode("'foo\"bar'")).toBe('foo"bar');
    });

    it('should decode control characters', () => {
      expect(keyPath.decode('"\\u0000\\n\\"\\\\\\u001F"')).toBe(`${String.fromCodePoint(0)}\n"\\${String.fromCodePoint(0x1F)}`);
    });

    it('should decode Unicode character', () => {
      expect(keyPath.decode('"\u261D\\U0001F601"')).toBe('☝😁');
    });
  });

  describe('parse', () => {
    it('basic', () => {
      // eslint-disable-next-line quotes
      const key = `users[0].'user . data'."user ' name".'first " name'`;
      expect(keyPath.parse(key)).toEqual([
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ]);
    });

    it('invalid key', () => {
      expect(() => keyPath.parse('')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('foo . bar')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('foo.bar.')).toThrowError(/^Invalid key/);
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
      expect(keyPath.stringify(path)).toBe(`users[0].'user . data'."user ' name".'first " name'`);
    });
  });
});
