import fetch from "cross-fetch";
const yaml = require('js-yaml');

function extension(file: string) {
    return file.split(".").pop();
}

export type IFetcher = (file: string) => Promise<string>;

export default class Loader {
    async load(file: string, fetcher?: IFetcher): Promise<any> {
        const text = await (fetcher ?? Loader.BrowserFetcher)(file);
        if (extension(file) === "yaml" || extension(file) === "yml") {
            return yaml.load(text);
        }
        return extension(file) === "json" ? JSON.parse(text) : text;
    }

    static BrowserFetcher: IFetcher = (file: string): Promise<string> => {
        return fetch(file).then(response => response.text());
    }
}
