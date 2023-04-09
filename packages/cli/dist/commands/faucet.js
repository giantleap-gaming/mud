"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// ../../node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "../../node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// ../../node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "../../node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    var base64 = exports2;
    base64.length = function length(string) {
      var p = string.length;
      if (!p)
        return 0;
      var n = 0;
      while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
      return Math.ceil(string.length * 3) / 4 - n;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base64.encode = function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base64.decode = function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base64.test = function test(string) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
  }
});

// ../../node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "../../node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// ../../node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "../../node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined")
        (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
      else
        (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
      if (typeof Float64Array !== "undefined")
        (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
      else
        (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
      return exports3;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// ../../node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "../../node_modules/@protobufjs/inquire/index.js"(exports, module) {
    "use strict";
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e) {
      }
      return null;
    }
  }
});

// ../../node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "../../node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    var utf8 = exports2;
    utf8.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf8.read = function utf8_read(buffer, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t;
      while (start < end) {
        t = buffer[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf8.write = function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// ../../node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "../../node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    module2.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
  }
});

// ../services/node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "../services/node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber2(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber2(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// ../services/node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "../services/node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : [];
    util.emptyObject = Object.freeze ? Object.freeze({}) : {};
    util.isInteger = Number.isInteger || function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject(value) {
      return value && typeof value === "object";
    };
    util.isset = util.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = function() {
      try {
        var Buffer2 = util.inquire("buffer").Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : null;
      } catch (e) {
        return null;
      }
    }();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || util.inquire("long");
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src, ifNotSet) {
      for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src[keys[i]];
      return dst;
    }
    util.merge = merge;
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          configurable: true
        },
        toString: {
          value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      };
    };
  }
});

// ../services/node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "../services/node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// ../services/node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "../services/node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else
          for (var i = 0; i < val.length; )
            buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// ../services/node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "../services/node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    } : function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        })(buffer);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
    Reader.prototype.uint32 = function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf8.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : "toNumber";
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// ../services/node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "../services/node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// ../services/node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "../services/node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(true);
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// ../services/node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "../services/node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// ../services/node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "../services/node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    module2.exports = {};
  }
});

// ../services/node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "../services/node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    var protobuf = exports2;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  }
});

// ../services/node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "../services/node_modules/protobufjs/minimal.js"(exports2, module2) {
    "use strict";
    module2.exports = require_index_minimal();
  }
});

// ../../node_modules/nice-grpc-common/lib/Metadata.js
var require_Metadata = __commonJS({
  "../../node_modules/nice-grpc-common/lib/Metadata.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Metadata = void 0;
    exports2.Metadata = function Metadata(init) {
      const data = /* @__PURE__ */ new Map();
      const metadata = {
        set(key, value) {
          key = normalizeKey(key);
          if (Array.isArray(value)) {
            if (value.length === 0) {
              data.delete(key);
            } else {
              for (const item of value) {
                validate(key, item);
              }
              data.set(key, key.endsWith("-bin") ? value : [value.join(", ")]);
            }
          } else {
            validate(key, value);
            data.set(key, [value]);
          }
          return metadata;
        },
        append(key, value) {
          key = normalizeKey(key);
          validate(key, value);
          let values = data.get(key);
          if (values == null) {
            values = [];
            data.set(key, values);
          }
          values.push(value);
          if (!key.endsWith("-bin")) {
            data.set(key, [values.join(", ")]);
          }
          return metadata;
        },
        delete(key) {
          key = normalizeKey(key);
          data.delete(key);
        },
        get(key) {
          var _a;
          key = normalizeKey(key);
          return (_a = data.get(key)) === null || _a === void 0 ? void 0 : _a[0];
        },
        getAll(key) {
          var _a;
          key = normalizeKey(key);
          return (_a = data.get(key)) !== null && _a !== void 0 ? _a : [];
        },
        has(key) {
          key = normalizeKey(key);
          return data.has(key);
        },
        [Symbol.iterator]() {
          return data[Symbol.iterator]();
        }
      };
      if (init != null) {
        const entries = isIterable(init) ? init : Object.entries(init);
        for (const [key, value] of entries) {
          metadata.set(key, value);
        }
      }
      return metadata;
    };
    function normalizeKey(key) {
      return key.toLowerCase();
    }
    function validate(key, value) {
      if (!/^[0-9a-z_.-]+$/.test(key)) {
        throw new Error(`Metadata key '${key}' contains illegal characters`);
      }
      if (key.endsWith("-bin")) {
        if (!(value instanceof Uint8Array)) {
          throw new Error(`Metadata key '${key}' ends with '-bin', thus it must have binary value`);
        }
      } else {
        if (typeof value !== "string") {
          throw new Error(`Metadata key '${key}' doesn't end with '-bin', thus it must have string value`);
        }
        if (!/^[ -~]*$/.test(value)) {
          throw new Error(`Metadata value '${value}' of key '${key}' contains illegal characters`);
        }
      }
    }
    function isIterable(value) {
      return Symbol.iterator in value;
    }
  }
});

