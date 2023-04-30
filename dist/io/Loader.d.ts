export declare type IFetcher = (file: string) => Promise<string>;
export default class Loader {
    load(file: string, fetcher?: IFetcher): Promise<any>;
    static BrowserFetcher: IFetcher;
}
