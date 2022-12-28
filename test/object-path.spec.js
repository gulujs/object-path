import { expect } from 'chai';
import { ObjectPath } from '../lib/index.js';

describe('ObjectPath', () => {
  it('get', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.get(obj, 'foo.bar')).to.equal('123');
    expect(ObjectPath.get(obj, ['foo', 'bar'])).to.equal('123');
    expect(ObjectPath.get(obj, 'foo.bar[1]')).to.equal('2');
    expect(ObjectPath.get(obj, 'baz[1]')).to.equal(2);
    expect(() => ObjectPath.get(obj, {})).to.throw('The key is invalid');

    expect(ObjectPath.get({}, '__proto__')).to.be.undefined;
  });

  it('set', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.set(obj, 'foo.bar', '456')).to.be.true;
    expect(obj.foo.bar).to.equal('456');

    expect(ObjectPath.set(obj, ['foo', 'bar'], '789')).to.be.true;
    expect(obj.foo.bar).to.equal('789');

    expect(ObjectPath.set(obj, 'baz[1]', 4)).to.be.true;
    expect(obj.baz[1]).to.equal(4);

    expect(ObjectPath.set(obj, 'foo.cat', 'hi')).to.be.true;
    expect(obj.foo.cat).to.equal('hi');

    expect(ObjectPath.set(obj, 'foo.dog.mouse', 'hi')).to.be.true;
    expect(obj.foo.dog.mouse).to.equal('hi');

    expect(ObjectPath.set(obj, 'foo.cows[0].eye', 'hi')).to.be.true;
    expect(obj.foo.cows[0].eye).to.equal('hi');

    expect(ObjectPath.set(1, 'a', 1)).to.be.false;

    expect(() => ObjectPath.set(obj, {}, null)).to.throw('The key is invalid');

    expect(ObjectPath.set({}, '__proto__', null)).to.be.false;
  });

  it('del', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.del(obj, 'foo.bar')).to.be.true;
    expect(ObjectPath.del(obj, ['foo', 'bar'])).to.be.true;
    expect(obj.foo).to.not.have.own.property('bar');

    expect(ObjectPath.del(obj, 'foo.dog.mouse')).to.be.false;

    expect(() => ObjectPath.del(obj, {})).to.throw('The key is invalid');

    expect(ObjectPath.del({}, '__proto__')).to.be.false;
  });

  it('has', () => {
    const obj = {
      foo: {
        bar: '123'
      },
      baz: [1, 2, 3]
    };

    expect(ObjectPath.has(obj, 'foo.bar')).to.be.true;
    expect(ObjectPath.has(obj, ['foo', 'bar'])).to.be.true;
    expect(ObjectPath.has(obj, 'foo.cat')).to.be.false;
    expect(ObjectPath.has(obj, [])).to.be.false;

    expect(() => ObjectPath.has(obj, {})).to.throw('The key is invalid');

    expect(ObjectPath.has({}, '__proto__')).to.be.false;
  });
});