// ../../node_modules/nice-grpc-common/lib/Status.js
var require_Status = __commonJS({
  "../../node_modules/nice-grpc-common/lib/Status.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Status = void 0;
    var Status;
    (function(Status2) {
      Status2[Status2["OK"] = 0] = "OK";
      Status2[Status2["CANCELLED"] = 1] = "CANCELLED";
      Status2[Status2["UNKNOWN"] = 2] = "UNKNOWN";
      Status2[Status2["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
      Status2[Status2["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
      Status2[Status2["NOT_FOUND"] = 5] = "NOT_FOUND";
      Status2[Status2["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
      Status2[Status2["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
      Status2[Status2["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
      Status2[Status2["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
      Status2[Status2["ABORTED"] = 10] = "ABORTED";
      Status2[Status2["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
      Status2[Status2["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
      Status2[Status2["INTERNAL"] = 13] = "INTERNAL";
      Status2[Status2["UNAVAILABLE"] = 14] = "UNAVAILABLE";
      Status2[Status2["DATA_LOSS"] = 15] = "DATA_LOSS";
      Status2[Status2["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
    })(Status = exports2.Status || (exports2.Status = {}));
  }
});

// ../../node_modules/nice-grpc-common/lib/MethodDescriptor.js
var require_MethodDescriptor = __commonJS({
  "../../node_modules/nice-grpc-common/lib/MethodDescriptor.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../../node_modules/nice-grpc-common/lib/client/CallOptions.js
var require_CallOptions = __commonJS({
  "../../node_modules/nice-grpc-common/lib/client/CallOptions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../../node_modules/nice-grpc-common/lib/client/ClientMiddleware.js
var require_ClientMiddleware = __commonJS({
  "../../node_modules/nice-grpc-common/lib/client/ClientMiddleware.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../../node_modules/nice-grpc-common/lib/client/composeClientMiddleware.js
var require_composeClientMiddleware = __commonJS({
  "../../node_modules/nice-grpc-common/lib/client/composeClientMiddleware.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.composeClientMiddleware = void 0;
    function composeClientMiddleware(middleware1, middleware2) {
      return (call, options) => {
        return middleware2(Object.assign(Object.assign({}, call), { next: (request, options2) => {
          return middleware1(Object.assign(Object.assign({}, call), { request }), options2);
        } }), options);
      };
    }
    exports2.composeClientMiddleware = composeClientMiddleware;
  }
});

// ../../node_modules/ts-error/lib/helpers.js
var require_helpers = __commonJS({
  "../../node_modules/ts-error/lib/helpers.js"(exports2) {
    "use strict";
    exports2.__esModule = void 0;
    exports2.__esModule = true;
    var objectSetPrototypeOfIsDefined = typeof Object.setPrototypeOf === "function";
    var objectGetPrototypeOfIsDefined = typeof Object.getPrototypeOf === "function";
    var objectDefinePropertyIsDefined = typeof Object.defineProperty === "function";
    var objectCreateIsDefined = typeof Object.create === "function";
    var objectHasOwnPropertyIsDefined = typeof Object.prototype.hasOwnProperty === "function";
    var setPrototypeOf = function setPrototypeOf2(target, prototype) {
      if (objectSetPrototypeOfIsDefined) {
        Object.setPrototypeOf(target, prototype);
      } else {
        target.__proto__ = prototype;
      }
    };
    exports2.setPrototypeOf = setPrototypeOf;
    var getPrototypeOf = function getPrototypeOf2(target) {
      if (objectGetPrototypeOfIsDefined) {
        return Object.getPrototypeOf(target);
      } else {
        return target.__proto__ || target.prototype;
      }
    };
    exports2.getPrototypeOf = getPrototypeOf;
    var ie8ObjectDefinePropertyBug = false;
    var defineProperty = function defineProperty2(target, name, propertyDescriptor) {
      if (objectDefinePropertyIsDefined && !ie8ObjectDefinePropertyBug) {
        try {
          Object.defineProperty(target, name, propertyDescriptor);
        } catch (e) {
          ie8ObjectDefinePropertyBug = true;
          defineProperty2(target, name, propertyDescriptor);
        }
      } else {
        target[name] = propertyDescriptor.value;
      }
    };
    exports2.defineProperty = defineProperty;
    var hasOwnProperty = function hasOwnProperty2(target, name) {
      if (objectHasOwnPropertyIsDefined) {
        return target.hasOwnProperty(target, name);
      } else {
        return target[name] === void 0;
      }
    };
    exports2.hasOwnProperty = hasOwnProperty;
    var objectCreate = function objectCreate2(prototype, propertyDescriptors) {
      if (objectCreateIsDefined) {
        return Object.create(prototype, propertyDescriptors);
      } else {
        var F = function F2() {
        };
        F.prototype = prototype;
        var result = new F();
        if (typeof propertyDescriptors === "undefined") {
          return result;
        }
        if (typeof propertyDescriptors === "null") {
          throw new Error("PropertyDescriptors must not be null.");
        }
        if (typeof propertyDescriptors === "object") {
          for (var key in propertyDescriptors) {
            if (hasOwnProperty(propertyDescriptors, key)) {
              result[key] = propertyDescriptors[key].value;
            }
          }
        }
        return result;
      }
    };
    exports2.objectCreate = objectCreate;
  }
});

// ../../node_modules/ts-error/lib/cjs.js
var require_cjs = __commonJS({
  "../../node_modules/ts-error/lib/cjs.js"(exports2) {
    "use strict";
    exports2.__esModule = void 0;
    exports2.__esModule = true;
    var helpers = require_helpers();
    var setPrototypeOf = helpers.setPrototypeOf;
    var getPrototypeOf = helpers.getPrototypeOf;
    var defineProperty = helpers.defineProperty;
    var objectCreate = helpers.objectCreate;
    var uglyErrorPrinting = new Error().toString() === "[object Error]";
    var extendableErrorName = "";
    function ExtendableError(message) {
      var originalConstructor = this.constructor;
      var constructorName = originalConstructor.name || function() {
        var constructorNameMatch = originalConstructor.toString().match(/^function\s*([^\s(]+)/);
        return constructorNameMatch === null ? extendableErrorName ? extendableErrorName : "Error" : constructorNameMatch[1];
      }();
      var constructorNameIsError = constructorName === "Error";
      var name = constructorNameIsError ? extendableErrorName : constructorName;
      var instance = Error.apply(this, arguments);
      setPrototypeOf(instance, getPrototypeOf(this));
      if (!(instance instanceof originalConstructor) || !(instance instanceof ExtendableError)) {
        var instance = this;
        Error.apply(this, arguments);
        defineProperty(instance, "message", {
          configurable: true,
          enumerable: false,
          value: message,
          writable: true
        });
      }
      defineProperty(instance, "name", {
        configurable: true,
        enumerable: false,
        value: name,
        writable: true
      });
      if (Error.captureStackTrace) {
        Error.captureStackTrace(
          instance,
          constructorNameIsError ? ExtendableError : originalConstructor
        );
      }
      if (instance.stack === void 0) {
        var err = new Error(message);
        err.name = instance.name;
        instance.stack = err.stack;
      }
      if (uglyErrorPrinting) {
        defineProperty(instance, "toString", {
          configurable: true,
          enumerable: false,
          value: function toString2() {
            return (this.name || "Error") + (typeof this.message === "undefined" ? "" : ": " + this.message);
          },
          writable: true
        });
      }
      return instance;
    }
    extendableErrorName = ExtendableError.name || "ExtendableError";
    ExtendableError.prototype = objectCreate(Error.prototype, {
      constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    exports2.ExtendableError = ExtendableError;
    exports2["default"] = exports2.ExtendableError;
  }
});

// ../../node_modules/nice-grpc-common/lib/client/ClientError.js
var require_ClientError = __commonJS({
  "../../node_modules/nice-grpc-common/lib/client/ClientError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ClientError = void 0;
    var ts_error_1 = require_cjs();
    var Status_1 = require_Status();
    var ClientError = class extends ts_error_1.ExtendableError {
      constructor(path, code, details) {
        super(`${path} ${Status_1.Status[code]}: ${details}`);
        this.path = path;
        this.code = code;
        this.details = details;
        this.name = "ClientError";
        Object.defineProperty(this, "@@nice-grpc", {
          value: true
        });
        Object.defineProperty(this, "@@nice-grpc:ClientError", {
          value: true
        });
      }
      static [Symbol.hasInstance](instance) {
        if (this !== ClientError) {
          return this.prototype.isPrototypeOf(instance);
        }
        return typeof instance === "object" && instance !== null && (instance.constructor === ClientError || instance["@@nice-grpc:ClientError"] === true || instance.name === "ClientError" && instance["@@nice-grpc"] === true);
      }
    };
    exports2.ClientError = ClientError;
  }
});

// ../../node_modules/nice-grpc-common/lib/server/CallContext.js
var require_CallContext = __commonJS({
  "../../node_modules/nice-grpc-common/lib/server/CallContext.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../../node_modules/nice-grpc-common/lib/server/ServerMiddleware.js
var require_ServerMiddleware = __commonJS({
  "../../node_modules/nice-grpc-common/lib/server/ServerMiddleware.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../../node_modules/nice-grpc-common/lib/server/composeServerMiddleware.js
var require_composeServerMiddleware = __commonJS({
  "../../node_modules/nice-grpc-common/lib/server/composeServerMiddleware.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.composeServerMiddleware = void 0;
    function composeServerMiddleware(middleware1, middleware2) {
      return (call, context) => {
        return middleware1(Object.assign(Object.assign({}, call), { next: (request, context1) => {
          return middleware2(Object.assign(Object.assign({}, call), { request }), context1);
        } }), context);
      };
    }
    exports2.composeServerMiddleware = composeServerMiddleware;
  }
});

// ../../node_modules/nice-grpc-common/lib/server/ServerError.js
var require_ServerError = __commonJS({
  "../../node_modules/nice-grpc-common/lib/server/ServerError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ServerError = void 0;
    var ts_error_1 = require_cjs();
    var Status_1 = require_Status();
    var ServerError = class extends ts_error_1.ExtendableError {
      constructor(code, details) {
        super(`${Status_1.Status[code]}: ${details}`);
        this.code = code;
        this.details = details;
        this.name = "ServerError";
        Object.defineProperty(this, "@@nice-grpc", {
          value: true
        });
        Object.defineProperty(this, "@@nice-grpc:ServerError", {
          value: true
        });
      }
      static [Symbol.hasInstance](instance) {
        if (this !== ServerError) {
          return this.prototype.isPrototypeOf(instance);
        }
        return typeof instance === "object" && instance !== null && (instance.constructor === ServerError || instance["@@nice-grpc:ServerError"] === true || instance.name === "ServerError" && instance["@@nice-grpc"] === true);
      }
    };
    exports2.ServerError = ServerError;
  }
});

// ../../node_modules/nice-grpc-common/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/nice-grpc-common/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m, k);
      if (!desc2 || ("get" in desc2 ? !m.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_Metadata(), exports2);
    __exportStar(require_Status(), exports2);
    __exportStar(require_MethodDescriptor(), exports2);
    __exportStar(require_CallOptions(), exports2);
    __exportStar(require_ClientMiddleware(), exports2);
    __exportStar(require_composeClientMiddleware(), exports2);
    __exportStar(require_ClientError(), exports2);
    __exportStar(require_CallContext(), exports2);
    __exportStar(require_ServerMiddleware(), exports2);
    __exportStar(require_composeServerMiddleware(), exports2);
    __exportStar(require_ServerError(), exports2);
  }
});

// node_modules/nice-grpc-web/lib/service-definitions/grpc-web.js
var require_grpc_web = __commonJS({
  "node_modules/nice-grpc-web/lib/service-definitions/grpc-web.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isGrpcWebServiceDefinition = exports2.fromGrpcWebServiceDefinition = void 0;
    function fromGrpcWebServiceDefinition(definition) {
      const result = {};
      for (const [key, value] of Object.entries(definition)) {
        if (key === "serviceName") {
          continue;
        }
        const method = value;
        result[uncapitalize(key)] = {
          path: `/${definition.serviceName}/${key}`,
          requestStream: method.requestStream,
          responseStream: method.responseStream,
          requestDeserialize: method.requestType.deserializeBinary,
          requestSerialize: (value2) => value2.serializeBinary(),
          responseDeserialize: method.responseType.deserializeBinary,
          responseSerialize: (value2) => value2.serializeBinary(),
          options: {}
        };
      }
      return result;
    }
    exports2.fromGrpcWebServiceDefinition = fromGrpcWebServiceDefinition;
    function isGrpcWebServiceDefinition(definition) {
      return "prototype" in definition;
    }
    exports2.isGrpcWebServiceDefinition = isGrpcWebServiceDefinition;
    function uncapitalize(value) {
      if (value.length === 0) {
        return value;
      }
      return value[0].toLowerCase() + value.slice(1);
    }
  }
});

// node_modules/nice-grpc-web/lib/service-definitions/ts-proto.js
var require_ts_proto = __commonJS({
  "node_modules/nice-grpc-web/lib/service-definitions/ts-proto.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isTsProtoServiceDefinition = exports2.fromTsProtoServiceDefinition = void 0;
    function fromTsProtoServiceDefinition(definition) {
      const result = {};
      for (const [key, method] of Object.entries(definition.methods)) {
        const requestEncode = method.requestType.encode;
        const requestFromPartial = method.requestType.fromPartial;
        const responseEncode = method.responseType.encode;
        const responseFromPartial = method.responseType.fromPartial;
        result[key] = {
          path: `/${definition.fullName}/${method.name}`,
          requestStream: method.requestStream,
          responseStream: method.responseStream,
          requestDeserialize: method.requestType.decode,
          requestSerialize: requestFromPartial != null ? (value) => requestEncode(requestFromPartial(value)).finish() : (value) => requestEncode(value).finish(),
          responseDeserialize: method.responseType.decode,
          responseSerialize: responseFromPartial != null ? (value) => responseEncode(responseFromPartial(value)).finish() : (value) => responseEncode(value).finish(),
          options: method.options
        };
      }
      return result;
    }
    exports2.fromTsProtoServiceDefinition = fromTsProtoServiceDefinition;
    function isTsProtoServiceDefinition(definition) {
      return "name" in definition && "fullName" in definition && "methods" in definition;
    }
    exports2.isTsProtoServiceDefinition = isTsProtoServiceDefinition;
  }
});

// node_modules/nice-grpc-web/lib/service-definitions/index.js
var require_service_definitions = __commonJS({
  "node_modules/nice-grpc-web/lib/service-definitions/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toGrpcWebMethodDefinition = exports2.normalizeServiceDefinition = void 0;
    var grpc_web_1 = require_grpc_web();
    var ts_proto_1 = require_ts_proto();
    function normalizeServiceDefinition(definition) {
      if ((0, grpc_web_1.isGrpcWebServiceDefinition)(definition)) {
        return (0, grpc_web_1.fromGrpcWebServiceDefinition)(definition);
      } else if ((0, ts_proto_1.isTsProtoServiceDefinition)(definition)) {
        return (0, ts_proto_1.fromTsProtoServiceDefinition)(definition);
      } else {
        return definition;
      }
    }
    exports2.normalizeServiceDefinition = normalizeServiceDefinition;
    function toGrpcWebMethodDefinition(definition) {
      const [, serviceName, methodName] = definition.path.split("/");
      return {
        service: {
          serviceName
        },
        methodName,
        requestStream: definition.requestStream,
        responseStream: definition.responseStream,
        requestType: class {
          constructor() {
            throw new Error("Unexpected instantiation");
          }
          static deserializeBinary(bytes) {
            return definition.requestDeserialize(bytes);
          }
        },
        responseType: class {
          constructor() {
            throw new Error("Unexpected instantiation");
          }
          static deserializeBinary(bytes) {
            return definition.responseDeserialize(bytes);
          }
        }
      };
    }
    exports2.toGrpcWebMethodDefinition = toGrpcWebMethodDefinition;
  }
});

// node_modules/nice-grpc-web/lib/client/channel.js
var require_channel = __commonJS({
  "node_modules/nice-grpc-web/lib/client/channel.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createChannel = void 0;
    function createChannel2(address, transport) {
      return { address, transport };
    }
    exports2.createChannel = createChannel2;
  }
});

// ../../node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.js
var require_grpc_web_client = __commonJS({
  "../../node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.js"(exports2) {
    !function(e, t) {
      for (var r in t)
        e[r] = t[r];
      t.__esModule && Object.defineProperty(e, "__esModule", { value: true });
    }(exports2, function() {
      var e = { 418: function(e2, t2) {
        !function(e3, t3) {
          for (var r in t3)
            e3[r] = t3[r];
        }(t2, function(e3) {
          var t3 = {};
          function r(n) {
            if (t3[n])
              return t3[n].exports;
            var o = t3[n] = { i: n, l: false, exports: {} };
            return e3[n].call(o.exports, o, o.exports, r), o.l = true, o.exports;
          }
          return r.m = e3, r.c = t3, r.i = function(e4) {
            return e4;
          }, r.d = function(e4, t4, n) {
            r.o(e4, t4) || Object.defineProperty(e4, t4, { configurable: false, enumerable: true, get: n });
          }, r.n = function(e4) {
            var t4 = e4 && e4.__esModule ? function() {
              return e4.default;
            } : function() {
              return e4;
            };
            return r.d(t4, "a", t4), t4;
          }, r.o = function(e4, t4) {
            return Object.prototype.hasOwnProperty.call(e4, t4);
          }, r.p = "", r(r.s = 1);
        }([function(e3, t3, r) {
          "use strict";
          Object.defineProperty(t3, "__esModule", { value: true });
          var n = r(3), o = function() {
            function e4(e5, t4) {
              void 0 === e5 && (e5 = {}), void 0 === t4 && (t4 = { splitValues: false });
              var r2, o2 = this;
              this.headersMap = {}, e5 && ("undefined" != typeof Headers && e5 instanceof Headers ? n.getHeaderKeys(e5).forEach(function(r3) {
                n.getHeaderValues(e5, r3).forEach(function(e6) {
                  t4.splitValues ? o2.append(r3, n.splitHeaderValue(e6)) : o2.append(r3, e6);
                });
              }) : "object" == typeof (r2 = e5) && "object" == typeof r2.headersMap && "function" == typeof r2.forEach ? e5.forEach(function(e6, t5) {
                o2.append(e6, t5);
              }) : "undefined" != typeof Map && e5 instanceof Map ? e5.forEach(function(e6, t5) {
                o2.append(t5, e6);
              }) : "string" == typeof e5 ? this.appendFromString(e5) : "object" == typeof e5 && Object.getOwnPropertyNames(e5).forEach(function(t5) {
                var r3 = e5[t5];
                Array.isArray(r3) ? r3.forEach(function(e6) {
                  o2.append(t5, e6);
                }) : o2.append(t5, r3);
              }));
            }
            return e4.prototype.appendFromString = function(e5) {
              for (var t4 = e5.split("\r\n"), r2 = 0; r2 < t4.length; r2++) {
                var n2 = t4[r2], o2 = n2.indexOf(":");
                if (o2 > 0) {
                  var s = n2.substring(0, o2).trim(), i = n2.substring(o2 + 1).trim();
                  this.append(s, i);
                }
              }
            }, e4.prototype.delete = function(e5, t4) {
              var r2 = n.normalizeName(e5);
              if (void 0 === t4)
                delete this.headersMap[r2];
              else {
                var o2 = this.headersMap[r2];
                if (o2) {
                  var s = o2.indexOf(t4);
                  s >= 0 && o2.splice(s, 1), 0 === o2.length && delete this.headersMap[r2];
                }
              }
            }, e4.prototype.append = function(e5, t4) {
              var r2 = this, o2 = n.normalizeName(e5);
              Array.isArray(this.headersMap[o2]) || (this.headersMap[o2] = []), Array.isArray(t4) ? t4.forEach(function(e6) {
                r2.headersMap[o2].push(n.normalizeValue(e6));
              }) : this.headersMap[o2].push(n.normalizeValue(t4));
            }, e4.prototype.set = function(e5, t4) {
              var r2 = n.normalizeName(e5);
              if (Array.isArray(t4)) {
                var o2 = [];
                t4.forEach(function(e6) {
                  o2.push(n.normalizeValue(e6));
                }), this.headersMap[r2] = o2;
              } else
                this.headersMap[r2] = [n.normalizeValue(t4)];
            }, e4.prototype.has = function(e5, t4) {
              var r2 = this.headersMap[n.normalizeName(e5)];
              if (!Array.isArray(r2))
                return false;
              if (void 0 !== t4) {
                var o2 = n.normalizeValue(t4);
                return r2.indexOf(o2) >= 0;
              }
              return true;
            }, e4.prototype.get = function(e5) {
              var t4 = this.headersMap[n.normalizeName(e5)];
              return void 0 !== t4 ? t4.concat() : [];
            }, e4.prototype.forEach = function(e5) {
              var t4 = this;
              Object.getOwnPropertyNames(this.headersMap).forEach(function(r2) {
                e5(r2, t4.headersMap[r2]);
              }, this);
            }, e4.prototype.toHeaders = function() {
              if ("undefined" != typeof Headers) {
                var e5 = new Headers();
                return this.forEach(function(t4, r2) {
                  r2.forEach(function(r3) {
                    e5.append(t4, r3);
                  });
                }), e5;
              }
              throw new Error("Headers class is not defined");
            }, e4;
          }();
          t3.BrowserHeaders = o;
        }, function(e3, t3, r) {
          "use strict";
          Object.defineProperty(t3, "__esModule", { value: true });
          var n = r(0);
          t3.BrowserHeaders = n.BrowserHeaders;
        }, function(e3, t3, r) {
          "use strict";
          Object.defineProperty(t3, "__esModule", { value: true }), t3.iterateHeaders = function(e4, t4) {
            for (var r2 = e4[Symbol.iterator](), n = r2.next(); !n.done; )
              t4(n.value[0]), n = r2.next();
          }, t3.iterateHeadersKeys = function(e4, t4) {
            for (var r2 = e4.keys(), n = r2.next(); !n.done; )
              t4(n.value), n = r2.next();
          };
        }, function(e3, t3, r) {
          "use strict";
          Object.defineProperty(t3, "__esModule", { value: true });
          var n = r(2);
          t3.normalizeName = function(e4) {
            if ("string" != typeof e4 && (e4 = String(e4)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e4))
              throw new TypeError("Invalid character in header field name");
            return e4.toLowerCase();
          }, t3.normalizeValue = function(e4) {
            return "string" != typeof e4 && (e4 = String(e4)), e4;
          }, t3.getHeaderValues = function(e4, t4) {
            var r2 = e4;
            if (r2 instanceof Headers && r2.getAll)
              return r2.getAll(t4);
            var n2 = r2.get(t4);
            return n2 && "string" == typeof n2 ? [n2] : n2;
          }, t3.getHeaderKeys = function(e4) {
            var t4 = e4, r2 = {}, o = [];
            return t4.keys ? n.iterateHeadersKeys(t4, function(e5) {
              r2[e5] || (r2[e5] = true, o.push(e5));
            }) : t4.forEach ? t4.forEach(function(e5, t5) {
              r2[t5] || (r2[t5] = true, o.push(t5));
            }) : n.iterateHeaders(t4, function(e5) {
              var t5 = e5[0];
              r2[t5] || (r2[t5] = true, o.push(t5));
            }), o;
          }, t3.splitHeaderValue = function(e4) {
            var t4 = [];
            return e4.split(", ").forEach(function(e5) {
              e5.split(",").forEach(function(e6) {
                t4.push(e6);
              });
            }), t4;
          };
        }]));
      }, 617: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.ChunkParser = t2.ChunkType = t2.encodeASCII = t2.decodeASCII = void 0;
        var n, o = r(65);
        function s(e3) {
          return 9 === (t3 = e3) || 10 === t3 || 13 === t3 || e3 >= 32 && e3 <= 126;
          var t3;
        }
        function i(e3) {
          for (var t3 = 0; t3 !== e3.length; ++t3)
            if (!s(e3[t3]))
              throw new Error("Metadata is not valid (printable) ASCII");
          return String.fromCharCode.apply(String, Array.prototype.slice.call(e3));
        }
        function a(e3) {
          return 128 == (128 & e3.getUint8(0));
        }
        function u(e3) {
          return e3.getUint32(1, false);
        }
        function d(e3, t3, r2) {
          return e3.byteLength - t3 >= r2;
        }
        function c(e3, t3, r2) {
          if (e3.slice)
            return e3.slice(t3, r2);
          var n2 = e3.length;
          void 0 !== r2 && (n2 = r2);
          for (var o2 = new Uint8Array(n2 - t3), s2 = 0, i2 = t3; i2 < n2; i2++)
            o2[s2++] = e3[i2];
          return o2;
        }
        t2.decodeASCII = i, t2.encodeASCII = function(e3) {
          for (var t3 = new Uint8Array(e3.length), r2 = 0; r2 !== e3.length; ++r2) {
            var n2 = e3.charCodeAt(r2);
            if (!s(n2))
              throw new Error("Metadata contains invalid ASCII");
            t3[r2] = n2;
          }
          return t3;
        }, function(e3) {
          e3[e3.MESSAGE = 1] = "MESSAGE", e3[e3.TRAILERS = 2] = "TRAILERS";
        }(n = t2.ChunkType || (t2.ChunkType = {}));
        var p = function() {
          function e3() {
            this.buffer = null, this.position = 0;
          }
          return e3.prototype.parse = function(e4, t3) {
            if (0 === e4.length && t3)
              return [];
            var r2, s2 = [];
            if (null == this.buffer)
              this.buffer = e4, this.position = 0;
            else if (this.position === this.buffer.byteLength)
              this.buffer = e4, this.position = 0;
            else {
              var p2 = this.buffer.byteLength - this.position, h = new Uint8Array(p2 + e4.byteLength), f = c(this.buffer, this.position);
              h.set(f, 0);
              var l = new Uint8Array(e4);
              h.set(l, p2), this.buffer = h, this.position = 0;
            }
            for (; ; ) {
              if (!d(this.buffer, this.position, 5))
                return s2;
              var g = c(this.buffer, this.position, this.position + 5), b = new DataView(g.buffer, g.byteOffset, g.byteLength), y = u(b);
              if (!d(this.buffer, this.position, 5 + y))
                return s2;
              var v = c(this.buffer, this.position + 5, this.position + 5 + y);
              if (this.position += 5 + y, a(b))
                return s2.push({ chunkType: n.TRAILERS, trailers: (r2 = v, new o.Metadata(i(r2))) }), s2;
              s2.push({ chunkType: n.MESSAGE, data: v });
            }
          }, e3;
        }();
        t2.ChunkParser = p;
      }, 8: function(e2, t2) {
        "use strict";
        var r;
        Object.defineProperty(t2, "__esModule", { value: true }), t2.httpStatusToCode = t2.Code = void 0, function(e3) {
          e3[e3.OK = 0] = "OK", e3[e3.Canceled = 1] = "Canceled", e3[e3.Unknown = 2] = "Unknown", e3[e3.InvalidArgument = 3] = "InvalidArgument", e3[e3.DeadlineExceeded = 4] = "DeadlineExceeded", e3[e3.NotFound = 5] = "NotFound", e3[e3.AlreadyExists = 6] = "AlreadyExists", e3[e3.PermissionDenied = 7] = "PermissionDenied", e3[e3.ResourceExhausted = 8] = "ResourceExhausted", e3[e3.FailedPrecondition = 9] = "FailedPrecondition", e3[e3.Aborted = 10] = "Aborted", e3[e3.OutOfRange = 11] = "OutOfRange", e3[e3.Unimplemented = 12] = "Unimplemented", e3[e3.Internal = 13] = "Internal", e3[e3.Unavailable = 14] = "Unavailable", e3[e3.DataLoss = 15] = "DataLoss", e3[e3.Unauthenticated = 16] = "Unauthenticated";
        }(r = t2.Code || (t2.Code = {})), t2.httpStatusToCode = function(e3) {
          switch (e3) {
            case 0:
              return r.Internal;
            case 200:
              return r.OK;
            case 400:
              return r.InvalidArgument;
            case 401:
              return r.Unauthenticated;
            case 403:
              return r.PermissionDenied;
            case 404:
              return r.NotFound;
            case 409:
              return r.Aborted;
            case 412:
              return r.FailedPrecondition;
            case 429:
              return r.ResourceExhausted;
            case 499:
              return r.Canceled;
            case 500:
              return r.Unknown;
            case 501:
              return r.Unimplemented;
            case 503:
              return r.Unavailable;
            case 504:
              return r.DeadlineExceeded;
            default:
              return r.Unknown;
          }
        };
      }, 934: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.client = void 0;
        var n = r(65), o = r(617), s = r(8), i = r(346), a = r(57), u = r(882);
        t2.client = function(e3, t3) {
          return new d(e3, t3);
        };
        var d = function() {
          function e3(e4, t3) {
            this.started = false, this.sentFirstMessage = false, this.completed = false, this.closed = false, this.finishedSending = false, this.onHeadersCallbacks = [], this.onMessageCallbacks = [], this.onEndCallbacks = [], this.parser = new o.ChunkParser(), this.methodDefinition = e4, this.props = t3, this.createTransport();
          }
          return e3.prototype.createTransport = function() {
            var e4 = this.props.host + "/" + this.methodDefinition.service.serviceName + "/" + this.methodDefinition.methodName, t3 = { methodDefinition: this.methodDefinition, debug: this.props.debug || false, url: e4, onHeaders: this.onTransportHeaders.bind(this), onChunk: this.onTransportChunk.bind(this), onEnd: this.onTransportEnd.bind(this) };
            this.props.transport ? this.transport = this.props.transport(t3) : this.transport = a.makeDefaultTransport(t3);
          }, e3.prototype.onTransportHeaders = function(e4, t3) {
            if (this.props.debug && i.debug("onHeaders", e4, t3), this.closed)
              this.props.debug && i.debug("grpc.onHeaders received after request was closed - ignoring");
            else if (0 === t3)
              ;
            else {
              this.responseHeaders = e4, this.props.debug && i.debug("onHeaders.responseHeaders", JSON.stringify(this.responseHeaders, null, 2));
              var r2 = c(e4);
              this.props.debug && i.debug("onHeaders.gRPCStatus", r2);
              var n2 = r2 && r2 >= 0 ? r2 : s.httpStatusToCode(t3);
              this.props.debug && i.debug("onHeaders.code", n2);
              var o2 = e4.get("grpc-message") || [];
              if (this.props.debug && i.debug("onHeaders.gRPCMessage", o2), this.rawOnHeaders(e4), n2 !== s.Code.OK) {
                var a2 = this.decodeGRPCStatus(o2[0]);
                this.rawOnError(n2, a2, e4);
              }
            }
          }, e3.prototype.onTransportChunk = function(e4) {
            var t3 = this;
            if (this.closed)
              this.props.debug && i.debug("grpc.onChunk received after request was closed - ignoring");
            else {
              var r2 = [];
              try {
                r2 = this.parser.parse(e4);
              } catch (e5) {
                return this.props.debug && i.debug("onChunk.parsing error", e5, e5.message), void this.rawOnError(s.Code.Internal, "parsing error: " + e5.message);
              }
              r2.forEach(function(e5) {
                if (e5.chunkType === o.ChunkType.MESSAGE) {
                  var r3 = t3.methodDefinition.responseType.deserializeBinary(e5.data);
                  t3.rawOnMessage(r3);
                } else
                  e5.chunkType === o.ChunkType.TRAILERS && (t3.responseHeaders ? (t3.responseTrailers = new n.Metadata(e5.trailers), t3.props.debug && i.debug("onChunk.trailers", t3.responseTrailers)) : (t3.responseHeaders = new n.Metadata(e5.trailers), t3.rawOnHeaders(t3.responseHeaders)));
              });
            }
          }, e3.prototype.onTransportEnd = function() {
            if (this.props.debug && i.debug("grpc.onEnd"), this.closed)
              this.props.debug && i.debug("grpc.onEnd received after request was closed - ignoring");
            else if (void 0 !== this.responseTrailers) {
              var e4 = c(this.responseTrailers);
              if (null !== e4) {
                var t3 = this.responseTrailers.get("grpc-message"), r2 = this.decodeGRPCStatus(t3[0]);
                this.rawOnEnd(e4, r2, this.responseTrailers);
              } else
                this.rawOnError(s.Code.Internal, "Response closed without grpc-status (Trailers provided)");
            } else {
              if (void 0 === this.responseHeaders)
                return void this.rawOnError(s.Code.Unknown, "Response closed without headers");
              var n2 = c(this.responseHeaders), o2 = this.responseHeaders.get("grpc-message");
              if (this.props.debug && i.debug("grpc.headers only response ", n2, o2), null === n2)
                return void this.rawOnEnd(s.Code.Unknown, "Response closed without grpc-status (Headers only)", this.responseHeaders);
              var a2 = this.decodeGRPCStatus(o2[0]);
              this.rawOnEnd(n2, a2, this.responseHeaders);
            }
          }, e3.prototype.decodeGRPCStatus = function(e4) {
            if (!e4)
              return "";
            try {
              return decodeURIComponent(e4);
            } catch (t3) {
              return e4;
            }
          }, e3.prototype.rawOnEnd = function(e4, t3, r2) {
            var n2 = this;
            this.props.debug && i.debug("rawOnEnd", e4, t3, r2), this.completed || (this.completed = true, this.onEndCallbacks.forEach(function(o2) {
              if (!n2.closed)
                try {
                  o2(e4, t3, r2);
                } catch (e5) {
                  setTimeout(function() {
                    throw e5;
                  }, 0);
                }
            }));
          }, e3.prototype.rawOnHeaders = function(e4) {
            this.props.debug && i.debug("rawOnHeaders", e4), this.completed || this.onHeadersCallbacks.forEach(function(t3) {
              try {
                t3(e4);
              } catch (e5) {
                setTimeout(function() {
                  throw e5;
                }, 0);
              }
            });
          }, e3.prototype.rawOnError = function(e4, t3, r2) {
            var o2 = this;
            void 0 === r2 && (r2 = new n.Metadata()), this.props.debug && i.debug("rawOnError", e4, t3), this.completed || (this.completed = true, this.onEndCallbacks.forEach(function(n2) {
              if (!o2.closed)
                try {
                  n2(e4, t3, r2);
                } catch (e5) {
                  setTimeout(function() {
                    throw e5;
                  }, 0);
                }
            }));
          }, e3.prototype.rawOnMessage = function(e4) {
            var t3 = this;
            this.props.debug && i.debug("rawOnMessage", e4.toObject()), this.completed || this.closed || this.onMessageCallbacks.forEach(function(r2) {
              if (!t3.closed)
                try {
                  r2(e4);
                } catch (e5) {
                  setTimeout(function() {
                    throw e5;
                  }, 0);
                }
            });
          }, e3.prototype.onHeaders = function(e4) {
            this.onHeadersCallbacks.push(e4);
          }, e3.prototype.onMessage = function(e4) {
            this.onMessageCallbacks.push(e4);
          }, e3.prototype.onEnd = function(e4) {
            this.onEndCallbacks.push(e4);
          }, e3.prototype.start = function(e4) {
            if (this.started)
              throw new Error("Client already started - cannot .start()");
            this.started = true;
            var t3 = new n.Metadata(e4 || {});
            t3.set("content-type", "application/grpc-web+proto"), t3.set("x-grpc-web", "1"), this.transport.start(t3);
          }, e3.prototype.send = function(e4) {
            if (!this.started)
              throw new Error("Client not started - .start() must be called before .send()");
            if (this.closed)
              throw new Error("Client already closed - cannot .send()");
            if (this.finishedSending)
              throw new Error("Client already finished sending - cannot .send()");
            if (!this.methodDefinition.requestStream && this.sentFirstMessage)
              throw new Error("Message already sent for non-client-streaming method - cannot .send()");
            this.sentFirstMessage = true;
            var t3 = u.frameRequest(e4);
            this.transport.sendMessage(t3);
          }, e3.prototype.finishSend = function() {
            if (!this.started)
              throw new Error("Client not started - .finishSend() must be called before .close()");
            if (this.closed)
              throw new Error("Client already closed - cannot .send()");
            if (this.finishedSending)
              throw new Error("Client already finished sending - cannot .finishSend()");
            this.finishedSending = true, this.transport.finishSend();
          }, e3.prototype.close = function() {
            if (!this.started)
              throw new Error("Client not started - .start() must be called before .close()");
            if (this.closed)
              throw new Error("Client already closed - cannot .close()");
            this.closed = true, this.props.debug && i.debug("request.abort aborting request"), this.transport.cancel();
          }, e3;
        }();
        function c(e3) {
          var t3 = e3.get("grpc-status") || [];
          if (t3.length > 0)
            try {
              var r2 = t3[0];
              return parseInt(r2, 10);
            } catch (e4) {
              return null;
            }
          return null;
        }
      }, 346: function(e2, t2) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.debug = void 0, t2.debug = function() {
          for (var e3 = [], t3 = 0; t3 < arguments.length; t3++)
            e3[t3] = arguments[t3];
          console.debug ? console.debug.apply(null, e3) : console.log.apply(null, e3);
        };
      }, 607: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.grpc = void 0;
        var n, o = r(418), s = r(57), i = r(229), a = r(540), u = r(210), d = r(859), c = r(8), p = r(938), h = r(35), f = r(934);
        (n = t2.grpc || (t2.grpc = {})).setDefaultTransport = s.setDefaultTransportFactory, n.CrossBrowserHttpTransport = d.CrossBrowserHttpTransport, n.FetchReadableStreamTransport = i.FetchReadableStreamTransport, n.XhrTransport = u.XhrTransport, n.WebsocketTransport = a.WebsocketTransport, n.Code = c.Code, n.Metadata = o.BrowserHeaders, n.client = function(e3, t3) {
          return f.client(e3, t3);
        }, n.invoke = p.invoke, n.unary = h.unary;
      }, 938: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.invoke = void 0;
        var n = r(934);
        t2.invoke = function(e3, t3) {
          if (e3.requestStream)
            throw new Error(".invoke cannot be used with client-streaming methods. Use .client instead.");
          var r2 = n.client(e3, { host: t3.host, transport: t3.transport, debug: t3.debug });
          return t3.onHeaders && r2.onHeaders(t3.onHeaders), t3.onMessage && r2.onMessage(t3.onMessage), t3.onEnd && r2.onEnd(t3.onEnd), r2.start(t3.metadata), r2.send(t3.request), r2.finishSend(), { close: function() {
            r2.close();
          } };
        };
      }, 65: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.Metadata = void 0;
        var n = r(418);
        Object.defineProperty(t2, "Metadata", { enumerable: true, get: function() {
          return n.BrowserHeaders;
        } });
      }, 57: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.makeDefaultTransport = t2.setDefaultTransportFactory = void 0;
        var n = r(859), o = function(e3) {
          return n.CrossBrowserHttpTransport({ withCredentials: false })(e3);
        };
        t2.setDefaultTransportFactory = function(e3) {
          o = e3;
        }, t2.makeDefaultTransport = function(e3) {
          return o(e3);
        };
      }, 229: function(e2, t2, r) {
        "use strict";
        var n = this && this.__assign || function() {
          return (n = Object.assign || function(e3) {
            for (var t3, r2 = 1, n2 = arguments.length; r2 < n2; r2++)
              for (var o2 in t3 = arguments[r2])
                Object.prototype.hasOwnProperty.call(t3, o2) && (e3[o2] = t3[o2]);
            return e3;
          }).apply(this, arguments);
        };
        Object.defineProperty(t2, "__esModule", { value: true }), t2.detectFetchSupport = t2.FetchReadableStreamTransport = void 0;
        var o = r(65), s = r(346);
        t2.FetchReadableStreamTransport = function(e3) {
          return function(t3) {
            return function(e4, t4) {
              return e4.debug && s.debug("fetchRequest", e4), new i(e4, t4);
            }(t3, e3);
          };
        };
        var i = function() {
          function e3(e4, t3) {
            this.cancelled = false, this.controller = self.AbortController && new AbortController(), this.options = e4, this.init = t3;
          }
          return e3.prototype.pump = function(e4, t3) {
            var r2 = this;
            if (this.reader = e4, this.cancelled)
              return this.options.debug && s.debug("Fetch.pump.cancel at first pump"), void this.reader.cancel().catch(function(e5) {
                r2.options.debug && s.debug("Fetch.pump.reader.cancel exception", e5);
              });
            this.reader.read().then(function(e5) {
              if (e5.done)
                return r2.options.onEnd(), t3;
              r2.options.onChunk(e5.value), r2.pump(r2.reader, t3);
            }).catch(function(e5) {
              r2.cancelled ? r2.options.debug && s.debug("Fetch.catch - request cancelled") : (r2.cancelled = true, r2.options.debug && s.debug("Fetch.catch", e5.message), r2.options.onEnd(e5));
            });
          }, e3.prototype.send = function(e4) {
            var t3 = this;
            fetch(this.options.url, n(n({}, this.init), { headers: this.metadata.toHeaders(), method: "POST", body: e4, signal: this.controller && this.controller.signal })).then(function(e5) {
              if (t3.options.debug && s.debug("Fetch.response", e5), t3.options.onHeaders(new o.Metadata(e5.headers), e5.status), !e5.body)
                return e5;
              t3.pump(e5.body.getReader(), e5);
            }).catch(function(e5) {
              t3.cancelled ? t3.options.debug && s.debug("Fetch.catch - request cancelled") : (t3.cancelled = true, t3.options.debug && s.debug("Fetch.catch", e5.message), t3.options.onEnd(e5));
            });
          }, e3.prototype.sendMessage = function(e4) {
            this.send(e4);
          }, e3.prototype.finishSend = function() {
          }, e3.prototype.start = function(e4) {
            this.metadata = e4;
          }, e3.prototype.cancel = function() {
            var e4 = this;
            this.cancelled ? this.options.debug && s.debug("Fetch.cancel already cancelled") : (this.cancelled = true, this.controller ? (this.options.debug && s.debug("Fetch.cancel.controller.abort"), this.controller.abort()) : this.options.debug && s.debug("Fetch.cancel.missing abort controller"), this.reader ? (this.options.debug && s.debug("Fetch.cancel.reader.cancel"), this.reader.cancel().catch(function(t3) {
              e4.options.debug && s.debug("Fetch.cancel.reader.cancel exception", t3);
            })) : this.options.debug && s.debug("Fetch.cancel before reader"));
          }, e3;
        }();
        t2.detectFetchSupport = function() {
          return "undefined" != typeof Response && Response.prototype.hasOwnProperty("body") && "function" == typeof Headers;
        };
      }, 859: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.CrossBrowserHttpTransport = void 0;
        var n = r(229), o = r(210);
        t2.CrossBrowserHttpTransport = function(e3) {
          if (n.detectFetchSupport()) {
            var t3 = { credentials: e3.withCredentials ? "include" : "same-origin" };
            return n.FetchReadableStreamTransport(t3);
          }
          return o.XhrTransport({ withCredentials: e3.withCredentials });
        };
      }, 210: function(e2, t2, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function(e3, t3) {
          return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e4, t4) {
            e4.__proto__ = t4;
          } || function(e4, t4) {
            for (var r2 in t4)
              Object.prototype.hasOwnProperty.call(t4, r2) && (e4[r2] = t4[r2]);
          })(e3, t3);
        }, function(e3, t3) {
          function r2() {
            this.constructor = e3;
          }
          n(e3, t3), e3.prototype = null === t3 ? Object.create(t3) : (r2.prototype = t3.prototype, new r2());
        });
        Object.defineProperty(t2, "__esModule", { value: true }), t2.stringToArrayBuffer = t2.MozChunkedArrayBufferXHR = t2.XHR = t2.XhrTransport = void 0;
        var s = r(65), i = r(346), a = r(849);
        t2.XhrTransport = function(e3) {
          return function(t3) {
            if (a.detectMozXHRSupport())
              return new d(t3, e3);
            if (a.detectXHROverrideMimeTypeSupport())
              return new u(t3, e3);
            throw new Error("This environment's XHR implementation cannot support binary transfer.");
          };
        };
        var u = function() {
          function e3(e4, t3) {
            this.options = e4, this.init = t3;
          }
          return e3.prototype.onProgressEvent = function() {
            this.options.debug && i.debug("XHR.onProgressEvent.length: ", this.xhr.response.length);
            var e4 = this.xhr.response.substr(this.index);
            this.index = this.xhr.response.length;
            var t3 = p(e4);
            this.options.onChunk(t3);
          }, e3.prototype.onLoadEvent = function() {
            this.options.debug && i.debug("XHR.onLoadEvent"), this.options.onEnd();
          }, e3.prototype.onStateChange = function() {
            this.options.debug && i.debug("XHR.onStateChange", this.xhr.readyState), this.xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED && this.options.onHeaders(new s.Metadata(this.xhr.getAllResponseHeaders()), this.xhr.status);
          }, e3.prototype.sendMessage = function(e4) {
            this.xhr.send(e4);
          }, e3.prototype.finishSend = function() {
          }, e3.prototype.start = function(e4) {
            var t3 = this;
            this.metadata = e4;
            var r2 = new XMLHttpRequest();
            this.xhr = r2, r2.open("POST", this.options.url), this.configureXhr(), this.metadata.forEach(function(e5, t4) {
              r2.setRequestHeader(e5, t4.join(", "));
            }), r2.withCredentials = Boolean(this.init.withCredentials), r2.addEventListener("readystatechange", this.onStateChange.bind(this)), r2.addEventListener("progress", this.onProgressEvent.bind(this)), r2.addEventListener("loadend", this.onLoadEvent.bind(this)), r2.addEventListener("error", function(e5) {
              t3.options.debug && i.debug("XHR.error", e5), t3.options.onEnd(e5.error);
            });
          }, e3.prototype.configureXhr = function() {
            this.xhr.responseType = "text", this.xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }, e3.prototype.cancel = function() {
            this.options.debug && i.debug("XHR.abort"), this.xhr.abort();
          }, e3;
        }();
        t2.XHR = u;
        var d = function(e3) {
          function t3() {
            return null !== e3 && e3.apply(this, arguments) || this;
          }
          return o(t3, e3), t3.prototype.configureXhr = function() {
            this.options.debug && i.debug("MozXHR.configureXhr: setting responseType to 'moz-chunked-arraybuffer'"), this.xhr.responseType = "moz-chunked-arraybuffer";
          }, t3.prototype.onProgressEvent = function() {
            var e4 = this.xhr.response;
            this.options.debug && i.debug("MozXHR.onProgressEvent: ", new Uint8Array(e4)), this.options.onChunk(new Uint8Array(e4));
          }, t3;
        }(u);
        function c(e3, t3) {
          var r2 = e3.charCodeAt(t3);
          if (r2 >= 55296 && r2 <= 56319) {
            var n2 = e3.charCodeAt(t3 + 1);
            n2 >= 56320 && n2 <= 57343 && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320));
          }
          return r2;
        }
        function p(e3) {
          for (var t3 = new Uint8Array(e3.length), r2 = 0, n2 = 0; n2 < e3.length; n2++) {
            var o2 = String.prototype.codePointAt ? e3.codePointAt(n2) : c(e3, n2);
            t3[r2++] = 255 & o2;
          }
          return t3;
        }
        t2.MozChunkedArrayBufferXHR = d, t2.stringToArrayBuffer = p;
      }, 849: function(e2, t2) {
        "use strict";
        var r;
        function n() {
          if (void 0 !== r)
            return r;
          if (XMLHttpRequest) {
            r = new XMLHttpRequest();
            try {
              r.open("GET", "https://localhost");
            } catch (e3) {
            }
          }
          return r;
        }
        function o(e3) {
          var t3 = n();
          if (!t3)
            return false;
          try {
            return t3.responseType = e3, t3.responseType === e3;
          } catch (e4) {
          }
          return false;
        }
        Object.defineProperty(t2, "__esModule", { value: true }), t2.detectXHROverrideMimeTypeSupport = t2.detectMozXHRSupport = t2.xhrSupportsResponseType = void 0, t2.xhrSupportsResponseType = o, t2.detectMozXHRSupport = function() {
          return "undefined" != typeof XMLHttpRequest && o("moz-chunked-arraybuffer");
        }, t2.detectXHROverrideMimeTypeSupport = function() {
          return "undefined" != typeof XMLHttpRequest && XMLHttpRequest.prototype.hasOwnProperty("overrideMimeType");
        };
      }, 540: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.WebsocketTransport = void 0;
        var n, o = r(346), s = r(617);
        !function(e3) {
          e3[e3.FINISH_SEND = 1] = "FINISH_SEND";
        }(n || (n = {}));
        var i = new Uint8Array([1]);
        t2.WebsocketTransport = function() {
          return function(e3) {
            return function(e4) {
              e4.debug && o.debug("websocketRequest", e4);
              var t3, r2 = function(e5) {
                if ("https://" === e5.substr(0, 8))
                  return "wss://" + e5.substr(8);
                if ("http://" === e5.substr(0, 7))
                  return "ws://" + e5.substr(7);
                throw new Error("Websocket transport constructed with non-https:// or http:// host.");
              }(e4.url), a = [];
              function u(e5) {
                if (e5 === n.FINISH_SEND)
                  t3.send(i);
                else {
                  var r3 = e5, o2 = new Int8Array(r3.byteLength + 1);
                  o2.set(new Uint8Array([0])), o2.set(r3, 1), t3.send(o2);
                }
              }
              return { sendMessage: function(e5) {
                t3 && t3.readyState !== t3.CONNECTING ? u(e5) : a.push(e5);
              }, finishSend: function() {
                t3 && t3.readyState !== t3.CONNECTING ? u(n.FINISH_SEND) : a.push(n.FINISH_SEND);
              }, start: function(n2) {
                (t3 = new WebSocket(r2, ["grpc-websockets"])).binaryType = "arraybuffer", t3.onopen = function() {
                  var r3;
                  e4.debug && o.debug("websocketRequest.onopen"), t3.send((r3 = "", n2.forEach(function(e5, t4) {
                    r3 += e5 + ": " + t4.join(", ") + "\r\n";
                  }), s.encodeASCII(r3))), a.forEach(function(e5) {
                    u(e5);
                  });
                }, t3.onclose = function(t4) {
                  e4.debug && o.debug("websocketRequest.onclose", t4), e4.onEnd();
                }, t3.onerror = function(t4) {
                  e4.debug && o.debug("websocketRequest.onerror", t4);
                }, t3.onmessage = function(t4) {
                  e4.onChunk(new Uint8Array(t4.data));
                };
              }, cancel: function() {
                e4.debug && o.debug("websocket.abort"), t3.close();
              } };
            }(e3);
          };
        };
      }, 35: function(e2, t2, r) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.unary = void 0;
        var n = r(65), o = r(934);
        t2.unary = function(e3, t3) {
          if (e3.responseStream)
            throw new Error(".unary cannot be used with server-streaming methods. Use .invoke or .client instead.");
          if (e3.requestStream)
            throw new Error(".unary cannot be used with client-streaming methods. Use .client instead.");
          var r2 = null, s = null, i = o.client(e3, { host: t3.host, transport: t3.transport, debug: t3.debug });
          return i.onHeaders(function(e4) {
            r2 = e4;
          }), i.onMessage(function(e4) {
            s = e4;
          }), i.onEnd(function(e4, o2, i2) {
            t3.onEnd({ status: e4, statusMessage: o2, headers: r2 || new n.Metadata(), message: s, trailers: i2 });
          }), i.start(t3.metadata), i.send(t3.request), i.finishSend(), { close: function() {
            i.close();
          } };
        };
      }, 882: function(e2, t2) {
        "use strict";
        Object.defineProperty(t2, "__esModule", { value: true }), t2.frameRequest = void 0, t2.frameRequest = function(e3) {
          var t3 = e3.serializeBinary(), r = new ArrayBuffer(t3.byteLength + 5);
          return new DataView(r, 1, 4).setUint32(0, t3.length, false), new Uint8Array(r, 5).set(t3), new Uint8Array(r);
        };
      } }, t = {};
      return function r(n) {
        if (t[n])
          return t[n].exports;
        var o = t[n] = { exports: {} };
        return e[n].call(o.exports, o, o.exports, r), o.exports;
      }(607);
    }());
  }
});

// ../../node_modules/abort-controller-x/lib/AbortError.js
var require_AbortError = __commonJS({
  "../../node_modules/abort-controller-x/lib/AbortError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.catchAbortError = exports2.rethrowAbortError = exports2.throwIfAborted = exports2.isAbortError = exports2.AbortError = void 0;
    var AbortError = class extends Error {
      constructor() {
        super("The operation has been aborted");
        this.message = "The operation has been aborted";
        this.name = "AbortError";
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    exports2.AbortError = AbortError;
    function isAbortError(error) {
      return typeof error === "object" && error !== null && error.name === "AbortError";
    }
    exports2.isAbortError = isAbortError;
    function throwIfAborted(signal) {
      if (signal.aborted) {
        throw new AbortError();
      }
    }
    exports2.throwIfAborted = throwIfAborted;
    function rethrowAbortError(error) {
      if (isAbortError(error)) {
        throw error;
      }
      return;
    }
    exports2.rethrowAbortError = rethrowAbortError;
    function catchAbortError(error) {
      if (isAbortError(error)) {
        return;
      }
      throw error;
    }
    exports2.catchAbortError = catchAbortError;
  }
});

// ../../node_modules/abort-controller-x/lib/execute.js
var require_execute = __commonJS({
  "../../node_modules/abort-controller-x/lib/execute.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.execute = void 0;
    var AbortError_1 = require_AbortError();
    function execute(signal, executor) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new AbortError_1.AbortError());
          return;
        }
        let removeAbortListener;
        let finished = false;
        function finish() {
          if (!finished) {
            finished = true;
            if (removeAbortListener != null) {
              removeAbortListener();
            }
          }
        }
        const callback = executor((value) => {
          resolve(value);
          finish();
        }, (reason) => {
          reject(reason);
          finish();
        });
        if (!finished) {
          const listener = () => {
            const callbackResult = callback();
            if (callbackResult == null) {
              reject(new AbortError_1.AbortError());
            } else {
              callbackResult.then(() => {
                reject(new AbortError_1.AbortError());
              }, (reason) => {
                reject(reason);
              });
            }
            finish();
          };
          signal.addEventListener("abort", listener);
          removeAbortListener = () => {
            signal.removeEventListener("abort", listener);
          };
        }
      });
    }
    exports2.execute = execute;
  }
});

