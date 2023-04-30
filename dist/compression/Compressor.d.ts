import { DataStore } from "../reducer/Reducer";
import ExtractableData, { ExtractionConfig } from "../expander/Extractor";
import { IFetcher } from "../io/Loader";
declare enum EncoderEnum {
    NONE = 0,
    FFLATE = 1
}
export default class Compressor {
    private applyEncoders;
    private applyDecoders;
    /**
     * Load json or text files and compress them into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    loadAndCompress(files: string[], fetcher: IFetcher<string>): Promise<ArrayBuffer>;
    /**
     * Compress data into one big blob.
     * This uses the default encoders.
     *
     * @param files files to load.
     */
    compress(data: Record<string, any>): ArrayBuffer;
    loadAndExpand(file: string, fetcher?: IFetcher<ArrayBuffer>): Promise<ExtractableData>;
    expand(arrayBuffer: ArrayBuffer, config?: ExtractionConfig): ExtractableData;
    compressDataStore(dataStore: DataStore, encoderEnums?: EncoderEnum[]): ArrayBuffer;
    expandDataStore(arrayBuffer: ArrayBuffer): DataStore;
}
export {};
