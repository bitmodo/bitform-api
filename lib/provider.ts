import routing = require('./routing');

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
 */
export abstract class Provider implements routing.Router {
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

    public abstract start(): never;

    public abstract group(path: routing.RoutePath, callback: (router: routing.Router) => void): routing.Router;

    public all(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route([routing.RouteMethod.get, routing.RouteMethod.post, routing.RouteMethod.put, routing.RouteMethod.delete], path, callback);
    }

    public abstract route(method: routing.RouteMethod | routing.RouteMethod[], path: routing.RoutePath, callback: routing.RouteCallback): routing.Route;

    public get(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.get, path, callback);
    }

    public post(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.post, path, callback);
    }

    public connect(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.connect, path, callback);
    }

    public delete(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.delete, path, callback);
    }

    public head(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.head, path, callback);
    }

    public options(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.options, path, callback);
    }

    public patch(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.patch, path, callback);
    }

    public put(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.put, path, callback);
    }

    public trace(path: routing.RoutePath, callback: routing.RouteCallback): routing.Route {
        return this.route(routing.RouteMethod.trace, path, callback);
    }
}