// ../../node_modules/abort-controller-x/lib/abortable.js
var require_abortable = __commonJS({
  "../../node_modules/abort-controller-x/lib/abortable.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.abortable = void 0;
    var execute_1 = require_execute();
    function abortable(signal, promise) {
      if (signal.aborted) {
        const noop = () => {
        };
        promise.then(noop, noop);
      }
      return (0, execute_1.execute)(signal, (resolve, reject) => {
        promise.then(resolve, reject);
        return () => {
        };
      });
    }
    exports2.abortable = abortable;
  }
});

// ../../node_modules/abort-controller-x/lib/delay.js
var require_delay = __commonJS({
  "../../node_modules/abort-controller-x/lib/delay.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.delay = void 0;
    var execute_1 = require_execute();
    function delay(signal, dueTime) {
      return (0, execute_1.execute)(signal, (resolve) => {
        const ms = typeof dueTime === "number" ? dueTime : dueTime.getTime() - Date.now();
        const timer = setTimeout(resolve, ms);
        return () => {
          clearTimeout(timer);
        };
      });
    }
    exports2.delay = delay;
  }
});

// ../../node_modules/abort-controller-x/lib/forever.js
var require_forever = __commonJS({
  "../../node_modules/abort-controller-x/lib/forever.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.forever = void 0;
    var execute_1 = require_execute();
    function forever(signal) {
      return (0, execute_1.execute)(signal, () => () => {
      });
    }
    exports2.forever = forever;
  }
});

