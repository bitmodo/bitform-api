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
export abstract class Provider implements Routing.Router {
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

    public abstract group(path: Routing.RoutePath, callback: (router: Routing.Router) => void): Routing.Router;

    public all(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route([Routing.RouteMethod.Get, Routing.RouteMethod.Post, Routing.RouteMethod.Put, Routing.RouteMethod.Delete], path, callback);
    }

    public abstract route(method: Routing.RouteMethod | Routing.RouteMethod[], path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route;

    public get(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Get, path, callback);
    }

    public post(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Post, path, callback);
    }

    public connect(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Connect, path, callback);
    }

    public delete(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Delete, path, callback);
    }

    public head(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Head, path, callback);
    }

    public options(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Options, path, callback);
    }

    public patch(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Patch, path, callback);
    }

    public put(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Put, path, callback);
    }

    public trace(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.Trace, path, callback);
    }
}

/**
 * The routing namespace.
 * This namespace provides all sorts of things related to routing. Everything from abstract requests, responses, and
 * anything else that has to do with routing. Everything in this namespace is highly related to providers, as they
 * are essentially what providers extend.
 */
export namespace Routing {
    /**
     * A route path.
     * This is the path that a route is mounted to.
     *
     * @todo Write format documentation
     */
    export type RoutePath = string;
    /**
     * A route callback.
     * This is the callback which is called when a route is requested.
     *
     * @todo Write documentation on returns
     */
    export type RouteCallback = (req: Request, res: Response) => string | Response | void;

    /**
     * A route method.
     * This is an enumeration for all the different types of supported routing methods.
     *
     * @todo Write documentation on how all of the different methods work
     */
    export enum RouteMethod {
        Get,
        Post,
        Put,
        Delete,

        Head,
        Connect,
        Options,
        Trace,
        Patch,
    }

    /**
     * A generic router.
     * A router is a class that allows for routes to be registered.
     */
    export interface Router {
        group(path: RoutePath, callback: (router: Router) => void): Router;

        all(path: RoutePath, callback: RouteCallback): Route;

        route(method: RouteMethod | RouteMethod[], path: RoutePath, callback: RouteCallback): Route;

        get(path: RoutePath, callback: RouteCallback): Route;

        post(path: RoutePath, callback: RouteCallback): Route;

        put(path: RoutePath, callback: RouteCallback): Route;

        delete(path: RoutePath, callback: RouteCallback): Route;

        head(path: RoutePath, callback: RouteCallback): Route;

        connect(path: RoutePath, callback: RouteCallback): Route;

        options(path: RoutePath, callback: RouteCallback): Route;

        trace(path: RoutePath, callback: RouteCallback): Route;

        patch(path: RoutePath, callback: RouteCallback): Route;
    }

    /**
     * A generic route.
     * A route is an endpoint that can be requested, and when requested will give a response.
     *
     * @todo Finish converting to callbacks
     * @todo Does this need to be abstract?
     */
    export abstract class Route {
        protected readonly _path: RoutePath;

        protected _callbacks: RouteCallbacks;

        // protected constructor(method: RouteMethod, path: RoutePath, callback: RouteCallback) {
        //     this._path      = path;
        //     // this._callbacks = { method: callback };
        // }

        protected constructor(path: RoutePath, callbacks: RouteCallbacks) {
            this._path = path;
            this._callbacks = callbacks;
        }

        // public get methods(): RouteMethod[] {
        //      return this._callbacks;
        // }

        public get path(): RoutePath {
            return this._path;
        }

        // public call(req: Request, res: Response): string | Response | void {
        //     return this._callback(req, res);
        // }
    }

    /**
     * A generic request.
     * A request is message from the user agent which is defining the data that should be gotten.
     *
     * @todo Signed cookies
     */
    export abstract class Request {
        public abstract get body(): string;

        public abstract get cookies(): Cookie[];

        public abstract get hostname(): string;

        public abstract get ip(): string;

        public abstract get method(): RouteMethod;

