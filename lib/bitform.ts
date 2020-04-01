import { Provider } from './provider';
import { Module }   from './module';
import { Storage }  from './storage';

/**
 * The configuration for a Bitform instance.
 */
export interface Config {
    provideApis?: boolean;
}

const defaultConfig: Config = {};

type Usable = Module | Provider | Storage.Provider;

/**
 * An instance of Bitform.
 * This is the main entry point of Bitform. Using this, you can specify different providers, modules, and whatever
 * else you might want to use.
 */
export default abstract class Bitform {
    protected _config: Config;

    protected _provider?: Provider          = undefined;
    protected _modules: Module[]            = [];
    protected _storages: Storage.Provider[] = [];

    protected constructor(config?: Config) {
        this._config = config || defaultConfig;
    }

    public get config(): Config {
        return this._config;
    }

    public get modules(): Module[] {
        return this._modules;
    }

    public use(usable: Usable): Bitform {
        if (usable instanceof Module) {
            this._modules = this._modules.concat(usable);
        } else if (usable instanceof Provider) {
            this._provider = usable;
        } else {
            this._storages = this._storages.concat(usable);
        }

        return this;
    }

    public run(): void {
        if (!this._provider) {
            throw new Error('No provider was set');
        }

        this.prepare();

        this._provider.start();
    }

    protected prepare(): void {
        if (!this._provider) {
            throw new Error('No provider was set');
        }

        for (let storage of this._storages) {
            storage.setup();
        }

        for (let module of this._modules) {
            module.load();
        }

        for (let module of this._modules) {
            module.prepare(this._provider);
        }
    }
}