// ../../node_modules/abort-controller-x/lib/waitForEvent.js
var require_waitForEvent = __commonJS({
  "../../node_modules/abort-controller-x/lib/waitForEvent.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.waitForEvent = void 0;
    var execute_1 = require_execute();
    function waitForEvent(signal, target, eventName, options) {
      return (0, execute_1.execute)(signal, (resolve) => {
        let unlisten;
        let finished = false;
        const handler2 = (...args) => {
          resolve(args.length > 1 ? args : args[0]);
          finished = true;
          if (unlisten != null) {
            unlisten();
          }
        };
        unlisten = listen(target, eventName, handler2, options);
        if (finished) {
          unlisten();
        }
        return () => {
          finished = true;
          if (unlisten != null) {
            unlisten();
          }
        };
      });
    }
    exports2.waitForEvent = waitForEvent;
    function listen(target, eventName, handler2, options) {
      if (isEventTarget(target)) {
        target.addEventListener(eventName, handler2, options);
        return () => target.removeEventListener(eventName, handler2, options);
      }
      if (isJQueryStyleEventEmitter(target)) {
        target.on(eventName, handler2);
        return () => target.off(eventName, handler2);
      }
      if (isNodeStyleEventEmitter(target)) {
        target.addListener(eventName, handler2);
        return () => target.removeListener(eventName, handler2);
      }
      throw new Error("Invalid event target");
    }
    function isNodeStyleEventEmitter(sourceObj) {
      return isFunction(sourceObj.addListener) && isFunction(sourceObj.removeListener);
    }
    function isJQueryStyleEventEmitter(sourceObj) {
      return isFunction(sourceObj.on) && isFunction(sourceObj.off);
    }
    function isEventTarget(sourceObj) {
      return isFunction(sourceObj.addEventListener) && isFunction(sourceObj.removeEventListener);
    }
    var isFunction = (obj) => typeof obj === "function";
  }
});

