import Encoder from "./Encoder";
import * as fflate from 'fflate';

export default class FFlateEncoder implements Encoder {
    encode(arrayBuffer: ArrayBuffer): ArrayBuffer {
        return fflate.gzipSync(new Uint8Array(arrayBuffer), {
            mtime: '1/1/2023 12:00 PM', //  fixed time to avoid changes if content doesn't change
          }).buffer;
    }
    decode(arrayBuffer: ArrayBuffer): ArrayBuffer {
        return fflate.gunzipSync(new Uint8Array(arrayBuffer)).buffer;
    }

}