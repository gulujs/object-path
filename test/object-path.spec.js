import { describe, it, expect } from 'vitest';
import { ObjectPath } from '../lib/index.js';

describe('ObjectPath', () => {
  it('get', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.get(obj, 'foo.bar')).toBe('123');
    expect(ObjectPath.get(obj, ['foo', 'bar'])).toBe('123');
    expect(ObjectPath.get(obj, 'foo.bar[1]')).toBe('2');
    expect(ObjectPath.get(obj, 'baz[1]')).toBe(2);
    expect(() => ObjectPath.get(obj, {})).toThrowError('The key is invalid');

    expect(ObjectPath.get({}, '__proto__')).toBeUndefined();
  });

  it('set', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.set(obj, 'foo.bar', '456')).toBe(true);
    expect(obj.foo.bar).toBe('456');

    expect(ObjectPath.set(obj, ['foo', 'bar'], '789')).toBe(true);
    expect(obj.foo.bar).toBe('789');

    expect(ObjectPath.set(obj, 'baz[1]', 4)).toBe(true);
    expect(obj.baz[1]).toBe(4);

    expect(ObjectPath.set(obj, 'foo.cat', 'hi')).toBe(true);
    expect(obj.foo.cat).toBe('hi');

    expect(ObjectPath.set(obj, 'foo.dog.mouse', 'hi')).toBe(true);
    expect(obj.foo.dog.mouse).toBe('hi');

    expect(ObjectPath.set(obj, 'foo.cows[0].eye', 'hi')).toBe(true);
    expect(obj.foo.cows[0].eye).toBe('hi');

    expect(ObjectPath.set(1, 'a', 1)).toBe(false);

    expect(() => ObjectPath.set(obj, {}, null)).toThrowError('The key is invalid');

    expect(ObjectPath.set({}, '__proto__', null)).toBe(false);
  });

  it('del', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.del(obj, 'foo.bar')).toBe(true);
    expect(ObjectPath.del(obj, ['foo', 'bar'])).toBe(true);
    expect(obj.foo).not.toHaveProperty('bar');

    expect(ObjectPath.del(obj, 'foo.dog.mouse')).toBe(false);

    expect(() => ObjectPath.del(obj, {})).toThrowError('The key is invalid');

    expect(ObjectPath.del({}, '__proto__')).toBe(false);
  });

  it('has', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.has(obj, 'foo.bar')).toBe(true);
    expect(ObjectPath.has(obj, ['foo', 'bar'])).toBe(true);
    expect(ObjectPath.has(obj, 'foo.cat')).toBe(false);
    expect(ObjectPath.has(obj, [])).toBe(false);

    expect(() => ObjectPath.has(obj, {})).toThrowError('The key is invalid');

    expect(ObjectPath.has({}, '__proto__')).toBe(false);
  });
});