// ../../node_modules/abort-controller-x/lib/all.js
var require_all = __commonJS({
  "../../node_modules/abort-controller-x/lib/all.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.all = void 0;
    var AbortError_1 = require_AbortError();
    function all(signal, executor) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new AbortError_1.AbortError());
          return;
        }
        const innerAbortController = new AbortController();
        const promises = executor(innerAbortController.signal);
        if (promises.length === 0) {
          resolve([]);
          return;
        }
        const abortListener = () => {
          innerAbortController.abort();
        };
        signal.addEventListener("abort", abortListener);
        let rejection;
        const results = new Array(promises.length);
        let settledCount = 0;
        function settled() {
          settledCount += 1;
          if (settledCount === promises.length) {
            signal.removeEventListener("abort", abortListener);
            if (rejection != null) {
              reject(rejection.reason);
            } else {
              resolve(results);
            }
          }
        }
        for (const [i, promise] of promises.entries()) {
          promise.then((value) => {
            results[i] = value;
            settled();
          }, (reason) => {
            innerAbortController.abort();
            if (rejection == null || !(0, AbortError_1.isAbortError)(reason) && (0, AbortError_1.isAbortError)(rejection.reason)) {
              rejection = { reason };
            }
            settled();
          });
        }
      });
    }
    exports2.all = all;
  }
});

// ../../node_modules/abort-controller-x/lib/race.js
var require_race = __commonJS({
  "../../node_modules/abort-controller-x/lib/race.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.race = void 0;
    var AbortError_1 = require_AbortError();
    function race(signal, executor) {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new AbortError_1.AbortError());
          return;
        }
        const innerAbortController = new AbortController();
        const promises = executor(innerAbortController.signal);
        const abortListener = () => {
          innerAbortController.abort();
        };
        signal.addEventListener("abort", abortListener);
        let settledCount = 0;
        function settled(result2) {
          innerAbortController.abort();
          settledCount += 1;
          if (settledCount === promises.length) {
            signal.removeEventListener("abort", abortListener);
            if (result2.status === "fulfilled") {
              resolve(result2.value);
            } else {
              reject(result2.reason);
            }
          }
        }
        let result;
        for (const promise of promises) {
          promise.then((value) => {
            if (result == null) {
              result = { status: "fulfilled", value };
            }
            settled(result);
          }, (reason) => {
            if (result == null || !(0, AbortError_1.isAbortError)(reason) && (result.status === "fulfilled" || (0, AbortError_1.isAbortError)(result.reason))) {
              result = { status: "rejected", reason };
            }
            settled(result);
          });
        }
      });
    }
    exports2.race = race;
  }
});

// ../../node_modules/abort-controller-x/lib/retry.js
var require_retry = __commonJS({
  "../../node_modules/abort-controller-x/lib/retry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.retry = void 0;
    var delay_1 = require_delay();
    var AbortError_1 = require_AbortError();
    async function retry(signal, fn, options = {}) {
      const { baseMs = 1e3, maxDelayMs = 3e4, onError, maxAttempts = Infinity } = options;
      let attempt = 0;
      const reset = () => {
        attempt = -1;
      };
      while (true) {
        try {
          return await fn(signal, attempt, reset);
        } catch (error) {
          (0, AbortError_1.rethrowAbortError)(error);
          if (attempt >= maxAttempts) {
            throw error;
          }
          let delayMs;
          if (attempt === -1) {
            delayMs = 0;
          } else {
            const backoff = Math.min(maxDelayMs, Math.pow(2, attempt) * baseMs);
            delayMs = Math.round(backoff * (1 + Math.random()) / 2);
          }
          if (onError) {
            onError(error, attempt, delayMs);
          }
          if (delayMs !== 0) {
            await (0, delay_1.delay)(signal, delayMs);
          }
          attempt += 1;
        }
      }
    }
    exports2.retry = retry;
  }
});

// ../../node_modules/abort-controller-x/lib/spawn.js
var require_spawn = __commonJS({
  "../../node_modules/abort-controller-x/lib/spawn.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.spawn = void 0;
    var AbortError_1 = require_AbortError();
    function spawn(signal, fn) {
      if (signal.aborted) {
        return Promise.reject(new AbortError_1.AbortError());
      }
      const deferredFunctions = [];
      const spawnAbortController = new AbortController();
      const spawnSignal = spawnAbortController.signal;
      const abortSpawn = () => {
        spawnAbortController.abort();
      };
      signal.addEventListener("abort", abortSpawn);
      const removeAbortListener = () => {
        signal.removeEventListener("abort", abortSpawn);
      };
      const tasks = /* @__PURE__ */ new Set();
      const abortTasks = () => {
        for (const task of tasks) {
          task.abort();
        }
      };
      spawnSignal.addEventListener("abort", abortTasks);
      const removeSpawnAbortListener = () => {
        spawnSignal.removeEventListener("abort", abortTasks);
      };
      let promise = new Promise((resolve, reject) => {
        let result;
        let failure;
        fork((signal2) => fn(signal2, {
          defer(fn2) {
            deferredFunctions.push(fn2);
          },
          fork
        })).join().then((value) => {
          spawnAbortController.abort();
          result = { value };
        }, (error) => {
          spawnAbortController.abort();
          if (!(0, AbortError_1.isAbortError)(error) || failure == null) {
            failure = { error };
          }
        });
        function fork(forkFn) {
          if (spawnSignal.aborted) {
            return {
              abort() {
              },
              async join() {
                throw new AbortError_1.AbortError();
              }
            };
          }
          const taskAbortController = new AbortController();
          const taskSignal = taskAbortController.signal;
          const taskPromise = forkFn(taskSignal);
          const task = {
            abort() {
              taskAbortController.abort();
            },
            join: () => taskPromise
          };
          tasks.add(task);
          taskPromise.catch(AbortError_1.catchAbortError).catch((error) => {
            failure = { error };
            spawnAbortController.abort();
          }).finally(() => {
            tasks.delete(task);
            if (tasks.size === 0) {
              if (failure != null) {
                reject(failure.error);
              } else {
                resolve(result.value);
              }
            }
          });
          return task;
        }
      });
      promise = promise.finally(() => {
        removeAbortListener();
        removeSpawnAbortListener();
        let deferPromise = Promise.resolve();
        for (let i = deferredFunctions.length - 1; i >= 0; i--) {
          deferPromise = deferPromise.finally(deferredFunctions[i]);
        }
        return deferPromise;
      });
      return promise;
    }
    exports2.spawn = spawn;
  }
});

// ../../node_modules/abort-controller-x/lib/run.js
var require_run = __commonJS({
  "../../node_modules/abort-controller-x/lib/run.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.run = void 0;
    var AbortError_1 = require_AbortError();
    function run(fn) {
      const abortController = new AbortController();
      const promise = fn(abortController.signal).catch(AbortError_1.catchAbortError);
      return () => {
        abortController.abort();
        return promise;
      };
    }
    exports2.run = run;
  }
});

// ../../node_modules/abort-controller-x/lib/index.js
var require_lib2 = __commonJS({
  "../../node_modules/abort-controller-x/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m, k);
      if (!desc2 || ("get" in desc2 ? !m.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_abortable(), exports2);
    __exportStar(require_AbortError(), exports2);
    __exportStar(require_delay(), exports2);
    __exportStar(require_execute(), exports2);
    __exportStar(require_forever(), exports2);
    __exportStar(require_waitForEvent(), exports2);
    __exportStar(require_all(), exports2);
    __exportStar(require_race(), exports2);
    __exportStar(require_retry(), exports2);
    __exportStar(require_spawn(), exports2);
    __exportStar(require_run(), exports2);
  }
});

// node_modules/nice-grpc-web/lib/utils/AsyncSink.js
var require_AsyncSink = __commonJS({
  "node_modules/nice-grpc-web/lib/utils/AsyncSink.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AsyncSink = void 0;
    var ARRAY_VALUE = "value";
    var ARRAY_ERROR = "error";
    var AsyncSink = class {
      constructor() {
        this._ended = false;
        this._values = [];
        this._resolvers = [];
      }
      [Symbol.asyncIterator]() {
        return this;
      }
      write(value) {
        this._push({ type: ARRAY_VALUE, value });
      }
      error(error) {
        this._push({ type: ARRAY_ERROR, error });
      }
      _push(item) {
        if (this._ended) {
          throw new Error("AsyncSink already ended");
        }
        if (this._resolvers.length > 0) {
          const { resolve, reject } = this._resolvers.shift();
          if (item.type === ARRAY_ERROR) {
            reject(item.error);
          } else {
            resolve({ done: false, value: item.value });
          }
        } else {
          this._values.push(item);
        }
      }
      next() {
        if (this._values.length > 0) {
          const { type, value, error } = this._values.shift();
          if (type === ARRAY_ERROR) {
            return Promise.reject(error);
          } else {
            return Promise.resolve({ done: false, value });
          }
        }
        if (this._ended) {
          return Promise.resolve({ done: true });
        }
        return new Promise((resolve, reject) => {
          this._resolvers.push({ resolve, reject });
        });
      }
      end() {
        while (this._resolvers.length > 0) {
          this._resolvers.shift().resolve({ done: true });
        }
        this._ended = true;
      }
    };
    exports2.AsyncSink = AsyncSink;
  }
});

// node_modules/nice-grpc-web/lib/utils/isAsyncIterable.js
var require_isAsyncIterable = __commonJS({
  "node_modules/nice-grpc-web/lib/utils/isAsyncIterable.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isAsyncIterable = void 0;
    function isAsyncIterable(value) {
      return value != null && Symbol.asyncIterator in value;
    }
    exports2.isAsyncIterable = isAsyncIterable;
  }
});

// ../../node_modules/js-base64/base64.js
var require_base642 = __commonJS({
  "../../node_modules/js-base64/base64.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : function() {
        var _Base64 = global2.Base64;
        var gBase64 = factory();
        gBase64.noConflict = function() {
          global2.Base64 = _Base64;
          return gBase64;
        };
        if (global2.Meteor) {
          Base64 = gBase64;
        }
        global2.Base64 = gBase64;
      }();
    })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports2, function() {
      "use strict";
      var version = "3.7.2";
      var VERSION = version;
      var _hasatob = typeof atob === "function";
      var _hasbtoa = typeof btoa === "function";
      var _hasBuffer = typeof Buffer === "function";
      var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
      var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
      var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var b64chs = Array.prototype.slice.call(b64ch);
      var b64tab = function(a) {
        var tab = {};
        a.forEach(function(c, i) {
          return tab[c] = i;
        });
        return tab;
      }(b64chs);
      var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
      var _fromCC = String.fromCharCode.bind(String);
      var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : function(it, fn) {
        if (fn === void 0) {
          fn = function(x) {
            return x;
          };
        }
        return new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
      };
      var _mkUriSafe = function(src) {
        return src.replace(/=/g, "").replace(/[+\/]/g, function(m0) {
          return m0 == "+" ? "-" : "_";
        });
      };
      var _tidyB64 = function(s) {
        return s.replace(/[^A-Za-z0-9\+\/]/g, "");
      };
      var btoaPolyfill = function(bin) {
        var u32, c0, c1, c2, asc = "";
        var pad = bin.length % 3;
        for (var i = 0; i < bin.length; ) {
          if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError("invalid character found");
          u32 = c0 << 16 | c1 << 8 | c2;
          asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
        }
        return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
      };
      var _btoa = _hasbtoa ? function(bin) {
        return btoa(bin);
      } : _hasBuffer ? function(bin) {
        return Buffer.from(bin, "binary").toString("base64");
      } : btoaPolyfill;
      var _fromUint8Array = _hasBuffer ? function(u8a) {
        return Buffer.from(u8a).toString("base64");
      } : function(u8a) {
        var maxargs = 4096;
        var strs = [];
        for (var i = 0, l = u8a.length; i < l; i += maxargs) {
          strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(""));
      };
      var fromUint8Array = function(u8a, urlsafe) {
        if (urlsafe === void 0) {
          urlsafe = false;
        }
        return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
      };
      var cb_utob = function(c) {
        if (c.length < 2) {
          var cc = c.charCodeAt(0);
          return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        } else {
          var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
          return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        }
      };
      var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
      var utob = function(u) {
        return u.replace(re_utob, cb_utob);
      };
      var _encode = _hasBuffer ? function(s) {
        return Buffer.from(s, "utf8").toString("base64");
      } : _TE ? function(s) {
        return _fromUint8Array(_TE.encode(s));
      } : function(s) {
        return _btoa(utob(s));
      };
      var encode = function(src, urlsafe) {
        if (urlsafe === void 0) {
          urlsafe = false;
        }
        return urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
      };
      var encodeURI = function(src) {
        return encode(src, true);
      };
      var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
      var cb_btou = function(cccc) {
        switch (cccc.length) {
          case 4:
            var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
            return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
          case 3:
            return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
          default:
            return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
        }
      };
      var btou = function(b) {
        return b.replace(re_btou, cb_btou);
      };
      var atobPolyfill = function(asc) {
        asc = asc.replace(/\s+/g, "");
        if (!b64re.test(asc))
          throw new TypeError("malformed base64.");
        asc += "==".slice(2 - (asc.length & 3));
        var u24, bin = "", r1, r2;
        for (var i = 0; i < asc.length; ) {
          u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
          bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
        }
        return bin;
      };
      var _atob = _hasatob ? function(asc) {
        return atob(_tidyB64(asc));
      } : _hasBuffer ? function(asc) {
        return Buffer.from(asc, "base64").toString("binary");
      } : atobPolyfill;
      var _toUint8Array = _hasBuffer ? function(a) {
        return _U8Afrom(Buffer.from(a, "base64"));
      } : function(a) {
        return _U8Afrom(_atob(a), function(c) {
          return c.charCodeAt(0);
        });
      };
      var toUint8Array = function(a) {
        return _toUint8Array(_unURI(a));
      };
      var _decode = _hasBuffer ? function(a) {
        return Buffer.from(a, "base64").toString("utf8");
      } : _TD ? function(a) {
        return _TD.decode(_toUint8Array(a));
      } : function(a) {
        return btou(_atob(a));
      };
      var _unURI = function(a) {
        return _tidyB64(a.replace(/[-_]/g, function(m0) {
          return m0 == "-" ? "+" : "/";
        }));
      };
      var decode = function(src) {
        return _decode(_unURI(src));
      };
      var isValid = function(src) {
        if (typeof src !== "string")
          return false;
        var s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
        return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
      };
      var _noEnum = function(v) {
        return {
          value: v,
          enumerable: false,
          writable: true,
          configurable: true
        };
      };
      var extendString = function() {
        var _add = function(name, body) {
          return Object.defineProperty(String.prototype, name, _noEnum(body));
        };
        _add("fromBase64", function() {
          return decode(this);
        });
        _add("toBase64", function(urlsafe) {
          return encode(this, urlsafe);
        });
        _add("toBase64URI", function() {
          return encode(this, true);
        });
        _add("toBase64URL", function() {
          return encode(this, true);
        });
        _add("toUint8Array", function() {
          return toUint8Array(this);
        });
      };
      var extendUint8Array = function() {
        var _add = function(name, body) {
          return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
        };
        _add("toBase64", function(urlsafe) {
          return fromUint8Array(this, urlsafe);
        });
        _add("toBase64URI", function() {
          return fromUint8Array(this, true);
        });
        _add("toBase64URL", function() {
          return fromUint8Array(this, true);
        });
      };
      var extendBuiltins = function() {
        extendString();
        extendUint8Array();
      };
      var gBase64 = {
        version,
        VERSION,
        atob: _atob,
        atobPolyfill,
        btoa: _btoa,
        btoaPolyfill,
        fromBase64: decode,
        toBase64: encode,
        encode,
        encodeURI,
        encodeURL: encodeURI,
        utob,
        btou,
        decode,
        isValid,
        fromUint8Array,
        toUint8Array,
        extendString,
        extendUint8Array,
        extendBuiltins
      };
      gBase64.Base64 = {};
      Object.keys(gBase64).forEach(function(k) {
        return gBase64.Base64[k] = gBase64[k];
      });
      return gBase64;
    });
  }
});

