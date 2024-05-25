import Loader from "./io/Loader";
import TokenEncoder from "./compression/TokenEncoder";
import Compressor from "./compression/Compressor";
import FFlateEncoder from "./compression/FFlateEncoder";

const exportedClasses = {
  Loader,
  Compressor,
  TokenEncoder,
  FFlateEncoder,
}

export default exportedClasses;
