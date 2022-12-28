import { EscapeDotStyleKeyPath, QuoteStyleKeyPath } from './key-path/index.js';
import { ObjectValue } from './object-value.js';
import { ObjectPath } from './object-path.js';

const quoteStyleKeyPath = new QuoteStyleKeyPath();
const escapeDotStyleKeyPath = new EscapeDotStyleKeyPath();
const objectValue = new ObjectValue();

const quoteStyleObjectPath = new ObjectPath({ keyPath: quoteStyleKeyPath, objectValue });
const escapeDotStyleObjectPath = new ObjectPath({ keyPath: escapeDotStyleKeyPath, objectValue });

ObjectPath.objectValue = objectValue;
ObjectPath.quoteStyle = quoteStyleObjectPath;
ObjectPath.escapeDotStyle = escapeDotStyleObjectPath;

['get', 'set', 'del', 'has'].forEach((method) => {
  ObjectPath[method] = (...args) => escapeDotStyleObjectPath[method](...args);
});

export {
  EscapeDotStyleKeyPath,
  QuoteStyleKeyPath,
  ObjectValue,
  ObjectPath
};
