import { Provider } from './provider';

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
