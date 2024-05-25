import fetch from "cross-fetch";

const yaml = require('js-yaml');

function extension(file: string) {
    return file.split(".").pop();
}

export type IFetcher<T> = (file: string) => Promise<T>;

export default class Loader {
    async load(file: string, fetcher: IFetcher<string>): Promise<any> {
        const text = await fetcher(file);
        if (extension(file) === "yaml" || extension(file) === "yml") {
            return yaml.load(text);
        }
        return extension(file) === "json" ? JSON.parse(text) : text;
    }

    static BrowserFetcher: IFetcher<string> = (file: string): Promise<string> => {
        return fetch(file).then(response => response.text());
    }

    static ArrayBufferFetcher:IFetcher<ArrayBuffer> = (file: string): Promise<ArrayBuffer> => {
        return fetch(file).then(response => response.arrayBuffer());
    }

    static NodeJSFileFetcher:IFetcher<ArrayBuffer> = async (file: string): Promise<ArrayBuffer> => {
        const fs = require("fs");
        const buffer = await fs.promises.readFile(file);
        return buffer.buffer as ArrayBuffer;    
    }
}
