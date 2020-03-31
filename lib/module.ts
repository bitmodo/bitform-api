import { Provider } from './provider';

/**
 * A Pib module.
 * This is an abstract module that can be used with Pib. Modules can provide extra pages, configuration options, etc.
 */
export abstract class Module {
    protected _name: string;
    protected _slug: string;

    protected _path?: string;

    protected _pages: Module.Page[];

    protected constructor(name: string, slug?: string, path?: string) {
        this._name = name;
        this._slug = slug || name;
        this._path = path;

        this._pages = [];
    }

    public get name(): string {
        return this._name;
    }

    public add(page: Module.Page): void {
        this._pages = this._pages.concat(page);
    }

    public abstract load(): void;

    public prepare(provider: Provider): void {
        for (let page of this._pages) {
            page.load(provider);
        }
    }
}

/**
 * The module namespace.
 * This namespace provides all of the things that are useful for modules. That includes things such as configurations,
 * pages, etc.
 */
export namespace Module {
    /**
     * A module configuration.
     * This is a way for a module to define configuration settings without having to worry about things like saving
     * and whatnot. This allows modules to be able to be configured through a settings module without any extra
     * work.
     */
    export class Configuration {
        public constructor() {

        }
    }

    /**
     * The configuration namespace.
     * This namespace provides all of the necessary tools and classes to properly handle configurations.
     */
    export namespace Configuration {
        /**
         * A configuration node.
         * This represents a single node in the configuration. It has a name and a value. The value can be anything
         * from a string to a number to a list.
         */
        export class Node<T> {
            readonly #name: string;
            #value?: T | T[];

            readonly #nullable: boolean;

            public constructor(name: string, nullable: boolean, value?: T | T[]) {
                this.#name  = name;
                this.#value = value;

                this.#nullable = nullable;
            }

            public get name(): string {
                return this.#name;
            }

            public get value(): T[] | T | undefined {
                return this.#value;
            }

            public set value(value: T | T[] | undefined) {
                if (!this.nullable && !value)
                    throw new TypeError('The node was marked as nonnull but was passed an undefined value');

                this.#value = value;
            }

            public get nullable(): boolean {
                return this.#nullable;
            }
        }
    }

    /**
     * A module page.
     * This is a page for a module. This should be extended whenever creating any sort of page. The page will specify
     * a layout and will be specified different settings and variables when the page is requested so that it can
     * dynamically display different content depending on the current context of the request.
     */
    export abstract class Page {
        protected constructor() {

        }

        public abstract load(provider: Provider): void;
    }

    /**
     * The page namespace.
     * This namespace defines all of the different things which are useful for a page.
     */
    export namespace Page {
        /**
         * A page layout.
         * This is the top-level overview of a page's content. It is what should be defining how a page should be
         * laid out.
         */
        export abstract class Layout {
            protected constructor() {

            }
        }

        /**
         * A Pib component.
         * A component is an element on a page. Every page is made up of some number of components. Components could be
         * anything from a text box to a simple container. Components should be made to be as flexible and reusable
         * as possible so that only a few components need to be made.
         */
        export abstract class Component {
            protected constructor() {

            }
        }
    }
}
