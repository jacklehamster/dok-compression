export declare type IFetcher<T> = (file: string) => Promise<T>;
export default class Loader {
    load(file: string, fetcher?: IFetcher<string>): Promise<any>;
    static BrowserFetcher: IFetcher<string>;
    static ArrayBufferFetcher: IFetcher<ArrayBuffer>;
}
