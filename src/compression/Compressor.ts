import Reducer, { DataStore } from "../reducer/Reducer";
import { StreamDataView } from "stream-data-view";
import Encoder from "./Encoder";
import TokenEncoder from "./TokenEncoder";
import FFlateEncoder from "./FFlateEncoder";
import Tokenizer from "../tokenizer/Tokenizer";
import ExtractableData, { ExtractionConfig } from "../expander/Extractor";
import Loader, { IFetcher } from "../io/Loader";

const version = "1.1.1";

enum EncoderEnum {
    NONE = 0,
    FFLATE = 1,
};

const ENCODERS: (() => Encoder | undefined)[] = [
    () => undefined,
    () => new FFlateEncoder(),
]

const DEFAULT: EncoderEnum[] = [EncoderEnum.FFLATE];

export default class Compressor {
    /**
     * Load json or text files and compress them into one big blob.
     * This uses the default encoders.
     * 
     * @param files files to load.
     */
    async loadAndCompress(files: string[], fetcher: IFetcher<string> = Loader.BrowserFetcher, encoder: EncoderEnum[] = DEFAULT): Promise<ArrayBuffer> {
        const tokenizer = new Tokenizer();
        const header = await tokenizer.load(files, fetcher);

        const reducer = new Reducer();
        const dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore, encoder);
    }

    /**
     * Compress data into one big blob.
     * This uses the default encoders.
     * 
     * @param files files to load.
     */
    compress(data: Record<string, any>, encoder: EncoderEnum[] = DEFAULT): ArrayBuffer {
        const tokenizer = new Tokenizer();
        const header = tokenizer.tokenize(data);

        const reducer = new Reducer();
        const dataStore = reducer.reduce(header);
        return this.compressDataStore(dataStore, encoder);
    }
    
    async loadAndExpand(file: string, fetcher: IFetcher<ArrayBuffer> = Loader.ArrayBufferFetcher): Promise<ExtractableData> {
        const arrayBuffer = await fetcher(file);
        return this.expand(arrayBuffer);
    }

    expand(arrayBuffer: ArrayBuffer, config?: ExtractionConfig): ExtractableData {
        return new ExtractableData(this.expandDataStore(arrayBuffer), config);
    }

    private compressDataStore(dataStore: DataStore, encoderEnums: EncoderEnum[] = DEFAULT): ArrayBuffer {
        const streamDataView = new StreamDataView();
        const tokenEncoder: TokenEncoder = new TokenEncoder(streamDataView);

        //  Write header tokens
        tokenEncoder.encodeTokens(dataStore.headerTokens, true);
        //  Write fileNames
        tokenEncoder.encodeNumberArray(dataStore.files);

        const finalStream = new StreamDataView();
        //  Write version
        finalStream.setNextUint8(version.length);
        finalStream.setNextString(version);

        //  Write encoders
        encoderEnums.forEach(encoderEnum => finalStream.setNextUint8(encoderEnum));
        finalStream.setNextUint8(0);

        const encoders: Encoder[] = encoderEnums
            .map(encoderEnum => ENCODERS[encoderEnum]())
            .filter((encoder): encoder is Encoder => !!encoder);

        //  Write header
        const headerBuffer = this.applyEncoders(streamDataView.getBuffer(), encoders);
        finalStream.setNextUint32(headerBuffer.byteLength);
        finalStream.setNextBytes(headerBuffer);
        // console.log("HEADER length", headerBuffer.byteLength);

        //  Write each file's data tokens.
        for (let index = 0; index < dataStore.files.length; index++) {
            const subStream = new StreamDataView();
            const subEncoder = new TokenEncoder(subStream);
            subEncoder.encodeTokens(dataStore.getDataTokens(index)!, false);

            //  save and compress buffer
            const subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
            finalStream.setNextUint32(subBuffer.byteLength);
            // console.log("SUBBUFFER length", index, subBuffer.byteLength);
            finalStream.setNextBytes(subBuffer);
        }
        finalStream.setNextUint32(0);

        //  Write original data size
        finalStream.setNextUint32(dataStore.originalDataSize ?? 0);

        return new Uint8Array(finalStream.getBuffer()).buffer as ArrayBuffer;
    }

    private expandDataStore(arrayBuffer: ArrayBuffer): DataStore {
        const compressedSize = arrayBuffer.byteLength;
        let input = arrayBuffer;
        const globalStream = new StreamDataView(input);
        const version = globalStream.getNextString(globalStream.getNextUint8());
        const decoders: Encoder[] = [];
        do {
            const encoderEnum = globalStream.getNextUint8();
            if (encoderEnum === EncoderEnum.NONE) {
                break;
            }
            const decoder = ENCODERS[encoderEnum]?.();
            if (decoder) {
                decoders.push(decoder);
            }
        } while(globalStream.getOffset() < globalStream.getLength());

        const headerByteLength = globalStream.getNextUint32();
        const headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer as ArrayBuffer, decoders);

        const headerTokenEncoder = new TokenEncoder(new StreamDataView(headerBuffer));
        const headerTokens = headerTokenEncoder.decodeTokens(true);
        const files = headerTokenEncoder.decodeNumberArray();

        const subBuffers: ArrayBuffer[] = [];
        do {
            const byteLength = globalStream.getNextUint32();
            if (!byteLength) {
                break;
            }
            subBuffers.push(globalStream.getNextBytes(byteLength).buffer as ArrayBuffer);
        } while(globalStream.getOffset() < globalStream.getLength())

        const getDataTokens = (index: number) => {
            const subBuffer = this.applyDecoders(subBuffers[index], decoders);
            const streamDataView = new StreamDataView(subBuffer);
            const tokenDecoder = new TokenEncoder(streamDataView);
            return tokenDecoder.decodeTokens(false);
        }

        //  The remaining from streamDataView is extra. Some compressed data don't have it.
        let originalDataSize;
        try {
            originalDataSize = globalStream.getNextUint32() || undefined;
        } catch (e) {
        }

        return {
            version,
            originalDataSize,
            compressedSize,
            headerTokens,
            files,
            getDataTokens,
        }
    }

    private applyEncoders(buffer: ArrayBuffer, encoders: Encoder[]): ArrayBuffer {
        let resultBuffer = buffer;
        encoders.forEach(encoder => {
            resultBuffer = encoder.encode(resultBuffer);
        });
        return resultBuffer;
    }

    private applyDecoders(buffer: ArrayBuffer, decoders: Encoder[]): ArrayBuffer {
        let resultBuffer = buffer;
        decoders.forEach(decoder => {
            resultBuffer = decoder.decode(resultBuffer);
        });
        return resultBuffer;
    }
}
