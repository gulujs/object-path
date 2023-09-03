import { EscapeDotStyleKeyPath, QuoteStyleKeyPath } from './key-path/index.js';
import { ObjectPath } from './object-path.js';

const quoteStyleKeyPath = new QuoteStyleKeyPath();
const escapeDotStyleKeyPath = new EscapeDotStyleKeyPath();

const quoteStyleObjectPath = new ObjectPath({ keyPath: quoteStyleKeyPath });
const escapeDotStyleObjectPath = new ObjectPath({ keyPath: escapeDotStyleKeyPath });

ObjectPath.quoteStyle = quoteStyleObjectPath;
ObjectPath.escapeDotStyle = escapeDotStyleObjectPath;

['get', 'set', 'del', 'has'].forEach((method) => {
  ObjectPath[method] = (...args) => escapeDotStyleObjectPath[method](...args);
});

export {
  EscapeDotStyleKeyPath,
  QuoteStyleKeyPath,
  ObjectPath
};
