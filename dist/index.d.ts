import Loader from "./io/Loader";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";
import FFlateEncoder from "./compression/FFlateEncoder";
declare const exportedClasses: {
    Loader: typeof Loader;
    Compressor: typeof Compressor;
    TokenEncoder: typeof TokenEncoder;
    FFlateEncoder: typeof FFlateEncoder;
};
export default exportedClasses;
