/* eslint-disable no-unused-vars */
export * from './provider';
export * from './module';
export * from './storage';

import { Provider } from './provider';
import { Module }   from './module';
import { Storage }  from './storage';

/**
 * The configuration for a Pib instance.
 */
export interface Config {
    provideApis?: boolean;
}

const defaultConfig: Config = {};

/**
 * An instance of Pib.
 * This is the main entry point of Pib. Using this, you can specify different providers, modules, and whatever
 * else you might want to use.
 */
export default abstract class Pib {
    protected _config: Config;

    protected _modules: Module[] = [];

    protected constructor(config?: Config) {
        this._config = config || defaultConfig;
    }

    public get config(): Config {
        return this._config;
    }

    public get modules(): Module[] {
        return this._modules;
    }

    public abstract use(usable: Module | Provider | Storage.Provider): Pib;
}