// node_modules/nice-grpc-web/lib/utils/convertMetadata.js
var require_convertMetadata = __commonJS({
  "node_modules/nice-grpc-web/lib/utils/convertMetadata.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertMetadataFromGrpcWeb = exports2.convertMetadataToGrpcWeb = void 0;
    var grpc_web_1 = require_grpc_web_client();
    var nice_grpc_common_1 = require_lib();
    var js_base64_1 = require_base642();
    function convertMetadataToGrpcWeb(metadata) {
      const grpcMetadata = new grpc_web_1.grpc.Metadata();
      for (const [key, values] of metadata) {
        for (const value of values) {
          grpcMetadata.append(key, typeof value === "string" ? value : js_base64_1.Base64.fromUint8Array(value));
        }
      }
      return grpcMetadata;
    }
    exports2.convertMetadataToGrpcWeb = convertMetadataToGrpcWeb;
    function convertMetadataFromGrpcWeb(grpcMetadata) {
      const metadata = (0, nice_grpc_common_1.Metadata)();
      for (const [key, values] of Object.entries(grpcMetadata.headersMap)) {
        metadata.set(key, key.endsWith("-bin") ? values.map((value) => js_base64_1.Base64.toUint8Array(value)) : values);
      }
      return metadata;
    }
    exports2.convertMetadataFromGrpcWeb = convertMetadataFromGrpcWeb;
  }
});

// node_modules/nice-grpc-web/lib/client/createBidiStreamingMethod.js
var require_createBidiStreamingMethod = __commonJS({
  "node_modules/nice-grpc-web/lib/client/createBidiStreamingMethod.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createBidiStreamingMethod = void 0;
    var nice_grpc_common_1 = require_lib();
    var grpc_web_1 = require_grpc_web_client();
    var abort_controller_x_1 = require_lib2();
    var AsyncSink_1 = require_AsyncSink();
    var service_definitions_1 = require_service_definitions();
    var isAsyncIterable_1 = require_isAsyncIterable();
    var convertMetadata_1 = require_convertMetadata();
    function createBidiStreamingMethod(definition, channel, middleware, defaultOptions) {
      const grpcMethodDefinition = (0, service_definitions_1.toGrpcWebMethodDefinition)(definition);
      const methodDescriptor = {
        path: definition.path,
        requestStream: definition.requestStream,
        responseStream: definition.responseStream,
        options: definition.options
      };
      async function* bidiStreamingMethod(request, options) {
        if (!(0, isAsyncIterable_1.isAsyncIterable)(request)) {
          throw new Error("A middleware passed invalid request to next(): expected a single message for bidirectional streaming method");
        }
        const { metadata = (0, nice_grpc_common_1.Metadata)(), signal = new AbortController().signal, onHeader, onTrailer } = options;
        const pipeAbortController = new AbortController();
        const sink = new AsyncSink_1.AsyncSink();
        const client = grpc_web_1.grpc.client(grpcMethodDefinition, {
          host: channel.address,
          transport: channel.transport
        });
        client.onHeaders((headers) => {
          onHeader === null || onHeader === void 0 ? void 0 : onHeader((0, convertMetadata_1.convertMetadataFromGrpcWeb)(headers));
        });
        client.onMessage((message) => {
          sink.write(message);
        });
        client.onEnd((code, message, trailers) => {
          onTrailer === null || onTrailer === void 0 ? void 0 : onTrailer((0, convertMetadata_1.convertMetadataFromGrpcWeb)(trailers));
          if (code === grpc_web_1.grpc.Code.OK) {
            sink.end();
          } else {
            sink.error(new nice_grpc_common_1.ClientError(definition.path, +code, message));
          }
        });
        client.start((0, convertMetadata_1.convertMetadataToGrpcWeb)(metadata));
        let pipeError;
        pipeRequest(pipeAbortController.signal, request, client, definition).then(() => {
          client.finishSend();
        }, (err) => {
          if (!(0, abort_controller_x_1.isAbortError)(err)) {
            pipeError = err;
            client.close();
            sink.end();
          }
        });
        const abortListener = () => {
          sink.error(new abort_controller_x_1.AbortError());
          pipeAbortController.abort();
          client.close();
        };
        signal.addEventListener("abort", abortListener);
        try {
          yield* sink;
        } finally {
          pipeAbortController.abort();
          signal.removeEventListener("abort", abortListener);
          (0, abort_controller_x_1.throwIfAborted)(signal);
          if (pipeError) {
            throw pipeError;
          }
        }
      }
      const method = middleware == null ? bidiStreamingMethod : (request, options) => middleware({
        method: methodDescriptor,
        requestStream: true,
        request,
        responseStream: true,
        next: bidiStreamingMethod
      }, options);
      return (request, options) => {
        const iterable = method(request, {
          ...defaultOptions,
          ...options
        });
        const iterator = iterable[Symbol.asyncIterator]();
        return {
          [Symbol.asyncIterator]() {
            return {
              async next() {
                const result = await iterator.next();
                if (result.done && result.value != null) {
                  return await iterator.throw(new Error("A middleware returned a message, but expected to return void for bidirectional streaming method"));
                }
                return result;
              },
              return() {
                return iterator.return();
              },
              throw(err) {
                return iterator.throw(err);
              }
            };
          }
        };
      };
    }
    exports2.createBidiStreamingMethod = createBidiStreamingMethod;
    async function pipeRequest(signal, request, client, definition) {
      for await (const item of request) {
        (0, abort_controller_x_1.throwIfAborted)(signal);
        client.send({
          serializeBinary: () => definition.requestSerialize(item)
        });
      }
    }
  }
});

// node_modules/nice-grpc-web/lib/client/createClientStreamingMethod.js
var require_createClientStreamingMethod = __commonJS({
  "node_modules/nice-grpc-web/lib/client/createClientStreamingMethod.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createClientStreamingMethod = void 0;
    var nice_grpc_common_1 = require_lib();
    var grpc_web_1 = require_grpc_web_client();
    var abort_controller_x_1 = require_lib2();
    var service_definitions_1 = require_service_definitions();
    var isAsyncIterable_1 = require_isAsyncIterable();
    var convertMetadata_1 = require_convertMetadata();
    function createClientStreamingMethod(definition, channel, middleware, defaultOptions) {
      const grpcMethodDefinition = (0, service_definitions_1.toGrpcWebMethodDefinition)(definition);
      const methodDescriptor = {
        path: definition.path,
        requestStream: definition.requestStream,
        responseStream: definition.responseStream,
        options: definition.options
      };
      async function* clientStreamingMethod(request, options) {
        if (!(0, isAsyncIterable_1.isAsyncIterable)(request)) {
          throw new Error("A middleware passed invalid request to next(): expected a single message for client streaming method");
        }
        const { metadata = (0, nice_grpc_common_1.Metadata)(), signal = new AbortController().signal, onHeader, onTrailer } = options;
        return await (0, abort_controller_x_1.execute)(signal, (resolve, reject) => {
          const pipeAbortController = new AbortController();
          let response;
          const client = grpc_web_1.grpc.client(grpcMethodDefinition, {
            host: channel.address,
            transport: channel.transport
          });
          client.onHeaders((headers) => {
            onHeader === null || onHeader === void 0 ? void 0 : onHeader((0, convertMetadata_1.convertMetadataFromGrpcWeb)(headers));
          });
          client.onMessage((message) => {
            response = message;
          });
          client.onEnd((code, message, trailers) => {
            onTrailer === null || onTrailer === void 0 ? void 0 : onTrailer((0, convertMetadata_1.convertMetadataFromGrpcWeb)(trailers));
            pipeAbortController.abort();
            if (code === grpc_web_1.grpc.Code.OK) {
              resolve(response);
            } else {
              reject(new nice_grpc_common_1.ClientError(definition.path, +code, message));
            }
          });
          client.start((0, convertMetadata_1.convertMetadataToGrpcWeb)(metadata));
          pipeRequest(pipeAbortController.signal, request, client, definition).then(() => {
            client.finishSend();
          }, (err) => {
            if (!(0, abort_controller_x_1.isAbortError)(err)) {
              reject(err);
              client.close();
            }
          });
          return () => {
            pipeAbortController.abort();
            client.close();
          };
        });
      }
      const method = middleware == null ? clientStreamingMethod : (request, options) => middleware({
        method: methodDescriptor,
        requestStream: true,
        request,
        responseStream: false,
        next: clientStreamingMethod
      }, options);
      return async (request, options) => {
        const iterable = method(request, {
          ...defaultOptions,
          ...options
        });
        const iterator = iterable[Symbol.asyncIterator]();
        let result = await iterator.next();
        while (true) {
          if (!result.done) {
            result = await iterator.throw(new Error("A middleware yielded a message, but expected to only return a message for client streaming method"));
            continue;
          }
          if (result.value == null) {
            result = await iterator.throw(new Error("A middleware returned void, but expected to return a message for client streaming method"));
            continue;
          }
          return result.value;
        }
      };
    }
    exports2.createClientStreamingMethod = createClientStreamingMethod;
    async function pipeRequest(signal, request, client, definition) {
      for await (const item of request) {
        (0, abort_controller_x_1.throwIfAborted)(signal);
        client.send({
          serializeBinary: () => definition.requestSerialize(item)
        });
      }
    }
  }
});

// node_modules/nice-grpc-web/lib/client/createServerStreamingMethod.js
var require_createServerStreamingMethod = __commonJS({
  "node_modules/nice-grpc-web/lib/client/createServerStreamingMethod.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createServerStreamingMethod = void 0;
    var grpc_web_1 = require_grpc_web_client();
    var abort_controller_x_1 = require_lib2();
    var AsyncSink_1 = require_AsyncSink();
    var nice_grpc_common_1 = require_lib();
    var service_definitions_1 = require_service_definitions();
    var convertMetadata_1 = require_convertMetadata();
    var isAsyncIterable_1 = require_isAsyncIterable();
    function createServerStreamingMethod(definition, channel, middleware, defaultOptions) {
      const grpcMethodDefinition = (0, service_definitions_1.toGrpcWebMethodDefinition)(definition);
      const methodDescriptor = {
        path: definition.path,
        requestStream: definition.requestStream,
        responseStream: definition.responseStream,
        options: definition.options
      };
      async function* serverStreamingMethod(request, options) {
        if ((0, isAsyncIterable_1.isAsyncIterable)(request)) {
          throw new Error("A middleware passed invalid request to next(): expected a single message for server streaming method");
        }
        const { metadata = (0, nice_grpc_common_1.Metadata)(), signal = new AbortController().signal, onHeader, onTrailer } = options;
        const sink = new AsyncSink_1.AsyncSink();
        const client = grpc_web_1.grpc.client(grpcMethodDefinition, {
          host: channel.address,
          transport: channel.transport
        });
        client.onHeaders((headers) => {
          onHeader === null || onHeader === void 0 ? void 0 : onHeader((0, convertMetadata_1.convertMetadataFromGrpcWeb)(headers));
        });
        client.onMessage((message) => {
          sink.write(message);
        });
        client.onEnd((code, message, trailers) => {
          onTrailer === null || onTrailer === void 0 ? void 0 : onTrailer((0, convertMetadata_1.convertMetadataFromGrpcWeb)(trailers));
          if (code === grpc_web_1.grpc.Code.OK) {
            sink.end();
          } else {
            sink.error(new nice_grpc_common_1.ClientError(definition.path, +code, message));
          }
        });
        client.start((0, convertMetadata_1.convertMetadataToGrpcWeb)(metadata));
        client.send({
          serializeBinary: () => definition.requestSerialize(request)
        });
        client.finishSend();
        const abortListener = () => {
          sink.error(new abort_controller_x_1.AbortError());
          client.close();
        };
        signal.addEventListener("abort", abortListener);
        try {
          yield* sink;
        } finally {
          signal.removeEventListener("abort", abortListener);
          (0, abort_controller_x_1.throwIfAborted)(signal);
        }
      }
      const method = middleware == null ? serverStreamingMethod : (request, options) => middleware({
        method: methodDescriptor,
        requestStream: false,
        request,
        responseStream: true,
        next: serverStreamingMethod
      }, options);
      return (request, options) => {
        const iterable = method(request, {
          ...defaultOptions,
          ...options
        });
        const iterator = iterable[Symbol.asyncIterator]();
        return {
          [Symbol.asyncIterator]() {
            return {
              async next() {
                const result = await iterator.next();
                if (result.done && result.value != null) {
                  return await iterator.throw(new Error("A middleware returned a message, but expected to return void for server streaming method"));
                }
                return result;
              },
              return() {
                return iterator.return();
              },
              throw(err) {
                return iterator.throw(err);
              }
            };
          }
        };
      };
    }
    exports2.createServerStreamingMethod = createServerStreamingMethod;
  }
});

// node_modules/nice-grpc-web/lib/client/createUnaryMethod.js
var require_createUnaryMethod = __commonJS({
  "node_modules/nice-grpc-web/lib/client/createUnaryMethod.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createUnaryMethod = void 0;
    var nice_grpc_common_1 = require_lib();
    var grpc_web_1 = require_grpc_web_client();
    var abort_controller_x_1 = require_lib2();
    var service_definitions_1 = require_service_definitions();
    var isAsyncIterable_1 = require_isAsyncIterable();
    var convertMetadata_1 = require_convertMetadata();
    function createUnaryMethod(definition, channel, middleware, defaultOptions) {
      const grpcMethodDefinition = (0, service_definitions_1.toGrpcWebMethodDefinition)(definition);
      const methodDescriptor = {
        path: definition.path,
        requestStream: definition.requestStream,
        responseStream: definition.responseStream,
        options: definition.options
      };
      async function* unaryMethod(request, options) {
        if ((0, isAsyncIterable_1.isAsyncIterable)(request)) {
          throw new Error("A middleware passed invalid request to next(): expected a single message for unary method");
        }
        const { metadata = (0, nice_grpc_common_1.Metadata)(), signal = new AbortController().signal, onHeader, onTrailer } = options;
        return await (0, abort_controller_x_1.execute)(signal, (resolve, reject) => {
          let response;
          const client = grpc_web_1.grpc.client(grpcMethodDefinition, {
            host: channel.address,
            transport: channel.transport
          });
          client.onHeaders((headers) => {
            onHeader === null || onHeader === void 0 ? void 0 : onHeader((0, convertMetadata_1.convertMetadataFromGrpcWeb)(headers));
          });
          client.onMessage((message) => {
            response = message;
          });
          client.onEnd((code, message, trailers) => {
            onTrailer === null || onTrailer === void 0 ? void 0 : onTrailer((0, convertMetadata_1.convertMetadataFromGrpcWeb)(trailers));
            if (code === grpc_web_1.grpc.Code.OK) {
              resolve(response);
            } else {
              reject(new nice_grpc_common_1.ClientError(definition.path, +code, message));
            }
          });
          client.start((0, convertMetadata_1.convertMetadataToGrpcWeb)(metadata));
          client.send({
            serializeBinary: () => definition.requestSerialize(request)
          });
          client.finishSend();
          return () => {
            client.close();
          };
        });
      }
      const method = middleware == null ? unaryMethod : (request, options) => middleware({
        method: methodDescriptor,
        requestStream: false,
        request,
        responseStream: false,
        next: unaryMethod
      }, options);
      return async (request, options) => {
        const iterable = method(request, {
          ...defaultOptions,
          ...options
        });
        const iterator = iterable[Symbol.asyncIterator]();
        let result = await iterator.next();
        while (true) {
          if (!result.done) {
            result = await iterator.throw(new Error("A middleware yielded a message, but expected to only return a message for unary method"));
            continue;
          }
          if (result.value == null) {
            result = await iterator.throw(new Error("A middleware returned void, but expected to return a message for unary method"));
            continue;
          }
          return result.value;
        }
      };
    }
    exports2.createUnaryMethod = createUnaryMethod;
  }
});

