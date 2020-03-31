/**
 * The storage namespace.
 * This namespace defines everything related to storage. That includes saving data, retrieving data, serializing data,
 * deserializing data, etc.
 */
export namespace Storage {
    /**
     * A storage provider.
     * This class represents a storage provider that allows for getting and setting any sort of data.
     */
    export abstract class Provider {
        protected constructor() {

        }
    }

    /**
     *
     */
    export interface Storable {
        serialize(data: Data): Data;

        deserialize(data: Data): void;
    }

    /**
     *
     */
    export type StorableType = boolean | string | number | Storable | StorableType[];

    /**
     *
     */
    export abstract class Data implements Storable {
        private readonly _data: { [name: string]: StorableType };

        protected constructor() {
            this._data = {};
        }

        public get(name: string): StorableType {
            return this._data[name];
        }

        public set(name: string, value?: StorableType): void {
            if (!value) {
                delete this._data[name];
                return;
            }

            this._data[name] = value;
        }

        public getBool(name: string): boolean {
            return this.get(name) as boolean;
        }

        public getString(name: string): string {
            return this.get(name) as string;
        }

        public getNumber(name: string): number {
            return this.get(name) as number;
        }

        deserialize(data: Data): void {
            for (let key in data._data) {
                this.set(key, data.get(key));
            }
        }

        serialize(data: Data): Data {
            for (let key in this._data) {
                data.set(key, this._data[key]);
            }

            return data;
        }
    }
}