        public abstract get params(): any;

        public abstract get path(): string;

        public abstract get protocol(): string;

        public abstract get query(): any;

        public get secure(): boolean {
            return this.protocol === 'https';
        }

        public abstract get subdomains(): string[];

        public abstract get url(): string;

        public abstract get xhr(): boolean;

        public abstract accepts(types: string | string[]): boolean;

        public abstract acceptsCharsets(types: string | string[]): boolean;

        public abstract acceptsEncodings(types: string | string[]): boolean;

        public abstract acceptsLanguages(types: string | string[]): boolean;

        public abstract get(field: string): string | undefined;

        public abstract is(type: string): string | boolean;

        public abstract param(name: string, defaultValue?: string): string;
    }

    /**
     * A generic response.
     * A response is the server's message to the user agent which contains the data for the given request.
     */
    export abstract class Response {
        public abstract append(field: string, value?: string | string[]): Response;

        public abstract attachment(filename?: string): Response;

        public abstract cookie(cookie: Cookie): Response;

        public abstract cookie(name: string, value: string, options: CookieOptions): Response;

        public abstract clearCookie(name: string, options: CookieOptions): Response;

        public abstract download(path: string, filename?: string): Response;

        public abstract end(data?: string | Buffer, encoding?: string): Response;

        public abstract format(object: { [key: string]: () => Response | void }): Response;

        public abstract get(field: string): string;

        public abstract json(body?: JSON): Response;

        public abstract jsonp(body?: JSON): Response;

        public abstract links(links: { [key: string]: string }): Response;

        public abstract location(path: string): Response;

        public abstract redirect(status: number, path: string): Response;

        public abstract redirect(path: string): Response;

        public abstract send(body?: string | Buffer | JSON): Response;

        public abstract sendFile(path: string, options: FileOptions): Response;

        public abstract sendStatus(statusCode: number): Response;

        public abstract set(field: string, value?: string): Response;

        public abstract set(fields: { [key: string]: string }): Response;

        public abstract status(code: number): Response;

        public abstract type(type: string): Response;

        public abstract vary(field: string): Response;
    }

    /**
     * A collection of route callbacks.
     * This is simply a group of callbacks that can correspond to a single route. This allows a single path to handle
     * requests depending on the http method being used.
     *
     * @see Route
     * @see RouteMethod
     */
    export interface RouteCallbacks {
        get?: RouteCallback;
        post?: RouteCallback;
        put?: RouteCallback;
        delete?: RouteCallback;

        head?: RouteCallback;
        connect?: RouteCallback;
        options?: RouteCallback;
        trace?: RouteCallback;
        patch?: RouteCallback;
    }

    /**
     * A cookie.
     * A cookie is a piece of data that the user agent stores and includes for every request. This allows data to be
     * persistent across multiple requests without having to save it on the server.
     *
     * @see CookieOptions
     */
    export interface Cookie extends CookieOptions {
        name: string;
        value: string;
    }

    /**
     * Cookie options.
     * These are the actual options for a cookie. These define how the cookie should be saved and how they behave.
     */
    export interface CookieOptions {
        domain?: string;
        encode?: () => void;
        expires?: Date;
        httpOnly?: boolean;
        maxAge?: number;
        path?: string;
        secure?: boolean;
        signed?: boolean;
        sameSite?: boolean | string;
    }

    /**
     * File options.
     * These are options that can be passed when sending a file. They define how the file should be handled by the user
     * agent.
     *
     * @see Response.sendFile
     */
    export interface FileOptions {
        maxAge?: number;
        root?: string;
        lastModified?: Date | false;
        headers?: { [key: string]: string };
        dotfiles?: DotfilesOption;
        acceptRanges?: boolean;
        cacheControl?: boolean;
        immutable?: boolean;
    }

    /**
     * How to handle dotfiles.
     *
     * @todo Add more documentation - I don't actually know why this is used
     */
    export enum DotfilesOption {
        Allow,
        Deny,
        Ignore
    }
}
