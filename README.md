# @lunjs/object-path

## Installation

```sh
npm install @lunjs/object-path
```

## Usage

```js
import { ObjectPath } from '@lunjs/object-path';

const path = ObjectPath.parseKey(`users[0].'user name'`);
console.log(path); // ['users', 0, 'user name']

const key = ObjectPath.stringifyKey(path);
console.log(key); // users[0].'user name'
```

## License

[MIT](LICENSE)