// node_modules/nice-grpc-web/lib/client/ClientFactory.js
var require_ClientFactory = __commonJS({
  "node_modules/nice-grpc-web/lib/client/ClientFactory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createClient = exports2.createClientFactory = void 0;
    var nice_grpc_common_1 = require_lib();
    var service_definitions_1 = require_service_definitions();
    var createBidiStreamingMethod_1 = require_createBidiStreamingMethod();
    var createClientStreamingMethod_1 = require_createClientStreamingMethod();
    var createServerStreamingMethod_1 = require_createServerStreamingMethod();
    var createUnaryMethod_1 = require_createUnaryMethod();
    function createClientFactory() {
      return createClientFactoryWithMiddleware();
    }
    exports2.createClientFactory = createClientFactory;
    function createClient2(definition, channel, defaultCallOptions) {
      return createClientFactory().create(definition, channel, defaultCallOptions);
    }
    exports2.createClient = createClient2;
    function createClientFactoryWithMiddleware(middleware) {
      return {
        use(newMiddleware) {
          return createClientFactoryWithMiddleware(middleware == null ? newMiddleware : (0, nice_grpc_common_1.composeClientMiddleware)(middleware, newMiddleware));
        },
        create(definition, channel, defaultCallOptions = {}) {
          const client = {};
          const methodEntries = Object.entries((0, service_definitions_1.normalizeServiceDefinition)(definition));
          for (const [methodName, methodDefinition] of methodEntries) {
            const defaultOptions = {
              ...defaultCallOptions["*"],
              ...defaultCallOptions[methodName]
            };
            if (!methodDefinition.requestStream) {
              if (!methodDefinition.responseStream) {
                client[methodName] = (0, createUnaryMethod_1.createUnaryMethod)(methodDefinition, channel, middleware, defaultOptions);
              } else {
                client[methodName] = (0, createServerStreamingMethod_1.createServerStreamingMethod)(methodDefinition, channel, middleware, defaultOptions);
              }
            } else {
              if (!methodDefinition.responseStream) {
                client[methodName] = (0, createClientStreamingMethod_1.createClientStreamingMethod)(methodDefinition, channel, middleware, defaultOptions);
              } else {
                client[methodName] = (0, createBidiStreamingMethod_1.createBidiStreamingMethod)(methodDefinition, channel, middleware, defaultOptions);
              }
            }
          }
          return client;
        }
      };
    }
  }
});

// node_modules/nice-grpc-web/lib/client/Client.js
var require_Client = __commonJS({
  "node_modules/nice-grpc-web/lib/client/Client.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/nice-grpc-web/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/nice-grpc-web/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m, k);
      if (!desc2 || ("get" in desc2 ? !m.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Status = exports2.Metadata = exports2.composeClientMiddleware = exports2.ClientError = void 0;
    var nice_grpc_common_1 = require_lib();
    Object.defineProperty(exports2, "ClientError", { enumerable: true, get: function() {
      return nice_grpc_common_1.ClientError;
    } });
    Object.defineProperty(exports2, "composeClientMiddleware", { enumerable: true, get: function() {
      return nice_grpc_common_1.composeClientMiddleware;
    } });
    Object.defineProperty(exports2, "Metadata", { enumerable: true, get: function() {
      return nice_grpc_common_1.Metadata;
    } });
    Object.defineProperty(exports2, "Status", { enumerable: true, get: function() {
      return nice_grpc_common_1.Status;
    } });
    __exportStar(require_service_definitions(), exports2);
    __exportStar(require_channel(), exports2);
    __exportStar(require_ClientFactory(), exports2);
    __exportStar(require_Client(), exports2);
  }
});

// ../../node_modules/@improbable-eng/grpc-web-node-http-transport/lib/index.js
var require_lib4 = __commonJS({
  "../../node_modules/@improbable-eng/grpc-web-node-http-transport/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NodeHttpTransport = void 0;
    var http = require("http");
    var https = require("https");
    var url = require("url");
    var grpc_web_1 = require_grpc_web_client();
    function NodeHttpTransport2() {
      return function(opts) {
        return new NodeHttp(opts);
      };
    }
    exports2.NodeHttpTransport = NodeHttpTransport2;
    var NodeHttp = function() {
      function NodeHttp2(transportOptions) {
        this.options = transportOptions;
      }
      NodeHttp2.prototype.sendMessage = function(msgBytes) {
        if (!this.options.methodDefinition.requestStream && !this.options.methodDefinition.responseStream) {
          this.request.setHeader("Content-Length", msgBytes.byteLength);
        }
        this.request.write(toBuffer(msgBytes));
        this.request.end();
      };
      NodeHttp2.prototype.finishSend = function() {
      };
      NodeHttp2.prototype.responseCallback = function(response) {
        var _this = this;
        this.options.debug && console.log("NodeHttp.response", response.statusCode);
        var headers = filterHeadersForUndefined(response.headers);
        this.options.onHeaders(new grpc_web_1.grpc.Metadata(headers), response.statusCode);
        response.on("data", function(chunk) {
          _this.options.debug && console.log("NodeHttp.data", chunk);
          _this.options.onChunk(toArrayBuffer(chunk));
        });
        response.on("end", function() {
          _this.options.debug && console.log("NodeHttp.end");
          _this.options.onEnd();
        });
      };
      ;
      NodeHttp2.prototype.start = function(metadata) {
        var _this = this;
        var headers = {};
        metadata.forEach(function(key, values) {
          headers[key] = values.join(", ");
        });
        var parsedUrl = url.parse(this.options.url);
        var httpOptions = {
          host: parsedUrl.hostname,
          port: parsedUrl.port ? parseInt(parsedUrl.port) : void 0,
          path: parsedUrl.path,
          headers,
          method: "POST"
        };
        if (parsedUrl.protocol === "https:") {
          this.request = https.request(httpOptions, this.responseCallback.bind(this));
        } else {
          this.request = http.request(httpOptions, this.responseCallback.bind(this));
        }
        this.request.on("error", function(err) {
          _this.options.debug && console.log("NodeHttp.error", err);
          _this.options.onEnd(err);
        });
      };
      NodeHttp2.prototype.cancel = function() {
        this.options.debug && console.log("NodeHttp.abort");
        this.request.abort();
      };
      return NodeHttp2;
    }();
    function filterHeadersForUndefined(headers) {
      var filteredHeaders = {};
      for (var key in headers) {
        var value = headers[key];
        if (headers.hasOwnProperty(key)) {
          if (value !== void 0) {
            filteredHeaders[key] = value;
          }
        }
      }
      return filteredHeaders;
    }
    function toArrayBuffer(buf) {
      var view = new Uint8Array(buf.length);
      for (var i = 0; i < buf.length; i++) {
        view[i] = buf[i];
      }
      return view;
    }
    function toBuffer(ab) {
      var buf = Buffer.alloc(ab.byteLength);
      for (var i = 0; i < buf.length; i++) {
        buf[i] = ab[i];
      }
      return buf;
    }
  }
});

// src/commands/faucet.ts
var faucet_exports = {};
__export(faucet_exports, {
  builder: () => builder,
  command: () => command,
  createFaucetService: () => createFaucetService,
  desc: () => desc,
  handler: () => handler
});
module.exports = __toCommonJS(faucet_exports);

// ../services/node_modules/long/index.js
var wasm = null;
try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    13,
    2,
    96,
    0,
    1,
    127,
    96,
    4,
    127,
    127,
    127,
    127,
    1,
    127,
    3,
    7,
    6,
    0,
    1,
    1,
    1,
    1,
    1,
    6,
    6,
    1,
    127,
    1,
    65,
    0,
    11,
    7,
    50,
    6,
    3,
    109,
    117,
    108,
    0,
    1,
    5,
    100,
    105,
    118,
    95,
    115,
    0,
    2,
    5,
    100,
    105,
    118,
    95,
    117,
    0,
    3,
    5,
    114,
    101,
    109,
    95,
    115,
    0,
    4,
    5,
    114,
    101,
    109,
    95,
    117,
    0,
    5,
    8,
    103,
    101,
    116,
    95,
    104,
    105,
    103,
    104,
    0,
    0,
    10,
    191,
    1,
    6,
    4,
    0,
    35,
    0,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    126,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    127,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    128,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    129,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    130,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11
  ])), {}).exports;
} catch (e) {
}
function Long(low, high, unsigned) {
  this.low = low | 0;
  this.high = high | 0;
  this.unsigned = !!unsigned;
}
Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });
function isLong(obj) {
  return (obj && obj["__isLong__"]) === true;
}
function ctz32(value) {
  var c = Math.clz32(value & -value);
  return value ? 31 - c : c;
}
Long.isLong = isLong;
var INT_CACHE = {};
var UINT_CACHE = {};
function fromInt(value, unsigned) {
  var obj, cachedObj, cache;
  if (unsigned) {
    value >>>= 0;
    if (cache = 0 <= value && value < 256) {
      cachedObj = UINT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, 0, true);
    if (cache)
      UINT_CACHE[value] = obj;
    return obj;
  } else {
    value |= 0;
    if (cache = -128 <= value && value < 128) {
      cachedObj = INT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, value < 0 ? -1 : 0, false);
    if (cache)
      INT_CACHE[value] = obj;
    return obj;
  }
}
Long.fromInt = fromInt;
function fromNumber(value, unsigned) {
  if (isNaN(value))
    return unsigned ? UZERO : ZERO;
  if (unsigned) {
    if (value < 0)
      return UZERO;
    if (value >= TWO_PWR_64_DBL)
      return MAX_UNSIGNED_VALUE;
  } else {
    if (value <= -TWO_PWR_63_DBL)
      return MIN_VALUE;
    if (value + 1 >= TWO_PWR_63_DBL)
      return MAX_VALUE;
  }
  if (value < 0)
    return fromNumber(-value, unsigned).neg();
  return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
}
Long.fromNumber = fromNumber;
function fromBits(lowBits, highBits, unsigned) {
  return new Long(lowBits, highBits, unsigned);
}
Long.fromBits = fromBits;
var pow_dbl = Math.pow;
function fromString(str, unsigned, radix) {
  if (str.length === 0)
    throw Error("empty string");
  if (typeof unsigned === "number") {
    radix = unsigned;
    unsigned = false;
  } else {
    unsigned = !!unsigned;
  }
  if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
    return unsigned ? UZERO : ZERO;
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  var p;
  if ((p = str.indexOf("-")) > 0)
    throw Error("interior hyphen");
  else if (p === 0) {
    return fromString(str.substring(1), unsigned, radix).neg();
  }
  var radixToPower = fromNumber(pow_dbl(radix, 8));
  var result = ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = fromNumber(pow_dbl(radix, size));
      result = result.mul(power).add(fromNumber(value));
    } else {
      result = result.mul(radixToPower);
      result = result.add(fromNumber(value));
    }
  }
  result.unsigned = unsigned;
  return result;
}
Long.fromString = fromString;
function fromValue(val, unsigned) {
  if (typeof val === "number")
    return fromNumber(val, unsigned);
  if (typeof val === "string")
    return fromString(val, unsigned);
  return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
}
Long.fromValue = fromValue;
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_24_DBL = 1 << 24;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
var ZERO = fromInt(0);
Long.ZERO = ZERO;
var UZERO = fromInt(0, true);
Long.UZERO = UZERO;
var ONE = fromInt(1);
Long.ONE = ONE;
var UONE = fromInt(1, true);
Long.UONE = UONE;
var NEG_ONE = fromInt(-1);
Long.NEG_ONE = NEG_ONE;
var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
Long.MAX_VALUE = MAX_VALUE;
var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
Long.MIN_VALUE = MIN_VALUE;
var LongPrototype = Long.prototype;
LongPrototype.toInt = function toInt() {
  return this.unsigned ? this.low >>> 0 : this.low;
};
LongPrototype.toNumber = function toNumber() {
  if (this.unsigned)
    return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
  return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};
