import { Container } from '../src';

class SomeService {
    constructor(public container?: Container) { }
}

describe('Container', () => {
    it('registers an instance, and then checks and retrieves it', () => {
        const container = new Container();
        const instance1 = new SomeService();
        const instance2 = new SomeService();

        expect(container.has(SomeService)).toBeFalsy();
        expect(container.has('some')).toBeFalsy();

        container.registerInstance(SomeService, instance1);
        container.registerInstance('some', instance2);

        expect(container.has(SomeService)).toBeTruthy();
        expect(container.has('some')).toBeTruthy();

        expect(container.get(SomeService)).toBe(instance1);
        expect(container.get('some')).toBe(instance2);
    });

    it('registers a factory, and then checks and retrieves the instance', () => {
        const container = new Container();
        const instance1 = new SomeService();
        const instance2 = new SomeService();

        expect(container.has(SomeService)).toBeFalsy();
        expect(container.has('some')).toBeFalsy();

        container.registerFactory(SomeService, () => instance1);
        container.registerFactory('some', () => instance2);

        expect(container.has(SomeService)).toBeTruthy();
        expect(container.has('some')).toBeTruthy();

        expect(container.get(SomeService)).toBe(instance1);
        expect(container.get('some')).toBe(instance2);
    });

    it('registers a type, and then checks and retrieves its instance', () => {
        const container = new Container();

        expect(container.has(SomeService)).toBeFalsy();
        expect(container.has('some')).toBeFalsy();

        container.registerType(SomeService);
        container.registerType('some', SomeService);

        expect(container.has(SomeService)).toBeTruthy();
        expect(container.has('some')).toBeTruthy();

        const instance1 = container.get(SomeService);
        const instance2 = container.get('some');

        expect(instance1).toBeInstanceOf(SomeService);
        expect(instance2).toBeInstanceOf(SomeService);
        expect(instance1).not.toBe(instance2);
    });

    it('checks if exists after retrieving', () => {
        const container = new Container();
        const instance = new SomeService();

        container.registerInstance(SomeService, instance);

        expect(container.get(SomeService)).toBe(instance);

        expect(container.has(SomeService)).toBeTruthy();
    });

    it('injects container when creating from type', () => {
        const container = new Container();

        container.registerType(SomeService);
        container.registerType('some', SomeService);

        const instance1 = container.get(SomeService);
        const instance2 = container.get<SomeService>('some');

        expect(instance1).not.toBe(instance2);

        expect(instance1.container).toBe(container);
        expect(instance2.container).toBe(container);
    });

    it('registers and then overrides', () => {
        const container = new Container();

        const instance1 = new SomeService();
        const instance2 = new SomeService();

        container.registerType(SomeService);
        container.registerInstance(SomeService, instance1);
        container.registerFactory(SomeService, () => instance2);

        expect(container.get(SomeService)).toBe(instance2);
    });


    it('registers and retrieves and registers again', () => {
        const container = new Container();

        container.registerType(SomeService);

        container.get(SomeService);

        expect(() => container.registerType(SomeService))
            .toThrow('Container is locked - nothing can be registered!');
    });

    it('registers factory that creates nothing', () => {
        const container = new Container();

        container.registerFactory(SomeService, () => null);

        expect(() => container.get(SomeService))
            .toThrow(`'SomeService' not created!`);
    });

    it('misses', () => {
        const container = new Container();

        expect(() => container.get(SomeService))
            .toThrow(`'SomeService' not registered!`);
    });
});