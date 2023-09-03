import { describe, it, expect } from 'vitest';
import { EscapeDotStyleKeyPath } from '../lib/index.js';

describe('EscapeDotStyleKeyPath', () => {
  const keyPath = new EscapeDotStyleKeyPath();

  describe('encode', () => {
    it('nothing changed', () => {
      expect(keyPath.encode('foobar')).toBe('foobar');
      expect(keyPath.encode('foo bar')).toBe('foo bar');
    });

    it('should be encoded', () => {
      expect(keyPath.encode('foo.bar')).toBe('foo\\.bar');
      expect(keyPath.encode('foo[0]')).toBe('foo\\[0]');
      expect(keyPath.encode('\\')).toBe('\\\\');
      expect(keyPath.encode('\\.')).toBe('\\\\\\.');
    });
  });

  describe('decode', () => {
    it('nothing changed', () => {
      expect(keyPath.decode('foobar')).toBe('foobar');
      expect(keyPath.decode('foo bar')).toBe('foo bar');
    });

    it('should be decoded', () => {
      expect(keyPath.decode('foo\\.bar')).toBe('foo.bar');
      expect(keyPath.decode('foo\\[0]')).toBe('foo[0]');
      expect(keyPath.decode('\\\\')).toBe('\\');
      expect(keyPath.decode('\\\\\\.')).toBe('\\.');
    });
  });

  describe('parse', () => {
    it('basic', () => {
      // eslint-disable-next-line quotes
      const key = `users[0].user \\. data.user ' name.first " name`;
      expect(keyPath.parse(key)).toEqual([
        'users',
        0,
        'user . data',
        'user \' name',
        'first " name'
      ]);

      expect(keyPath.parse('foo.')).toEqual(['foo', '']);
      expect(keyPath.parse('foo.\\')).toEqual(['foo', '\\']);
      expect(keyPath.parse('\\foo')).toEqual(['\\foo']);
      expect(keyPath.parse('\\[[0]')).toEqual(['[', 0]);
      expect(keyPath.parse('[0][0]')).toEqual([0, 0]);
    });

    it('empty string', () => {
      expect(keyPath.parse('')).toEqual(['']);
    });

    it('array', () => {
      expect(keyPath.parse('[0]')).toEqual([0]);
      expect(keyPath.parse('\\\\[0]')).toEqual(['\\', 0]);
    });

    it('invalid key', () => {
      expect(() => keyPath.parse('[[0]')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[0]]')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('foo[')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[0]foo')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[foo]')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[.]')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[\\]')).toThrowError(/^Invalid key/);
      expect(() => keyPath.parse('[0]\\')).toThrowError(/^Invalid key/);
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
      expect(keyPath.stringify(path)).toBe(`users[0].user \\. data.user ' name.first " name`);
    });
  });
});
