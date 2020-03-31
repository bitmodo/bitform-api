/**
 * The configuration for a provider.
 */
export interface ProviderConfig {
    host?: string;
    port?: number;
}

/**
 * The default hostname.
 */
export const defaultHost = 'localhost';
/**
 * The default port.
 */
export const defaultPort = 80;

/**
 * A backend provider for Pib.
 * This is an abstract implementation of a Pib provider. The provider should allow Pib to create endpoints on a
 * web server.
 *
 * The provider should be able to receive a config. This will tell the provider how to function and expose different
 * things such as the host and port.
 *
 * @abstract
 * @class
 * @see ProviderConfig
 */
export abstract class Provider {
    protected _config: ProviderConfig;

    protected constructor(config?: ProviderConfig) {
        this._config = config || { host: defaultHost, port: defaultPort };
    }

    public get host(): string {
        return this._config.host || defaultHost;
    }

    public get port(): number {
        return this._config.port || defaultPort;
    }

    public abstract get(path: string): void;
}

/**
 *
 */
export namespace Provider {
    /**
     *
     */
    export type RoutePath = string;
    /**
     *
     */
    export type RouteCallback = (req: Request, res: Response) => void;

    /**
     *
     */
    export abstract class Route {
        protected readonly _path: RoutePath;

        protected readonly _callback: RouteCallback;

        protected constructor(path: RoutePath, callback: RouteCallback) {
            this._path = path;
            this._callback = callback;
        }

        public get path(): RoutePath {
            return this._path;
        }
    }

    /**
     *
     */
    export abstract class Request {

    }

    /**
     *
     */
    export abstract class Response {

    }
}
