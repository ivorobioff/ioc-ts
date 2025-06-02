# 🔌 React Hook for `@ivorobioff/ioc-container`

A lightweight React integration for the `@ivorobioff/ioc-container` service locator.

## 📦 Installation

```bash
npm install @ivorobioff/ioc-react
```

## 🎯 What It Does

- Provides a React Context for the Service Locator.
- Exposes the `useService` hook to retrieve registered services inside components.

## 🚀 Quick Start

```ts
// services.ts
import { container } from '@ivorobioff/ioc-react';

export class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

export function registerServices() {
  container.registerType(Logger);
}

```

```tsx
// App.tsx
import React from 'react';
import { ServiceContext, container } from '@ivorobioff/ioc-react';
import MyComponent from './MyComponent';
import { registerServices } from './services';

registerServices();

export default function App() {
  return (
    <ServiceContext.Provider value={container}>
      <MyComponent />
    </ServiceContext.Provider>
  );
}
```

```tsx
// MyComponent.tsx
import { useEffect } from 'react';
import { useService } from '@ivorobioff/ioc-react';
import { Logger } from './services';

export default function MyComponent() {
  const logger = useService(Logger);

  useEffect(() => {
    logger.log('Component mounted');
  }, []);

  return <div>Hello</div>;
}
```

## 🛠️ API

`useService`

Retrieves a service from the current `ServiceContext`.

```ts
useService<T>(reference: InstanceReference<T>): T
```

**Example**

```ts
const logger = useService(Logger);
```

`container`

The singleton container instance used to register services.

**Example**

```ts
import { container } from '@ivorobioff/ioc-react';
container.registerType(MyService);
```

`ServiceContext`

React context for the container. Injected into your app via provider.

```tsx
<ServiceContext.Provider value={container}>
  {/* children */}
</ServiceContext.Provider>

```

## 💡 Best Practice

- Register all services before rendering `<App />`.
- Avoid dynamic registration after the app starts — the container will lock on first `.get()` call.

## 📄 License

MIT