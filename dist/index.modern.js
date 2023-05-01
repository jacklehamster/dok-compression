import fetch from 'cross-fetch';
import { StreamDataView } from 'stream-data-view';
import { gzipSync, gunzipSync } from 'fflate';
import md5 from 'blueimp-md5';

var yaml = require('js-yaml');
function extension(file) {
  return file.split(".").pop();
}
var Loader = /*#__PURE__*/function () {
  function Loader() {}
  var _proto = Loader.prototype;
  _proto.load = function load(file, fetcher) {
    try {
      return Promise.resolve((fetcher != null ? fetcher : Loader.BrowserFetcher)(file)).then(function (text) {
        return extension(file) === "yaml" || extension(file) === "yml" ? yaml.load(text) : extension(file) === "json" ? JSON.parse(text) : text;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return Loader;
}();
Loader.BrowserFetcher = function (file) {
  return fetch(file).then(function (response) {
    return response.text();
  });
};
Loader.ArrayBufferFetcher = function (file) {
  return fetch(file).then(function (response) {
    return response.arrayBuffer();
  });
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var StructureType;
(function (StructureType) {
  StructureType[StructureType["LEAF"] = 0] = "LEAF";
  StructureType[StructureType["ARRAY"] = 1] = "ARRAY";
  StructureType[StructureType["OBJECT"] = 2] = "OBJECT";
  StructureType[StructureType["SPLIT"] = 3] = "SPLIT";
})(StructureType || (StructureType = {}));
var DataType;
(function (DataType) {
  DataType[DataType["UNDEFINED"] = 0] = "UNDEFINED";
  DataType[DataType["NULL"] = 1] = "NULL";
  DataType[DataType["BOOLEAN_FALSE"] = 2] = "BOOLEAN_FALSE";
  DataType[DataType["BOOLEAN_TRUE"] = 3] = "BOOLEAN_TRUE";
  DataType[DataType["INT8"] = 4] = "INT8";
  DataType[DataType["UINT8"] = 5] = "UINT8";
  DataType[DataType["INT16"] = 6] = "INT16";
  DataType[DataType["UINT16"] = 7] = "UINT16";
  DataType[DataType["INT32"] = 8] = "INT32";
  DataType[DataType["UINT32"] = 9] = "UINT32";
  DataType[DataType["FLOAT32"] = 10] = "FLOAT32";
  DataType[DataType["FLOAT64"] = 11] = "FLOAT64";
  DataType[DataType["STRING"] = 12] = "STRING";
  DataType[DataType["UNICODE"] = 13] = "UNICODE";
  DataType[DataType["OBJECT_8"] = 17] = "OBJECT_8";
  DataType[DataType["OBJECT_16"] = 18] = "OBJECT_16";
  DataType[DataType["OBJECT_32"] = 19] = "OBJECT_32";
  DataType[DataType["SPLIT_8"] = 20] = "SPLIT_8";
  DataType[DataType["SPLIT_16"] = 21] = "SPLIT_16";
  DataType[DataType["SPLIT_32"] = 22] = "SPLIT_32";
  DataType[DataType["ARRAY_8"] = 23] = "ARRAY_8";
  DataType[DataType["ARRAY_16"] = 24] = "ARRAY_16";
  DataType[DataType["ARRAY_32"] = 25] = "ARRAY_32";
  DataType[DataType["OFFSET_ARRAY_8"] = 26] = "OFFSET_ARRAY_8";
  DataType[DataType["OFFSET_ARRAY_16"] = 27] = "OFFSET_ARRAY_16";
  DataType[DataType["OFFSET_ARRAY_32"] = 28] = "OFFSET_ARRAY_32";
  DataType[DataType["EMPTY_ARRAY"] = 29] = "EMPTY_ARRAY";
  DataType[DataType["REFERENCE_8"] = 30] = "REFERENCE_8";
  DataType[DataType["REFERENCE_16"] = 31] = "REFERENCE_16";
  DataType[DataType["REFERENCE_32"] = 32] = "REFERENCE_32";
  DataType[DataType["COMPLEX_OBJECT"] = 33] = "COMPLEX_OBJECT";
  DataType[DataType["UINT2"] = 34] = "UINT2";
  DataType[DataType["UINT4"] = 35] = "UINT4";
})(DataType || (DataType = {}));
var NUMBER_DATA_TYPES = [DataType.UINT8, DataType.INT8, DataType.UINT16, DataType.INT16, DataType.UINT32, DataType.INT32, DataType.FLOAT32, DataType.FLOAT64];
var DataTypeUtils = /*#__PURE__*/function () {
  function DataTypeUtils() {}
  var _proto = DataTypeUtils.prototype;
  _proto.numberSatisfyDataType = function numberSatisfyDataType(value, dataType) {
    var hasDecimal = value % 1 !== 0;
    if (hasDecimal) {
      switch (dataType) {
        case DataType.FLOAT32:
          return Math.fround(value) === value;
        case DataType.FLOAT64:
          return true;
        default:
          return false;
      }
    }
    switch (dataType) {
      case DataType.UINT2:
        return value >= 0 && value < 4;
      case DataType.UINT4:
        return value >= 0 && value < 16;
      case DataType.UINT8:
        return value >= 0 && value <= 255;
      case DataType.INT8:
        return value >= -128 && value <= 127;
      case DataType.UINT16:
        return value >= 0 && value <= 65535;
      case DataType.INT16:
        return value >= -32768 && value <= 32767;
      case DataType.UINT32:
        return value >= 0;
      case DataType.INT32:
        return true;
      case DataType.FLOAT32:
        return Math.fround(value) === value;
      case DataType.FLOAT64:
        return true;
    }
    return false;
  };
  _proto.getBestType = function getBestType(array) {
    var _this = this;
    if (array.some(function (number) {
      return number % 1 !== 0;
    })) {
      if (array.every(function (number) {
        return _this.numberSatisfyDataType(number, DataType.FLOAT32);
      })) {
        return DataType.FLOAT32;
      }
      return DataType.FLOAT64;
    }
    var min = Math.min.apply(Math, array);
    var max = Math.max.apply(Math, array);
    for (var _i = 0, _NUMBER_DATA_TYPES = NUMBER_DATA_TYPES; _i < _NUMBER_DATA_TYPES.length; _i++) {
      var dataType = _NUMBER_DATA_TYPES[_i];
      if (this.numberSatisfyDataType(min, dataType) && this.numberSatisfyDataType(max, dataType)) {
        return dataType;
      }
    }
    return DataType.FLOAT64;
  };
  _proto.getNumberDataType = function getNumberDataType(value) {
    for (var _i2 = 0, _NUMBER_DATA_TYPES2 = NUMBER_DATA_TYPES; _i2 < _NUMBER_DATA_TYPES2.length; _i2++) {
      var type = _NUMBER_DATA_TYPES2[_i2];
      if (this.numberSatisfyDataType(value, type)) {
        return type;
      }
    }
    return DataType.UNDEFINED;
  };
  _proto.getStringDataType = function getStringDataType(value) {
    var letterCodes = value.split("").map(function (l) {
      return l.charCodeAt(0);
    });
    if (letterCodes.every(function (code) {
      return code <= 255;
    })) {
      return DataType.STRING;
    } else {
      return DataType.UNICODE;
    }
  };
  _proto.getFullTokenDataType = function getFullTokenDataType(token) {
    switch (token.type) {
      case "array":
        return DataType.ARRAY_8;
      case "object":
        return DataType.OBJECT_8;
      case "split":
        return DataType.SPLIT_8;
      default:
        return this.getDataType(token);
    }
  };
  _proto.getDataType = function getDataType(token) {
    switch (token.type) {
      case "complex":
        return DataType.COMPLEX_OBJECT;
      case "array":
      case "object":
      case "split":
        var indices = token.value;
        if (!indices.length) {
          console.assert(token.type === "array");
          return DataType.EMPTY_ARRAY;
        }
        var offset = 0;
        if (token.type === "array" && indices.length > 3) {
          var min = Math.min.apply(Math, indices);
          var max = Math.max.apply(Math, indices);
          if (this.getNumberDataType(max - min) !== this.getNumberDataType(max)) {
            offset = min;
          }
          indices = indices.map(function (value) {
            return value - offset;
          });
        }
        var bestType = this.getBestType(indices);
        switch (token.type) {
          case "object":
            return bestType === DataType.UINT8 ? DataType.OBJECT_8 : bestType === DataType.UINT16 ? DataType.OBJECT_16 : DataType.OBJECT_32;
          case "split":
            return bestType === DataType.UINT8 ? DataType.SPLIT_8 : bestType === DataType.UINT16 ? DataType.SPLIT_16 : DataType.SPLIT_32;
          case "array":
            if (offset) {
              return bestType === DataType.UINT8 ? DataType.OFFSET_ARRAY_8 : bestType === DataType.UINT16 ? DataType.OFFSET_ARRAY_16 : DataType.OFFSET_ARRAY_32;
            } else {
              return bestType === DataType.UINT8 ? DataType.ARRAY_8 : bestType === DataType.UINT16 ? DataType.ARRAY_16 : DataType.ARRAY_32;
            }
        }
      case "leaf":
        if (token.value === undefined) {
          return DataType.UNDEFINED;
        } else if (token.value === null) {
          return DataType.NULL;
        } else {
          switch (typeof token.value) {
            case "boolean":
              return token.value ? DataType.BOOLEAN_TRUE : DataType.BOOLEAN_FALSE;
            case "string":
              return this.getStringDataType(token.value);
            case "number":
              return this.getNumberDataType(token.value);
          }
        }
        break;
      case "reference":
        switch (this.getNumberDataType(token.value)) {
          case DataType.UINT8:
            return DataType.REFERENCE_8;
          case DataType.UINT16:
            return DataType.REFERENCE_16;
          case DataType.UINT32:
            return DataType.REFERENCE_32;
        }
        throw new Error("Invalid reference value: " + token.value);
    }
    throw new Error("Unrecognized type for " + token.type + " value: " + token.value);
  };
  _proto.dataTypeToType = function dataTypeToType(dataType) {
    switch (dataType) {
      case DataType.COMPLEX_OBJECT:
        return "complex";
      case DataType.EMPTY_ARRAY:
      case DataType.ARRAY_8:
      case DataType.ARRAY_16:
      case DataType.ARRAY_32:
        return "array";
      case DataType.OBJECT_8:
      case DataType.OBJECT_16:
      case DataType.OBJECT_32:
        return "object";
      case DataType.SPLIT_8:
      case DataType.SPLIT_16:
      case DataType.SPLIT_32:
        return "split";
      case DataType.REFERENCE_8:
      case DataType.REFERENCE_16:
      case DataType.REFERENCE_32:
        return "reference";
      default:
        return "leaf";
    }
  };
  _proto.typeToStructureType = function typeToStructureType(type) {
    switch (type) {
      case "leaf":
        return StructureType.LEAF;
      case "array":
        return StructureType.ARRAY;
      case "object":
        return StructureType.OBJECT;
      case "split":
        return StructureType.SPLIT;
    }
    throw new Error("Cannot translate to structure type: " + type);
  };
  return DataTypeUtils;
}();

var MAX_ARRAY_SIZE = 255;
var TokenEncoder = /*#__PURE__*/function () {
  function TokenEncoder(streamDataView) {
    this.streamDataView = streamDataView;
    this.dataTypeUtils = new DataTypeUtils();
  }
  var _proto = TokenEncoder.prototype;
  _proto.encodeTokens = function encodeTokens(tokens, organized) {
    var pos = 0;
    while (pos < tokens.length) {
      var count = this.encodeMulti(tokens, pos, organized);
      if (count) {
        pos += count;
      }
    }
    this.encodeMulti([], pos, organized);
  };
  _proto.decodeTokens = function decodeTokens(organized) {
    var tokens = [];
    while (this.streamDataView.getOffset() < this.streamDataView.getLength()) {
      if (!this.decodeMulti(tokens, organized)) {
        break;
      }
    }
    return tokens;
  };
  _proto.encodeToken = function encodeToken(token, dataType, multiInfo) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(token));
    switch (usedDataType) {
      case DataType.UNDEFINED:
      case DataType.NULL:
      case DataType.BOOLEAN_TRUE:
      case DataType.BOOLEAN_FALSE:
      case DataType.EMPTY_ARRAY:
        break;
      case DataType.INT8:
      case DataType.UINT8:
      case DataType.INT16:
      case DataType.UINT16:
      case DataType.INT32:
      case DataType.UINT32:
      case DataType.FLOAT32:
      case DataType.FLOAT64:
        this.encodeSingleNumber(token.value, usedDataType);
        break;
      case DataType.STRING:
      case DataType.UNICODE:
        this.encodeString(token.value, usedDataType, multiInfo);
        break;
      case DataType.OBJECT_8:
      case DataType.OBJECT_16:
      case DataType.OBJECT_32:
        this.encodeObjectToken(token, usedDataType);
        break;
      case DataType.SPLIT_8:
      case DataType.SPLIT_16:
      case DataType.SPLIT_32:
        this.encodeSplitToken(token, usedDataType);
        break;
      case DataType.ARRAY_8:
      case DataType.ARRAY_16:
      case DataType.ARRAY_32:
      case DataType.OFFSET_ARRAY_8:
      case DataType.OFFSET_ARRAY_16:
      case DataType.OFFSET_ARRAY_32:
        this.encodeArrayToken(token, usedDataType);
        break;
      case DataType.REFERENCE_8:
      case DataType.REFERENCE_16:
      case DataType.REFERENCE_32:
        this.encodeReferenceToken(token, usedDataType);
        break;
      case DataType.COMPLEX_OBJECT:
        this.encodeComplexToken(token, usedDataType);
        break;
      default:
        throw new Error("Invalid dataType: " + usedDataType);
    }
  };
  _proto.decodeToken = function decodeToken(dataType, multiInfo) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    switch (usedDataType) {
      case DataType.UNDEFINED:
        return {
          type: "leaf",
          value: undefined
        };
      case DataType.NULL:
        return {
          type: "leaf",
          value: null
        };
      case DataType.BOOLEAN_TRUE:
        return {
          type: "leaf",
          value: true
        };
      case DataType.BOOLEAN_FALSE:
        return {
          type: "leaf",
          value: false
        };
      case DataType.EMPTY_ARRAY:
        return {
          type: "array",
          value: []
        };
      case DataType.UINT2:
      case DataType.UINT4:
        throw new Error("Use decode number array.");
      case DataType.INT8:
      case DataType.UINT8:
      case DataType.INT16:
      case DataType.UINT16:
      case DataType.INT32:
      case DataType.UINT32:
      case DataType.FLOAT32:
      case DataType.FLOAT64:
        return {
          type: "leaf",
          value: this.decodeSingleNumber(usedDataType)
        };
      case DataType.STRING:
      case DataType.UNICODE:
        return {
          type: "leaf",
          value: this.decodeString(usedDataType, multiInfo)
        };
      case DataType.OBJECT_8:
      case DataType.OBJECT_16:
      case DataType.OBJECT_32:
        return this.decodeObjectToken(usedDataType);
      case DataType.SPLIT_8:
      case DataType.SPLIT_16:
      case DataType.SPLIT_32:
        return this.decodeSplitToken(usedDataType);
      case DataType.ARRAY_8:
      case DataType.ARRAY_16:
      case DataType.ARRAY_32:
      case DataType.OFFSET_ARRAY_8:
      case DataType.OFFSET_ARRAY_16:
      case DataType.OFFSET_ARRAY_32:
        return this.decodeArrayToken(usedDataType);
      case DataType.REFERENCE_8:
      case DataType.REFERENCE_16:
      case DataType.REFERENCE_32:
        return this.decodeReferenceToken(usedDataType);
      case DataType.COMPLEX_OBJECT:
        return this.decodeComplexToken(usedDataType);
      default:
        throw new Error("Invalid dataType: " + usedDataType);
    }
  };
  _proto.isOffsetDataType = function isOffsetDataType(dataType) {
    return dataType === DataType.OFFSET_ARRAY_8 || dataType === DataType.OFFSET_ARRAY_16 || dataType === DataType.OFFSET_ARRAY_32;
  };
  _proto.encodeArrayToken = function encodeArrayToken(arrayToken, dataType) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(arrayToken));
    var numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8 ? DataType.UINT8 : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16 ? DataType.UINT16 : DataType.UINT32;
    var indices = arrayToken.value;
    if (this.isOffsetDataType(usedDataType)) {
      var offset = Math.min.apply(Math, indices);
      indices = indices.map(function (value) {
        return value - offset;
      });
      this.encodeSingleNumber(offset);
    }
    this.encodeNumberArray(indices, numberType);
  };
  _proto.decodeArrayToken = function decodeArrayToken(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var offset = 0;
    if (this.isOffsetDataType(usedDataType)) {
      offset = this.decodeSingleNumber();
    }
    var numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8 ? DataType.UINT8 : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16 ? DataType.UINT16 : DataType.UINT32;
    var indices = this.decodeNumberArray(numberType).map(function (value) {
      return value + offset;
    });
    return {
      type: "array",
      value: indices
    };
  };
  _proto.encodeObjectToken = function encodeObjectToken(objectToken, dataType) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(objectToken));
    var numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
    var _objectToken$value = objectToken.value,
      keysIndex = _objectToken$value[0],
      valuesIndex = _objectToken$value[1];
    this.encodeSingleNumber(keysIndex, numberType);
    this.encodeSingleNumber(valuesIndex, numberType);
  };
  _proto.decodeObjectToken = function decodeObjectToken(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
    return {
      type: "object",
      value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
    };
  };
  _proto.encodeSplitToken = function encodeSplitToken(splitToken, dataType) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(splitToken));
    var numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
    var _splitToken$value = splitToken.value,
      chunksIndex = _splitToken$value[0],
      separatorsIndex = _splitToken$value[1];
    this.encodeSingleNumber(chunksIndex, numberType);
    this.encodeSingleNumber(separatorsIndex, numberType);
  };
  _proto.decodeSplitToken = function decodeSplitToken(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
    return {
      type: "split",
      value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)]
    };
  };
  _proto.encodeReferenceToken = function encodeReferenceToken(token, dataType) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getDataType(token));
    var numberType = usedDataType === DataType.REFERENCE_8 ? DataType.UINT8 : usedDataType === DataType.REFERENCE_16 ? DataType.UINT16 : DataType.UINT32;
    var index = token.value;
    this.encodeSingleNumber(index, numberType);
  };
  _proto.decodeReferenceToken = function decodeReferenceToken(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var numberType = usedDataType === DataType.REFERENCE_8 ? DataType.UINT8 : usedDataType === DataType.REFERENCE_16 ? DataType.UINT16 : DataType.UINT32;
    return {
      type: "reference",
      value: this.decodeSingleNumber(numberType)
    };
  };
  _proto.encodeComplexToken = function encodeComplexToken(token, dataType) {
    if (dataType === undefined) {
      this.encodeDataType(this.dataTypeUtils.getDataType(token));
    }
    var structure = token.value;
    this.encodeNumberArray(structure, DataType.UINT2);
  };
  _proto.decodeComplexToken = function decodeComplexToken(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var structure = this.decodeNumberArray(DataType.UINT2);
    return {
      type: this.dataTypeUtils.dataTypeToType(usedDataType),
      value: structure
    };
  };
  _proto.encodeDataType = function encodeDataType(dataType) {
    this.streamDataView.setNextUint8(dataType);
    return dataType;
  };
  _proto.decodeDataType = function decodeDataType() {
    var dataType = this.streamDataView.getNextUint8();
    return dataType;
  };
  _proto.encodeMulti = function encodeMulti(tokens, pos, organized) {
    if (pos >= tokens.length) {
      this.encodeSingleNumber(0, DataType.UINT8);
      return 0;
    }
    var firstType = this.dataTypeUtils.getDataType(tokens[pos]);
    var multiCount;
    var maxCount = Math.min(tokens.length - pos, 255);
    for (multiCount = 1; multiCount < maxCount; multiCount++) {
      if (this.dataTypeUtils.getDataType(tokens[pos + multiCount]) !== firstType) {
        break;
      }
    }
    this.encodeSingleNumber(multiCount, DataType.UINT8);
    this.encodeDataType(firstType);
    var multiInfo = {
      organized: organized
    };
    for (var i = 0; i < multiCount; i++) {
      this.encodeToken(tokens[pos + i], firstType, multiInfo);
    }
    return multiCount;
  };
  _proto.decodeMulti = function decodeMulti(tokens, organized) {
    var count = this.streamDataView.getNextUint8();
    if (!count) {
      return 0;
    }
    var dataType = this.decodeDataType();
    var multiInfo = {
      organized: organized
    };
    for (var i = 0; i < count; i++) {
      var token = this.decodeToken(dataType, multiInfo);
      tokens.push(token);
    }
    return count;
  };
  _proto.encodeSingleNumber = function encodeSingleNumber(value, dataType) {
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getNumberDataType(value));
    switch (usedDataType) {
      case DataType.UINT2:
      case DataType.UINT4:
        throw new Error("Use encode number array.");
      case DataType.UINT8:
        this.streamDataView.setNextUint8(value);
        break;
      case DataType.INT8:
        this.streamDataView.setNextInt8(value);
        break;
      case DataType.UINT16:
        this.streamDataView.setNextUint16(value);
        break;
      case DataType.INT16:
        this.streamDataView.setNextInt16(value);
        break;
      case DataType.UINT32:
        this.streamDataView.setNextUint32(value);
        break;
      case DataType.INT32:
        this.streamDataView.setNextInt32(value);
        break;
      case DataType.FLOAT32:
        this.streamDataView.setNextFloat32(value);
        break;
      case DataType.FLOAT64:
        this.streamDataView.setNextFloat64(value);
        break;
      default:
        throw new Error("Invalid dataType for number: " + usedDataType);
    }
  };
  _proto.decodeSingleNumber = function decodeSingleNumber(dataType) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    switch (usedDataType) {
      case DataType.UINT2:
      case DataType.UINT4:
        throw new Error("Use decode number array.");
      case DataType.UINT8:
        return this.streamDataView.getNextUint8();
      case DataType.INT8:
        return this.streamDataView.getNextInt8();
      case DataType.UINT16:
        return this.streamDataView.getNextUint16();
      case DataType.INT16:
        return this.streamDataView.getNextInt16();
      case DataType.UINT32:
        return this.streamDataView.getNextUint32();
      case DataType.INT32:
        return this.streamDataView.getNextInt32();
      case DataType.FLOAT32:
        return this.streamDataView.getNextFloat32();
      case DataType.FLOAT64:
        return this.streamDataView.getNextFloat64();
      default:
        throw new Error("Invalid dataType for number: " + usedDataType);
    }
  };
  _proto.bit2ToNum = function bit2ToNum(_ref) {
    var a = _ref[0],
      b = _ref[1],
      c = _ref[2],
      d = _ref[3];
    return (a != null ? a : 0) << 0 | (b != null ? b : 0) << 2 | (c != null ? c : 0) << 4 | (d != null ? d : 0) << 6;
  };
  _proto.numToBit2 = function numToBit2(n, size) {
    if (size === void 0) {
      size = 4;
    }
    return [n >> 0 & 3, n >> 2 & 3, n >> 4 & 3, n >> 6 & 3].slice(0, size);
  };
  _proto.bit4ToNum = function bit4ToNum(_ref2) {
    var a = _ref2[0],
      b = _ref2[1];
    return (a != null ? a : 0) << 0 | (b != null ? b : 0) << 4;
  };
  _proto.numToBit4 = function numToBit4(n, size) {
    if (size === void 0) {
      size = 2;
    }
    return [n >> 0 & 15, n >> 4 & 15].slice(0, size);
  };
  _proto.encodeNumberArray = function encodeNumberArray(array, dataType) {
    if (dataType === DataType.UINT2 || dataType === DataType.UINT4) {
      var stride = dataType === DataType.UINT2 ? 4 : 2;
      var transform = dataType === DataType.UINT2 ? this.bit2ToNum : this.bit4ToNum;
      var bytes = [];
      for (var i = 0; i < array.length; i += stride) {
        bytes.push(transform(array.slice(i, i + stride)));
      }
      this.encodeNumberArray(bytes, DataType.UINT8);
      this.encodeSingleNumber(array.length - bytes.length * stride, DataType.INT8);
      return;
    }
    var pos;
    for (pos = 0; pos < array.length;) {
      var size = Math.min(MAX_ARRAY_SIZE, array.length - pos);
      this.encodeSingleNumber(size, DataType.UINT8);
      if (!size) {
        break;
      }
      var bestType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getBestType(array));
      for (var _i = 0; _i < size; _i++) {
        this.encodeSingleNumber(array[pos + _i], bestType);
      }
      pos += size;
    }
    if (pos === MAX_ARRAY_SIZE) {
      this.encodeSingleNumber(0, DataType.UINT8);
    }
  };
  _proto.decodeNumberArray = function decodeNumberArray(dataType) {
    if (dataType === DataType.UINT2 || dataType === DataType.UINT4) {
      var transform = dataType === DataType.UINT2 ? this.numToBit2 : this.numToBit4;
      var structure = [];
      var bytes = this.decodeNumberArray(DataType.UINT8);
      for (var _iterator = _createForOfIteratorHelperLoose(bytes), _step; !(_step = _iterator()).done;) {
        var _byte = _step.value;
        structure.push.apply(structure, transform(_byte));
      }
      var sizeDiff = this.decodeSingleNumber(DataType.INT8);
      structure.length += sizeDiff;
      return structure;
    }
    var size;
    var numbers = [];
    do {
      size = this.decodeSingleNumber(DataType.UINT8);
      if (!size) {
        break;
      }
      var type = dataType != null ? dataType : this.decodeDataType();
      for (var i = 0; i < size; i++) {
        numbers.push(this.decodeSingleNumber(type));
      }
    } while (size >= MAX_ARRAY_SIZE);
    return numbers;
  };
  _proto.encodeString = function encodeString(value, dataType, multiInfo) {
    var _this = this;
    var usedDataType = dataType != null ? dataType : this.encodeDataType(this.dataTypeUtils.getStringDataType(value));
    var letterCodes = value.split("").map(function (l) {
      return l.charCodeAt(0);
    });
    if (!(multiInfo !== null && multiInfo !== void 0 && multiInfo.organized) || multiInfo.lastStringLength !== value.length) {
      letterCodes.push(0);
    }
    var numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
    letterCodes.forEach(function (code) {
      return _this.encodeSingleNumber(code, numberType);
    });
    if (multiInfo) {
      multiInfo.lastStringLength = value.length;
    }
  };
  _proto.decodeString = function decodeString(dataType, multiInfo) {
    var usedDataType = dataType != null ? dataType : this.decodeDataType();
    var charCodes = [];
    var numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
    do {
      var code = this.decodeSingleNumber(numberType);
      if (!code) {
        break;
      }
      charCodes.push(code);
      if (multiInfo !== null && multiInfo !== void 0 && multiInfo.organized && multiInfo !== null && multiInfo !== void 0 && multiInfo.lastStringLength && charCodes.length >= (multiInfo === null || multiInfo === void 0 ? void 0 : multiInfo.lastStringLength)) {
        break;
      }
    } while (true);
    var string = charCodes.map(function (code) {
      return String.fromCharCode(code);
    }).join("");
    if (multiInfo) {
      multiInfo.lastStringLength = string.length;
    }
    return string;
  };
  TokenEncoder.selfTest = function selfTest() {
    var _this2 = this;
    var testers = [function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(DataType.STRING, function (dataType) {
        return tokenEncoder.encodeDataType(dataType);
      }, reset, function () {
        return tokenDecoder.decodeDataType();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(DataType.UNDEFINED, function (dataType) {
        return tokenEncoder.encodeDataType(dataType);
      }, reset, function () {
        return tokenDecoder.decodeDataType();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(33, function (number) {
        return tokenEncoder.encodeSingleNumber(number, DataType.INT8);
      }, reset, function () {
        return tokenDecoder.decodeSingleNumber(DataType.INT8);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([{
        type: "leaf",
        value: 123
      }, {
        type: "leaf",
        value: 45
      }, {
        type: "leaf",
        value: 67
      }, {
        type: "leaf",
        value: 89
      }], function (header) {
        return tokenEncoder.encodeMulti(header, 0, false);
      }, reset, function () {
        var result = [];
        tokenDecoder.decodeMulti(result, false);
        return result;
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([{
        type: "leaf",
        value: 1000001
      }, {
        type: "leaf",
        value: 1002000
      }, {
        type: "leaf",
        value: 1003001
      }], function (header) {
        return tokenEncoder.encodeMulti(header, 0, false);
      }, reset, function () {
        var result = [];
        tokenDecoder.decodeMulti(result, false);
        return result;
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([1, 2, 3, 4, 10, 20, 200], function (array) {
        return tokenEncoder.encodeNumberArray(array);
      }, reset, function () {
        return tokenDecoder.decodeNumberArray();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(new Array(2000).fill(null).map(function (_, index) {
        return index;
      }), function (array) {
        return tokenEncoder.encodeNumberArray(array);
      }, reset, function () {
        return tokenDecoder.decodeNumberArray();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([10000, -202, 3, 4, 10, 20, 3200], function (array) {
        return tokenEncoder.encodeNumberArray(array);
      }, reset, function () {
        return tokenDecoder.decodeNumberArray();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction("teststring", function (string) {
        return tokenEncoder.encodeString(string);
      }, reset, function () {
        return tokenDecoder.decodeString();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction("teststring", function (string) {
        return tokenEncoder.encodeString(string, DataType.STRING);
      }, reset, function () {
        return tokenDecoder.decodeString(DataType.STRING);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction("test😀😃😄😁😆", function (string) {
        return tokenEncoder.encodeString(string);
      }, reset, function () {
        return tokenDecoder.decodeString();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "object",
        value: [200, 201]
      }, function (o) {
        return tokenEncoder.encodeObjectToken(o);
      }, reset, function () {
        return tokenDecoder.decodeObjectToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "object",
        value: [2000, 2001]
      }, function (o) {
        return tokenEncoder.encodeObjectToken(o);
      }, reset, function () {
        return tokenDecoder.decodeObjectToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "object",
        value: [2000, 2001]
      }, function (o) {
        return tokenEncoder.encodeObjectToken(o, DataType.OBJECT_32);
      }, reset, function () {
        return tokenDecoder.decodeObjectToken(DataType.OBJECT_32);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "split",
        value: [200, 201]
      }, function (o) {
        return tokenEncoder.encodeSplitToken(o);
      }, reset, function () {
        return tokenDecoder.decodeSplitToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "split",
        value: [2000, 2001]
      }, function (o) {
        return tokenEncoder.encodeSplitToken(o);
      }, reset, function () {
        return tokenDecoder.decodeSplitToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "split",
        value: [2000, 2001]
      }, function (o) {
        return tokenEncoder.encodeSplitToken(o, DataType.SPLIT_32);
      }, reset, function () {
        return tokenDecoder.decodeSplitToken(DataType.SPLIT_32);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "leaf",
        value: "tokenstring"
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "leaf",
        value: 123.5
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "leaf",
        value: "😁😆"
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "array",
        value: [1, 10, 20, 30, 200]
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "array",
        value: [1001, 1010, 1020, 1030, 1200]
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "array",
        value: [10010, 10100, 10300, 20000]
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "array",
        value: [10010, 10100, 10000]
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "array",
        value: new Array(260).fill(null).map(function (_, index) {
          return index;
        })
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(new Array(100).fill(null).map(function (_, index) {
        var token = {
          type: "array",
          value: new Array(index).fill(null).map(function (_, index) {
            return index;
          })
        };
        return token;
      }), function (o) {
        return tokenEncoder.encodeTokens(o, false);
      }, reset, function () {
        return tokenDecoder.decodeTokens(false);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(new Array(260).fill(null).map(function (_, index) {
        var token = {
          type: "array",
          value: new Array(index).fill(null).map(function (_, index) {
            return index;
          })
        };
        return token;
      }), function (o) {
        return tokenEncoder.encodeTokens(o, false);
      }, reset, function () {
        return tokenDecoder.decodeTokens(false);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction(new Array(260).fill(null).map(function (_) {
        var token = {
          type: "array",
          value: [1]
        };
        return token;
      }), function (o) {
        return tokenEncoder.encodeTokens(o, false);
      }, reset, function () {
        return tokenDecoder.decodeTokens(false);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "complex",
        value: [1, 2, 3, 2, 1, 2, 1, 0]
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction({
        type: "complex",
        value: "120100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000031000000000010000000120103100020103100020103100031000000000002010031000000031000000003100000310000310000003100000003100000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000201003100000003100000000310000031000031000000310000000031000000000000000000000000000100000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000".split("").map(function (a) {
          return parseInt(a);
        })
      }, function (o) {
        return tokenEncoder.encodeToken(o);
      }, reset, function () {
        return tokenDecoder.decodeToken();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([1, 2, 3, 2, 1, 2, 1, 0], function (o) {
        return tokenEncoder.encodeNumberArray(o, DataType.UINT2);
      }, reset, function () {
        return tokenDecoder.decodeNumberArray(DataType.UINT2);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction([1, 15, 12, 12, 1, 9, 1, 0], function (o) {
        return tokenEncoder.encodeNumberArray(o, DataType.UINT4);
      }, reset, function () {
        return tokenDecoder.decodeNumberArray(DataType.UINT4);
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction("xyzxyzyzxxxyyyzzz", function (o) {
        return tokenEncoder.encodeString(o);
      }, reset, function () {
        return tokenDecoder.decodeString();
      });
    }, function (tokenEncoder, tokenDecoder, reset) {
      _this2.testAction("abcdeabcabcadbdddba", function (o) {
        return tokenEncoder.encodeString(o);
      }, reset, function () {
        return tokenDecoder.decodeString();
      });
    }];
    testers.forEach(function (tester, index) {
      var streamDataView = new StreamDataView();
      var encoder = new TokenEncoder(streamDataView);
      var decoder = new TokenEncoder(streamDataView);
      var reset = function reset() {
        return streamDataView.resetOffset();
      };
      tester(encoder, decoder, reset);
      console.info("\u2705 Passed test " + index + ".");
    });
  };
  TokenEncoder.testAction = function testAction(value, encode, reset, decode, check) {
    if (check === void 0) {
      check = function check(result, value) {
        return console.assert(JSON.stringify(result) === JSON.stringify(value), "Not equal: \n%s\n!==\n%s (expected)", JSON.stringify(result), JSON.stringify(value));
      };
    }
    encode(value);
    reset();
    var decoded = decode();
    reset();
    check(decoded, value);
  };
  return TokenEncoder;
}();

var Reducer = /*#__PURE__*/function () {
  function Reducer() {
    this.dataTypeUtils = new DataTypeUtils();
  }
  var _proto = Reducer.prototype;
  _proto.reduce = function reduce(header) {
    var _this = this;
    var hashToIndex = {};
    var headerTokens = this.createReducedHeaderTokens(this.filterSplit(Object.values(header.registry).filter(function (token) {
      return token.files.size > 1 || token.files.has("header");
    }), header.registry), hashToIndex);
    var fileEntries = Object.entries(header.files).sort(function (_ref, _ref2) {
      var name1 = _ref[0];
      var name2 = _ref2[0];
      return name1.localeCompare(name2);
    });
    fileEntries.forEach(function (_ref3) {
      var _info$nameToken$value, _info$nameToken$value2, _info$token$value, _info$token$value$sub;
      var entry = _ref3[0],
        info = _ref3[1];
      console.log(entry, ">>", (_info$nameToken$value = info.nameToken.value) === null || _info$nameToken$value === void 0 ? void 0 : (_info$nameToken$value2 = _info$nameToken$value.substring) === null || _info$nameToken$value2 === void 0 ? void 0 : _info$nameToken$value2.call(_info$nameToken$value, 0, 10));
      console.log(entry, ">>>", (_info$token$value = info.token.value) === null || _info$token$value === void 0 ? void 0 : (_info$token$value$sub = _info$token$value.substring) === null || _info$token$value$sub === void 0 ? void 0 : _info$token$value$sub.call(_info$token$value, 0, 10));
    });
    var files = fileEntries.map(function (_ref4) {
      var token = _ref4[1];
      return hashToIndex[token.nameToken.hash];
    });
    var dataTokens = fileEntries.map(function (_ref5) {
      var root = _ref5[1].token;
      var subHashToIndex = _extends({}, hashToIndex);
      var structure = [];
      var result = [{
        type: "complex",
        value: structure
      }];
      _this.createComplexObject(root, subHashToIndex, header.registry, headerTokens, structure, result);
      return result;
    });
    return {
      originalDataSize: header.originalDataSize,
      headerTokens: headerTokens,
      files: files,
      getDataTokens: function getDataTokens(index) {
        return dataTokens[index];
      }
    };
  };
  _proto.sortTokens = function sortTokens(tokens) {
    tokens.sort(function (t1, t2) {
      return t2.count - t1.count;
    });
  };
  _proto.organizeTokens = function organizeTokens(tokens) {
    var _this2 = this;
    if (!tokens.length) {
      return tokens;
    }
    var buckets = [];
    tokens.forEach(function (token) {
      var dataType = _this2.dataTypeUtils.getFullTokenDataType(token);
      var bucket = undefined;
      for (var _i = 0, _buckets = buckets; _i < _buckets.length; _i++) {
        var b = _buckets[_i];
        if (b.length < 255 && _this2.dataTypeUtils.getFullTokenDataType(b[0]) === dataType) {
          bucket = b;
          break;
        }
      }
      if (!bucket) {
        bucket = [];
        buckets.push(bucket);
      }
      bucket.push(token);
    });
    buckets.forEach(function (bucket) {
      var dataType = _this2.dataTypeUtils.getFullTokenDataType(bucket[0]);
      switch (dataType) {
        case DataType.UINT8:
        case DataType.UINT16:
        case DataType.UINT32:
        case DataType.INT8:
        case DataType.INT16:
        case DataType.INT32:
        case DataType.FLOAT32:
        case DataType.FLOAT64:
          bucket.sort(function (a, b) {
            return b.value - a.value;
          });
          break;
        case DataType.STRING:
        case DataType.UNICODE:
          bucket.sort(function (a, b) {
            return b.value.length - a.value.length;
          });
          break;
        case DataType.ARRAY_8:
        case DataType.ARRAY_16:
        case DataType.ARRAY_32:
          bucket.sort(function (a, b) {
            return b.value.length - a.value.length;
          });
          break;
      }
    });
    var resultTokens = [];
    buckets.forEach(function (bucket) {
      return bucket.forEach(function (token) {
        return resultTokens.push(token);
      });
    });
    return resultTokens;
  };
  _proto.filterSplit = function filterSplit(tokens, registry) {
    for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
      var token = _step.value;
      if (token.type === "split") {
        var _token$reference = token.reference,
          chunskHash = _token$reference[0],
          separatorsHash = _token$reference[1];
        var chunksToken = registry[chunskHash];
        var separatorsToken = registry[separatorsHash];
        if (chunksToken.count <= token.count && separatorsToken.count <= token.count) {
          chunksToken.deleted = true;
          separatorsToken.deleted = true;
          token.type = "leaf";
          delete token.reference;
        }
      }
    }
    return tokens.filter(function (_ref6) {
      var deleted = _ref6.deleted;
      return !deleted;
    });
  };
  _proto.createReducedHeaderTokens = function createReducedHeaderTokens(tokens, hashToIndex, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    this.sortTokens(tokens);
    var organizedTokens = this.organizeTokens(tokens);
    organizedTokens.forEach(function (_ref7, index) {
      var hash = _ref7.hash;
      return hashToIndex[hash] = index + offset;
    });
    return organizedTokens.map(function (token) {
      var _token$reference$map, _token$reference2;
      return {
        type: token.type,
        value: (_token$reference$map = (_token$reference2 = token.reference) === null || _token$reference2 === void 0 ? void 0 : _token$reference2.map(function (hash) {
          return hashToIndex[hash];
        })) != null ? _token$reference$map : token.value
      };
    });
  };
  _proto.createComplexObject = function createComplexObject(token, hashToIndex, registry, headerTokens, structure, resultDataTokens) {
    var _this3 = this;
    if (hashToIndex[token.hash] >= 0) {
      structure.push(StructureType.LEAF);
      resultDataTokens.push({
        type: "reference",
        value: hashToIndex[token.hash]
      });
    } else if (token.type === "leaf") {
      structure.push(this.dataTypeUtils.typeToStructureType(token.type));
      hashToIndex[token.hash] = headerTokens.length + resultDataTokens.length;
      resultDataTokens.push({
        type: token.type,
        value: token.value
      });
    } else if (token.type === "split" || token.type === "object" || token.type === "array") {
      var _token$reference4;
      structure.push(this.dataTypeUtils.typeToStructureType(token.type));
      if (token.type === "array") {
        var _token$reference3;
        resultDataTokens.push({
          type: "leaf",
          value: (_token$reference3 = token.reference) === null || _token$reference3 === void 0 ? void 0 : _token$reference3.length
        });
      }
      var subTokens = (_token$reference4 = token.reference) === null || _token$reference4 === void 0 ? void 0 : _token$reference4.map(function (hash) {
        return registry[hash];
      });
      subTokens === null || subTokens === void 0 ? void 0 : subTokens.forEach(function (token) {
        _this3.createComplexObject(token, hashToIndex, registry, headerTokens, structure, resultDataTokens);
      });
    } else {
      throw new Error("Invalid token type");
    }
  };
  return Reducer;
}();

var FFlateEncoder = /*#__PURE__*/function () {
  function FFlateEncoder() {}
  var _proto = FFlateEncoder.prototype;
  _proto.encode = function encode(arrayBuffer) {
    return gzipSync(new Uint8Array(arrayBuffer)).buffer;
  };
  _proto.decode = function decode(arrayBuffer) {
    return gunzipSync(new Uint8Array(arrayBuffer)).buffer;
  };
  return FFlateEncoder;
}();

var SPLIT_REGEX = /\W+/g;
var TEST_REGEX = /(\w{3,}\W+){2,}|(\W+\w{3,}){2,}/;
function getType(value) {
  if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "object" && value) {
    return "object";
  } else if (typeof value === "string" && new Set(value).size < 16) {
    return "leaf";
  } else if (typeof value === "string" && TEST_REGEX.test(value)) {
    return "split";
  } else {
    return "leaf";
  }
}

var TextEncoder = require('text-encoding').TextEncoder;
var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer() {
    this.loader = new Loader();
  }
  var _proto = Tokenizer.prototype;
  _proto.load = function load(files, fetcher) {
    try {
      var _this = this;
      if (files.some(function (file) {
        return typeof file !== "string";
      })) {
        throw new Error("Each argument passed to load must be a string.");
      }
      return Promise.resolve(Promise.all(files.map(function (file) {
        return _this.loader.load(file, fetcher);
      }))).then(function (allData) {
        return _this.tokenize(allData);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.tokenize = function tokenize(items) {
    var _this2 = this;
    var header = {
      registry: {},
      files: {}
    };
    var counter = {
      next: 0
    };
    Object.entries(items).sort(function (entry1, entry2) {
      return entry1[0].localeCompare(entry2[0]);
    }).forEach(function (_ref) {
      var file = _ref[0],
        value = _ref[1];
      header.files[file] = {
        nameToken: _this2.tokenizeHelper(file, header.registry, counter, "header"),
        token: _this2.tokenizeHelper(value, header.registry, counter, file)
      };
    });
    var textEncoder = new TextEncoder();
    header.originalDataSize = textEncoder.encode(JSON.stringify(items)).byteLength;
    return header;
  };
  _proto.registerToken = function registerToken(hash, value, registry, counter, file, reference) {
    var _registry$hash;
    var entry = (_registry$hash = registry[hash]) != null ? _registry$hash : registry[hash] = {
      type: getType(value),
      hash: hash,
      value: value,
      reference: reference,
      order: counter.next++,
      count: 0,
      files: new Set()
    };
    entry.files.add(file);
    entry.count++;
    return entry;
  };
  _proto.tokenizeHelper = function tokenizeHelper(item, registry, counter, file) {
    var _this3 = this;
    var type = getType(item);
    if (type === "array") {
      if (!Array.isArray(item)) {
        throw new Error("item should be an array");
      }
      var hashes = item.map(function (item) {
        return _this3.tokenizeHelper(item, registry, counter, file);
      }).map(function (_ref2) {
        var hash = _ref2.hash;
        return hash;
      });
      var hash = md5(hashes.join(","));
      return this.registerToken(hash, item, registry, counter, file, hashes);
    } else if (type === "object") {
      var entries = Object.entries(item);
      var keysToken = this.tokenizeHelper(entries.map(function (_ref3) {
        var key = _ref3[0];
        return key;
      }), registry, counter, file);
      var valuesToken = this.tokenizeHelper(entries.map(function (_ref4) {
        var value = _ref4[1];
        return value;
      }), registry, counter, file);
      var _hash = md5(keysToken.hash + "|" + valuesToken.hash);
      return this.registerToken(_hash, item, registry, counter, file, [keysToken.hash, valuesToken.hash]);
    } else if (type === "split") {
      var chunks = item.split(SPLIT_REGEX);
      var separators = item.match(SPLIT_REGEX);
      var chunksToken = this.tokenizeHelper(chunks, registry, counter, file);
      var separatorsToken = this.tokenizeHelper(separators, registry, counter, file);
      var _hash2 = md5(chunksToken.hash + "-" + separatorsToken.hash);
      return this.registerToken(_hash2, item, registry, counter, file, [chunksToken.hash, separatorsToken.hash]);
    } else {
      var m = md5(JSON.stringify(item));
      return this.registerToken(m, item, registry, counter, file);
    }
  };
  return Tokenizer;
}();

var DEFAULT_CONFIG = {
  cacheable: true
};
var ExtractableData = /*#__PURE__*/function () {
  function ExtractableData(dataStore, config) {
    this.extractor = new Extractor();
    this.dataStore = dataStore;
    this.config = _extends({}, DEFAULT_CONFIG, config);
    this.fileNames = this.extractor.extractFileNames(dataStore.files, dataStore.headerTokens, this.config);
    this.fileToSlot = Object.fromEntries(this.fileNames.map(function (file, index) {
      return [file, index];
    }));
    this.version = dataStore.version;
    this.originalDataSize = dataStore.originalDataSize;
    this.compressedSize = dataStore.compressedSize;
  }
  var _proto = ExtractableData.prototype;
  _proto.extract = function extract(filename) {
    var slot = this.fileToSlot[filename];
    var dataTokens = this.dataStore.getDataTokens(slot);
    if (dataTokens) {
      return this.extractor.extract(this.dataStore.headerTokens, dataTokens, this.config);
    }
  };
  _proto.getHeaderTokens = function getHeaderTokens() {
    return this.dataStore.headerTokens;
  };
  return ExtractableData;
}();
var Extractor = /*#__PURE__*/function () {
  function Extractor() {
    this.valueFetcher = {
      "array": this.getArray.bind(this),
      "leaf": this.getLeaf.bind(this),
      "object": this.getObject.bind(this),
      "split": this.getSplit.bind(this),
      "reference": this.getReference.bind(this),
      "complex": undefined
    };
  }
  var _proto2 = Extractor.prototype;
  _proto2.extractFileNames = function extractFileNames(files, headerTokens, config) {
    var _this = this;
    return files.map(function (index) {
      return _this.extractToken(index, headerTokens, undefined, config);
    });
  };
  _proto2.extract = function extract(headerTokens, dataTokens, config) {
    var tokenStream = dataTokens.entries();
    var _tokenStream$next$val = tokenStream.next().value,
      complexToken = _tokenStream$next$val[1];
    var structure = complexToken.value;
    var token = this.extractComplex(structure.entries(), tokenStream, headerTokens, [].concat(dataTokens), config);
    return token;
  };
  _proto2.extractComplex = function extractComplex(structure, tokenStream, headerTokens, dataTokens, config) {
    var _this2 = this;
    var _structure$next$value = structure.next().value,
      structureType = _structure$next$value[1];
    switch (structureType) {
      case StructureType.LEAF:
        var _tokenStream$next$val2 = tokenStream.next().value,
          leafToken = _tokenStream$next$val2[1];
        var value = this.extractValueOrCache(leafToken, headerTokens, dataTokens, config, true, this.valueFetcher[leafToken.type]);
        return value;
      case StructureType.ARRAY:
        var _tokenStream$next$val3 = tokenStream.next().value,
          numToken = _tokenStream$next$val3[1];
        var array = new Array(numToken.value).fill(null).map(function (_) {
          return _this2.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
        });
        return array;
      case StructureType.OBJECT:
        var keys = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
        var values = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
        var object = Object.fromEntries(keys.map(function (key, index) {
          return [key, values[index]];
        }));
        return object;
      case StructureType.SPLIT:
        var chunks = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
        var separators = this.extractComplex(structure, tokenStream, headerTokens, dataTokens, config);
        var split = chunks.map(function (chunk, index) {
          var _separators$index;
          return "" + chunk + ((_separators$index = separators[index]) != null ? _separators$index : "");
        }).join("");
        return split;
    }
  };
  _proto2.extractToken = function extractToken(index, headerTokens, dataTokens, config, allowUseCache) {
    var token = index < headerTokens.length ? headerTokens[index] : dataTokens === null || dataTokens === void 0 ? void 0 : dataTokens[index - headerTokens.length];
    if (!token) {
      throw new Error("Invalid token at index: " + index);
    }
    return this.extractValueOrCache(token, headerTokens, dataTokens, config, allowUseCache, this.valueFetcher[token.type]);
  };
  _proto2.getLeaf = function getLeaf(token) {
    return token.value;
  };
  _proto2.getReference = function getReference(token, headerTokens, dataTokens, config) {
    var index = token.value;
    return this.extractToken(index, headerTokens, dataTokens, config);
  };
  _proto2.getArray = function getArray(token, headerTokens, dataTokens, config) {
    var _this3 = this;
    if (!Array.isArray(token.value)) {
      throw new Error("Invalid array token");
    }
    return token.value.map(function (index) {
      return _this3.extractToken(index, headerTokens, dataTokens, config);
    });
  };
  _proto2.getObject = function getObject(token, headerTokens, dataTokens, config) {
    var _token$value = token.value,
      keyIndex = _token$value[0],
      valueIndex = _token$value[1];
    var keys = this.extractToken(keyIndex, headerTokens, dataTokens, config, true);
    var values = this.extractToken(valueIndex, headerTokens, dataTokens, config);
    return Object.fromEntries(keys.map(function (key, index) {
      return [key, values[index]];
    }));
  };
  _proto2.getSplit = function getSplit(token, headerTokens, dataTokens, config) {
    var _token$value2 = token.value,
      chunksIndex = _token$value2[0],
      separatorsIndex = _token$value2[1];
    var chunks = this.extractToken(chunksIndex, headerTokens, dataTokens, config, true);
    var separators = this.extractToken(separatorsIndex, headerTokens, dataTokens, config, true);
    return chunks.map(function (chunk, index) {
      var _separators$index2;
      return "" + chunk + ((_separators$index2 = separators[index]) != null ? _separators$index2 : "");
    }).join("");
  };
  _proto2.extractValueOrCache = function extractValueOrCache(token, headerTokens, dataTokens, config, allowUseCache, getValue) {
    if (token.cache !== undefined && allowUseCache) {
      return token.cache;
    }
    var value = getValue(token, headerTokens, dataTokens, config);
    if (config.cacheable && token.type !== "leaf") {
      token.cache = value;
    }
    return value;
  };
  return Extractor;
}();

var version = "1.1.0";
var EncoderEnum;
(function (EncoderEnum) {
  EncoderEnum[EncoderEnum["NONE"] = 0] = "NONE";
  EncoderEnum[EncoderEnum["FFLATE"] = 1] = "FFLATE";
})(EncoderEnum || (EncoderEnum = {}));
var ENCODERS = [function () {
  return undefined;
}, function () {
  return new FFlateEncoder();
}];
var DEFAULT = [EncoderEnum.FFLATE];
var Compressor = /*#__PURE__*/function () {
  function Compressor() {}
  var _proto = Compressor.prototype;
  _proto.loadAndCompress = function loadAndCompress(files, fetcher, encoder) {
    if (encoder === void 0) {
      encoder = DEFAULT;
    }
    try {
      var _this = this;
      var tokenizer = new Tokenizer();
      return Promise.resolve(tokenizer.load(files, fetcher)).then(function (header) {
        var reducer = new Reducer();
        var dataStore = reducer.reduce(header);
        return _this.compressDataStore(dataStore, encoder);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.compress = function compress(data, encoder) {
    if (encoder === void 0) {
      encoder = DEFAULT;
    }
    var tokenizer = new Tokenizer();
    var header = tokenizer.tokenize(data);
    var reducer = new Reducer();
    var dataStore = reducer.reduce(header);
    return this.compressDataStore(dataStore, encoder);
  };
  _proto.loadAndExpand = function loadAndExpand(file, fetcher) {
    try {
      var _this2 = this;
      if (fetcher === undefined) fetcher = Loader.ArrayBufferFetcher;
      return Promise.resolve(fetcher(file)).then(function (arrayBuffer) {
        return _this2.expand(arrayBuffer);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.expand = function expand(arrayBuffer, config) {
    return new ExtractableData(this.expandDataStore(arrayBuffer), config);
  };
  _proto.compressDataStore = function compressDataStore(dataStore, encoderEnums) {
    var _dataStore$originalDa;
    if (encoderEnums === void 0) {
      encoderEnums = DEFAULT;
    }
    var streamDataView = new StreamDataView();
    var tokenEncoder = new TokenEncoder(streamDataView);
    tokenEncoder.encodeTokens(dataStore.headerTokens, true);
    tokenEncoder.encodeNumberArray(dataStore.files);
    var finalStream = new StreamDataView();
    finalStream.setNextUint8(version.length);
    finalStream.setNextString(version);
    encoderEnums.forEach(function (encoderEnum) {
      return finalStream.setNextUint8(encoderEnum);
    });
    finalStream.setNextUint8(0);
    var encoders = encoderEnums.map(function (encoderEnum) {
      return ENCODERS[encoderEnum]();
    }).filter(function (encoder) {
      return !!encoder;
    });
    var headerBuffer = this.applyEncoders(streamDataView.getBuffer(), encoders);
    finalStream.setNextUint32(headerBuffer.byteLength);
    finalStream.setNextBytes(headerBuffer);
    for (var index = 0; index < dataStore.files.length; index++) {
      var subStream = new StreamDataView();
      var subEncoder = new TokenEncoder(subStream);
      subEncoder.encodeTokens(dataStore.getDataTokens(index), false);
      var subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
      finalStream.setNextUint32(subBuffer.byteLength);
      finalStream.setNextBytes(subBuffer);
    }
    finalStream.setNextUint32(0);
    finalStream.setNextUint32((_dataStore$originalDa = dataStore.originalDataSize) != null ? _dataStore$originalDa : 0);
    return new Uint8Array(finalStream.getBuffer()).buffer;
  };
  _proto.expandDataStore = function expandDataStore(arrayBuffer) {
    var _this3 = this;
    var compressedSize = arrayBuffer.byteLength;
    var input = arrayBuffer;
    var globalStream = new StreamDataView(input);
    var version = globalStream.getNextString(globalStream.getNextUint8());
    var decoders = [];
    do {
      var _ENCODERS$encoderEnum;
      var encoderEnum = globalStream.getNextUint8();
      if (encoderEnum === EncoderEnum.NONE) {
        break;
      }
      var decoder = (_ENCODERS$encoderEnum = ENCODERS[encoderEnum]) === null || _ENCODERS$encoderEnum === void 0 ? void 0 : _ENCODERS$encoderEnum.call(ENCODERS);
      if (decoder) {
        decoders.push(decoder);
      }
    } while (globalStream.getOffset() < globalStream.getLength());
    var headerByteLength = globalStream.getNextUint32();
    var headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer, decoders);
    var headerTokenEncoder = new TokenEncoder(new StreamDataView(headerBuffer));
    var headerTokens = headerTokenEncoder.decodeTokens(true);
    var files = headerTokenEncoder.decodeNumberArray();
    var subBuffers = [];
    do {
      var byteLength = globalStream.getNextUint32();
      if (!byteLength) {
        break;
      }
      subBuffers.push(globalStream.getNextBytes(byteLength).buffer);
    } while (globalStream.getOffset() < globalStream.getLength());
    var getDataTokens = function getDataTokens(index) {
      var subBuffer = _this3.applyDecoders(subBuffers[index], decoders);
      var streamDataView = new StreamDataView(subBuffer);
      var tokenDecoder = new TokenEncoder(streamDataView);
      return tokenDecoder.decodeTokens(false);
    };
    var originalDataSize;
    try {
      originalDataSize = globalStream.getNextUint32() || undefined;
    } catch (e) {}
    return {
      version: version,
      originalDataSize: originalDataSize,
      compressedSize: compressedSize,
      headerTokens: headerTokens,
      files: files,
      getDataTokens: getDataTokens
    };
  };
  _proto.applyEncoders = function applyEncoders(buffer, encoders) {
    var resultBuffer = buffer;
    encoders.forEach(function (encoder) {
      resultBuffer = encoder.encode(resultBuffer);
    });
    return resultBuffer;
  };
  _proto.applyDecoders = function applyDecoders(buffer, decoders) {
    var resultBuffer = buffer;
    decoders.forEach(function (decoder) {
      resultBuffer = decoder.decode(resultBuffer);
    });
    return resultBuffer;
  };
  return Compressor;
}();

var exportedClasses = {
  Loader: Loader,
  Compressor: Compressor,
  TokenEncoder: TokenEncoder,
  FFlateEncoder: FFlateEncoder
};

export default exportedClasses;
//# sourceMappingURL=index.modern.js.map
