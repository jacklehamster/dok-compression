var yaml = require('js-yaml');
function extension(file) {
  return file.split(".").pop();
}
var Loader = /*#__PURE__*/function () {
  function Loader() {}
  var _proto = Loader.prototype;
  _proto.load = function load(file) {
    try {
      return Promise.resolve(fetch(file)).then(function (response) {
        var _exit = false;
        function _temp2(_result) {
          return _exit ? _result : Promise.resolve(extension(file) === "json" ? response.json() : response.text());
        }
        var _temp = function () {
          if (extension(file) === "yaml" || extension(file) === "yml") {
            var _load = yaml.load;
            return Promise.resolve(response.text()).then(function (_response$text) {
              var _yaml$load = _load.call(yaml, _response$text);
              _exit = true;
              return _yaml$load;
            });
          }
        }();
        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return Loader;
}();

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
    var files = fileEntries.map(function (_ref3) {
      var token = _ref3[1];
      return hashToIndex[token.nameToken.hash];
    });
    var dataTokens = fileEntries.map(function (_ref4) {
      var root = _ref4[1].token;
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
    return tokens.filter(function (_ref5) {
      var deleted = _ref5.deleted;
      return !deleted;
    });
  };
  _proto.createReducedHeaderTokens = function createReducedHeaderTokens(tokens, hashToIndex, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    this.sortTokens(tokens);
    var organizedTokens = this.organizeTokens(tokens);
    organizedTokens.forEach(function (_ref6, index) {
      var hash = _ref6.hash;
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,(function(){return (()=>{var t={d:(e,n)=>{for(var i in n)t.o(n,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:n[i]});},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});}},e={};t.r(e),t.d(e,{StreamDataView:()=>o});var n=function(){function t(t){this.encoding=t||"utf-8";}return t.prototype.decode=function(t){var e=String.fromCharCode.apply(null,Array.from(t));return "utf-8"===this.encoding?decodeURIComponent(escape(e)):e},t}(),i=function(){function t(t){this.encoding=t||"utf-8";}return t.prototype.encode=function(t){return "utf-8"===this.encoding&&(t=unescape(encodeURIComponent(t))),new Uint8Array(t.split("").map((function(t){return t.charCodeAt(0)})))},t}(),o=function(){function t(t,e){this.offset=0,this.autoResize=!1,void 0===t&&(t=0,this.autoResize=!0),"number"==typeof t&&(t=new ArrayBuffer(t)),this.view=new DataView(t),this.littleEndian=!e;}return t.fromByteString=function(e){var n=new t(e.split(" ").length);return n.fromByteString(e),n},t.fromTextString=function(e,n){var o,s=new t((o=n?new i("utf-8").encode(e):new i("ascii").encode(e)).length);return s.setNextString(e,n,o.length),s},t.prototype.resize=function(t){var e=function(t,e){if(!(t instanceof ArrayBuffer))throw new TypeError("Source must be an instance of ArrayBuffer");if(e<=t.byteLength)return t.slice(0,e);var n=new Uint8Array(t),i=new Uint8Array(new ArrayBuffer(e));return i.set(n),i.buffer}(this.getBuffer(),t);this.view=new DataView(e);},t.prototype.crop=function(){this.resize(this.getOffset());},t.prototype.getBuffer=function(){return this.view.buffer},t.prototype.skip=function(t){this.offset+=t;},t.prototype.resetOffset=function(){this.offset=0;},t.prototype.getOffset=function(){return this.offset},t.prototype.setOffset=function(t){this.offset=t;},t.prototype.getInt8=function(t){return this.view.getInt8(t)},t.prototype.getUint8=function(t){return this.view.getUint8(t)},t.prototype.getNextInt8=function(){var t=this.getInt8(this.offset);return this.offset+=1,t},t.prototype.getNextUint8=function(){var t=this.getUint8(this.offset);return this.offset+=1,t},t.prototype.getInt16=function(t){return this.view.getInt16(t,this.littleEndian)},t.prototype.getUint16=function(t){return this.view.getUint16(t,this.littleEndian)},t.prototype.getNextInt16=function(){var t=this.getInt16(this.offset);return this.offset+=2,t},t.prototype.getNextUint16=function(){var t=this.getUint16(this.offset);return this.offset+=2,t},t.prototype.getInt32=function(t){return this.view.getInt32(t,this.littleEndian)},t.prototype.getUint32=function(t){return this.view.getUint32(t,this.littleEndian)},t.prototype.getNextInt32=function(){var t=this.getInt32(this.offset);return this.offset+=4,t},t.prototype.getNextUint32=function(){var t=this.getUint32(this.offset);return this.offset+=4,t},t.prototype.getFloat32=function(t){return this.view.getFloat32(t,this.littleEndian)},t.prototype.getFloat64=function(t){return this.view.getFloat64(t,this.littleEndian)},t.prototype.getNextFloat32=function(){var t=this.getFloat32(this.offset);return this.offset+=4,t},t.prototype.getNextFloat64=function(){var t=this.getFloat64(this.offset);return this.offset+=8,t},t.prototype.setInt8=function(t,e){this.handleAutoResize(t,1),this.view.setInt8(t,e);},t.prototype.setUint8=function(t,e){this.handleAutoResize(t,1),this.view.setUint8(t,e);},t.prototype.setNextInt8=function(t){this.setInt8(this.offset,t),this.offset+=1;},t.prototype.setNextUint8=function(t){this.setUint8(this.offset,t),this.offset+=1;},t.prototype.setInt16=function(t,e){this.handleAutoResize(t,2),this.view.setInt16(t,e,this.littleEndian);},t.prototype.setUint16=function(t,e){this.handleAutoResize(t,2),this.view.setUint16(t,e,this.littleEndian);},t.prototype.setNextInt16=function(t){this.setInt16(this.offset,t),this.offset+=2;},t.prototype.setNextUint16=function(t){this.setUint16(this.offset,t),this.offset+=2;},t.prototype.setInt32=function(t,e){this.handleAutoResize(t,4),this.view.setInt32(t,e,this.littleEndian);},t.prototype.setUint32=function(t,e){this.handleAutoResize(t,4),this.view.setUint32(t,e,this.littleEndian);},t.prototype.setNextInt32=function(t){this.setInt32(this.offset,t),this.offset+=4;},t.prototype.setNextUint32=function(t){this.setUint32(this.offset,t),this.offset+=4;},t.prototype.setFloat32=function(t,e){this.handleAutoResize(t,8),this.view.setFloat32(t,e,this.littleEndian);},t.prototype.setFloat64=function(t,e){this.handleAutoResize(t,8),this.view.setFloat64(t,e,this.littleEndian);},t.prototype.setNextFloat32=function(t){this.setFloat32(this.offset,t),this.offset+=4;},t.prototype.setNextFloat64=function(t){this.setFloat64(this.offset,t),this.offset+=8;},t.prototype.getBytes=function(t,e){void 0===t&&(t=0),e=e||this.view.buffer.byteLength-t;var n=this.getBuffer().slice(t,t+e);return new Uint8Array(n)},t.prototype.getNextBytes=function(t){var e=this.getBytes(this.offset,t);return this.offset+=t||0,e},t.prototype.setBytes=function(t,e){(e instanceof ArrayBuffer||Array.isArray(e))&&(e=new Uint8Array(e));var n=e;this.handleAutoResize(t,n.byteLength);for(var i=0;i<n.byteLength;i++)this.setUint8(t+i,n[i]);},t.prototype.setNextBytes=function(t){Array.isArray(t)&&(t=new Uint8Array(t)),this.setBytes(this.offset,t),this.offset+=t.byteLength;},t.prototype.getString=function(t,e,i,o){var s=this.getBytes(t,e);if(o){var r=s.indexOf(0);r>=0&&(s=s.slice(0,r));}return i?new n("utf-8").decode(s):new n("ascii").decode(s)},t.prototype.getNextString=function(t,e,n){var i=this.getString(this.offset,t,e,n);return this.offset+=t,i},t.prototype.setString=function(t,e,n,o){var s;s=n?new i("utf-8").encode(e):new i("ascii").encode(e),o="number"==typeof o?o:s.byteLength,this.handleAutoResize(t,o);for(var r=0;r<o;r++)this.view.setUint8(t+r,s[r]||0);return o},t.prototype.setNextString=function(t,e,n){this.offset+=this.setString(this.offset,t,e,n);},t.prototype.toByteString=function(){return Array.from(new Uint8Array(this.getBuffer())).map((function(t){return ("00"+t.toString(16)).slice(-2)})).join(" ").toUpperCase()},t.prototype.toTextString=function(t){return this.getString(0,this.view.byteLength,t)},t.prototype.fromByteString=function(t){var e=t.split(" "),n=new ArrayBuffer(e.length);this.view=new DataView(n),this.setNextBytes(new Uint8Array(e.map((function(t){return parseInt(t,16)})))),this.resetOffset();},t.prototype.getLength=function(){return this.view.byteLength},t.prototype.clear=function(){this.view=new DataView(new ArrayBuffer(this.view.byteLength)),this.offset=0;},t.prototype.handleAutoResize=function(t,e){this.autoResize&&this.getBuffer().byteLength<t+e&&this.resize(t+e);},t}();return e})()}));
});

var sdv = unwrapExports(dist);

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
      var streamDataView = new sdv.StreamDataView();
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

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && st.f && !st.l))
        return buf || new u8(0);
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        st = {};
    // Assumes roughly 33% compression ratio average
    if (!buf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (noBuf)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (noBuf)
                    cbuf(bt + 131072);
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// starting at p, write the minimum number of bits that can hold v to d
var wbits = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
};
// starting at p, write the minimum number of bits (>8) that can hold v to d
var wbits16 = function (d, p, v) {
    v <<= p & 7;
    var o = (p / 8) | 0;
    d[o] |= v;
    d[o + 1] |= v >>> 8;
    d[o + 2] |= v >>> 16;
};
// creates code lengths from a frequency table
var hTree = function (d, mb) {
    // Need extra info to make a tree
    var t = [];
    for (var i = 0; i < d.length; ++i) {
        if (d[i])
            t.push({ s: i, f: d[i] });
    }
    var s = t.length;
    var t2 = t.slice();
    if (!s)
        return [et, 0];
    if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return [v, 1];
    }
    t.sort(function (a, b) { return a.f - b.f; });
    // after i2 reaches last ind, will be stopped
    // freq must be greater than largest possible number of symbols
    t.push({ s: -1, f: 25001 });
    var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
    t[0] = { s: -1, f: l.f + r.f, l: l, r: r };
    // efficient algorithm from UZIP.js
    // i0 is lookbehind, i2 is lookahead - after processing two low-freq
    // symbols that combined have high freq, will start processing i2 (high-freq,
    // non-composite) symbols instead
    // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
    while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l: l, r: r };
    }
    var maxSym = t2[0].s;
    for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
            maxSym = t2[i].s;
    }
    // code lengths
    var tr = new u16(maxSym + 1);
    // max bits in tree
    var mbt = ln(t[i1 - 1], tr, 0);
    if (mbt > mb) {
        // more algorithms from UZIP.js
        // TODO: find out how this code works (debt)
        //  ind    debt
        var i = 0, dt = 0;
        //    left            cost
        var lft = mbt - mb, cst = 1 << lft;
        t2.sort(function (a, b) { return tr[b.s] - tr[a.s] || a.f - b.f; });
        for (; i < s; ++i) {
            var i2_1 = t2[i].s;
            if (tr[i2_1] > mb) {
                dt += cst - (1 << (mbt - tr[i2_1]));
                tr[i2_1] = mb;
            }
            else
                break;
        }
        dt >>>= lft;
        while (dt > 0) {
            var i2_2 = t2[i].s;
            if (tr[i2_2] < mb)
                dt -= 1 << (mb - tr[i2_2]++ - 1);
            else
                ++i;
        }
        for (; i >= 0 && dt; --i) {
            var i2_3 = t2[i].s;
            if (tr[i2_3] == mb) {
                --tr[i2_3];
                ++dt;
            }
        }
        mbt = mb;
    }
    return [new u8(tr), mbt];
};
// get the max length and assign length codes
var ln = function (n, l, d) {
    return n.s == -1
        ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
        : (l[n.s] = d);
};
// length codes generation
var lc = function (c) {
    var s = c.length;
    // Note that the semicolon was intentional
    while (s && !c[--s])
        ;
    var cl = new u16(++s);
    //  ind      num         streak
    var cli = 0, cln = c[0], cls = 1;
    var w = function (v) { cl[cli++] = v; };
    for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
            ++cls;
        else {
            if (!cln && cls > 2) {
                for (; cls > 138; cls -= 138)
                    w(32754);
                if (cls > 2) {
                    w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
                    cls = 0;
                }
            }
            else if (cls > 3) {
                w(cln), --cls;
                for (; cls > 6; cls -= 6)
                    w(8304);
                if (cls > 2)
                    w(((cls - 3) << 5) | 8208), cls = 0;
            }
            while (cls--)
                w(cln);
            cls = 1;
            cln = c[i];
        }
    }
    return [cl.subarray(0, cli), s];
};
// calculate the length of output from tree, code lengths
var clen = function (cf, cl) {
    var l = 0;
    for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
    return l;
};
// writes a fixed block
// returns the new bit pos
var wfblk = function (out, pos, dat) {
    // no need to write 00 as type: TypedArray defaults to 0
    var s = dat.length;
    var o = shft(pos + 2);
    out[o] = s & 255;
    out[o + 1] = s >>> 8;
    out[o + 2] = out[o] ^ 255;
    out[o + 3] = out[o + 1] ^ 255;
    for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
    return (o + 4 + s) * 8;
};
// writes a block
var wblk = function (dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
    wbits(out, p++, final);
    ++lf[256];
    var _a = hTree(lf, 15), dlt = _a[0], mlb = _a[1];
    var _b = hTree(df, 15), ddt = _b[0], mdb = _b[1];
    var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
    var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
    var lcfreq = new u16(19);
    for (var i = 0; i < lclt.length; ++i)
        lcfreq[lclt[i] & 31]++;
    for (var i = 0; i < lcdt.length; ++i)
        lcfreq[lcdt[i] & 31]++;
    var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
    var nlcc = 19;
    for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
    var flen = (bl + 5) << 3;
    var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
    var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
    if (flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
    var lm, ll, dm, dl;
    wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
    if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
            wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i = 0; i < clct.length; ++i) {
                var len = clct[i] & 31;
                wbits(out, p, llm[len]), p += lct[len];
                if (len > 15)
                    wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
            }
        }
    }
    else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
    }
    for (var i = 0; i < li; ++i) {
        if (syms[i] > 255) {
            var len = (syms[i] >>> 18) & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
                wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
            var dst = syms[i] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
                wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
        }
        else {
            wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
        }
    }
    wbits16(out, p, lm[256]);
    return p + ll[256];
};
// deflate options (nice << 13) | chain
var deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
// empty
var et = /*#__PURE__*/ new u8(0);
// compresses data into a raw DEFLATE buffer
var dflt = function (dat, lvl, plvl, pre, post, lst) {
    var s = dat.length;
    var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post);
    // writing to this writes to the output buffer
    var w = o.subarray(pre, o.length - post);
    var pos = 0;
    if (!lvl || s < 8) {
        for (var i = 0; i <= s; i += 65535) {
            // end
            var e = i + 65535;
            if (e >= s) {
                // write final block
                w[pos >> 3] = lst;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
    }
    else {
        var opt = deo[lvl - 1];
        var n = opt >>> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        //    prev 2-byte val map    curr 2-byte val map
        var prev = new u16(32768), head = new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function (i) { return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1; };
        // 24576 is an arbitrary number of maximum symbols per block
        // 424 buffer for last block
        var syms = new u32(25000);
        // length/literal freq   distance freq
        var lf = new u16(288), df = new u16(32);
        //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
        var lc_1 = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
        for (; i < s; ++i) {
            // hash value
            // deopt when i > s - 3 - at end, deopt acceptable
            var hv = hsh(i);
            // index mod 32768    previous index mod
            var imod = i & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            // We always should modify head and prev, but only add symbols if
            // this data is not yet processed ("wait" for wait index)
            if (wi <= i) {
                // bytes remaining
                var rem = s - i;
                if ((lc_1 > 7000 || li > 24576) && rem > 423) {
                    pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
                    li = lc_1 = eb = 0, bs = i;
                    for (var j = 0; j < 286; ++j)
                        lf[j] = 0;
                    for (var j = 0; j < 30; ++j)
                        df[j] = 0;
                }
                //  len    dist   chain
                var l = 2, d = 0, ch_1 = c, dif = (imod - pimod) & 32767;
                if (rem > 2 && hv == hsh(i - dif)) {
                    var maxn = Math.min(n, rem) - 1;
                    var maxd = Math.min(32767, i);
                    // max possible length
                    // not capped at dif because decompressors implement "rolling" index population
                    var ml = Math.min(258, rem);
                    while (dif <= maxd && --ch_1 && imod != pimod) {
                        if (dat[i + l] == dat[i + l - dif]) {
                            var nl = 0;
                            for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                                ;
                            if (nl > l) {
                                l = nl, d = dif;
                                // break out early when we reach "nice" (we are satisfied enough)
                                if (nl > maxn)
                                    break;
                                // now, find the rarest 2-byte sequence within this
                                // length of literals and search for that instead.
                                // Much faster than just using the start
                                var mmd = Math.min(dif, nl - 2);
                                var md = 0;
                                for (var j = 0; j < mmd; ++j) {
                                    var ti = (i - dif + j + 32768) & 32767;
                                    var pti = prev[ti];
                                    var cd = (ti - pti + 32768) & 32767;
                                    if (cd > md)
                                        md = cd, pimod = ti;
                                }
                            }
                        }
                        // check the previous match
                        imod = pimod, pimod = prev[imod];
                        dif += (imod - pimod + 32768) & 32767;
                    }
                }
                // d will be nonzero only when a match was found
                if (d) {
                    // store both dist and len data in one Uint32
                    // Make sure this is recognized as a len/dist with 28th bit (2^28)
                    syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
                    var lin = revfl[l] & 31, din = revfd[d] & 31;
                    eb += fleb[lin] + fdeb[din];
                    ++lf[257 + lin];
                    ++df[din];
                    wi = i + l;
                    ++lc_1;
                }
                else {
                    syms[li++] = dat[i];
                    ++lf[dat[i]];
                }
            }
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        // this is the easiest way to avoid needing to maintain state
        if (!lst && pos & 7)
            pos = wfblk(w, pos + 1, et);
    }
    return slc(o, 0, pre + shft(pos) + post);
};
// CRC32 table
var crct = /*#__PURE__*/ (function () {
    var t = new Int32Array(256);
    for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
            c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
    }
    return t;
})();
// CRC32
var crc = function () {
    var c = -1;
    return {
        p: function (d) {
            // closures have awful performance
            var cr = c;
            for (var i = 0; i < d.length; ++i)
                cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
            c = cr;
        },
        d: function () { return ~c; }
    };
};
// deflate with opts
var dopt = function (dat, opt, pre, post, st) {
    return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st);
};
// write bytes
var wbytes = function (d, b, v) {
    for (; v; ++b)
        d[b] = v, v >>>= 8;
};
// gzip header
var gzh = function (c, o) {
    var fn = o.filename;
    c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
    if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1000));
    if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
            c[i + 10] = fn.charCodeAt(i);
    }
};
// gzip footer: -8 to -4 = CRC, -4 to -0 is length
// gzip start
var gzs = function (d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, 'invalid gzip data');
    var flg = d[3];
    var st = 10;
    if (flg & 4)
        st += d[10] | (d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
    return st + (flg & 2);
};
// gzip length
var gzl = function (d) {
    var l = d.length;
    return ((d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0;
};
// gzip header length
var gzhl = function (o) { return 10 + ((o.filename && (o.filename.length + 1)) || 0); };
/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
function gzipSync(data, opts) {
    if (!opts)
        opts = {};
    var c = crc(), l = data.length;
    c.p(data);
    var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
    return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
function gunzipSync(data, out) {
    return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }

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

var version = "1.0.8";

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

var md5 = createCommonjsModule(function (module) {
(function ($) {

  /**
   * Add integers, wrapping at 2^32.
   * This uses 16-bit operations internally to work around bugs in interpreters.
   *
   * @param {number} x First integer
   * @param {number} y Second integer
   * @returns {number} Sum
   */
  function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff)
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   *
   * @param {number} num 32-bit number
   * @param {number} cnt Rotation count
   * @returns {number} Rotated number
   */
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} q q
   * @param {number} a a
   * @param {number} b b
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /**
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   *
   * @param {Array} x Array of little-endian words
   * @param {number} len Bit length
   * @returns {Array<number>} MD5 Array
   */
  function binlMD5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d]
  }

  /**
   * Convert an array of little-endian words to a string
   *
   * @param {Array<number>} input MD5 Array
   * @returns {string} MD5 string
   */
  function binl2rstr(input) {
    var i;
    var output = '';
    var length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
    }
    return output
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   *
   * @param {string} input Raw input string
   * @returns {Array<number>} Array of little-endian words
   */
  function rstr2binl(input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    var length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    }
    return output
  }

  /**
   * Calculate the MD5 of a raw string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /**
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */
  function rstrHMACMD5(key, data) {
    var i;
    var bkey = rstr2binl(key);
    var ipad = [];
    var opad = [];
    var hash;
    ipad[15] = opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /**
   * Convert a raw string to a hex string
   *
   * @param {string} input Raw input string
   * @returns {string} Hex encoded string
   */
  function rstr2hex(input) {
    var hexTab = '0123456789abcdef';
    var output = '';
    var x;
    var i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output
  }

  /**
   * Encode a string as UTF-8
   *
   * @param {string} input Input string
   * @returns {string} UTF8 string
   */
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input))
  }

  /**
   * Encodes input string as raw MD5 string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  /**
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */
  function hexMD5(s) {
    return rstr2hex(rawMD5(s))
  }
  /**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  /**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  /**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */
  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if ( module.exports) {
    module.exports = md5;
  } else {
    $.md5 = md5;
  }
})(commonjsGlobal);
});

