# 🧩 IoC Container

A minimalistic, fast, zero-dependency service locator / dependency injection container for TypeScript projects.

## Features

✨ Features
- Register instances, classes, or factories
- Lazy instantiation
- Container locks on first `get` to prevent mutations
- No decorators, no reflection, no magic
- Fully typed API

## 📦 Installation

```bash
npm install @ivorobioff/ioc-container
```

Or using Yarn:

```bash
yarn add @ivorobioff/ioc-container
```

## 🚀 Usage

```ts
import { Container } from '@ivorobioff/ioc-container';

class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

class SomeService {
  private logger: Logger;
  private appId: string;

  constructor(container: Container) {
    this.logger = container.get(Logger);
    this.appId = container.get('appId');
  }

  doSomething() {
    this.logger.log(`AppId=${this.appId}`);
  }
}

const container = new Container();

container.registerType(Logger);
container.registerFactory('appId', () => crypto.randomUUID());
container.registerType(SomeService);

const myService = container.get(SomeService);
myService.doSomething();

```

## 🛠️ API

`registerInstance`
Registers an existing instance or value.

```ts
registerInstance<T>(reference: InstanceReference<T>, instance: T): void
```
**Example**
```ts
container.registerInstance('config', { debug: true });
```

`registerType`
Registers a class constructor to be instantiated later. Accepts either the class itself or a custom string alias.

```ts
registerType<T>(type: InstanceType<T>): void

registerType<T>(reference: string, type: InstanceType<T>): void
```
**Example**
```ts
container.registerType(Logger);
container.registerType('myService', SomeService);
```

`registerFactory`
Registers a factory function to create the instance when needed.

```ts
registerFactory<T>(reference: InstanceReference<T>, factory: InstanceFactory<T>): void
```

**Example**
```ts
container.registerFactory('appId', () => crypto.randomUUID());
```
`get`
Retrieves a service, instantiating it if necessary.

```ts
get<T>(reference: InstanceReference<T>): T
```
**Example**
```ts
const logger = container.get(Logger);
```
`has`
Checks if a service is registered.

```ts
has(reference: InstanceReference<unknown>): boolean
```

**Example**
```ts
if (container.has('config')) {
  // ...
}
```

## 🔒 Container Locking

Once `.get()` is called, the container **locks**, disallowing any further registrations. This helps catch mistakes early in runtime.

Trying to register after locking throws a `LockedError`.

```ts
container.get('something'); // locks the container

container.registerInstance('foo', {}); // throws LockedError
```

## 📄 License

MIT