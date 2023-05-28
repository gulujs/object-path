# @gulujs/object-path

## Installation

```sh
npm install @gulujs/object-path
```

## Usage

```js
import { ObjectPath } from '@gulujs/object-path';

const obj = { foo: [{ bar: 'Hello' }] };

/**
 * default is `escapeDotStyle`
 * `quoteStyle` can access by `ObjectPath.quoteStyle.get('obj', 'foo[0].bar')`
 */
console.log(ObjectPath.get(obj, 'foo[0].bar')); // 'Hello'

ObjectPath.set(obj, 'baz', 'world');
console.log(obj); // { foo: [{ bar: 'Hello' }], baz: 'world' }

ObjectPath.del(obj, 'foo[0].bar');
console.log(obj); // { foo: [{}], baz: 'world' }

console.log(ObjectPath.has(obj, 'foo[0].bar')); // false
console.log(ObjectPath.has(obj, 'foo')); // true

let path = ObjectPath.escapeDotStyle.keyPath.parse('users[0].user\\.name');
console.log(path); // ['users', 0, 'user.name']

let key = ObjectPath.escapeDotStyle.keyPath.stringify(path);
console.log(key); // 'users[0].user\\.name'

path = ObjectPath.quoteStyle.keyPath.parse(`users[0].'user name'`);
console.log(path); // ['users', 0, 'user name']

key = ObjectPath.quoteStyle.keyPath.stringify(path);
console.log(key); // `users[0].'user name'`
```

- Quote style is implemented base on [TOML Keys](https://toml.io/en/v1.0.0#keys)

## License

[MIT](LICENSE)
