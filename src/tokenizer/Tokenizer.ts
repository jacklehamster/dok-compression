import Loader, { IFetcher } from "../io/Loader";
import { Header } from "./Header";
import Token, { getType, Hash, SPLIT_REGEX } from "./Token";
import md5 from "blueimp-md5";
/**
 * Class for spitting objects into tokens.
 */
export default class Tokenizer {
    loader: Loader = new Loader();

    /**
     * Load json or text files and turn them into tokens.
     * 
     * @param files files to load and reduce.
     */
    async load(files: string[], fetcher?: IFetcher): Promise<Header> {
        if (files.some(file => typeof file !== "string")) {
            throw new Error("Each argument passed to load must be a string.");
        }
        const allData = await Promise.all(files.map(file => this.loader.load(file, fetcher)));
        return this.tokenize(allData);
    }

    /**
     * Takes a mapping of filename and their corresponding data, and turn them into tokens.
     *
     * @param items Mapping from filename to data.
     * @returns All data stored as tokens.
     */
    tokenize(items: Record<string, any>) {
        const header: Header = {
            registry: {},
            files: {},
        };

        const counter = { next: 0 };

        Object.entries(items).sort((entry1, entry2) => entry1[0].localeCompare(entry2[0])).forEach(([file, value]) => {
            header.files[file] = {
                nameToken: this.tokenizeHelper(file, header.registry, counter, "header"),
                token: this.tokenizeHelper(value, header.registry, counter, file),
            }
        });

        const textEncoder = new TextEncoder();
        header.originalDataSize = textEncoder.encode(JSON.stringify(items)).byteLength;

        return header;
    }

    private registerToken(hash: Hash, value: any, registry: Record<Hash, Token>, counter: {next: number}, file: string, reference?: string[]) {
        const entry = registry[hash] ?? (registry[hash] = {
            type: getType(value),
            hash,
            value,
            reference,
            order: counter.next++,
            count: 0,
            files: new Set(),
        });
        entry.files.add(file);
        entry.count++;
        return entry;
    }

    private tokenizeHelper(item: any, registry: Record<Hash, Token>, counter: {next: number}, file: string): Token {
        const type = getType(item);
        if (type === "array") {
            if (!Array.isArray(item)) {
                throw new Error("item should be an array");
            }
            const hashes = item.map(item => this.tokenizeHelper(item, registry, counter, file)).map(({hash}) => hash);
            const hash = md5(hashes.join(","));
            return this.registerToken(hash, item, registry, counter, file, hashes);
        } else if (type === "object") {
            const entries = Object.entries(item);
            const keysToken = this.tokenizeHelper(entries.map(([key]) => key), registry, counter, file);
            const valuesToken = this.tokenizeHelper(entries.map(([,value]) => value), registry, counter, file);
            const hash = md5(`${keysToken.hash}|${valuesToken.hash}`);
            return this.registerToken(hash, item, registry, counter, file, [keysToken.hash, valuesToken.hash]);
        } else if (type === "split") {
            const chunks = item.split(SPLIT_REGEX);
            const separators = item.match(SPLIT_REGEX);
            const chunksToken = this.tokenizeHelper(chunks, registry, counter, file);
            const separatorsToken = this.tokenizeHelper(separators, registry, counter, file);
            const hash = md5(`${chunksToken.hash}-${separatorsToken.hash}`);
            return this.registerToken(hash, item, registry, counter, file, [chunksToken.hash, separatorsToken.hash]);
        } else {
            const m = md5(JSON.stringify(item));
            return this.registerToken(m, item, registry, counter, file);
        }
    }
}