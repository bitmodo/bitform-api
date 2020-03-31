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
     * @todo Add more clear and specific documentation to everything
     * @todo Stale/fresh properties?
     * @todo Create parent type for Request & Response?
     */
    export abstract class Request {
        /**
         * Data submitted in the request body.
         * This is any data submitted in the request body. By default it is undefined. If there is any data, it will be
         * parsed and converted into data types that are usable. The default supported types are JSON and urlencoded
         * data.
         *
         * @see JSON
         */
        public abstract get body(): JSON | string | undefined;

        /**
         * Cookies sent by the request.
         * These are any of the cookies sent in the request. The cookies are parsed and converted into `Cookie` objects
         * which can then be used. If there are no cookies, it will default to an empty array.
         *
         * @see Cookie
         */
        public abstract get cookies(): Cookie[];

        /**
         * The hostname of the request.
         * This is the hostname derived by the `Host` HTTP header.
         */
        public abstract get hostname(): string;

        /**
         * The IP address of the request.
         * This contains the remote IP address of the request.
         */
        public abstract get ip(): string;

        /**
         * The method of the request.
         * This corresponds to a `RouteMethod` that is specified by the request.
         *
         * @see RouteMethod
         */
        public abstract get method(): RouteMethod;

        /**
         * The mapped parameter properties.
         * These are route parameters that have been mapped to properties. This allows you to get the parameters in a
         * route path so that you can use them when handling the request.
         *
         * @see RoutePath
         */
        public abstract get params(): any;

        /**
         * The path part of the URL.
         * This will return the path portion of the URL. This will be the actual path that is requested, rather than
         * the route path.
         */
        public abstract get path(): string;

        /**
         * The request protocol.
         * This is the protocol that is being used for the request. It is either HTTP or HTTPS.
         *
         * @see RouteProtocol
         */
        public abstract get protocol(): RouteProtocol;

        /**
         * An object containing the query parameters.
         * This is an object containing the mapped query parameters in the URL. That is everything after the `?` in the
         * URL will be mapped to an object and returned here.
         */
        public abstract get query(): any;

        /**
         * If a TLS connection is established.
         * This is a boolean property that is true if a TLS connection is established. It is equivalent to comparing
         * the protocol to see if it is HTTPS.
         *
         * @see protocol
         */
        public get secure(): boolean {
            return this.protocol === RouteProtocol.HTTPS;
        }

        /**
         * Subdomains in the domain.
         * This is an array of subdomains in the domain name of the request.
         */
        public abstract get subdomains(): string[];

        /**
         * The full URL of the request.
         * This is the full URL of the request. It is all of the different components pieced together.
         */
        public abstract get url(): string;

        /**
         * If the request was from `XMLHttpRequest`.
         * This is a boolean property indicating if the `X-Requested-With` header field is equal to `XMLHttpRequest`.
         * This indicates if the request was initiated by a client library such as jQuery.
         */
        public abstract get xhr(): boolean;

        /**
         * Check if the content type is acceptable.
         * This will check if the specified content type(s) are acceptable based on the request's `Accept` HTTP header.
         * The method returns the best match, or `false` if none of the content types are acceptable (in which case
         * the application should respond with 406).
         *
         * @param types The type(s) of content to check
         * @returns The best content type match or false
         */
        public abstract accepts(types: string | string[]): string | false;

        /**
         * Get the first acceptable charset.
         * This will go through the list of charsets specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @param charsets The charset(s) to check
         * @returns The first charset that is acceptable or false
         */
        public abstract acceptsCharsets(charsets: string | string[]): string | false;

        /**
         * Get the first acceptable encoding.
         * This will go through the list of encodings specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @param encodings The encoding(s) to check
         * @returns The first encoding that is acceptable or false
         */
        public abstract acceptsEncodings(encodings: string | string[]): string | false;

        /**
         * Get the first acceptable language.
         * This will go through the list of encodings specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @param langs The language(s) to check
         * @returns The first language that is acceptable or false
         */
        public abstract acceptsLanguages(langs: string | string[]): string | false;

        /**
         * Get an HTTP header.
         * This will get the specified HTTP request header field and return it. If the field is not found, undefined is
         * returned.
         *
         * @param field The field to get
         * @returns The value of the field or undefined
         */
        public abstract get(field: string): string | undefined;

        /**
         * Check if the content type matches.
         * This will return the matching content type if the request's `Content-Type` HTTP header matches the MIME type
         * specified. If the request has no body, `null` is returned. Otherwise, `false` is returned.
         *
         * @param type The content type to check
         * @returns The matching content type, false, or null
         */
        public abstract is(type: string): string | false | null;
    }

    /**
     * A generic response.
     * A response is the server's message to the user agent which contains the data for the given request.
     *
     * @todo Give example of how to chain methods
     * @todo Create HTTP status code enum?
     */
    export abstract class Response {
        /**
         *
         * @param field
         * @param value
         * @returns
         */
        public abstract append(field: string, value?: string | string[]): Response;

        /**
         *
         * @param filename
         * @returns
         */
        public abstract attachment(filename?: string): Response;

        /**
         *
         * @param cookie
         * @returns
         */
        public abstract cookie(cookie: Cookie): Response;

        /**
         *
         * @param name
         * @param value
         * @param options
         * @returns
         */
        public abstract cookie(name: string, value: string, options: CookieOptions): Response;

        /**
         *
         * @param name
         * @param options
         * @returns
         */
        public abstract clearCookie(name: string, options: CookieOptions): Response;

        /**
         *
         * @param path
         * @param filename
         * @returns
         */
        public abstract download(path: string, filename?: string): Response;

        /**
         *
         * @todo Can data be more types?
         * @param data
         * @param encoding
         * @returns
         */
        public abstract end(data?: string | Buffer, encoding?: string): Response;

        /**
         *
         * @param object
         * @returns
         */
        public abstract format(object: { [key: string]: () => Response | void }): Response;

        /**
         *
         * @param field
         * @returns
         */
        public abstract get(field: string): string;

        /**
         *
         * @param body
         * @returns
         */
        public abstract json(body?: JSON): Response;

        /**
         *
         * @param body
         * @returns
         */
        public abstract jsonp(body?: JSON): Response;

        /**
         *
         * @param links
         * @returns
         */
        public abstract links(links: { [key: string]: string }): Response;

        /**
         *
         * @param path
         * @returns
         */
        public abstract location(path: string): Response;

        /**
         *
         * @param status
         * @param path
         * @returns
         */
        public abstract redirect(status: number, path: string): Response;

        /**
         *
         * @param path
         * @returns
         */
        public abstract redirect(path: string): Response;

        /**
         *
         * @param body
         * @returns
         */
        public abstract send(body?: string | Buffer | JSON): Response;

        /**
         *
         * @param path
         * @param options
         * @returns
         */
        public abstract sendFile(path: string, options: FileOptions): Response;

        /**
         *
         * @param statusCode
         * @returns
         */
        public abstract sendStatus(statusCode: number): Response;

        /**
         *
         * @param field
         * @param value
         * @returns
         */
        public abstract set(field: string, value?: string): Response;

        /**
         *
         * @param fields
         * @returns
         */
        public abstract set(fields: { [key: string]: string }): Response;

        /**
         *
         * @param code
         * @returns
         */
        public abstract status(code: number): Response;

        /**
         *
         * @param type
         * @returns
         */
        public abstract type(type: string): Response;

        /**
         *
         * @param field
         * @returns
         */
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

    /**
     * The route protocol.
     * This is the protocol that is being used for a request.
     *
     * @todo Add more documentation
     */
    export enum RouteProtocol {
        HTTP,
        HTTPS
    }
}