var Tokenizer = /*#__PURE__*/function () {
  function Tokenizer() {
    this.loader = new Loader();
  }
  var _proto = Tokenizer.prototype;
  _proto.load = function load() {
    try {
      var _this = this;
      for (var _len = arguments.length, files = new Array(_len), _key = 0; _key < _len; _key++) {
        files[_key] = arguments[_key];
      }
      if (files.some(function (file) {
        return typeof file !== "string";
      })) {
        throw new Error("Each argument passed to load must be a string.");
      }
      var sortedFiles = files.sort();
      return Promise.resolve(Promise.all(sortedFiles.map(_this.loader.load))).then(function (allData) {
        var header = _this.tokenize(Object.fromEntries(allData.map(function (data, index) {
          return [sortedFiles[index], data];
        })));
        var textEncoder = new TextEncoder();
        header.originalDataSize = textEncoder.encode(JSON.stringify(allData)).byteLength;
        return header;
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
    Object.entries(items).forEach(function (_ref) {
      var file = _ref[0],
        value = _ref[1];
      header.files[file] = {
        nameToken: _this2.tokenizeHelper(file, header.registry, counter, "header"),
        token: _this2.tokenizeHelper(value, header.registry, counter, file)
      };
    });
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
  _proto.loadAndCompress = function loadAndCompress(files) {
    try {
      var _this = this;
      var tokenizer = new Tokenizer();
      return Promise.resolve(tokenizer.load.apply(tokenizer, files)).then(function (header) {
        var reducer = new Reducer();
        var dataStore = reducer.reduce(header);
        return _this.compressDataStore(dataStore);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  _proto.compress = function compress(data) {
    var tokenizer = new Tokenizer();
    var header = tokenizer.tokenize(data);
    var reducer = new Reducer();
    var dataStore = reducer.reduce(header);
    return this.compressDataStore(dataStore);
  };
  _proto.loadAndExpand = function loadAndExpand(file) {
    try {
      var _this2 = this;
      return Promise.resolve(fetch(file)).then(function (response) {
        return Promise.resolve(response.arrayBuffer()).then(function (arrayBuffer) {
          return _this2.expand(arrayBuffer);
        });
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
    var streamDataView = new sdv.StreamDataView();
    var tokenEncoder = new TokenEncoder(streamDataView);
    tokenEncoder.encodeTokens(dataStore.headerTokens, true);
    tokenEncoder.encodeNumberArray(dataStore.files);
    var finalStream = new sdv.StreamDataView();
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
    console.log("HEADER length", headerBuffer.byteLength);
    for (var index = 0; index < dataStore.files.length; index++) {
      var subStream = new sdv.StreamDataView();
      var subEncoder = new TokenEncoder(subStream);
      subEncoder.encodeTokens(dataStore.getDataTokens(index), false);
      var subBuffer = this.applyEncoders(subStream.getBuffer(), encoders);
      finalStream.setNextUint32(subBuffer.byteLength);
      console.log("SUBBUFFER length", index, subBuffer.byteLength);
      finalStream.setNextBytes(subBuffer);
    }
    finalStream.setNextUint32(0);
    finalStream.setNextUint32((_dataStore$originalDa = dataStore.originalDataSize) != null ? _dataStore$originalDa : 0);
    return finalStream.getBuffer();
  };
  _proto.expandDataStore = function expandDataStore(arrayBuffer) {
    var _this3 = this;
    var compressedSize = arrayBuffer.byteLength;
    var input = arrayBuffer;
    var globalStream = new sdv.StreamDataView(input);
    var version = globalStream.getNextString(globalStream.getNextUint8());
    var decoders = [];
    do {
      var encoderEnum = globalStream.getNextUint8();
      if (encoderEnum === EncoderEnum.NONE) {
        break;
      }
      var decoder = ENCODERS[encoderEnum]();
      if (decoder) {
        decoders.push(decoder);
      }
    } while (globalStream.getOffset() < globalStream.getLength());
    var headerByteLength = globalStream.getNextUint32();
    var headerBuffer = this.applyDecoders(globalStream.getNextBytes(headerByteLength).buffer, decoders);
    var headerTokenEncoder = new TokenEncoder(new sdv.StreamDataView(headerBuffer));
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
      var streamDataView = new sdv.StreamDataView(subBuffer);
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
  return Compressor;
}();

var index = {
  Loader: Loader,
  Compressor: Compressor,
  TokenEncoder: TokenEncoder
};

export default index;
//# sourceMappingURL=index.modern.js.map
