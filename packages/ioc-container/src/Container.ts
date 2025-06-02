export type InstanceType<T> = { new(container: Container): T };
export type InstanceFactory<T> = (container: Container) => T;
export type InstanceReference<T> = string | InstanceType<T>;

function makeAlias(reference: InstanceReference<unknown> | InstanceType<unknown>): string {
  if (typeof reference === 'string') {
    return reference;
  }

  return reference.name;
}


export class LockedError extends Error {
  constructor() {
    super('Container is locked - nothing can be registered!')
  }
}

export class Container {

  private locked = false;

  private instances = new Map<string, unknown>();

  private factories = new Map<string, InstanceFactory<unknown>>();

  registerInstance<T>(reference: InstanceReference<T>, instance: T) {

    if (this.locked) {
      throw new LockedError();
    }

    this.factories.set(makeAlias(reference), () => instance);
  }

  registerType<T>(reference: string, type: InstanceType<T>): void;
  registerType<T>(reference: InstanceType<T>): void;

  registerType<T>(reference: string | InstanceType<T>, type?: InstanceType<T>) {

    if (this.locked) {
      throw new LockedError();
    }

    if (typeof reference === 'string') {
      this.factories.set(reference, (c) => new type!(c));
    } else {
      this.factories.set(makeAlias(reference), (c) => new reference(c));
    }
  }

  registerFactory<T>(reference: InstanceReference<T>, factory: InstanceFactory<T>) {

    if (this.locked) {
      throw new LockedError();
    }

    this.factories.set(makeAlias(reference), factory);
  }

  get<T>(reference: InstanceReference<T>): T {

    this.locked = true;

    const alias = makeAlias(reference);

    if (!this.instances.has(alias)) {

      const factory = this.factories.get(alias);

      if (!factory) {
        throw new Error(`'${alias}' not registered!`);
      }

      const instance = factory(this);

      if (instance === null || typeof instance === 'undefined') {
        throw new Error(`'${alias}' not created!`);
      }

      this.instances.set(alias, instance);

      this.factories.delete(alias);
    }

    return this.instances.get(alias) as T;
  }

  has(reference: InstanceReference<unknown>): boolean {

    const alias = makeAlias(reference);

    return this.instances.has(alias) || this.factories.has(alias);
  }
}