LongPrototype.toString = function toString(radix) {
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  if (this.isZero())
    return "0";
  if (this.isNegative()) {
    if (this.eq(MIN_VALUE)) {
      var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
      return div.toString(radix) + rem1.toInt().toString(radix);
    } else
      return "-" + this.neg().toString(radix);
  }
  var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
  var result = "";
  while (true) {
    var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
    rem = remDiv;
    if (rem.isZero())
      return digits + result;
    else {
      while (digits.length < 6)
        digits = "0" + digits;
      result = "" + digits + result;
    }
  }
};
LongPrototype.getHighBits = function getHighBits() {
  return this.high;
};
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
  return this.high >>> 0;
};
LongPrototype.getLowBits = function getLowBits() {
  return this.low;
};
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
  return this.low >>> 0;
};
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
  if (this.isNegative())
    return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
  var val = this.high != 0 ? this.high : this.low;
  for (var bit = 31; bit > 0; bit--)
    if ((val & 1 << bit) != 0)
      break;
  return this.high != 0 ? bit + 33 : bit + 1;
};
LongPrototype.isZero = function isZero() {
  return this.high === 0 && this.low === 0;
};
LongPrototype.eqz = LongPrototype.isZero;
LongPrototype.isNegative = function isNegative() {
  return !this.unsigned && this.high < 0;
};
LongPrototype.isPositive = function isPositive() {
  return this.unsigned || this.high >= 0;
};
LongPrototype.isOdd = function isOdd() {
  return (this.low & 1) === 1;
};
LongPrototype.isEven = function isEven() {
  return (this.low & 1) === 0;
};
LongPrototype.equals = function equals(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
    return false;
  return this.high === other.high && this.low === other.low;
};
LongPrototype.eq = LongPrototype.equals;
LongPrototype.notEquals = function notEquals(other) {
  return !this.eq(other);
};
LongPrototype.neq = LongPrototype.notEquals;
LongPrototype.ne = LongPrototype.notEquals;
LongPrototype.lessThan = function lessThan(other) {
  return this.comp(other) < 0;
};
LongPrototype.lt = LongPrototype.lessThan;
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
  return this.comp(other) <= 0;
};
LongPrototype.lte = LongPrototype.lessThanOrEqual;
LongPrototype.le = LongPrototype.lessThanOrEqual;
LongPrototype.greaterThan = function greaterThan(other) {
  return this.comp(other) > 0;
};
LongPrototype.gt = LongPrototype.greaterThan;
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
  return this.comp(other) >= 0;
};
LongPrototype.gte = LongPrototype.greaterThanOrEqual;
LongPrototype.ge = LongPrototype.greaterThanOrEqual;
LongPrototype.compare = function compare(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.eq(other))
    return 0;
  var thisNeg = this.isNegative(), otherNeg = other.isNegative();
  if (thisNeg && !otherNeg)
    return -1;
  if (!thisNeg && otherNeg)
    return 1;
  if (!this.unsigned)
    return this.sub(other).isNegative() ? -1 : 1;
  return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
};
LongPrototype.comp = LongPrototype.compare;
LongPrototype.negate = function negate() {
  if (!this.unsigned && this.eq(MIN_VALUE))
    return MIN_VALUE;
  return this.not().add(ONE);
};
LongPrototype.neg = LongPrototype.negate;
LongPrototype.add = function add(addend) {
  if (!isLong(addend))
    addend = fromValue(addend);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = addend.high >>> 16;
  var b32 = addend.high & 65535;
  var b16 = addend.low >>> 16;
  var b00 = addend.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 + b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.subtract = function subtract(subtrahend) {
  if (!isLong(subtrahend))
    subtrahend = fromValue(subtrahend);
  return this.add(subtrahend.neg());
};
LongPrototype.sub = LongPrototype.subtract;
LongPrototype.multiply = function multiply(multiplier) {
  if (this.isZero())
    return this;
  if (!isLong(multiplier))
    multiplier = fromValue(multiplier);
  if (wasm) {
    var low = wasm["mul"](
      this.low,
      this.high,
      multiplier.low,
      multiplier.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (multiplier.isZero())
    return this.unsigned ? UZERO : ZERO;
  if (this.eq(MIN_VALUE))
    return multiplier.isOdd() ? MIN_VALUE : ZERO;
  if (multiplier.eq(MIN_VALUE))
    return this.isOdd() ? MIN_VALUE : ZERO;
  if (this.isNegative()) {
    if (multiplier.isNegative())
      return this.neg().mul(multiplier.neg());
    else
      return this.neg().mul(multiplier).neg();
  } else if (multiplier.isNegative())
    return this.mul(multiplier.neg()).neg();
  if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
    return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = multiplier.high >>> 16;
  var b32 = multiplier.high & 65535;
  var b16 = multiplier.low >>> 16;
  var b00 = multiplier.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.mul = LongPrototype.multiply;
LongPrototype.divide = function divide(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (divisor.isZero())
    throw Error("division by zero");
  if (wasm) {
    if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
      return this;
    }
    var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (this.isZero())
    return this.unsigned ? UZERO : ZERO;
  var approx, rem, res;
  if (!this.unsigned) {
    if (this.eq(MIN_VALUE)) {
      if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
        return MIN_VALUE;
      else if (divisor.eq(MIN_VALUE))
        return ONE;
      else {
        var halfThis = this.shr(1);
        approx = halfThis.div(divisor).shl(1);
        if (approx.eq(ZERO)) {
          return divisor.isNegative() ? ONE : NEG_ONE;
        } else {
          rem = this.sub(divisor.mul(approx));
          res = approx.add(rem.div(divisor));
          return res;
        }
      }
    } else if (divisor.eq(MIN_VALUE))
      return this.unsigned ? UZERO : ZERO;
    if (this.isNegative()) {
      if (divisor.isNegative())
        return this.neg().div(divisor.neg());
      return this.neg().div(divisor).neg();
    } else if (divisor.isNegative())
      return this.div(divisor.neg()).neg();
    res = ZERO;
  } else {
    if (!divisor.unsigned)
      divisor = divisor.toUnsigned();
    if (divisor.gt(this))
      return UZERO;
    if (divisor.gt(this.shru(1)))
      return UONE;
    res = UZERO;
  }
  rem = this;
  while (rem.gte(divisor)) {
    approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
    var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
    while (approxRem.isNegative() || approxRem.gt(rem)) {
      approx -= delta;
      approxRes = fromNumber(approx, this.unsigned);
      approxRem = approxRes.mul(divisor);
    }
    if (approxRes.isZero())
      approxRes = ONE;
    res = res.add(approxRes);
    rem = rem.sub(approxRem);
  }
  return res;
};
LongPrototype.div = LongPrototype.divide;
LongPrototype.modulo = function modulo(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (wasm) {
    var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  return this.sub(this.div(divisor).mul(divisor));
};
LongPrototype.mod = LongPrototype.modulo;
LongPrototype.rem = LongPrototype.modulo;
LongPrototype.not = function not() {
  return fromBits(~this.low, ~this.high, this.unsigned);
};
LongPrototype.countLeadingZeros = function countLeadingZeros() {
  return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
};
LongPrototype.clz = LongPrototype.countLeadingZeros;
LongPrototype.countTrailingZeros = function countTrailingZeros() {
  return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
};
LongPrototype.ctz = LongPrototype.countTrailingZeros;
LongPrototype.and = function and(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};
LongPrototype.or = function or(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};
LongPrototype.xor = function xor(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};
LongPrototype.shiftLeft = function shiftLeft(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
  else
    return fromBits(0, this.low << numBits - 32, this.unsigned);
};
LongPrototype.shl = LongPrototype.shiftLeft;
LongPrototype.shiftRight = function shiftRight(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
  else
    return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
};
LongPrototype.shr = LongPrototype.shiftRight;
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits < 32)
    return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
  if (numBits === 32)
    return fromBits(this.high, 0, this.unsigned);
  return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
};
LongPrototype.shru = LongPrototype.shiftRightUnsigned;
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
LongPrototype.rotateLeft = function rotateLeft(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
};
LongPrototype.rotl = LongPrototype.rotateLeft;
LongPrototype.rotateRight = function rotateRight(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
};
LongPrototype.rotr = LongPrototype.rotateRight;
LongPrototype.toSigned = function toSigned() {
  if (!this.unsigned)
    return this;
  return fromBits(this.low, this.high, false);
};
LongPrototype.toUnsigned = function toUnsigned() {
  if (this.unsigned)
    return this;
  return fromBits(this.low, this.high, true);
};
LongPrototype.toBytes = function toBytes(le) {
  return le ? this.toBytesLE() : this.toBytesBE();
};
LongPrototype.toBytesLE = function toBytesLE() {
  var hi = this.high, lo = this.low;
  return [
    lo & 255,
    lo >>> 8 & 255,
    lo >>> 16 & 255,
    lo >>> 24,
    hi & 255,
    hi >>> 8 & 255,
    hi >>> 16 & 255,
    hi >>> 24
  ];
};
LongPrototype.toBytesBE = function toBytesBE() {
  var hi = this.high, lo = this.low;
  return [
    hi >>> 24,
    hi >>> 16 & 255,
    hi >>> 8 & 255,
    hi & 255,
    lo >>> 24,
    lo >>> 16 & 255,
    lo >>> 8 & 255,
    lo & 255
  ];
};
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
  return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
  return new Long(
    bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
    bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
    unsigned
  );
};
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
  return new Long(
    bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
    bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
    unsigned
  );
};
var long_default = Long;

// ../services/protobuf/ts/faucet/faucet.ts
var import_minimal = __toESM(require_minimal2());
function createBaseLinkedTwitterPair() {
  return { username: "", address: "" };
}
var LinkedTwitterPair = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLinkedTwitterPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseLinkedTwitterPair();
    message.username = object.username ?? "";
    message.address = object.address ?? "";
    return message;
  }
};
function createBaseDripRequest() {
  return { username: "", address: "" };
}
var DripRequest = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseDripRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        case 2:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseDripRequest();
    message.username = object.username ?? "";
    message.address = object.address ?? "";
    return message;
  }
};
function createBaseDripDevRequest() {
  return { address: "" };
}
var DripDevRequest = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseDripDevRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseDripDevRequest();
    message.address = object.address ?? "";
    return message;
  }
};
function createBaseDripResponse() {
  return { dripTxHash: "", ecsTxHash: "" };
}
var DripResponse = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.dripTxHash !== "") {
      writer.uint32(10).string(message.dripTxHash);
    }
    if (message.ecsTxHash !== "") {
      writer.uint32(18).string(message.ecsTxHash);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseDripResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dripTxHash = reader.string();
          break;
        case 2:
          message.ecsTxHash = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseDripResponse();
    message.dripTxHash = object.dripTxHash ?? "";
    message.ecsTxHash = object.ecsTxHash ?? "";
    return message;
  }
};
function createBaseTimeUntilDripResponse() {
  return { timeUntilDripMinutes: 0, timeUntilDripSeconds: 0 };
}
var TimeUntilDripResponse = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.timeUntilDripMinutes !== 0) {
      writer.uint32(9).double(message.timeUntilDripMinutes);
    }
    if (message.timeUntilDripSeconds !== 0) {
      writer.uint32(17).double(message.timeUntilDripSeconds);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseTimeUntilDripResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timeUntilDripMinutes = reader.double();
          break;
        case 2:
          message.timeUntilDripSeconds = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseTimeUntilDripResponse();
    message.timeUntilDripMinutes = object.timeUntilDripMinutes ?? 0;
    message.timeUntilDripSeconds = object.timeUntilDripSeconds ?? 0;
    return message;
  }
};
function createBaseGetLinkedTwittersRequest() {
  return {};
}
var GetLinkedTwittersRequest = {
  encode(_, writer = import_minimal.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseGetLinkedTwittersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_) {
    const message = createBaseGetLinkedTwittersRequest();
    return message;
  }
};
function createBaseGetLinkedTwittersResponse() {
  return { linkedTwitters: [] };
}
var GetLinkedTwittersResponse = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    for (const v of message.linkedTwitters) {
      LinkedTwitterPair.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseGetLinkedTwittersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.linkedTwitters.push(LinkedTwitterPair.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseGetLinkedTwittersResponse();
    message.linkedTwitters = object.linkedTwitters?.map((e) => LinkedTwitterPair.fromPartial(e)) || [];
    return message;
  }
};
function createBaseLinkedTwitterForAddressRequest() {
  return { address: "" };
}
var LinkedTwitterForAddressRequest = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLinkedTwitterForAddressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseLinkedTwitterForAddressRequest();
    message.address = object.address ?? "";
    return message;
  }
};
function createBaseLinkedTwitterForAddressResponse() {
  return { username: "" };
}
var LinkedTwitterForAddressResponse = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLinkedTwitterForAddressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseLinkedTwitterForAddressResponse();
    message.username = object.username ?? "";
    return message;
  }
};
function createBaseLinkedAddressForTwitterRequest() {
  return { username: "" };
}
var LinkedAddressForTwitterRequest = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLinkedAddressForTwitterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.username = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseLinkedAddressForTwitterRequest();
    message.username = object.username ?? "";
    return message;
  }
};
function createBaseLinkedAddressForTwitterResponse() {
  return { address: "" };
}
var LinkedAddressForTwitterResponse = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLinkedAddressForTwitterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseLinkedAddressForTwitterResponse();
    message.address = object.address ?? "";
    return message;
  }
};
function createBaseSetLinkedTwitterRequest() {
  return { address: "", username: "", signature: "" };
}
var SetLinkedTwitterRequest = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.signature !== "") {
      writer.uint32(26).string(message.signature);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSetLinkedTwitterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.username = reader.string();
          break;
        case 3:
          message.signature = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object) {
    const message = createBaseSetLinkedTwitterRequest();
    message.address = object.address ?? "";
    message.username = object.username ?? "";
    message.signature = object.signature ?? "";
    return message;
  }
};
function createBaseSetLinkedTwitterResponse() {
  return {};
}
var SetLinkedTwitterResponse = {
  encode(_, writer = import_minimal.default.Writer.create()) {
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSetLinkedTwitterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(_) {
    const message = createBaseSetLinkedTwitterResponse();
    return message;
  }
};
var FaucetServiceDefinition = {
  name: "FaucetService",
  fullName: "faucet.FaucetService",
  methods: {
    drip: {
      name: "Drip",
      requestType: DripRequest,
      requestStream: false,
      responseType: DripResponse,
      responseStream: false,
      options: {}
    },
    dripDev: {
      name: "DripDev",
      requestType: DripDevRequest,
      requestStream: false,
      responseType: DripResponse,
      responseStream: false,
      options: {}
    },
    dripVerifyTweet: {
      name: "DripVerifyTweet",
      requestType: DripRequest,
      requestStream: false,
      responseType: DripResponse,
      responseStream: false,
      options: {}
    },
    timeUntilDrip: {
      name: "TimeUntilDrip",
      requestType: DripRequest,
      requestStream: false,
      responseType: TimeUntilDripResponse,
      responseStream: false,
      options: {}
    },
    getLinkedTwitters: {
      name: "GetLinkedTwitters",
      requestType: GetLinkedTwittersRequest,
      requestStream: false,
      responseType: GetLinkedTwittersResponse,
      responseStream: false,
      options: {}
    },
    getLinkedTwitterForAddress: {
      name: "GetLinkedTwitterForAddress",
      requestType: LinkedTwitterForAddressRequest,
      requestStream: false,
      responseType: LinkedTwitterForAddressResponse,
      responseStream: false,
      options: {}
    },
    getLinkedAddressForTwitter: {
      name: "GetLinkedAddressForTwitter",
      requestType: LinkedAddressForTwitterRequest,
      requestStream: false,
      responseType: LinkedAddressForTwitterResponse,
      responseStream: false,
      options: {}
    },
    setLinkedTwitter: {
      name: "SetLinkedTwitter",
      requestType: SetLinkedTwitterRequest,
      requestStream: false,
      responseType: SetLinkedTwitterResponse,
      responseStream: false,
      options: {}
    }
  }
};
var globalThis = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();
if (import_minimal.default.util.Long !== long_default) {
  import_minimal.default.util.Long = long_default;
  import_minimal.default.configure();
}

// src/commands/faucet.ts
var import_nice_grpc_web = __toESM(require_lib3());

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  const styles2 = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  styles2.color.gray = styles2.color.blackBright;
  styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
  styles2.color.grey = styles2.color.blackBright;
  styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
  for (const [groupName, group] of Object.entries(styles2)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles2[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles2[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles2, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles2, "codes", {
    value: codes,
    enumerable: false
  });
  styles2.color.close = "\x1B[39m";
  styles2.bgColor.close = "\x1B[49m";
  styles2.color.ansi = wrapAnsi16();
  styles2.color.ansi256 = wrapAnsi256();
  styles2.color.ansi16m = wrapAnsi16m();
  styles2.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles2, {
    rgbToAnsi256: {
      value: (red, green, blue) => {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value: (hex) => {
        const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let { colorString } = matches.groups;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles2.rgbToAnsi256(...styles2.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value: (code) => {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles2.ansi256ToAnsi(styles2.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles2.ansi256ToAnsi(styles2.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles2;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_os = __toESM(require("node:os"), 1);
var import_node_tty = __toESM(require("node:tty"), 1);
function hasFlag(flag, argv = import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app":
        return version >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles[styleName] = {
    get() {
      const builder2 = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder2 });
      return builder2;
    }
  };
}
styles.visible = {
  get() {
    const builder2 = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder2 });
    return builder2;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder2 = (...arguments_) => applyStyle(builder2, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder2, proto);
  builder2[GENERATOR] = self2;
  builder2[STYLER] = _styler;
  builder2[IS_EMPTY] = _isEmpty;
  return builder2;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/commands/faucet.ts
var import_grpc_web_node_http_transport = __toESM(require_lib4());
var command = "faucet";
var desc = "Interact with a MUD faucet";
function createFaucetService(url) {
  return (0, import_nice_grpc_web.createClient)(FaucetServiceDefinition, (0, import_nice_grpc_web.createChannel)(url, (0, import_grpc_web_node_http_transport.NodeHttpTransport)()));
}
var builder = (yargs) => yargs.options({
  dripDev: {
    type: "boolean",
    desc: "Request a drip from the dev endpoint (requires faucet to have dev mode enabled)",
    default: true
  },
  faucetUrl: {
    type: "string",
    desc: "URL of the MUD faucet",
    default: "https://faucet.testnet-mud-services.linfra.xyz"
  },
  address: {
    type: "string",
    desc: "Ethereum address to fund",
    required: true
  }
});
var handler = async (argv) => {
  const { dripDev, faucetUrl, address } = argv;
  const faucet = createFaucetService(faucetUrl);
  if (dripDev) {
    console.log(source_default.yellow("Dripping to", address));
    await faucet.dripDev({ address });
    console.log(source_default.yellow("Success"));
  }
  process.exit(0);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  command,
  createFaucetService,
  desc,
  handler
});
/**
 * @license
 * Copyright 2009 The Closure Library Authors
 * Copyright 2020 Daniel Wirtz / The long.js Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
