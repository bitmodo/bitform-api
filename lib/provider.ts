import util = require('./util');

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

    public abstract start(): never;

    public abstract group(path: Routing.RoutePath, callback: (router: Routing.Router) => void): Routing.Router;

    public all(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route([Routing.RouteMethod.get, Routing.RouteMethod.post, Routing.RouteMethod.put, Routing.RouteMethod.delete], path, callback);
    }

    public abstract route(method: Routing.RouteMethod | Routing.RouteMethod[], path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route;

    public get(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.get, path, callback);
    }

    public post(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.post, path, callback);
    }

    public connect(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.connect, path, callback);
    }

    public delete(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.delete, path, callback);
    }

    public head(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.head, path, callback);
    }

    public options(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.options, path, callback);
    }

    public patch(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.patch, path, callback);
    }

    public put(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.put, path, callback);
    }

    public trace(path: Routing.RoutePath, callback: Routing.RouteCallback): Routing.Route {
        return this.route(Routing.RouteMethod.trace, path, callback);
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
        get     = 'get',
        post    = 'post',
        put     = 'put',
        delete  = 'delete',

        head    = 'head',
        connect = 'connect',
        options = 'options',
        trace   = 'trace',
        patch   = 'patch',
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

        protected constructor(path: RoutePath, callbacks: RouteCallbacks) {
            this._path      = path;
            this._callbacks = callbacks;
        }

        public get methods(): RouteMethod[] {
            return util.reverseMap(RouteMethod, util.keys(this._callbacks)) as RouteMethod[];
        }

        public get path(): RoutePath {
            return this._path;
        }

        public handle(method: RouteMethod, callback: RouteCallback): void {
            this._callbacks[method] = callback;
        }

        public call(method: RouteMethod, req: Request, res: Response): string | Response | void {
            let callback = this._callbacks[method];
            if (!callback) {
                return;
            }

            return callback(req, res);
        }
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
         * parsed and converted into data types that are usable. The default supported types are {@link JSON} and
         * urlencoded data.
         *
         * @see JSON
         */
        public abstract get body(): JSON | string | undefined;

        /**
         * Cookies sent by the request.
         * These are any of the cookies sent in the request. The cookies are parsed and converted into {@link Cookie}
         * objects which can then be used. If there are no cookies, it will default to an empty array.
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
         * This corresponds to a {@link RouteMethod} that is specified by the request.
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
         * @todo create content type enum?
         * @param {(string|string[])} types - The type(s) of content to check
         * @returns {(string|false)} The best content type match or false
         */
        public abstract accepts(types: string | string[]): string | false;

        /**
         * Get the first acceptable charset.
         * This will go through the list of charsets specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @todo Create charsets enum?
         * @param {(string|string[])} charsets - The charset(s) to check
         * @returns {(string|false)} The first charset that is acceptable or false
         */
        public abstract acceptsCharsets(charsets: string | string[]): string | false;

        /**
         * Get the first acceptable encoding.
         * This will go through the list of encodings specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @todo Create encodings enum?
         * @param {(string|string[])} encodings - The encoding(s) to check
         * @returns {(string|false)} The first encoding that is acceptable or false
         */
        public abstract acceptsEncodings(encodings: string | string[]): string | false;

        /**
         * Get the first acceptable language.
         * This will go through the list of encodings specified and return the first one that is acceptable. If none
         * are acceptable, false will be returned.
         *
         * @todo Create languages enum?
         * @param {(string|string[])} langs - The language(s) to check
         * @returns {(string|false)} The first language that is acceptable or false
         */
        public abstract acceptsLanguages(langs: string | string[]): string | false;

        /**
         * Get an HTTP header.
         * This will get the specified HTTP request header field and return it. If the field is not found, undefined is
         * returned.
         *
         * @param {string} field - The field to get
         * @returns {(string|undefined)} The value of the field or undefined
         */
        public abstract get(field: string): string | undefined;

        /**
         * Check if the content type matches.
         * This will return the matching content type if the request's `Content-Type` HTTP header matches the MIME type
         * specified. If the request has no body, `null` is returned. Otherwise, `false` is returned.
         *
         * @param {string} type - The content type to check
         * @returns {(string|false|null)} The matching content type, false, or null
         */
        public abstract is(type: string): string | false | null;
    }

    /**
     * A generic response.
     * A response is the server's message to the user agent which contains the data for the given request.
     *
     * @todo Give example of how to chain methods
     * @todo Create HTTP status code enum?
     * @todo Handle rendering pages/components
     */
    export abstract class Response {
        /**
         * Append the value(s) to the HTTP header.
         * This will take the specified value(s) and append them to the specified HTTP header. If the header does not
         * already exist, it will be created first.
         *
         * @param {string} field - The field to append to
         * @param {(string|string[])} value - The value(s) to append
         * @returns {Response} The current response for chaining
         */
        public abstract append(field: string, value: string | string[]): Response;

        /**
         * Cause the response to be an attachment.
         * This will set the `Content-Disposition` header to `attachment`. This causes the response to be handled as if
         * it were an attachment. If a filename is given, the `Content-Type` header will be set based on the extension,
         * and the `Content-Disposition` will be set to include the filename.
         *
         * @param {string} [filename] - The optional filename to use
         * @returns {Response} The current response for chaining
         */
        public abstract attachment(filename?: string): Response;

        /**
         * Set a cookie.
         * This will add a cookie to the response. The name and value will be whatever is specified in the provided
         * cookie, and options will also be based on that object.
         *
         * @see Cookie
         * @param {Cookie} cookie - The cookie to create
         * @returns {Response} The current response for chaining
         */
        public abstract cookie(cookie: Cookie): Response;

        /**
         * Set a cookie.
         * This will add a cookie to the response. This method is a convenience method for the other cookie method.
         *
         * @see cookie
         * @param {string} name - The name of the cookie
         * @param {string} value - The cookie's value
         * @param {CookieOptions} [options] - Additional options for the cookie
         * @returns {Response} The current response for chaining
         */
        public abstract cookie(name: string, value: string, options?: CookieOptions): Response;

        /**
         * Clear a cookie.
         * This will delete a cookie on the client. It will use the name specified and the options provided to do so.
         * Note that web browsers and other compliant clients will only clear the cookie if the given options match those
         * used to create the cookie.
         *
         * @param {string} name - The name of the cookie to clear
         * @param {CookieOptions} [options] - The options that the cookie was made using
         * @returns {Response} The current response for chaining
         */
        public abstract clearCookie(name: string, options?: CookieOptions): Response;

        /**
         * Transfer a file as an attachment.
         * This will cause the file at the specified path to be transferred as an attachment. Typically, browsers will
         * prompt the user for download. By default, the filename will be equal to the path. Once the operation has been
         * completed, the callback function will be called with either the error or null.
         *
         * @param {string} path - The path of the file to download
         * @param {string} [filename] - The name of the file
         * @param {(error?: Error | null) => void} [callback] - A callback for when the download is finished
         * @returns {Response} The current response for chaining
         */
        public abstract download(path: string, filename?: string, callback?: (error?: Error | null) => void): Response;

        /**
         * End the response process.
         * This will cause the response to end and be sent. This can be used to quickly end the response without any
         * data. However, if data needs to be included, use methods such as {@link send} and {@link json}.
         *
         * @todo Can data be more types?
         * @see send
         * @see json
         * @param {(string|Buffer)} [data] - Optional data to write before ending
         * @param {string} [encoding] - The encoding of the data
         * @returns {Response} The current response for chaining
         */
        public abstract end(data?: string | Buffer, encoding?: string): Response;

        /**
         * Perform content-negotiation depending on the acceptable content.
         * This will perform different content-negotiation depending on the content types specified in the `Accept`
         * HTTP header. Depending on the acceptable content types, one of the provided closures will be selected and
         * run.
         *
         * @param {*} object - The content type callbacks
         * @returns {Response} The current response for chaining
         */
        public abstract format(object: { [key: string]: () => Response | string | void }): Response;

        /**
         * Get an HTTP header.
         * This will get the specified HTTP response header field and return it. If the field is not found, undefined is
         * returned.
         *
         * @param {string} field - The field to get
         * @returns {(string|undefined)} The value of the field or undefined
         */
        public abstract get(field: string): string | undefined;

        /**
         * Send a JSON response.
         * This will send the JSON object specified as the response body. It will also set the correct content type for
         * the response.
         *
         * @see JSON
         * @param {JSON} [body] - The JSON body to send
         * @returns {Response} The current response for chaining
         */
        public abstract json(body?: JSON): Response;

        /**
         * Send a JSON response with JSONP support.
         * This will send the JSON object specified as the response body with JSONP support. This method is identical
         * to {@link json}, except that it opts-in to JSONP callback support.
         *
         * @see json
         * @param {JSON} [body] - The JSON body to send
         * @returns {Response} The current response for chaining
         */
        public abstract jsonp(body?: JSON): Response;

        /**
         * Set the `Link` HTTP header.
         * This will take the provided links and join them to populate the response's `Link` HTTP header.
         *
         * @param {*} links - The links to use
         * @returns {Response} The current response for chaining
         */
        public abstract links(links: { [key: string]: string }): Response;

        /**
         * Set the `Location` HTTP header.
         * This will set the `Location` HTTP header to the specified path. If set to `back`, it will refer to the URL
         * specified in the `Referer` header, or `/` if that header is not specified.
         *
         * @param {string} path - The path to set the location
         * @returns {Response} The current response for chaining
         */
        public abstract location(path: string): Response;

        /**
         * Redirect to the specified path with the specified status code.
         * This will redirect the response to the specified path.
         *
         * @param {number} status - The status code to use
         * @param {string} path - The path to redirect to
         * @returns {Response} The current response for chaining
         */
        public abstract redirect(status: number, path: string): Response;

        /**
         * Redirect to the specified path.
         * This will redirect to the specified path with a status code of 302. This is essentially a call to the
         * {@link redirect} method with a default status number.
         *
         * @see redirect
         * @param {string} path - The path to redirect to.
         * @returns {Response} The current response for chaining
         */
        public abstract redirect(path: string): Response;

        /**
         * Send the HTTP response.
         * This will send the HTTP response with the optionally specified body. The body can be a buffer, a string, or
         * a JSON object.
         *
         * @todo Set `Content-Length`
         * @todo Provide automatic HEAD and HTTP cache freshness
         * @param {(string|Buffer|JSON)} [body] - The optional body to send
         * @returns {Response} The current response for chaining
         */
        public abstract send(body?: string | Buffer | JSON): Response;

        /**
         * Transfer the file at the given path.
         * This will take the file at the given path and transfer it in the response. The `Content-Type` will automatically
         * be set depending on the path extension.
         *
         * @param {string} path - The path to the file to send
         * @param {FileOptions} [options] - The optional options to use for sending the file
         * @returns {Response} The current response for chaining
         */
        public abstract sendFile(path: string, options?: FileOptions): Response;

        /**
         * Set the status code and send a string.
         * This will set the status code to whatever is specified then send a string representation of the status
         * code as the response body.
         *
         * @param {number} statusCode - The status code to send
         * @returns {Response} The current response for chaining
         */
        public abstract sendStatus(statusCode: number): Response;

        /**
         * Set an HTTP header.
         * This will set the specified field to the specified value.
         *
         * @param {string} field - The name of the field to set
         * @param {string} value - The value to set the field to
         * @returns {Response} The current response for chaining
         */
        public abstract set(field: string, value: string): Response;

        /**
         * Set multiple HTTP headers.
         * This will take all of the fields specified in the object and convert them to headers. The keys will be the
         * header names and values will be the header values.
         *
         * @param {*} fields - The fields to set
         * @returns {Response} The current response for chaining
         */
        public abstract set(fields: { [key: string]: string }): Response;

        /**
         * Set the status code.
         * This will set the status code of the response.
         *
         * @param {number} code - The status code to set
         * @returns {Response} The current response for chaining
         */
        public abstract status(code: number): Response;

        /**
         * Set the content type.
         * This will set the content type of the response.
         *
         * @todo Create content type enum
         * @param {string} type - The content type
         * @returns {Response} The current response for chaining
         */
        public abstract type(type: string): Response;

        /**
         * Add the `Vary` header.
         * This will add the `Vary` HTTP header if it is not already present.
         *
         * @param {string} field - The field to vary
         * @returns {Response} The current response for chaining
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
}
