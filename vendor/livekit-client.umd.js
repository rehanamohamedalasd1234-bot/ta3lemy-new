var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __yieldStar = (value) => {
  var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
  if (obj == null) {
    obj = value[__knownSymbol("iterator")]();
    method = (k) => it[k] = (x) => obj[k](x);
  } else {
    obj = obj.call(value);
    method = (k) => it[k] = (v) => {
      if (isAwait) {
        isAwait = false;
        if (k === "throw") throw v;
        return v;
      }
      isAwait = true;
      return {
        done: false,
        value: new __await(new Promise((resolve) => {
          var x = obj[k](v);
          if (!(x instanceof Object)) __typeError("Object expected");
          resolve(x);
        }), 1)
      };
    };
  }
  return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
    throw x;
  }, "return" in obj && method("return"), it;
};
!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).LivekitClient = {});
})(this, (function(e) {
  "use strict";
  function t(e2, t2) {
    return t2.forEach((function(t3) {
      t3 && "string" != typeof t3 && !Array.isArray(t3) && Object.keys(t3).forEach((function(n2) {
        if ("default" !== n2 && !(n2 in e2)) {
          var i2 = Object.getOwnPropertyDescriptor(t3, n2);
          Object.defineProperty(e2, n2, i2.get ? i2 : { enumerable: true, get: function() {
            return t3[n2];
          } });
        }
      }));
    })), Object.freeze(e2);
  }
  var n = Object.defineProperty, i = (e2, t2, i2) => ((e3, t3, i3) => t3 in e3 ? n(e3, t3, { enumerable: true, configurable: true, writable: true, value: i3 }) : e3[t3] = i3)(e2, "symbol" != typeof t2 ? t2 + "" : t2, i2);
  class r {
    constructor() {
      i(this, "_locking"), i(this, "_locks"), this._locking = Promise.resolve(), this._locks = 0;
    }
    isLocked() {
      return this._locks > 0;
    }
    lock() {
      let e2;
      this._locks += 1;
      const t2 = new Promise(((t3) => e2 = () => {
        this._locks -= 1, t3();
      })), n2 = this._locking.then((() => e2));
      return this._locking = this._locking.then((() => t2)), n2;
    }
  }
  function o(e2, t2) {
    if (!e2) throw new Error(t2);
  }
  function s(e2) {
    if ("number" != typeof e2) throw new Error("invalid int 32: " + typeof e2);
    if (!Number.isInteger(e2) || e2 > 2147483647 || e2 < -2147483648) throw new Error("invalid int 32: " + e2);
  }
  function a(e2) {
    if ("number" != typeof e2) throw new Error("invalid uint 32: " + typeof e2);
    if (!Number.isInteger(e2) || e2 > 4294967295 || e2 < 0) throw new Error("invalid uint 32: " + e2);
  }
  function c(e2) {
    if ("number" != typeof e2) throw new Error("invalid float 32: " + typeof e2);
    if (Number.isFinite(e2) && (e2 > 34028234663852886e22 || e2 < -34028234663852886e22)) throw new Error("invalid float 32: " + e2);
  }
  const d = /* @__PURE__ */ Symbol("@bufbuild/protobuf/enum-type");
  function l(e2) {
    const t2 = e2[d];
    return o(t2, "missing enum type on enum object"), t2;
  }
  function u(e2, t2, n2, i2) {
    e2[d] = h(t2, n2.map(((t3) => ({ no: t3.no, name: t3.name, localName: e2[t3.no] }))));
  }
  function h(e2, t2, n2) {
    const i2 = /* @__PURE__ */ Object.create(null), r2 = /* @__PURE__ */ Object.create(null), o2 = [];
    for (const s2 of t2) {
      const e3 = m(s2);
      o2.push(e3), i2[s2.name] = e3, r2[s2.no] = e3;
    }
    return { typeName: e2, values: o2, findName: (e3) => i2[e3], findNumber: (e3) => r2[e3] };
  }
  function p(e2, t2, n2) {
    const i2 = {};
    for (const r2 of t2) {
      const e3 = m(r2);
      i2[e3.localName] = e3.no, i2[e3.no] = e3.localName;
    }
    return u(i2, e2, t2), i2;
  }
  function m(e2) {
    return "localName" in e2 ? e2 : Object.assign(Object.assign({}, e2), { localName: e2.name });
  }
  class g {
    equals(e2) {
      return this.getType().runtime.util.equals(this.getType(), this, e2);
    }
    clone() {
      return this.getType().runtime.util.clone(this);
    }
    fromBinary(e2, t2) {
      const n2 = this.getType().runtime.bin, i2 = n2.makeReadOptions(t2);
      return n2.readMessage(this, i2.readerFactory(e2), e2.byteLength, i2), this;
    }
    fromJson(e2, t2) {
      const n2 = this.getType(), i2 = n2.runtime.json, r2 = i2.makeReadOptions(t2);
      return i2.readMessage(n2, e2, r2, this), this;
    }
    fromJsonString(e2, t2) {
      let i2;
      try {
        i2 = JSON.parse(e2);
      } catch (n2) {
        throw new Error("cannot decode ".concat(this.getType().typeName, " from JSON: ").concat(n2 instanceof Error ? n2.message : String(n2)));
      }
      return this.fromJson(i2, t2);
    }
    toBinary(e2) {
      const t2 = this.getType().runtime.bin, n2 = t2.makeWriteOptions(e2), i2 = n2.writerFactory();
      return t2.writeMessage(this, i2, n2), i2.finish();
    }
    toJson(e2) {
      const t2 = this.getType().runtime.json, n2 = t2.makeWriteOptions(e2);
      return t2.writeMessage(this, n2);
    }
    toJsonString(e2) {
      var t2;
      const n2 = this.toJson(e2);
      return JSON.stringify(n2, null, null !== (t2 = null == e2 ? void 0 : e2.prettySpaces) && void 0 !== t2 ? t2 : 0);
    }
    toJSON() {
      return this.toJson({ emitDefaultValues: true });
    }
    getType() {
      return Object.getPrototypeOf(this).constructor;
    }
  }
  function v() {
    let e2 = 0, t2 = 0;
    for (let i2 = 0; i2 < 28; i2 += 7) {
      let n3 = this.buf[this.pos++];
      if (e2 |= (127 & n3) << i2, !(128 & n3)) return this.assertBounds(), [e2, t2];
    }
    let n2 = this.buf[this.pos++];
    if (e2 |= (15 & n2) << 28, t2 = (112 & n2) >> 4, !(128 & n2)) return this.assertBounds(), [e2, t2];
    for (let i2 = 3; i2 <= 31; i2 += 7) {
      let n3 = this.buf[this.pos++];
      if (t2 |= (127 & n3) << i2, !(128 & n3)) return this.assertBounds(), [e2, t2];
    }
    throw new Error("invalid varint");
  }
  function f(e2, t2, n2) {
    for (let o2 = 0; o2 < 28; o2 += 7) {
      const i3 = e2 >>> o2, r3 = !(i3 >>> 7 == 0 && 0 == t2), s2 = 255 & (r3 ? 128 | i3 : i3);
      if (n2.push(s2), !r3) return;
    }
    const i2 = e2 >>> 28 & 15 | (7 & t2) << 4, r2 = !!(t2 >> 3);
    if (n2.push(255 & (r2 ? 128 | i2 : i2)), r2) {
      for (let e3 = 3; e3 < 31; e3 += 7) {
        const i3 = t2 >>> e3, r3 = !(i3 >>> 7 == 0), o2 = 255 & (r3 ? 128 | i3 : i3);
        if (n2.push(o2), !r3) return;
      }
      n2.push(t2 >>> 31 & 1);
    }
  }
  const k = 4294967296;
  function y(e2) {
    const t2 = "-" === e2[0];
    t2 && (e2 = e2.slice(1));
    const n2 = 1e6;
    let i2 = 0, r2 = 0;
    function o2(t3, o3) {
      const s2 = Number(e2.slice(t3, o3));
      r2 *= n2, i2 = i2 * n2 + s2, i2 >= k && (r2 += i2 / k | 0, i2 %= k);
    }
    return o2(-24, -18), o2(-18, -12), o2(-12, -6), o2(-6), t2 ? S(i2, r2) : T(i2, r2);
  }
  function b(e2, t2) {
    var n2 = (function(e3, t3) {
      return { lo: e3 >>> 0, hi: t3 >>> 0 };
    })(e2, t2);
    if (e2 = n2.lo, (t2 = n2.hi) <= 2097151) return String(k * t2 + e2);
    const i2 = 16777215 & (e2 >>> 24 | t2 << 8), r2 = t2 >> 16 & 65535;
    let o2 = (16777215 & e2) + 6777216 * i2 + 6710656 * r2, s2 = i2 + 8147497 * r2, a2 = 2 * r2;
    const c2 = 1e7;
    return o2 >= c2 && (s2 += Math.floor(o2 / c2), o2 %= c2), s2 >= c2 && (a2 += Math.floor(s2 / c2), s2 %= c2), a2.toString() + E(s2) + E(o2);
  }
  function T(e2, t2) {
    return { lo: 0 | e2, hi: 0 | t2 };
  }
  function S(e2, t2) {
    return t2 = ~t2, e2 ? e2 = 1 + ~e2 : t2 += 1, T(e2, t2);
  }
  const E = (e2) => {
    const t2 = String(e2);
    return "0000000".slice(t2.length) + t2;
  };
  function C(e2, t2) {
    if (e2 >= 0) {
      for (; e2 > 127; ) t2.push(127 & e2 | 128), e2 >>>= 7;
      t2.push(e2);
    } else {
      for (let n2 = 0; n2 < 9; n2++) t2.push(127 & e2 | 128), e2 >>= 7;
      t2.push(1);
    }
  }
  function w() {
    let e2 = this.buf[this.pos++], t2 = 127 & e2;
    if (!(128 & e2)) return this.assertBounds(), t2;
    if (e2 = this.buf[this.pos++], t2 |= (127 & e2) << 7, !(128 & e2)) return this.assertBounds(), t2;
    if (e2 = this.buf[this.pos++], t2 |= (127 & e2) << 14, !(128 & e2)) return this.assertBounds(), t2;
    if (e2 = this.buf[this.pos++], t2 |= (127 & e2) << 21, !(128 & e2)) return this.assertBounds(), t2;
    e2 = this.buf[this.pos++], t2 |= (15 & e2) << 28;
    for (let n2 = 5; 128 & e2 && n2 < 10; n2++) e2 = this.buf[this.pos++];
    if (128 & e2) throw new Error("invalid varint");
    return this.assertBounds(), t2 >>> 0;
  }
  const R = (function() {
    const e2 = new DataView(new ArrayBuffer(8));
    if ("function" == typeof BigInt && "function" == typeof e2.getBigInt64 && "function" == typeof e2.getBigUint64 && "function" == typeof e2.setBigInt64 && "function" == typeof e2.setBigUint64 && ("object" != typeof process || "object" != typeof process.env || "1" !== process.env.BUF_BIGINT_DISABLE)) {
      const t3 = BigInt("-9223372036854775808"), n3 = BigInt("9223372036854775807"), i2 = BigInt("0"), r2 = BigInt("18446744073709551615");
      return { zero: BigInt(0), supported: true, parse(e3) {
        const i3 = "bigint" == typeof e3 ? e3 : BigInt(e3);
        if (i3 > n3 || i3 < t3) throw new Error("int64 invalid: ".concat(e3));
        return i3;
      }, uParse(e3) {
        const t4 = "bigint" == typeof e3 ? e3 : BigInt(e3);
        if (t4 > r2 || t4 < i2) throw new Error("uint64 invalid: ".concat(e3));
        return t4;
      }, enc(t4) {
        return e2.setBigInt64(0, this.parse(t4), true), { lo: e2.getInt32(0, true), hi: e2.getInt32(4, true) };
      }, uEnc(t4) {
        return e2.setBigInt64(0, this.uParse(t4), true), { lo: e2.getInt32(0, true), hi: e2.getInt32(4, true) };
      }, dec: (t4, n4) => (e2.setInt32(0, t4, true), e2.setInt32(4, n4, true), e2.getBigInt64(0, true)), uDec: (t4, n4) => (e2.setInt32(0, t4, true), e2.setInt32(4, n4, true), e2.getBigUint64(0, true)) };
    }
    const t2 = (e3) => o(/^-?[0-9]+$/.test(e3), "int64 invalid: ".concat(e3)), n2 = (e3) => o(/^[0-9]+$/.test(e3), "uint64 invalid: ".concat(e3));
    return { zero: "0", supported: false, parse: (e3) => ("string" != typeof e3 && (e3 = e3.toString()), t2(e3), e3), uParse: (e3) => ("string" != typeof e3 && (e3 = e3.toString()), n2(e3), e3), enc: (e3) => ("string" != typeof e3 && (e3 = e3.toString()), t2(e3), y(e3)), uEnc: (e3) => ("string" != typeof e3 && (e3 = e3.toString()), n2(e3), y(e3)), dec: (e3, t3) => (function(e4, t4) {
      let n3 = T(e4, t4);
      const i2 = 2147483648 & n3.hi;
      i2 && (n3 = S(n3.lo, n3.hi));
      const r2 = b(n3.lo, n3.hi);
      return i2 ? "-" + r2 : r2;
    })(e3, t3), uDec: (e3, t3) => b(e3, t3) };
  })();
  var P, I, _;
  function M(e2, t2, n2) {
    if (t2 === n2) return true;
    if (e2 == P.BYTES) {
      if (!(t2 instanceof Uint8Array && n2 instanceof Uint8Array)) return false;
      if (t2.length !== n2.length) return false;
      for (let e3 = 0; e3 < t2.length; e3++) if (t2[e3] !== n2[e3]) return false;
      return true;
    }
    switch (e2) {
      case P.UINT64:
      case P.FIXED64:
      case P.INT64:
      case P.SFIXED64:
      case P.SINT64:
        return t2 == n2;
    }
    return false;
  }
  function D(e2, t2) {
    switch (e2) {
      case P.BOOL:
        return false;
      case P.UINT64:
      case P.FIXED64:
      case P.INT64:
      case P.SFIXED64:
      case P.SINT64:
        return 0 == t2 ? R.zero : "0";
      case P.DOUBLE:
      case P.FLOAT:
        return 0;
      case P.BYTES:
        return new Uint8Array(0);
      case P.STRING:
        return "";
      default:
        return 0;
    }
  }
  function O(e2, t2) {
    switch (e2) {
      case P.BOOL:
        return false === t2;
      case P.STRING:
        return "" === t2;
      case P.BYTES:
        return t2 instanceof Uint8Array && !t2.byteLength;
      default:
        return 0 == t2;
    }
  }
  function A(e2, t2) {
    this.v = e2, this.k = t2;
  }
  function L(e2, t2) {
    (null == t2 || t2 > e2.length) && (t2 = e2.length);
    for (var n2 = 0, i2 = Array(t2); n2 < t2; n2++) i2[n2] = e2[n2];
    return i2;
  }
  function N(e2) {
    if (Array.isArray(e2)) return e2;
  }
  function x(e2, t2, n2) {
    return (t2 = (function(e3) {
      var t3 = (function(e4, t4) {
        if ("object" != typeof e4 || !e4) return e4;
        var n3 = e4[Symbol.toPrimitive];
        if (void 0 !== n3) {
          var i2 = n3.call(e4, t4);
          if ("object" != typeof i2) return i2;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === t4 ? String : Number)(e4);
      })(e3, "string");
      return "symbol" == typeof t3 ? t3 : t3 + "";
    })(t2)) in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t2] = n2, e2;
  }
  function U() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function F(e2, t2) {
    var n2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var i2 = Object.getOwnPropertySymbols(e2);
      t2 && (i2 = i2.filter((function(t3) {
        return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
      }))), n2.push.apply(n2, i2);
    }
    return n2;
  }
  function j(e2, t2) {
    return N(e2) || (function(e3, t3) {
      var n2 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
      if (null != n2) {
        var i2, r2, o2, s2, a2 = [], c2 = true, d2 = false;
        try {
          if (o2 = (n2 = n2.call(e3)).next, 0 === t3) {
            if (Object(n2) !== n2) return;
            c2 = false;
          } else for (; !(c2 = (i2 = o2.call(n2)).done) && (a2.push(i2.value), a2.length !== t3); c2 = true) ;
        } catch (e4) {
          d2 = true, r2 = e4;
        } finally {
          try {
            if (!c2 && null != n2.return && (s2 = n2.return(), Object(s2) !== s2)) return;
          } finally {
            if (d2) throw r2;
          }
        }
        return a2;
      }
    })(e2, t2) || q(e2, t2) || U();
  }
  function B(e2) {
    return N(e2) || (function(e3) {
      if ("undefined" != typeof Symbol && null != e3[Symbol.iterator] || null != e3["@@iterator"]) return Array.from(e3);
    })(e2) || q(e2) || U();
  }
  function q(e2, t2) {
    if (e2) {
      if ("string" == typeof e2) return L(e2, t2);
      var n2 = {}.toString.call(e2).slice(8, -1);
      return "Object" === n2 && e2.constructor && (n2 = e2.constructor.name), "Map" === n2 || "Set" === n2 ? Array.from(e2) : "Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2) ? L(e2, t2) : void 0;
    }
  }
  function V(e2) {
    var t2, n2;
    function i2(t3, n3) {
      try {
        var o2 = e2[t3](n3), s2 = o2.value, a2 = s2 instanceof A;
        Promise.resolve(a2 ? s2.v : s2).then((function(n4) {
          if (a2) {
            var c2 = "return" === t3 && s2.k ? t3 : "next";
            if (!s2.k || n4.done) return i2(c2, n4);
            n4 = e2[c2](n4).value;
          }
          r2(!!o2.done, n4);
        }), (function(e3) {
          i2("throw", e3);
        }));
      } catch (e3) {
        r2(2, e3);
      }
    }
    function r2(e3, r3) {
      2 === e3 ? t2.reject(r3) : t2.resolve({ value: r3, done: e3 }), (t2 = t2.next) ? i2(t2.key, t2.arg) : n2 = null;
    }
    this._invoke = function(e3, r3) {
      return new Promise((function(o2, s2) {
        var a2 = { key: e3, arg: r3, resolve: o2, reject: s2, next: null };
        n2 ? n2 = n2.next = a2 : (t2 = n2 = a2, i2(e3, r3));
      }));
    }, "function" != typeof e2.return && (this.return = void 0);
  }
  !(function(e2) {
    e2[e2.DOUBLE = 1] = "DOUBLE", e2[e2.FLOAT = 2] = "FLOAT", e2[e2.INT64 = 3] = "INT64", e2[e2.UINT64 = 4] = "UINT64", e2[e2.INT32 = 5] = "INT32", e2[e2.FIXED64 = 6] = "FIXED64", e2[e2.FIXED32 = 7] = "FIXED32", e2[e2.BOOL = 8] = "BOOL", e2[e2.STRING = 9] = "STRING", e2[e2.BYTES = 12] = "BYTES", e2[e2.UINT32 = 13] = "UINT32", e2[e2.SFIXED32 = 15] = "SFIXED32", e2[e2.SFIXED64 = 16] = "SFIXED64", e2[e2.SINT32 = 17] = "SINT32", e2[e2.SINT64 = 18] = "SINT64";
  })(P || (P = {})), (function(e2) {
    e2[e2.BIGINT = 0] = "BIGINT", e2[e2.STRING = 1] = "STRING";
  })(I || (I = {})), V.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
  }, V.prototype.next = function(e2) {
    return this._invoke("next", e2);
  }, V.prototype.throw = function(e2) {
    return this._invoke("throw", e2);
  }, V.prototype.return = function(e2) {
    return this._invoke("return", e2);
  }, (function(e2) {
    e2[e2.Varint = 0] = "Varint", e2[e2.Bit64 = 1] = "Bit64", e2[e2.LengthDelimited = 2] = "LengthDelimited", e2[e2.StartGroup = 3] = "StartGroup", e2[e2.EndGroup = 4] = "EndGroup", e2[e2.Bit32 = 5] = "Bit32";
  })(_ || (_ = {}));
  class W {
    constructor(e2) {
      this.stack = [], this.textEncoder = null != e2 ? e2 : new TextEncoder(), this.chunks = [], this.buf = [];
    }
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let e2 = 0;
      for (let i2 = 0; i2 < this.chunks.length; i2++) e2 += this.chunks[i2].length;
      let t2 = new Uint8Array(e2), n2 = 0;
      for (let i2 = 0; i2 < this.chunks.length; i2++) t2.set(this.chunks[i2], n2), n2 += this.chunks[i2].length;
      return this.chunks = [], t2;
    }
    fork() {
      return this.stack.push({ chunks: this.chunks, buf: this.buf }), this.chunks = [], this.buf = [], this;
    }
    join() {
      let e2 = this.finish(), t2 = this.stack.pop();
      if (!t2) throw new Error("invalid state, fork stack empty");
      return this.chunks = t2.chunks, this.buf = t2.buf, this.uint32(e2.byteLength), this.raw(e2);
    }
    tag(e2, t2) {
      return this.uint32((e2 << 3 | t2) >>> 0);
    }
    raw(e2) {
      return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e2), this;
    }
    uint32(e2) {
      for (a(e2); e2 > 127; ) this.buf.push(127 & e2 | 128), e2 >>>= 7;
      return this.buf.push(e2), this;
    }
    int32(e2) {
      return s(e2), C(e2, this.buf), this;
    }
    bool(e2) {
      return this.buf.push(e2 ? 1 : 0), this;
    }
    bytes(e2) {
      return this.uint32(e2.byteLength), this.raw(e2);
    }
    string(e2) {
      let t2 = this.textEncoder.encode(e2);
      return this.uint32(t2.byteLength), this.raw(t2);
    }
    float(e2) {
      c(e2);
      let t2 = new Uint8Array(4);
      return new DataView(t2.buffer).setFloat32(0, e2, true), this.raw(t2);
    }
    double(e2) {
      let t2 = new Uint8Array(8);
      return new DataView(t2.buffer).setFloat64(0, e2, true), this.raw(t2);
    }
    fixed32(e2) {
      a(e2);
      let t2 = new Uint8Array(4);
      return new DataView(t2.buffer).setUint32(0, e2, true), this.raw(t2);
    }
    sfixed32(e2) {
      s(e2);
      let t2 = new Uint8Array(4);
      return new DataView(t2.buffer).setInt32(0, e2, true), this.raw(t2);
    }
    sint32(e2) {
      return s(e2), C(e2 = (e2 << 1 ^ e2 >> 31) >>> 0, this.buf), this;
    }
    sfixed64(e2) {
      let t2 = new Uint8Array(8), n2 = new DataView(t2.buffer), i2 = R.enc(e2);
      return n2.setInt32(0, i2.lo, true), n2.setInt32(4, i2.hi, true), this.raw(t2);
    }
    fixed64(e2) {
      let t2 = new Uint8Array(8), n2 = new DataView(t2.buffer), i2 = R.uEnc(e2);
      return n2.setInt32(0, i2.lo, true), n2.setInt32(4, i2.hi, true), this.raw(t2);
    }
    int64(e2) {
      let t2 = R.enc(e2);
      return f(t2.lo, t2.hi, this.buf), this;
    }
    sint64(e2) {
      let t2 = R.enc(e2), n2 = t2.hi >> 31;
      return f(t2.lo << 1 ^ n2, (t2.hi << 1 | t2.lo >>> 31) ^ n2, this.buf), this;
    }
    uint64(e2) {
      let t2 = R.uEnc(e2);
      return f(t2.lo, t2.hi, this.buf), this;
    }
  }
  class H {
    constructor(e2, t2) {
      this.varint64 = v, this.uint32 = w, this.buf = e2, this.len = e2.length, this.pos = 0, this.view = new DataView(e2.buffer, e2.byteOffset, e2.byteLength), this.textDecoder = null != t2 ? t2 : new TextDecoder();
    }
    tag() {
      let e2 = this.uint32(), t2 = e2 >>> 3, n2 = 7 & e2;
      if (t2 <= 0 || n2 < 0 || n2 > 5) throw new Error("illegal tag: field no " + t2 + " wire type " + n2);
      return [t2, n2];
    }
    skip(e2, t2) {
      let n2 = this.pos;
      switch (e2) {
        case _.Varint:
          for (; 128 & this.buf[this.pos++]; ) ;
          break;
        case _.Bit64:
          this.pos += 4;
        case _.Bit32:
          this.pos += 4;
          break;
        case _.LengthDelimited:
          let n3 = this.uint32();
          this.pos += n3;
          break;
        case _.StartGroup:
          for (; ; ) {
            const e3 = j(this.tag(), 2), n4 = e3[0], i2 = e3[1];
            if (i2 === _.EndGroup) {
              if (void 0 !== t2 && n4 !== t2) throw new Error("invalid end group tag");
              break;
            }
            this.skip(i2, n4);
          }
          break;
        default:
          throw new Error("cant skip wire type " + e2);
      }
      return this.assertBounds(), this.buf.subarray(n2, this.pos);
    }
    assertBounds() {
      if (this.pos > this.len) throw new RangeError("premature EOF");
    }
    int32() {
      return 0 | this.uint32();
    }
    sint32() {
      let e2 = this.uint32();
      return e2 >>> 1 ^ -(1 & e2);
    }
    int64() {
      return R.dec(...this.varint64());
    }
    uint64() {
      return R.uDec(...this.varint64());
    }
    sint64() {
      let e2 = j(this.varint64(), 2), t2 = e2[0], n2 = e2[1], i2 = -(1 & t2);
      return t2 = (t2 >>> 1 | (1 & n2) << 31) ^ i2, n2 = n2 >>> 1 ^ i2, R.dec(t2, n2);
    }
    bool() {
      let e2 = j(this.varint64(), 2), t2 = e2[0], n2 = e2[1];
      return 0 !== t2 || 0 !== n2;
    }
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    fixed64() {
      return R.uDec(this.sfixed32(), this.sfixed32());
    }
    sfixed64() {
      return R.dec(this.sfixed32(), this.sfixed32());
    }
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    bytes() {
      let e2 = this.uint32(), t2 = this.pos;
      return this.pos += e2, this.assertBounds(), this.buf.subarray(t2, t2 + e2);
    }
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  }
  function K(e2) {
    const t2 = e2.field.localName, n2 = /* @__PURE__ */ Object.create(null);
    return n2[t2] = (function(e3) {
      const t3 = e3.field;
      if (t3.repeated) return [];
      if (void 0 !== t3.default) return t3.default;
      switch (t3.kind) {
        case "enum":
          return t3.T.values[0].no;
        case "scalar":
          return D(t3.T, t3.L);
        case "message":
          const e4 = t3.T, n3 = new e4();
          return e4.fieldWrapper ? e4.fieldWrapper.unwrapField(n3) : n3;
        case "map":
          throw "map fields are not allowed to be extensions";
      }
    })(e2), [n2, () => n2[t2]];
  }
  let z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), G = [];
  for (let gp = 0; gp < z.length; gp++) G[z[gp].charCodeAt(0)] = gp;
  G["-".charCodeAt(0)] = z.indexOf("+"), G["_".charCodeAt(0)] = z.indexOf("/");
  const J = { dec(e2) {
    let t2 = 3 * e2.length / 4;
    "=" == e2[e2.length - 2] ? t2 -= 2 : "=" == e2[e2.length - 1] && (t2 -= 1);
    let n2, i2 = new Uint8Array(t2), r2 = 0, o2 = 0, s2 = 0;
    for (let a2 = 0; a2 < e2.length; a2++) {
      if (n2 = G[e2.charCodeAt(a2)], void 0 === n2) switch (e2[a2]) {
        case "=":
          o2 = 0;
        case "\n":
        case "\r":
        case "	":
        case " ":
          continue;
        default:
          throw Error("invalid base64 string.");
      }
      switch (o2) {
        case 0:
          s2 = n2, o2 = 1;
          break;
        case 1:
          i2[r2++] = s2 << 2 | (48 & n2) >> 4, s2 = n2, o2 = 2;
          break;
        case 2:
          i2[r2++] = (15 & s2) << 4 | (60 & n2) >> 2, s2 = n2, o2 = 3;
          break;
        case 3:
          i2[r2++] = (3 & s2) << 6 | n2, o2 = 0;
      }
    }
    if (1 == o2) throw Error("invalid base64 string.");
    return i2.subarray(0, r2);
  }, enc(e2) {
    let t2, n2 = "", i2 = 0, r2 = 0;
    for (let o2 = 0; o2 < e2.length; o2++) switch (t2 = e2[o2], i2) {
      case 0:
        n2 += z[t2 >> 2], r2 = (3 & t2) << 4, i2 = 1;
        break;
      case 1:
        n2 += z[r2 | t2 >> 4], r2 = (15 & t2) << 2, i2 = 2;
        break;
      case 2:
        n2 += z[r2 | t2 >> 6], n2 += z[63 & t2], i2 = 0;
    }
    return i2 && (n2 += z[r2], n2 += "=", 1 == i2 && (n2 += "=")), n2;
  } };
  function Q(e2, t2, n2) {
    Z(t2, e2);
    const i2 = t2.runtime.bin.makeReadOptions(n2), r2 = (function(e3, t3) {
      if (!t3.repeated && ("enum" == t3.kind || "scalar" == t3.kind)) {
        for (let n3 = e3.length - 1; n3 >= 0; --n3) if (e3[n3].no == t3.no) return [e3[n3]];
        return [];
      }
      return e3.filter(((e4) => e4.no === t3.no));
    })(e2.getType().runtime.bin.listUnknownFields(e2), t2.field), o2 = j(K(t2), 2), s2 = o2[0], a2 = o2[1];
    for (const c2 of r2) t2.runtime.bin.readField(s2, i2.readerFactory(c2.data), t2.field, c2.wireType, i2);
    return a2();
  }
  function Y(e2, t2, n2, i2) {
    Z(t2, e2);
    const r2 = t2.runtime.bin.makeReadOptions(i2), o2 = t2.runtime.bin.makeWriteOptions(i2);
    if (X(e2, t2)) {
      const n3 = e2.getType().runtime.bin.listUnknownFields(e2).filter(((e3) => e3.no != t2.field.no));
      e2.getType().runtime.bin.discardUnknownFields(e2);
      for (const t3 of n3) e2.getType().runtime.bin.onUnknownField(e2, t3.no, t3.wireType, t3.data);
    }
    const s2 = o2.writerFactory();
    let a2 = t2.field;
    a2.opt || a2.repeated || "enum" != a2.kind && "scalar" != a2.kind || (a2 = Object.assign(Object.assign({}, t2.field), { opt: true })), t2.runtime.bin.writeField(a2, n2, s2, o2);
    const c2 = r2.readerFactory(s2.finish());
    for (; c2.pos < c2.len; ) {
      const t3 = j(c2.tag(), 2), n3 = t3[0], i3 = t3[1], r3 = c2.skip(i3, n3);
      e2.getType().runtime.bin.onUnknownField(e2, n3, i3, r3);
    }
  }
  function X(e2, t2) {
    const n2 = e2.getType();
    return t2.extendee.typeName === n2.typeName && !!n2.runtime.bin.listUnknownFields(e2).find(((e3) => e3.no == t2.field.no));
  }
  function Z(e2, t2) {
    o(e2.extendee.typeName == t2.getType().typeName, "extension ".concat(e2.typeName, " can only be applied to message ").concat(e2.extendee.typeName));
  }
  function $(e2, t2) {
    const n2 = e2.localName;
    if (e2.repeated) return t2[n2].length > 0;
    if (e2.oneof) return t2[e2.oneof.localName].case === n2;
    switch (e2.kind) {
      case "enum":
      case "scalar":
        return e2.opt || e2.req ? void 0 !== t2[n2] : "enum" == e2.kind ? t2[n2] !== e2.T.values[0].no : !O(e2.T, t2[n2]);
      case "message":
        return void 0 !== t2[n2];
      case "map":
        return Object.keys(t2[n2]).length > 0;
    }
  }
  function ee(e2, t2) {
    const n2 = e2.localName, i2 = !e2.opt && !e2.req;
    if (e2.repeated) t2[n2] = [];
    else if (e2.oneof) t2[e2.oneof.localName] = { case: void 0 };
    else switch (e2.kind) {
      case "map":
        t2[n2] = {};
        break;
      case "enum":
        t2[n2] = i2 ? e2.T.values[0].no : void 0;
        break;
      case "scalar":
        t2[n2] = i2 ? D(e2.T, e2.L) : void 0;
        break;
      case "message":
        t2[n2] = void 0;
    }
  }
  function te(e2, t2) {
    if (null === e2 || "object" != typeof e2) return false;
    if (!Object.getOwnPropertyNames(g.prototype).every(((t3) => t3 in e2 && "function" == typeof e2[t3]))) return false;
    const n2 = e2.getType();
    return null !== n2 && "function" == typeof n2 && "typeName" in n2 && "string" == typeof n2.typeName && (void 0 === t2 || n2.typeName == t2.typeName);
  }
  function ne(e2, t2) {
    return te(t2) || !e2.fieldWrapper ? t2 : e2.fieldWrapper.wrapField(t2);
  }
  P.DOUBLE, P.FLOAT, P.INT64, P.UINT64, P.INT32, P.UINT32, P.BOOL, P.STRING, P.BYTES;
  const ie = { ignoreUnknownFields: false }, re = { emitDefaultValues: false, enumAsInteger: false, useProtoFieldName: false, prettySpaces: 0 };
  function oe(e2) {
    return e2 ? Object.assign(Object.assign({}, ie), e2) : ie;
  }
  function se(e2) {
    return e2 ? Object.assign(Object.assign({}, re), e2) : re;
  }
  const ae = /* @__PURE__ */ Symbol(), ce = /* @__PURE__ */ Symbol();
  function de(e2) {
    if (null === e2) return "null";
    switch (typeof e2) {
      case "object":
        return Array.isArray(e2) ? "array" : "object";
      case "string":
        return e2.length > 100 ? "string" : '"'.concat(e2.split('"').join('\\"'), '"');
      default:
        return String(e2);
    }
  }
  function le(e2, t2, i2, r2, s2) {
    let a2 = i2.localName;
    if (i2.repeated) {
      if (o("map" != i2.kind), null === t2) return;
      if (!Array.isArray(t2)) throw new Error("cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(t2)));
      const c3 = e2[a2];
      for (const e3 of t2) {
        if (null === e3) throw new Error("cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(e3)));
        switch (i2.kind) {
          case "message":
            c3.push(i2.T.fromJson(e3, r2));
            break;
          case "enum":
            const t3 = pe(i2.T, e3, r2.ignoreUnknownFields, true);
            t3 !== ce && c3.push(t3);
            break;
          case "scalar":
            try {
              c3.push(he(i2.T, e3, i2.L, true));
            } catch (n2) {
              let r3 = "cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(e3));
              throw n2 instanceof Error && n2.message.length > 0 && (r3 += ": ".concat(n2.message)), new Error(r3);
            }
        }
      }
    } else if ("map" == i2.kind) {
      if (null === t2) return;
      if ("object" != typeof t2 || Array.isArray(t2)) throw new Error("cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(t2)));
      const o2 = e2[a2];
      for (const e3 of Object.entries(t2)) {
        var c2 = j(e3, 2);
        const a3 = c2[0], d2 = c2[1];
        if (null === d2) throw new Error("cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: map value null"));
        let l2;
        try {
          l2 = ue(i2.K, a3);
        } catch (n2) {
          let r3 = "cannot decode map key for field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(t2));
          throw n2 instanceof Error && n2.message.length > 0 && (r3 += ": ".concat(n2.message)), new Error(r3);
        }
        switch (i2.V.kind) {
          case "message":
            o2[l2] = i2.V.T.fromJson(d2, r2);
            break;
          case "enum":
            const e4 = pe(i2.V.T, d2, r2.ignoreUnknownFields, true);
            e4 !== ce && (o2[l2] = e4);
            break;
          case "scalar":
            try {
              o2[l2] = he(i2.V.T, d2, I.BIGINT, true);
            } catch (n2) {
              let r3 = "cannot decode map value for field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(t2));
              throw n2 instanceof Error && n2.message.length > 0 && (r3 += ": ".concat(n2.message)), new Error(r3);
            }
        }
      }
    } else switch (i2.oneof && (e2 = e2[i2.oneof.localName] = { case: a2 }, a2 = "value"), i2.kind) {
      case "message":
        const o2 = i2.T;
        if (null === t2 && "google.protobuf.Value" != o2.typeName) return;
        let c3 = e2[a2];
        te(c3) ? c3.fromJson(t2, r2) : (e2[a2] = c3 = o2.fromJson(t2, r2), o2.fieldWrapper && !i2.oneof && (e2[a2] = o2.fieldWrapper.unwrapField(c3)));
        break;
      case "enum":
        const d2 = pe(i2.T, t2, r2.ignoreUnknownFields, false);
        switch (d2) {
          case ae:
            ee(i2, e2);
            break;
          case ce:
            break;
          default:
            e2[a2] = d2;
        }
        break;
      case "scalar":
        try {
          const n2 = he(i2.T, t2, i2.L, false);
          if (n2 === ae) ee(i2, e2);
          else e2[a2] = n2;
        } catch (n2) {
          let r3 = "cannot decode field ".concat(s2.typeName, ".").concat(i2.name, " from JSON: ").concat(de(t2));
          throw n2 instanceof Error && n2.message.length > 0 && (r3 += ": ".concat(n2.message)), new Error(r3);
        }
    }
  }
  function ue(e2, t2) {
    if (e2 === P.BOOL) switch (t2) {
      case "true":
        t2 = true;
        break;
      case "false":
        t2 = false;
    }
    return he(e2, t2, I.BIGINT, true).toString();
  }
  function he(e2, t2, i2, r2) {
    if (null === t2) return r2 ? D(e2, i2) : ae;
    switch (e2) {
      case P.DOUBLE:
      case P.FLOAT:
        if ("NaN" === t2) return Number.NaN;
        if ("Infinity" === t2) return Number.POSITIVE_INFINITY;
        if ("-Infinity" === t2) return Number.NEGATIVE_INFINITY;
        if ("" === t2) break;
        if ("string" == typeof t2 && t2.trim().length !== t2.length) break;
        if ("string" != typeof t2 && "number" != typeof t2) break;
        const r3 = Number(t2);
        if (Number.isNaN(r3)) break;
        if (!Number.isFinite(r3)) break;
        return e2 == P.FLOAT && c(r3), r3;
      case P.INT32:
      case P.FIXED32:
      case P.SFIXED32:
      case P.SINT32:
      case P.UINT32:
        let o2;
        if ("number" == typeof t2 ? o2 = t2 : "string" == typeof t2 && t2.length > 0 && t2.trim().length === t2.length && (o2 = Number(t2)), void 0 === o2) break;
        return e2 == P.UINT32 || e2 == P.FIXED32 ? a(o2) : s(o2), o2;
      case P.INT64:
      case P.SFIXED64:
      case P.SINT64:
        if ("number" != typeof t2 && "string" != typeof t2) break;
        const d2 = R.parse(t2);
        return i2 ? d2.toString() : d2;
      case P.FIXED64:
      case P.UINT64:
        if ("number" != typeof t2 && "string" != typeof t2) break;
        const l2 = R.uParse(t2);
        return i2 ? l2.toString() : l2;
      case P.BOOL:
        if ("boolean" != typeof t2) break;
        return t2;
      case P.STRING:
        if ("string" != typeof t2) break;
        try {
          encodeURIComponent(t2);
        } catch (n2) {
          throw new Error("invalid UTF8");
        }
        return t2;
      case P.BYTES:
        if ("" === t2) return new Uint8Array(0);
        if ("string" != typeof t2) break;
        return J.dec(t2);
    }
    throw new Error();
  }
  function pe(e2, t2, n2, i2) {
    if (null === t2) return "google.protobuf.NullValue" == e2.typeName ? 0 : i2 ? e2.values[0].no : ae;
    switch (typeof t2) {
      case "number":
        if (Number.isInteger(t2)) return t2;
        break;
      case "string":
        const i3 = e2.findName(t2);
        if (void 0 !== i3) return i3.no;
        if (n2) return ce;
    }
    throw new Error("cannot decode enum ".concat(e2.typeName, " from JSON: ").concat(de(t2)));
  }
  function me(e2) {
    return !(!e2.repeated && "map" != e2.kind) || !e2.oneof && ("message" != e2.kind && (!e2.opt && !e2.req));
  }
  function ge(e2, t2, n2) {
    if ("map" == e2.kind) {
      o("object" == typeof t2 && null != t2);
      const a2 = {}, c2 = Object.entries(t2);
      switch (e2.V.kind) {
        case "scalar":
          for (const n3 of c2) {
            var i2 = j(n3, 2);
            const t4 = i2[0], r3 = i2[1];
            a2[t4.toString()] = fe(e2.V.T, r3);
          }
          break;
        case "message":
          for (const e3 of c2) {
            var r2 = j(e3, 2);
            const t4 = r2[0], i3 = r2[1];
            a2[t4.toString()] = i3.toJson(n2);
          }
          break;
        case "enum":
          const t3 = e2.V.T;
          for (const e3 of c2) {
            var s2 = j(e3, 2);
            const i3 = s2[0], r3 = s2[1];
            a2[i3.toString()] = ve(t3, r3, n2.enumAsInteger);
          }
      }
      return n2.emitDefaultValues || c2.length > 0 ? a2 : void 0;
    }
    if (e2.repeated) {
      o(Array.isArray(t2));
      const i3 = [];
      switch (e2.kind) {
        case "scalar":
          for (let n3 = 0; n3 < t2.length; n3++) i3.push(fe(e2.T, t2[n3]));
          break;
        case "enum":
          for (let r3 = 0; r3 < t2.length; r3++) i3.push(ve(e2.T, t2[r3], n2.enumAsInteger));
          break;
        case "message":
          for (let e3 = 0; e3 < t2.length; e3++) i3.push(t2[e3].toJson(n2));
      }
      return n2.emitDefaultValues || i3.length > 0 ? i3 : void 0;
    }
    switch (e2.kind) {
      case "scalar":
        return fe(e2.T, t2);
      case "enum":
        return ve(e2.T, t2, n2.enumAsInteger);
      case "message":
        return ne(e2.T, t2).toJson(n2);
    }
  }
  function ve(e2, t2, n2) {
    var i2;
    if (o("number" == typeof t2), "google.protobuf.NullValue" == e2.typeName) return null;
    if (n2) return t2;
    const r2 = e2.findNumber(t2);
    return null !== (i2 = null == r2 ? void 0 : r2.name) && void 0 !== i2 ? i2 : t2;
  }
  function fe(e2, t2) {
    switch (e2) {
      case P.INT32:
      case P.SFIXED32:
      case P.SINT32:
      case P.FIXED32:
      case P.UINT32:
        return o("number" == typeof t2), t2;
      case P.FLOAT:
      case P.DOUBLE:
        return o("number" == typeof t2), Number.isNaN(t2) ? "NaN" : t2 === Number.POSITIVE_INFINITY ? "Infinity" : t2 === Number.NEGATIVE_INFINITY ? "-Infinity" : t2;
      case P.STRING:
        return o("string" == typeof t2), t2;
      case P.BOOL:
        return o("boolean" == typeof t2), t2;
      case P.UINT64:
      case P.FIXED64:
      case P.INT64:
      case P.SFIXED64:
      case P.SINT64:
        return o("bigint" == typeof t2 || "string" == typeof t2 || "number" == typeof t2), t2.toString();
      case P.BYTES:
        return o(t2 instanceof Uint8Array), J.enc(t2);
    }
  }
  const ke = /* @__PURE__ */ Symbol("@bufbuild/protobuf/unknown-fields"), ye = { readUnknownFields: true, readerFactory: (e2) => new H(e2) }, be = { writeUnknownFields: true, writerFactory: () => new W() };
  function Te(e2) {
    return e2 ? Object.assign(Object.assign({}, ye), e2) : ye;
  }
  function Se(e2) {
    return e2 ? Object.assign(Object.assign({}, be), e2) : be;
  }
  function Ee(e2, t2, n2, i2, r2) {
    let o2 = n2.repeated, s2 = n2.localName;
    switch (n2.oneof && ((e2 = e2[n2.oneof.localName]).case != s2 && delete e2.value, e2.case = s2, s2 = "value"), n2.kind) {
      case "scalar":
      case "enum":
        const a2 = "enum" == n2.kind ? P.INT32 : n2.T;
        let c2 = Re;
        if ("scalar" == n2.kind && n2.L > 0 && (c2 = we), o2) {
          let n3 = e2[s2];
          if (i2 == _.LengthDelimited && a2 != P.STRING && a2 != P.BYTES) {
            let e3 = t2.uint32() + t2.pos;
            for (; t2.pos < e3; ) n3.push(c2(t2, a2));
          } else n3.push(c2(t2, a2));
        } else e2[s2] = c2(t2, a2);
        break;
      case "message":
        const d2 = n2.T;
        o2 ? e2[s2].push(Ce(t2, new d2(), r2, n2)) : te(e2[s2]) ? Ce(t2, e2[s2], r2, n2) : (e2[s2] = Ce(t2, new d2(), r2, n2), !d2.fieldWrapper || n2.oneof || n2.repeated || (e2[s2] = d2.fieldWrapper.unwrapField(e2[s2])));
        break;
      case "map":
        let l2 = (function(e3, t3, n3) {
          const i3 = t3.uint32(), r3 = t3.pos + i3;
          let o3, s3;
          for (; t3.pos < r3; ) {
            switch (j(t3.tag(), 1)[0]) {
              case 1:
                o3 = Re(t3, e3.K);
                break;
              case 2:
                switch (e3.V.kind) {
                  case "scalar":
                    s3 = Re(t3, e3.V.T);
                    break;
                  case "enum":
                    s3 = t3.int32();
                    break;
                  case "message":
                    s3 = Ce(t3, new e3.V.T(), n3, void 0);
                }
            }
          }
          void 0 === o3 && (o3 = D(e3.K, I.BIGINT));
          "string" != typeof o3 && "number" != typeof o3 && (o3 = o3.toString());
          if (void 0 === s3) switch (e3.V.kind) {
            case "scalar":
              s3 = D(e3.V.T, I.BIGINT);
              break;
            case "enum":
              s3 = e3.V.T.values[0].no;
              break;
            case "message":
              s3 = new e3.V.T();
          }
          return [o3, s3];
        })(n2, t2, r2), u2 = j(l2, 2), h2 = u2[0], p2 = u2[1];
        e2[s2][h2] = p2;
    }
  }
  function Ce(e2, t2, n2, i2) {
    const r2 = t2.getType().runtime.bin, o2 = null == i2 ? void 0 : i2.delimited;
    return r2.readMessage(t2, e2, o2 ? i2.no : e2.uint32(), n2, o2), t2;
  }
  function we(e2, t2) {
    const n2 = Re(e2, t2);
    return "bigint" == typeof n2 ? n2.toString() : n2;
  }
  function Re(e2, t2) {
    switch (t2) {
      case P.STRING:
        return e2.string();
      case P.BOOL:
        return e2.bool();
      case P.DOUBLE:
        return e2.double();
      case P.FLOAT:
        return e2.float();
      case P.INT32:
        return e2.int32();
      case P.INT64:
        return e2.int64();
      case P.UINT64:
        return e2.uint64();
      case P.FIXED64:
        return e2.fixed64();
      case P.BYTES:
        return e2.bytes();
      case P.FIXED32:
        return e2.fixed32();
      case P.SFIXED32:
        return e2.sfixed32();
      case P.SFIXED64:
        return e2.sfixed64();
      case P.SINT64:
        return e2.sint64();
      case P.UINT32:
        return e2.uint32();
      case P.SINT32:
        return e2.sint32();
    }
  }
  function Pe(e2, t2, n2, i2) {
    o(void 0 !== t2);
    const r2 = e2.repeated;
    switch (e2.kind) {
      case "scalar":
      case "enum":
        let a2 = "enum" == e2.kind ? P.INT32 : e2.T;
        if (r2) if (o(Array.isArray(t2)), e2.packed) !(function(e3, t3, n3, i3) {
          if (!i3.length) return;
          e3.tag(n3, _.LengthDelimited).fork();
          let r3 = j(De(t3), 2)[1];
          for (let o2 = 0; o2 < i3.length; o2++) e3[r3](i3[o2]);
          e3.join();
        })(n2, a2, e2.no, t2);
        else for (const i3 of t2) Me(n2, a2, e2.no, i3);
        else Me(n2, a2, e2.no, t2);
        break;
      case "message":
        if (r2) {
          o(Array.isArray(t2));
          for (const r3 of t2) _e(n2, i2, e2, r3);
        } else _e(n2, i2, e2, t2);
        break;
      case "map":
        o("object" == typeof t2 && null != t2);
        for (const r3 of Object.entries(t2)) {
          var s2 = j(r3, 2);
          Ie(n2, i2, e2, s2[0], s2[1]);
        }
    }
  }
  function Ie(e2, t2, n2, i2, r2) {
    e2.tag(n2.no, _.LengthDelimited), e2.fork();
    let s2 = i2;
    switch (n2.K) {
      case P.INT32:
      case P.FIXED32:
      case P.UINT32:
      case P.SFIXED32:
      case P.SINT32:
        s2 = Number.parseInt(i2);
        break;
      case P.BOOL:
        o("true" == i2 || "false" == i2), s2 = "true" == i2;
    }
    switch (Me(e2, n2.K, 1, s2), n2.V.kind) {
      case "scalar":
        Me(e2, n2.V.T, 2, r2);
        break;
      case "enum":
        Me(e2, P.INT32, 2, r2);
        break;
      case "message":
        o(void 0 !== r2), e2.tag(2, _.LengthDelimited).bytes(r2.toBinary(t2));
    }
    e2.join();
  }
  function _e(e2, t2, n2, i2) {
    const r2 = ne(n2.T, i2);
    n2.delimited ? e2.tag(n2.no, _.StartGroup).raw(r2.toBinary(t2)).tag(n2.no, _.EndGroup) : e2.tag(n2.no, _.LengthDelimited).bytes(r2.toBinary(t2));
  }
  function Me(e2, t2, n2, i2) {
    o(void 0 !== i2);
    let r2 = j(De(t2), 2), s2 = r2[0], a2 = r2[1];
    e2.tag(n2, s2)[a2](i2);
  }
  function De(e2) {
    let t2 = _.Varint;
    switch (e2) {
      case P.BYTES:
      case P.STRING:
        t2 = _.LengthDelimited;
        break;
      case P.DOUBLE:
      case P.FIXED64:
      case P.SFIXED64:
        t2 = _.Bit64;
        break;
      case P.FIXED32:
      case P.SFIXED32:
      case P.FLOAT:
        t2 = _.Bit32;
    }
    return [t2, P[e2].toLowerCase()];
  }
  function Oe(e2) {
    if (void 0 === e2) return e2;
    if (te(e2)) return e2.clone();
    if (e2 instanceof Uint8Array) {
      const t2 = new Uint8Array(e2.byteLength);
      return t2.set(e2), t2;
    }
    return e2;
  }
  function Ae(e2) {
    return e2 instanceof Uint8Array ? e2 : new Uint8Array(e2);
  }
  class Le {
    constructor(e2, t2) {
      this._fields = e2, this._normalizer = t2;
    }
    findJsonName(e2) {
      if (!this.jsonNames) {
        const e3 = {};
        for (const t2 of this.list()) e3[t2.jsonName] = e3[t2.name] = t2;
        this.jsonNames = e3;
      }
      return this.jsonNames[e2];
    }
    find(e2) {
      if (!this.numbers) {
        const e3 = {};
        for (const t2 of this.list()) e3[t2.no] = t2;
        this.numbers = e3;
      }
      return this.numbers[e2];
    }
    list() {
      return this.all || (this.all = this._normalizer(this._fields)), this.all;
    }
    byNumber() {
      return this.numbersAsc || (this.numbersAsc = this.list().concat().sort(((e2, t2) => e2.no - t2.no))), this.numbersAsc;
    }
    byMember() {
      if (!this.members) {
        this.members = [];
        const e2 = this.members;
        let t2;
        for (const n2 of this.list()) n2.oneof ? n2.oneof !== t2 && (t2 = n2.oneof, e2.push(t2)) : e2.push(n2);
      }
      return this.members;
    }
  }
  function Ne(e2, t2) {
    const n2 = Ue(e2);
    return t2 ? n2 : Ve(qe(n2));
  }
  const xe = Ue;
  function Ue(e2) {
    let t2 = false;
    const n2 = [];
    for (let i2 = 0; i2 < e2.length; i2++) {
      let r2 = e2.charAt(i2);
      switch (r2) {
        case "_":
          t2 = true;
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          n2.push(r2), t2 = false;
          break;
        default:
          t2 && (t2 = false, r2 = r2.toUpperCase()), n2.push(r2);
      }
    }
    return n2.join("");
  }
  const Fe = /* @__PURE__ */ new Set(["constructor", "toString", "toJSON", "valueOf"]), je = /* @__PURE__ */ new Set(["getType", "clone", "equals", "fromBinary", "fromJson", "fromJsonString", "toBinary", "toJson", "toJsonString", "toObject"]), Be = (e2) => "".concat(e2, "$"), qe = (e2) => je.has(e2) ? Be(e2) : e2, Ve = (e2) => Fe.has(e2) ? Be(e2) : e2;
  class We {
    constructor(e2) {
      this.kind = "oneof", this.repeated = false, this.packed = false, this.opt = false, this.req = false, this.default = void 0, this.fields = [], this.name = e2, this.localName = Ne(e2, false);
    }
    addField(e2) {
      o(e2.oneof === this, "field ".concat(e2.name, " not one of ").concat(this.name)), this.fields.push(e2);
    }
    findField(e2) {
      if (!this._lookup) {
        this._lookup = /* @__PURE__ */ Object.create(null);
        for (let e3 = 0; e3 < this.fields.length; e3++) this._lookup[this.fields[e3].localName] = this.fields[e3];
      }
      return this._lookup[e2];
    }
  }
  const He = (Ke = (e2) => new Le(e2, ((e3) => (function(e4) {
    var t2, n2, i2, r2, o2, s2;
    const a2 = [];
    let c2;
    for (const d2 of "function" == typeof e4 ? e4() : e4) {
      const e5 = d2;
      if (e5.localName = Ne(d2.name, void 0 !== d2.oneof), e5.jsonName = null !== (t2 = d2.jsonName) && void 0 !== t2 ? t2 : xe(d2.name), e5.repeated = null !== (n2 = d2.repeated) && void 0 !== n2 && n2, "scalar" == d2.kind && (e5.L = null !== (i2 = d2.L) && void 0 !== i2 ? i2 : I.BIGINT), e5.delimited = null !== (r2 = d2.delimited) && void 0 !== r2 && r2, e5.req = null !== (o2 = d2.req) && void 0 !== o2 && o2, e5.opt = null !== (s2 = d2.opt) && void 0 !== s2 && s2, void 0 === d2.packed && (e5.packed = "enum" == d2.kind || "scalar" == d2.kind && d2.T != P.BYTES && d2.T != P.STRING), void 0 !== d2.oneof) {
        const t3 = "string" == typeof d2.oneof ? d2.oneof : d2.oneof.name;
        c2 && c2.name == t3 || (c2 = new We(t3)), e5.oneof = c2, c2.addField(e5);
      }
      a2.push(e5);
    }
    return a2;
  })(e3))), ze = (e2) => {
    for (const t2 of e2.getType().fields.byMember()) {
      if (t2.opt) continue;
      const n2 = t2.localName, i2 = e2;
      if (t2.repeated) i2[n2] = [];
      else switch (t2.kind) {
        case "oneof":
          i2[n2] = { case: void 0 };
          break;
        case "enum":
          i2[n2] = 0;
          break;
        case "map":
          i2[n2] = {};
          break;
        case "scalar":
          i2[n2] = D(t2.T, t2.L);
      }
    }
  }, { syntax: "proto3", json: { makeReadOptions: oe, makeWriteOptions: se, readMessage(e2, t2, n2, i2) {
    if (null == t2 || Array.isArray(t2) || "object" != typeof t2) throw new Error("cannot decode message ".concat(e2.typeName, " from JSON: ").concat(de(t2)));
    i2 = null != i2 ? i2 : new e2();
    const r2 = /* @__PURE__ */ new Map(), o2 = n2.typeRegistry;
    for (const a2 of Object.entries(t2)) {
      var s2 = j(a2, 2);
      const t3 = s2[0], c2 = s2[1], d2 = e2.fields.findJsonName(t3);
      if (d2) {
        if (d2.oneof) {
          if (null === c2 && "scalar" == d2.kind) continue;
          const n3 = r2.get(d2.oneof);
          if (void 0 !== n3) throw new Error("cannot decode message ".concat(e2.typeName, ' from JSON: multiple keys for oneof "').concat(d2.oneof.name, '" present: "').concat(n3, '", "').concat(t3, '"'));
          r2.set(d2.oneof, t3);
        }
        le(i2, c2, d2, n2, e2);
      } else {
        let r3 = false;
        if ((null == o2 ? void 0 : o2.findExtension) && t3.startsWith("[") && t3.endsWith("]")) {
          const s3 = o2.findExtension(t3.substring(1, t3.length - 1));
          if (s3 && s3.extendee.typeName == e2.typeName) {
            r3 = true;
            const e3 = j(K(s3), 2), t4 = e3[0], o3 = e3[1];
            le(t4, c2, s3.field, n2, s3), Y(i2, s3, o3(), n2);
          }
        }
        if (!r3 && !n2.ignoreUnknownFields) throw new Error("cannot decode message ".concat(e2.typeName, ' from JSON: key "').concat(t3, '" is unknown'));
      }
    }
    return i2;
  }, writeMessage(e2, t2) {
    const i2 = e2.getType(), r2 = {};
    let o2;
    try {
      for (o2 of i2.fields.byNumber()) {
        if (!$(o2, e2)) {
          if (o2.req) throw "required field not set";
          if (!t2.emitDefaultValues) continue;
          if (!me(o2)) continue;
        }
        const n3 = ge(o2, o2.oneof ? e2[o2.oneof.localName].value : e2[o2.localName], t2);
        void 0 !== n3 && (r2[t2.useProtoFieldName ? o2.name : o2.jsonName] = n3);
      }
      const n2 = t2.typeRegistry;
      if (null == n2 ? void 0 : n2.findExtensionFor) for (const o3 of i2.runtime.bin.listUnknownFields(e2)) {
        const s2 = n2.findExtensionFor(i2.typeName, o3.no);
        if (s2 && X(e2, s2)) {
          const n3 = Q(e2, s2, t2), i3 = ge(s2.field, n3, t2);
          void 0 !== i3 && (r2[s2.field.jsonName] = i3);
        }
      }
    } catch (n2) {
      const t3 = o2 ? "cannot encode field ".concat(i2.typeName, ".").concat(o2.name, " to JSON") : "cannot encode message ".concat(i2.typeName, " to JSON"), r3 = n2 instanceof Error ? n2.message : String(n2);
      throw new Error(t3 + (r3.length > 0 ? ": ".concat(r3) : ""));
    }
    return r2;
  }, readScalar: (e2, t2, n2) => he(e2, t2, null != n2 ? n2 : I.BIGINT, true), writeScalar(e2, t2, n2) {
    if (void 0 !== t2) return n2 || O(e2, t2) ? fe(e2, t2) : void 0;
  }, debug: de }, bin: { makeReadOptions: Te, makeWriteOptions: Se, listUnknownFields(e2) {
    var t2;
    return null !== (t2 = e2[ke]) && void 0 !== t2 ? t2 : [];
  }, discardUnknownFields(e2) {
    delete e2[ke];
  }, writeUnknownFields(e2, t2) {
    const n2 = e2[ke];
    if (n2) for (const i2 of n2) t2.tag(i2.no, i2.wireType).raw(i2.data);
  }, onUnknownField(e2, t2, n2, i2) {
    const r2 = e2;
    Array.isArray(r2[ke]) || (r2[ke] = []), r2[ke].push({ no: t2, wireType: n2, data: i2 });
  }, readMessage(e2, t2, n2, i2, r2) {
    const o2 = e2.getType(), s2 = r2 ? t2.len : t2.pos + n2;
    let a2, c2;
    for (; t2.pos < s2; ) {
      var d2 = j(t2.tag(), 2);
      if (a2 = d2[0], c2 = d2[1], true === r2 && c2 == _.EndGroup) break;
      const n3 = o2.fields.find(a2);
      if (n3) Ee(e2, t2, n3, c2, i2);
      else {
        const n4 = t2.skip(c2, a2);
        i2.readUnknownFields && this.onUnknownField(e2, a2, c2, n4);
      }
    }
    if (r2 && (c2 != _.EndGroup || a2 !== n2)) throw new Error("invalid end group tag");
  }, readField: Ee, writeMessage(e2, t2, n2) {
    const i2 = e2.getType();
    for (const r2 of i2.fields.byNumber()) if ($(r2, e2)) Pe(r2, r2.oneof ? e2[r2.oneof.localName].value : e2[r2.localName], t2, n2);
    else if (r2.req) throw new Error("cannot encode field ".concat(i2.typeName, ".").concat(r2.name, " to binary: required field not set"));
    return n2.writeUnknownFields && this.writeUnknownFields(e2, t2), t2;
  }, writeField(e2, t2, n2, i2) {
    void 0 !== t2 && Pe(e2, t2, n2, i2);
  } }, util: Object.assign(Object.assign({}, { setEnumType: u, initPartial(e2, t2) {
    if (void 0 === e2) return;
    const n2 = t2.getType();
    for (const r2 of n2.fields.byMember()) {
      const n3 = r2.localName, o2 = t2, s2 = e2;
      if (null != s2[n3]) switch (r2.kind) {
        case "oneof":
          const e3 = s2[n3].case;
          if (void 0 === e3) continue;
          const t3 = r2.findField(e3);
          let a2 = s2[n3].value;
          t3 && "message" == t3.kind && !te(a2, t3.T) ? a2 = new t3.T(a2) : t3 && "scalar" === t3.kind && t3.T === P.BYTES && (a2 = Ae(a2)), o2[n3] = { case: e3, value: a2 };
          break;
        case "scalar":
        case "enum":
          let c2 = s2[n3];
          r2.T === P.BYTES && (c2 = r2.repeated ? c2.map(Ae) : Ae(c2)), o2[n3] = c2;
          break;
        case "map":
          switch (r2.V.kind) {
            case "scalar":
            case "enum":
              if (r2.V.T === P.BYTES) for (const t4 of Object.entries(s2[n3])) {
                var i2 = j(t4, 2);
                const e5 = i2[0], r3 = i2[1];
                o2[n3][e5] = Ae(r3);
              }
              else Object.assign(o2[n3], s2[n3]);
              break;
            case "message":
              const e4 = r2.V.T;
              for (const t4 of Object.keys(s2[n3])) {
                let i3 = s2[n3][t4];
                e4.fieldWrapper || (i3 = new e4(i3)), o2[n3][t4] = i3;
              }
          }
          break;
        case "message":
          const d2 = r2.T;
          if (r2.repeated) o2[n3] = s2[n3].map(((e4) => te(e4, d2) ? e4 : new d2(e4)));
          else {
            const e4 = s2[n3];
            d2.fieldWrapper ? "google.protobuf.BytesValue" === d2.typeName ? o2[n3] = Ae(e4) : o2[n3] = e4 : o2[n3] = te(e4, d2) ? e4 : new d2(e4);
          }
      }
    }
  }, equals: (e2, t2, n2) => t2 === n2 || !(!t2 || !n2) && e2.fields.byMember().every(((e3) => {
    const i2 = t2[e3.localName], r2 = n2[e3.localName];
    if (e3.repeated) {
      if (i2.length !== r2.length) return false;
      switch (e3.kind) {
        case "message":
          return i2.every(((t3, n3) => e3.T.equals(t3, r2[n3])));
        case "scalar":
          return i2.every(((t3, n3) => M(e3.T, t3, r2[n3])));
        case "enum":
          return i2.every(((e4, t3) => M(P.INT32, e4, r2[t3])));
      }
      throw new Error("repeated cannot contain ".concat(e3.kind));
    }
    switch (e3.kind) {
      case "message":
        let t3 = i2, n3 = r2;
        return e3.T.fieldWrapper && (void 0 === t3 || te(t3) || (t3 = e3.T.fieldWrapper.wrapField(t3)), void 0 === n3 || te(n3) || (n3 = e3.T.fieldWrapper.wrapField(n3))), e3.T.equals(t3, n3);
      case "enum":
        return M(P.INT32, i2, r2);
      case "scalar":
        return M(e3.T, i2, r2);
      case "oneof":
        if (i2.case !== r2.case) return false;
        const o2 = e3.findField(i2.case);
        if (void 0 === o2) return true;
        switch (o2.kind) {
          case "message":
            return o2.T.equals(i2.value, r2.value);
          case "enum":
            return M(P.INT32, i2.value, r2.value);
          case "scalar":
            return M(o2.T, i2.value, r2.value);
        }
        throw new Error("oneof cannot contain ".concat(o2.kind));
      case "map":
        const s2 = Object.keys(i2).concat(Object.keys(r2));
        switch (e3.V.kind) {
          case "message":
            const t4 = e3.V.T;
            return s2.every(((e4) => t4.equals(i2[e4], r2[e4])));
          case "enum":
            return s2.every(((e4) => M(P.INT32, i2[e4], r2[e4])));
          case "scalar":
            const n4 = e3.V.T;
            return s2.every(((e4) => M(n4, i2[e4], r2[e4])));
        }
    }
  })), clone(e2) {
    const t2 = e2.getType(), n2 = new t2(), i2 = n2;
    for (const o2 of t2.fields.byMember()) {
      const t3 = e2[o2.localName];
      let n3;
      if (o2.repeated) n3 = t3.map(Oe);
      else if ("map" == o2.kind) {
        n3 = i2[o2.localName];
        for (const e3 of Object.entries(t3)) {
          var r2 = j(e3, 2);
          const t4 = r2[0], i3 = r2[1];
          n3[t4] = Oe(i3);
        }
      } else n3 = "oneof" == o2.kind ? o2.findField(t3.case) ? { case: t3.case, value: Oe(t3.value) } : { case: void 0 } : Oe(t3);
      i2[o2.localName] = n3;
    }
    for (const o2 of t2.runtime.bin.listUnknownFields(e2)) t2.runtime.bin.onUnknownField(i2, o2.no, o2.wireType, o2.data);
    return n2;
  } }), { newFieldList: Ke, initFields: ze }), makeMessageType(e2, t2, n2) {
    return (function(e3, t3, n3, i2) {
      var r2;
      const o2 = null !== (r2 = null == i2 ? void 0 : i2.localName) && void 0 !== r2 ? r2 : t3.substring(t3.lastIndexOf(".") + 1), s2 = { [o2]: function(t4) {
        e3.util.initFields(this), e3.util.initPartial(t4, this);
      } }[o2];
      return Object.setPrototypeOf(s2.prototype, new g()), Object.assign(s2, { runtime: e3, typeName: t3, fields: e3.util.newFieldList(n3), fromBinary: (e4, t4) => new s2().fromBinary(e4, t4), fromJson: (e4, t4) => new s2().fromJson(e4, t4), fromJsonString: (e4, t4) => new s2().fromJsonString(e4, t4), equals: (t4, n4) => e3.util.equals(s2, t4, n4) }), s2;
    })(this, e2, t2, n2);
  }, makeEnum: p, makeEnumType: h, getEnumType: l, makeExtension(e2, t2, n2) {
    return /* @__PURE__ */ (function(e3, t3, n3, i2) {
      let r2;
      return { typeName: t3, extendee: n3, get field() {
        if (!r2) {
          const n4 = "function" == typeof i2 ? i2() : i2;
          n4.name = t3.split(".").pop(), n4.jsonName = "[".concat(t3, "]"), r2 = e3.util.newFieldList([n4]).list()[0];
        }
        return r2;
      }, runtime: e3 };
    })(this, e2, t2, n2);
  } });
  var Ke, ze;
  class Ge extends g {
    constructor(e2) {
      super(), this.seconds = R.zero, this.nanos = 0, He.util.initPartial(e2, this);
    }
    fromJson(e2, t2) {
      if ("string" != typeof e2) throw new Error("cannot decode google.protobuf.Timestamp from JSON: ".concat(He.json.debug(e2)));
      const n2 = e2.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
      if (!n2) throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
      const i2 = Date.parse(n2[1] + "-" + n2[2] + "-" + n2[3] + "T" + n2[4] + ":" + n2[5] + ":" + n2[6] + (n2[8] ? n2[8] : "Z"));
      if (Number.isNaN(i2)) throw new Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
      if (i2 < Date.parse("0001-01-01T00:00:00Z") || i2 > Date.parse("9999-12-31T23:59:59Z")) throw new Error("cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
      return this.seconds = R.parse(i2 / 1e3), this.nanos = 0, n2[7] && (this.nanos = parseInt("1" + n2[7] + "0".repeat(9 - n2[7].length)) - 1e9), this;
    }
    toJson(e2) {
      const t2 = 1e3 * Number(this.seconds);
      if (t2 < Date.parse("0001-01-01T00:00:00Z") || t2 > Date.parse("9999-12-31T23:59:59Z")) throw new Error("cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
      if (this.nanos < 0) throw new Error("cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative");
      let n2 = "Z";
      if (this.nanos > 0) {
        const e3 = (this.nanos + 1e9).toString().substring(1);
        n2 = "000000" === e3.substring(3) ? "." + e3.substring(0, 3) + "Z" : "000" === e3.substring(6) ? "." + e3.substring(0, 6) + "Z" : "." + e3 + "Z";
      }
      return new Date(t2).toISOString().replace(".000Z", n2);
    }
    toDate() {
      return new Date(1e3 * Number(this.seconds) + Math.ceil(this.nanos / 1e6));
    }
    static now() {
      return Ge.fromDate(/* @__PURE__ */ new Date());
    }
    static fromDate(e2) {
      const t2 = e2.getTime();
      return new Ge({ seconds: R.parse(Math.floor(t2 / 1e3)), nanos: t2 % 1e3 * 1e6 });
    }
    static fromBinary(e2, t2) {
      return new Ge().fromBinary(e2, t2);
    }
    static fromJson(e2, t2) {
      return new Ge().fromJson(e2, t2);
    }
    static fromJsonString(e2, t2) {
      return new Ge().fromJsonString(e2, t2);
    }
    static equals(e2, t2) {
      return He.util.equals(Ge, e2, t2);
    }
  }
  Ge.runtime = He, Ge.typeName = "google.protobuf.Timestamp", Ge.fields = He.util.newFieldList((() => [{ no: 1, name: "seconds", kind: "scalar", T: 3 }, { no: 2, name: "nanos", kind: "scalar", T: 5 }]));
  const Je = He.makeMessageType("livekit.MetricsBatch", (() => [{ no: 1, name: "timestamp_ms", kind: "scalar", T: 3 }, { no: 2, name: "normalized_timestamp", kind: "message", T: Ge }, { no: 3, name: "str_data", kind: "scalar", T: 9, repeated: true }, { no: 4, name: "time_series", kind: "message", T: Qe, repeated: true }, { no: 5, name: "events", kind: "message", T: Xe, repeated: true }])), Qe = He.makeMessageType("livekit.TimeSeriesMetric", (() => [{ no: 1, name: "label", kind: "scalar", T: 13 }, { no: 2, name: "participant_identity", kind: "scalar", T: 13 }, { no: 3, name: "track_sid", kind: "scalar", T: 13 }, { no: 4, name: "samples", kind: "message", T: Ye, repeated: true }, { no: 5, name: "rid", kind: "scalar", T: 13 }])), Ye = He.makeMessageType("livekit.MetricSample", (() => [{ no: 1, name: "timestamp_ms", kind: "scalar", T: 3 }, { no: 2, name: "normalized_timestamp", kind: "message", T: Ge }, { no: 3, name: "value", kind: "scalar", T: 2 }])), Xe = He.makeMessageType("livekit.EventMetric", (() => [{ no: 1, name: "label", kind: "scalar", T: 13 }, { no: 2, name: "participant_identity", kind: "scalar", T: 13 }, { no: 3, name: "track_sid", kind: "scalar", T: 13 }, { no: 4, name: "start_timestamp_ms", kind: "scalar", T: 3 }, { no: 5, name: "end_timestamp_ms", kind: "scalar", T: 3, opt: true }, { no: 6, name: "normalized_start_timestamp", kind: "message", T: Ge }, { no: 7, name: "normalized_end_timestamp", kind: "message", T: Ge, opt: true }, { no: 8, name: "metadata", kind: "scalar", T: 9 }, { no: 9, name: "rid", kind: "scalar", T: 13 }])), Ze = He.makeEnum("livekit.AudioCodec", [{ no: 0, name: "DEFAULT_AC" }, { no: 1, name: "OPUS" }, { no: 2, name: "AAC" }, { no: 3, name: "AC_MP3" }]), $e = He.makeEnum("livekit.VideoCodec", [{ no: 0, name: "DEFAULT_VC" }, { no: 1, name: "H264_BASELINE" }, { no: 2, name: "H264_MAIN" }, { no: 3, name: "H264_HIGH" }, { no: 4, name: "VP8" }]), et = He.makeEnum("livekit.ImageCodec", [{ no: 0, name: "IC_DEFAULT" }, { no: 1, name: "IC_JPEG" }]), tt = He.makeEnum("livekit.BackupCodecPolicy", [{ no: 0, name: "PREFER_REGRESSION" }, { no: 1, name: "SIMULCAST" }, { no: 2, name: "REGRESSION" }]), nt = He.makeEnum("livekit.TrackType", [{ no: 0, name: "AUDIO" }, { no: 1, name: "VIDEO" }, { no: 2, name: "DATA" }]), it = He.makeEnum("livekit.TrackSource", [{ no: 0, name: "UNKNOWN" }, { no: 1, name: "CAMERA" }, { no: 2, name: "MICROPHONE" }, { no: 3, name: "SCREEN_SHARE" }, { no: 4, name: "SCREEN_SHARE_AUDIO" }]), rt = He.makeEnum("livekit.VideoQuality", [{ no: 0, name: "LOW" }, { no: 1, name: "MEDIUM" }, { no: 2, name: "HIGH" }, { no: 3, name: "OFF" }]), ot = He.makeEnum("livekit.ConnectionQuality", [{ no: 0, name: "POOR" }, { no: 1, name: "GOOD" }, { no: 2, name: "EXCELLENT" }, { no: 3, name: "LOST" }]), st = He.makeEnum("livekit.ClientConfigSetting", [{ no: 0, name: "UNSET" }, { no: 1, name: "DISABLED" }, { no: 2, name: "ENABLED" }]), at = He.makeEnum("livekit.DisconnectReason", [{ no: 0, name: "UNKNOWN_REASON" }, { no: 1, name: "CLIENT_INITIATED" }, { no: 2, name: "DUPLICATE_IDENTITY" }, { no: 3, name: "SERVER_SHUTDOWN" }, { no: 4, name: "PARTICIPANT_REMOVED" }, { no: 5, name: "ROOM_DELETED" }, { no: 6, name: "STATE_MISMATCH" }, { no: 7, name: "JOIN_FAILURE" }, { no: 8, name: "MIGRATION" }, { no: 9, name: "SIGNAL_CLOSE" }, { no: 10, name: "ROOM_CLOSED" }, { no: 11, name: "USER_UNAVAILABLE" }, { no: 12, name: "USER_REJECTED" }, { no: 13, name: "SIP_TRUNK_FAILURE" }, { no: 14, name: "CONNECTION_TIMEOUT" }, { no: 15, name: "MEDIA_FAILURE" }, { no: 16, name: "AGENT_ERROR" }]), ct = He.makeEnum("livekit.ReconnectReason", [{ no: 0, name: "RR_UNKNOWN" }, { no: 1, name: "RR_SIGNAL_DISCONNECTED" }, { no: 2, name: "RR_PUBLISHER_FAILED" }, { no: 3, name: "RR_SUBSCRIBER_FAILED" }, { no: 4, name: "RR_SWITCH_CANDIDATE" }]), dt = He.makeEnum("livekit.SubscriptionError", [{ no: 0, name: "SE_UNKNOWN" }, { no: 1, name: "SE_CODEC_UNSUPPORTED" }, { no: 2, name: "SE_TRACK_NOTFOUND" }]), lt = He.makeEnum("livekit.AudioTrackFeature", [{ no: 0, name: "TF_STEREO" }, { no: 1, name: "TF_NO_DTX" }, { no: 2, name: "TF_AUTO_GAIN_CONTROL" }, { no: 3, name: "TF_ECHO_CANCELLATION" }, { no: 4, name: "TF_NOISE_SUPPRESSION" }, { no: 5, name: "TF_ENHANCED_NOISE_CANCELLATION" }, { no: 6, name: "TF_PRECONNECT_BUFFER" }]), ut = He.makeEnum("livekit.PacketTrailerFeature", [{ no: 0, name: "PTF_USER_TIMESTAMP" }, { no: 1, name: "PTF_FRAME_ID" }, { no: 2, name: "PTF_USER_DATA" }]), ht = He.makeMessageType("livekit.Room", (() => [{ no: 1, name: "sid", kind: "scalar", T: 9 }, { no: 2, name: "name", kind: "scalar", T: 9 }, { no: 3, name: "empty_timeout", kind: "scalar", T: 13 }, { no: 14, name: "departure_timeout", kind: "scalar", T: 13 }, { no: 4, name: "max_participants", kind: "scalar", T: 13 }, { no: 5, name: "creation_time", kind: "scalar", T: 3 }, { no: 15, name: "creation_time_ms", kind: "scalar", T: 3 }, { no: 6, name: "turn_password", kind: "scalar", T: 9 }, { no: 7, name: "enabled_codecs", kind: "message", T: pt, repeated: true }, { no: 8, name: "metadata", kind: "scalar", T: 9 }, { no: 9, name: "num_participants", kind: "scalar", T: 13 }, { no: 11, name: "num_publishers", kind: "scalar", T: 13 }, { no: 10, name: "active_recording", kind: "scalar", T: 8 }, { no: 13, name: "version", kind: "message", T: rn }])), pt = He.makeMessageType("livekit.Codec", (() => [{ no: 1, name: "mime", kind: "scalar", T: 9 }, { no: 2, name: "fmtp_line", kind: "scalar", T: 9 }])), mt = He.makeMessageType("livekit.ParticipantPermission", (() => [{ no: 1, name: "can_subscribe", kind: "scalar", T: 8 }, { no: 2, name: "can_publish", kind: "scalar", T: 8 }, { no: 3, name: "can_publish_data", kind: "scalar", T: 8 }, { no: 9, name: "can_publish_sources", kind: "enum", T: He.getEnumType(it), repeated: true }, { no: 7, name: "hidden", kind: "scalar", T: 8 }, { no: 8, name: "recorder", kind: "scalar", T: 8 }, { no: 10, name: "can_update_metadata", kind: "scalar", T: 8 }, { no: 11, name: "agent", kind: "scalar", T: 8 }, { no: 12, name: "can_subscribe_metrics", kind: "scalar", T: 8 }, { no: 13, name: "can_manage_agent_session", kind: "scalar", T: 8 }])), gt = He.makeMessageType("livekit.ParticipantInfo", (() => [{ no: 1, name: "sid", kind: "scalar", T: 9 }, { no: 2, name: "identity", kind: "scalar", T: 9 }, { no: 3, name: "state", kind: "enum", T: He.getEnumType(vt) }, { no: 4, name: "tracks", kind: "message", T: Tt, repeated: true }, { no: 5, name: "metadata", kind: "scalar", T: 9 }, { no: 6, name: "joined_at", kind: "scalar", T: 3 }, { no: 17, name: "joined_at_ms", kind: "scalar", T: 3 }, { no: 9, name: "name", kind: "scalar", T: 9 }, { no: 10, name: "version", kind: "scalar", T: 13 }, { no: 11, name: "permission", kind: "message", T: mt }, { no: 12, name: "region", kind: "scalar", T: 9 }, { no: 13, name: "is_publisher", kind: "scalar", T: 8 }, { no: 14, name: "kind", kind: "enum", T: He.getEnumType(ft) }, { no: 15, name: "attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 16, name: "disconnect_reason", kind: "enum", T: He.getEnumType(at) }, { no: 18, name: "kind_details", kind: "enum", T: He.getEnumType(kt), repeated: true }, { no: 19, name: "data_tracks", kind: "message", T: St, repeated: true }, { no: 20, name: "client_protocol", kind: "scalar", T: 5 }, { no: 21, name: "capabilities", kind: "enum", T: He.getEnumType($t), repeated: true }])), vt = He.makeEnum("livekit.ParticipantInfo.State", [{ no: 0, name: "JOINING" }, { no: 1, name: "JOINED" }, { no: 2, name: "ACTIVE" }, { no: 3, name: "DISCONNECTED" }]), ft = He.makeEnum("livekit.ParticipantInfo.Kind", [{ no: 0, name: "STANDARD" }, { no: 1, name: "INGRESS" }, { no: 2, name: "EGRESS" }, { no: 3, name: "SIP" }, { no: 4, name: "AGENT" }, { no: 7, name: "CONNECTOR" }, { no: 8, name: "BRIDGE" }]), kt = He.makeEnum("livekit.ParticipantInfo.KindDetail", [{ no: 0, name: "CLOUD_AGENT" }, { no: 1, name: "FORWARDED" }, { no: 2, name: "CONNECTOR_WHATSAPP" }, { no: 3, name: "CONNECTOR_TWILIO" }, { no: 4, name: "BRIDGE_RTSP" }, { no: 5, name: "SIMULATION" }]), yt = He.makeEnum("livekit.Encryption.Type", [{ no: 0, name: "NONE" }, { no: 1, name: "GCM" }, { no: 2, name: "CUSTOM" }]), bt = He.makeMessageType("livekit.SimulcastCodecInfo", (() => [{ no: 1, name: "mime_type", kind: "scalar", T: 9 }, { no: 2, name: "mid", kind: "scalar", T: 9 }, { no: 3, name: "cid", kind: "scalar", T: 9 }, { no: 4, name: "layers", kind: "message", T: Dt, repeated: true }, { no: 5, name: "video_layer_mode", kind: "enum", T: He.getEnumType(Ot) }, { no: 6, name: "sdp_cid", kind: "scalar", T: 9 }])), Tt = He.makeMessageType("livekit.TrackInfo", (() => [{ no: 1, name: "sid", kind: "scalar", T: 9 }, { no: 2, name: "type", kind: "enum", T: He.getEnumType(nt) }, { no: 3, name: "name", kind: "scalar", T: 9 }, { no: 4, name: "muted", kind: "scalar", T: 8 }, { no: 5, name: "width", kind: "scalar", T: 13 }, { no: 6, name: "height", kind: "scalar", T: 13 }, { no: 7, name: "simulcast", kind: "scalar", T: 8 }, { no: 8, name: "disable_dtx", kind: "scalar", T: 8 }, { no: 9, name: "source", kind: "enum", T: He.getEnumType(it) }, { no: 10, name: "layers", kind: "message", T: Dt, repeated: true }, { no: 11, name: "mime_type", kind: "scalar", T: 9 }, { no: 12, name: "mid", kind: "scalar", T: 9 }, { no: 13, name: "codecs", kind: "message", T: bt, repeated: true }, { no: 14, name: "stereo", kind: "scalar", T: 8 }, { no: 15, name: "disable_red", kind: "scalar", T: 8 }, { no: 16, name: "encryption", kind: "enum", T: He.getEnumType(yt) }, { no: 17, name: "stream", kind: "scalar", T: 9 }, { no: 18, name: "version", kind: "message", T: rn }, { no: 19, name: "audio_features", kind: "enum", T: He.getEnumType(lt), repeated: true }, { no: 20, name: "backup_codec_policy", kind: "enum", T: He.getEnumType(tt) }, { no: 21, name: "packet_trailer_features", kind: "enum", T: He.getEnumType(ut), repeated: true }])), St = He.makeMessageType("livekit.DataTrackInfo", (() => [{ no: 1, name: "pub_handle", kind: "scalar", T: 13 }, { no: 2, name: "sid", kind: "scalar", T: 9 }, { no: 3, name: "name", kind: "scalar", T: 9 }, { no: 4, name: "encryption", kind: "enum", T: He.getEnumType(yt) }, { no: 5, name: "frame_encoding", kind: "message", T: Et, opt: true }, { no: 6, name: "schema", kind: "message", T: Pt, opt: true }])), Et = He.makeMessageType("livekit.DataTrackFrameEncoding", (() => [{ no: 1, name: "well_known", kind: "enum", T: He.getEnumType(Ct), oneof: "value" }, { no: 2, name: "custom", kind: "scalar", T: 9, oneof: "value" }])), Ct = He.makeEnum("livekit.DataTrackFrameEncoding.WellKnownFrameEncoding", [{ no: 0, name: "WELL_KNOWN_FRAME_ENCODING_UNSPECIFIED", localName: "UNSPECIFIED" }, { no: 1, name: "WELL_KNOWN_FRAME_ENCODING_ROS1", localName: "ROS1" }, { no: 2, name: "WELL_KNOWN_FRAME_ENCODING_CDR", localName: "CDR" }, { no: 3, name: "WELL_KNOWN_FRAME_ENCODING_PROTOBUF", localName: "PROTOBUF" }, { no: 4, name: "WELL_KNOWN_FRAME_ENCODING_FLATBUFFER", localName: "FLATBUFFER" }, { no: 5, name: "WELL_KNOWN_FRAME_ENCODING_CBOR", localName: "CBOR" }, { no: 6, name: "WELL_KNOWN_FRAME_ENCODING_MSGPACK", localName: "MSGPACK" }, { no: 7, name: "WELL_KNOWN_FRAME_ENCODING_JSON", localName: "JSON" }]), wt = He.makeMessageType("livekit.DataTrackSchemaEncoding", (() => [{ no: 1, name: "well_known", kind: "enum", T: He.getEnumType(Rt), oneof: "value" }, { no: 2, name: "custom", kind: "scalar", T: 9, oneof: "value" }])), Rt = He.makeEnum("livekit.DataTrackSchemaEncoding.WellKnownSchemaEncoding", [{ no: 0, name: "WELL_KNOWN_SCHEMA_ENCODING_UNSPECIFIED", localName: "UNSPECIFIED" }, { no: 1, name: "WELL_KNOWN_SCHEMA_ENCODING_PROTOBUF", localName: "PROTOBUF" }, { no: 2, name: "WELL_KNOWN_SCHEMA_ENCODING_FLATBUFFER", localName: "FLATBUFFER" }, { no: 3, name: "WELL_KNOWN_SCHEMA_ENCODING_ROS1_MSG", localName: "ROS1_MSG" }, { no: 4, name: "WELL_KNOWN_SCHEMA_ENCODING_ROS2_MSG", localName: "ROS2_MSG" }, { no: 5, name: "WELL_KNOWN_SCHEMA_ENCODING_ROS2_IDL", localName: "ROS2_IDL" }, { no: 6, name: "WELL_KNOWN_SCHEMA_ENCODING_OMG_IDL", localName: "OMG_IDL" }, { no: 7, name: "WELL_KNOWN_SCHEMA_ENCODING_JSON_SCHEMA", localName: "JSON_SCHEMA" }]), Pt = He.makeMessageType("livekit.DataTrackSchemaId", (() => [{ no: 1, name: "name", kind: "scalar", T: 9 }, { no: 2, name: "encoding", kind: "message", T: wt }])), It = He.makeMessageType("livekit.DataTrackSubscriptionOptions", (() => [{ no: 1, name: "target_fps", kind: "scalar", T: 13, opt: true }])), _t = He.makeMessageType("livekit.DataBlobKey", (() => [{ no: 1, name: "generic", kind: "scalar", T: 9, oneof: "key" }, { no: 2, name: "schema_id", kind: "message", T: Pt, oneof: "key" }])), Mt = He.makeMessageType("livekit.DataBlob", (() => [{ no: 1, name: "key", kind: "message", T: _t }, { no: 2, name: "contents", kind: "scalar", T: 12 }])), Dt = He.makeMessageType("livekit.VideoLayer", (() => [{ no: 1, name: "quality", kind: "enum", T: He.getEnumType(rt) }, { no: 2, name: "width", kind: "scalar", T: 13 }, { no: 3, name: "height", kind: "scalar", T: 13 }, { no: 4, name: "bitrate", kind: "scalar", T: 13 }, { no: 5, name: "ssrc", kind: "scalar", T: 13 }, { no: 6, name: "spatial_layer", kind: "scalar", T: 5 }, { no: 7, name: "rid", kind: "scalar", T: 9 }, { no: 8, name: "repair_ssrc", kind: "scalar", T: 13 }])), Ot = He.makeEnum("livekit.VideoLayer.Mode", [{ no: 0, name: "MODE_UNUSED" }, { no: 1, name: "ONE_SPATIAL_LAYER_PER_STREAM" }, { no: 2, name: "MULTIPLE_SPATIAL_LAYERS_PER_STREAM" }, { no: 3, name: "ONE_SPATIAL_LAYER_PER_STREAM_INCOMPLETE_RTCP_SR" }]), At = He.makeMessageType("livekit.DataPacket", (() => [{ no: 1, name: "kind", kind: "enum", T: He.getEnumType(Lt) }, { no: 4, name: "participant_identity", kind: "scalar", T: 9 }, { no: 5, name: "destination_identities", kind: "scalar", T: 9, repeated: true }, { no: 2, name: "user", kind: "message", T: jt, oneof: "value" }, { no: 3, name: "speaker", kind: "message", T: Ut, oneof: "value" }, { no: 6, name: "sip_dtmf", kind: "message", T: Bt, oneof: "value" }, { no: 7, name: "transcription", kind: "message", T: qt, oneof: "value" }, { no: 8, name: "metrics", kind: "message", T: Je, oneof: "value" }, { no: 9, name: "chat_message", kind: "message", T: Wt, oneof: "value" }, { no: 10, name: "rpc_request", kind: "message", T: Ht, oneof: "value" }, { no: 11, name: "rpc_ack", kind: "message", T: Kt, oneof: "value" }, { no: 12, name: "rpc_response", kind: "message", T: zt, oneof: "value" }, { no: 13, name: "stream_header", kind: "message", T: dn, oneof: "value" }, { no: 14, name: "stream_chunk", kind: "message", T: ln, oneof: "value" }, { no: 15, name: "stream_trailer", kind: "message", T: un, oneof: "value" }, { no: 18, name: "encrypted_packet", kind: "message", T: Nt, oneof: "value" }, { no: 16, name: "sequence", kind: "scalar", T: 13 }, { no: 17, name: "participant_sid", kind: "scalar", T: 9 }])), Lt = He.makeEnum("livekit.DataPacket.Kind", [{ no: 0, name: "RELIABLE" }, { no: 1, name: "LOSSY" }]), Nt = He.makeMessageType("livekit.EncryptedPacket", (() => [{ no: 1, name: "encryption_type", kind: "enum", T: He.getEnumType(yt) }, { no: 2, name: "iv", kind: "scalar", T: 12 }, { no: 3, name: "key_index", kind: "scalar", T: 13 }, { no: 4, name: "encrypted_value", kind: "scalar", T: 12 }])), xt = He.makeMessageType("livekit.EncryptedPacketPayload", (() => [{ no: 1, name: "user", kind: "message", T: jt, oneof: "value" }, { no: 3, name: "chat_message", kind: "message", T: Wt, oneof: "value" }, { no: 4, name: "rpc_request", kind: "message", T: Ht, oneof: "value" }, { no: 5, name: "rpc_ack", kind: "message", T: Kt, oneof: "value" }, { no: 6, name: "rpc_response", kind: "message", T: zt, oneof: "value" }, { no: 7, name: "stream_header", kind: "message", T: dn, oneof: "value" }, { no: 8, name: "stream_chunk", kind: "message", T: ln, oneof: "value" }, { no: 9, name: "stream_trailer", kind: "message", T: un, oneof: "value" }])), Ut = He.makeMessageType("livekit.ActiveSpeakerUpdate", (() => [{ no: 1, name: "speakers", kind: "message", T: Ft, repeated: true }])), Ft = He.makeMessageType("livekit.SpeakerInfo", (() => [{ no: 1, name: "sid", kind: "scalar", T: 9 }, { no: 2, name: "level", kind: "scalar", T: 2 }, { no: 3, name: "active", kind: "scalar", T: 8 }])), jt = He.makeMessageType("livekit.UserPacket", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 5, name: "participant_identity", kind: "scalar", T: 9 }, { no: 2, name: "payload", kind: "scalar", T: 12 }, { no: 3, name: "destination_sids", kind: "scalar", T: 9, repeated: true }, { no: 6, name: "destination_identities", kind: "scalar", T: 9, repeated: true }, { no: 4, name: "topic", kind: "scalar", T: 9, opt: true }, { no: 8, name: "id", kind: "scalar", T: 9, opt: true }, { no: 9, name: "start_time", kind: "scalar", T: 4, opt: true }, { no: 10, name: "end_time", kind: "scalar", T: 4, opt: true }, { no: 11, name: "nonce", kind: "scalar", T: 12 }])), Bt = He.makeMessageType("livekit.SipDTMF", (() => [{ no: 3, name: "code", kind: "scalar", T: 13 }, { no: 4, name: "digit", kind: "scalar", T: 9 }])), qt = He.makeMessageType("livekit.Transcription", (() => [{ no: 2, name: "transcribed_participant_identity", kind: "scalar", T: 9 }, { no: 3, name: "track_id", kind: "scalar", T: 9 }, { no: 4, name: "segments", kind: "message", T: Vt, repeated: true }])), Vt = He.makeMessageType("livekit.TranscriptionSegment", (() => [{ no: 1, name: "id", kind: "scalar", T: 9 }, { no: 2, name: "text", kind: "scalar", T: 9 }, { no: 3, name: "start_time", kind: "scalar", T: 4 }, { no: 4, name: "end_time", kind: "scalar", T: 4 }, { no: 5, name: "final", kind: "scalar", T: 8 }, { no: 6, name: "language", kind: "scalar", T: 9 }])), Wt = He.makeMessageType("livekit.ChatMessage", (() => [{ no: 1, name: "id", kind: "scalar", T: 9 }, { no: 2, name: "timestamp", kind: "scalar", T: 3 }, { no: 3, name: "edit_timestamp", kind: "scalar", T: 3, opt: true }, { no: 4, name: "message", kind: "scalar", T: 9 }, { no: 5, name: "deleted", kind: "scalar", T: 8 }, { no: 6, name: "generated", kind: "scalar", T: 8 }])), Ht = He.makeMessageType("livekit.RpcRequest", (() => [{ no: 1, name: "id", kind: "scalar", T: 9 }, { no: 2, name: "method", kind: "scalar", T: 9 }, { no: 3, name: "payload", kind: "scalar", T: 9 }, { no: 4, name: "response_timeout_ms", kind: "scalar", T: 13 }, { no: 5, name: "version", kind: "scalar", T: 13 }, { no: 6, name: "compressed_payload", kind: "scalar", T: 12 }])), Kt = He.makeMessageType("livekit.RpcAck", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 9 }])), zt = He.makeMessageType("livekit.RpcResponse", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 9 }, { no: 2, name: "payload", kind: "scalar", T: 9, oneof: "value" }, { no: 3, name: "error", kind: "message", T: Gt, oneof: "value" }, { no: 4, name: "compressed_payload", kind: "scalar", T: 12, oneof: "value" }])), Gt = He.makeMessageType("livekit.RpcError", (() => [{ no: 1, name: "code", kind: "scalar", T: 13 }, { no: 2, name: "message", kind: "scalar", T: 9 }, { no: 3, name: "data", kind: "scalar", T: 9 }])), Jt = He.makeMessageType("livekit.ParticipantTracks", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 2, name: "track_sids", kind: "scalar", T: 9, repeated: true }])), Qt = He.makeMessageType("livekit.ServerInfo", (() => [{ no: 1, name: "edition", kind: "enum", T: He.getEnumType(Yt) }, { no: 2, name: "version", kind: "scalar", T: 9 }, { no: 3, name: "protocol", kind: "scalar", T: 5 }, { no: 4, name: "region", kind: "scalar", T: 9 }, { no: 5, name: "node_id", kind: "scalar", T: 9 }, { no: 6, name: "debug_info", kind: "scalar", T: 9 }, { no: 7, name: "agent_protocol", kind: "scalar", T: 5 }])), Yt = He.makeEnum("livekit.ServerInfo.Edition", [{ no: 0, name: "Standard" }, { no: 1, name: "Cloud" }]), Xt = He.makeMessageType("livekit.ClientInfo", (() => [{ no: 1, name: "sdk", kind: "enum", T: He.getEnumType(Zt) }, { no: 2, name: "version", kind: "scalar", T: 9 }, { no: 3, name: "protocol", kind: "scalar", T: 5 }, { no: 4, name: "os", kind: "scalar", T: 9 }, { no: 5, name: "os_version", kind: "scalar", T: 9 }, { no: 6, name: "device_model", kind: "scalar", T: 9 }, { no: 7, name: "browser", kind: "scalar", T: 9 }, { no: 8, name: "browser_version", kind: "scalar", T: 9 }, { no: 9, name: "address", kind: "scalar", T: 9 }, { no: 10, name: "network", kind: "scalar", T: 9 }, { no: 11, name: "other_sdks", kind: "scalar", T: 9 }, { no: 12, name: "client_protocol", kind: "scalar", T: 5 }, { no: 13, name: "capabilities", kind: "enum", T: He.getEnumType($t), repeated: true }])), Zt = He.makeEnum("livekit.ClientInfo.SDK", [{ no: 0, name: "UNKNOWN" }, { no: 1, name: "JS" }, { no: 2, name: "SWIFT" }, { no: 3, name: "ANDROID" }, { no: 4, name: "FLUTTER" }, { no: 5, name: "GO" }, { no: 6, name: "UNITY" }, { no: 7, name: "REACT_NATIVE" }, { no: 8, name: "RUST" }, { no: 9, name: "PYTHON" }, { no: 10, name: "CPP" }, { no: 11, name: "UNITY_WEB" }, { no: 12, name: "NODE" }, { no: 13, name: "UNREAL" }, { no: 14, name: "ESP32" }, { no: 15, name: "DOTNET" }]), $t = He.makeEnum("livekit.ClientInfo.Capability", [{ no: 0, name: "CAP_UNUSED" }, { no: 1, name: "CAP_PACKET_TRAILER" }, { no: 2, name: "CAP_COMPRESSION_DEFLATE_RAW" }]), en = He.makeMessageType("livekit.ClientConfiguration", (() => [{ no: 1, name: "video", kind: "message", T: tn }, { no: 2, name: "screen", kind: "message", T: tn }, { no: 3, name: "resume_connection", kind: "enum", T: He.getEnumType(st) }, { no: 4, name: "disabled_codecs", kind: "message", T: nn }, { no: 5, name: "force_relay", kind: "enum", T: He.getEnumType(st) }])), tn = He.makeMessageType("livekit.VideoConfiguration", (() => [{ no: 1, name: "hardware_encoder", kind: "enum", T: He.getEnumType(st) }])), nn = He.makeMessageType("livekit.DisabledCodecs", (() => [{ no: 1, name: "codecs", kind: "message", T: pt, repeated: true }, { no: 2, name: "publish", kind: "message", T: pt, repeated: true }])), rn = He.makeMessageType("livekit.TimedVersion", (() => [{ no: 1, name: "unix_micro", kind: "scalar", T: 3 }, { no: 2, name: "ticks", kind: "scalar", T: 5 }])), on = He.makeEnum("livekit.DataStream.OperationType", [{ no: 0, name: "CREATE" }, { no: 1, name: "UPDATE" }, { no: 2, name: "DELETE" }, { no: 3, name: "REACTION" }]), sn = He.makeEnum("livekit.DataStream.CompressionType", [{ no: 0, name: "NONE" }, { no: 1, name: "DEFLATE_RAW" }]), an = He.makeMessageType("livekit.DataStream.TextHeader", (() => [{ no: 1, name: "operation_type", kind: "enum", T: He.getEnumType(on) }, { no: 2, name: "version", kind: "scalar", T: 5 }, { no: 3, name: "reply_to_stream_id", kind: "scalar", T: 9 }, { no: 4, name: "attached_stream_ids", kind: "scalar", T: 9, repeated: true }, { no: 5, name: "generated", kind: "scalar", T: 8 }]), { localName: "DataStream_TextHeader" }), cn = He.makeMessageType("livekit.DataStream.ByteHeader", (() => [{ no: 1, name: "name", kind: "scalar", T: 9 }]), { localName: "DataStream_ByteHeader" }), dn = He.makeMessageType("livekit.DataStream.Header", (() => [{ no: 1, name: "stream_id", kind: "scalar", T: 9 }, { no: 2, name: "timestamp", kind: "scalar", T: 3 }, { no: 3, name: "topic", kind: "scalar", T: 9 }, { no: 4, name: "mime_type", kind: "scalar", T: 9 }, { no: 5, name: "total_length", kind: "scalar", T: 4, opt: true }, { no: 7, name: "encryption_type", kind: "enum", T: He.getEnumType(yt) }, { no: 8, name: "attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 9, name: "text_header", kind: "message", T: an, oneof: "content_header" }, { no: 10, name: "byte_header", kind: "message", T: cn, oneof: "content_header" }, { no: 11, name: "inline_content", kind: "scalar", T: 12, opt: true }, { no: 12, name: "compression", kind: "enum", T: He.getEnumType(sn) }]), { localName: "DataStream_Header" }), ln = He.makeMessageType("livekit.DataStream.Chunk", (() => [{ no: 1, name: "stream_id", kind: "scalar", T: 9 }, { no: 2, name: "chunk_index", kind: "scalar", T: 4 }, { no: 3, name: "content", kind: "scalar", T: 12 }, { no: 4, name: "version", kind: "scalar", T: 5 }, { no: 5, name: "iv", kind: "scalar", T: 12, opt: true }]), { localName: "DataStream_Chunk" }), un = He.makeMessageType("livekit.DataStream.Trailer", (() => [{ no: 1, name: "stream_id", kind: "scalar", T: 9 }, { no: 2, name: "reason", kind: "scalar", T: 9 }, { no: 3, name: "attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }]), { localName: "DataStream_Trailer" }), hn = He.makeMessageType("livekit.FilterParams", (() => [{ no: 1, name: "include_events", kind: "scalar", T: 9, repeated: true }, { no: 2, name: "exclude_events", kind: "scalar", T: 9, repeated: true }])), pn = He.makeMessageType("livekit.WebhookConfig", (() => [{ no: 1, name: "url", kind: "scalar", T: 9 }, { no: 2, name: "signing_key", kind: "scalar", T: 9 }, { no: 3, name: "filter_params", kind: "message", T: hn }])), mn = He.makeMessageType("livekit.SubscribedAudioCodec", (() => [{ no: 1, name: "codec", kind: "scalar", T: 9 }, { no: 2, name: "enabled", kind: "scalar", T: 8 }])), gn = He.makeEnum("livekit.JobRestartPolicy", [{ no: 0, name: "JRP_ON_FAILURE" }, { no: 1, name: "JRP_NEVER" }]), vn = He.makeMessageType("livekit.RoomAgentDispatch", (() => [{ no: 1, name: "agent_name", kind: "scalar", T: 9 }, { no: 2, name: "metadata", kind: "scalar", T: 9 }, { no: 3, name: "restart_policy", kind: "enum", T: He.getEnumType(gn) }, { no: 4, name: "deployment", kind: "scalar", T: 9 }, { no: 5, name: "attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }])), fn = He.makeEnum("livekit.EncodingOptionsPreset", [{ no: 0, name: "H264_720P_30" }, { no: 1, name: "H264_720P_60" }, { no: 2, name: "H264_1080P_30" }, { no: 3, name: "H264_1080P_60" }, { no: 4, name: "PORTRAIT_H264_720P_30" }, { no: 5, name: "PORTRAIT_H264_720P_60" }, { no: 6, name: "PORTRAIT_H264_1080P_30" }, { no: 7, name: "PORTRAIT_H264_1080P_60" }, { no: 8, name: "PASSTHROUGH" }]), kn = He.makeEnum("livekit.EncodedFileType", [{ no: 0, name: "DEFAULT_FILETYPE" }, { no: 1, name: "MP4" }, { no: 2, name: "OGG" }, { no: 3, name: "MP3" }]), yn = He.makeEnum("livekit.StreamProtocol", [{ no: 0, name: "DEFAULT_PROTOCOL" }, { no: 1, name: "RTMP" }, { no: 2, name: "SRT" }, { no: 3, name: "WEBSOCKET" }]), bn = He.makeEnum("livekit.SegmentedFileProtocol", [{ no: 0, name: "DEFAULT_SEGMENTED_FILE_PROTOCOL" }, { no: 1, name: "HLS_PROTOCOL" }]), Tn = He.makeEnum("livekit.SegmentedFileSuffix", [{ no: 0, name: "INDEX" }, { no: 1, name: "TIMESTAMP" }]), Sn = He.makeEnum("livekit.ImageFileSuffix", [{ no: 0, name: "IMAGE_SUFFIX_INDEX" }, { no: 1, name: "IMAGE_SUFFIX_TIMESTAMP" }, { no: 2, name: "IMAGE_SUFFIX_NONE_OVERWRITE" }]), En = He.makeEnum("livekit.AudioMixing", [{ no: 0, name: "DEFAULT_MIXING" }, { no: 1, name: "DUAL_CHANNEL_AGENT" }, { no: 2, name: "DUAL_CHANNEL_ALTERNATE" }]), Cn = He.makeMessageType("livekit.EncodingOptions", (() => [{ no: 1, name: "width", kind: "scalar", T: 5 }, { no: 2, name: "height", kind: "scalar", T: 5 }, { no: 3, name: "depth", kind: "scalar", T: 5 }, { no: 4, name: "framerate", kind: "scalar", T: 5 }, { no: 5, name: "audio_codec", kind: "enum", T: He.getEnumType(Ze) }, { no: 6, name: "audio_bitrate", kind: "scalar", T: 5 }, { no: 7, name: "audio_frequency", kind: "scalar", T: 5 }, { no: 8, name: "video_codec", kind: "enum", T: He.getEnumType($e) }, { no: 9, name: "video_bitrate", kind: "scalar", T: 5 }, { no: 10, name: "key_frame_interval", kind: "scalar", T: 1 }, { no: 11, name: "audio_quality", kind: "scalar", T: 5 }, { no: 12, name: "video_quality", kind: "scalar", T: 5 }])), wn = He.makeMessageType("livekit.StreamOutput", (() => [{ no: 1, name: "protocol", kind: "enum", T: He.getEnumType(yn) }, { no: 2, name: "urls", kind: "scalar", T: 9, repeated: true }])), Rn = He.makeMessageType("livekit.SegmentedFileOutput", (() => [{ no: 1, name: "protocol", kind: "enum", T: He.getEnumType(bn) }, { no: 2, name: "filename_prefix", kind: "scalar", T: 9 }, { no: 3, name: "playlist_name", kind: "scalar", T: 9 }, { no: 11, name: "live_playlist_name", kind: "scalar", T: 9 }, { no: 4, name: "segment_duration", kind: "scalar", T: 13 }, { no: 10, name: "filename_suffix", kind: "enum", T: He.getEnumType(Tn) }, { no: 8, name: "disable_manifest", kind: "scalar", T: 8 }, { no: 5, name: "s3", kind: "message", T: In, oneof: "output" }, { no: 6, name: "gcp", kind: "message", T: _n, oneof: "output" }, { no: 7, name: "azure", kind: "message", T: Mn, oneof: "output" }, { no: 9, name: "aliOSS", kind: "message", T: Dn, oneof: "output" }])), Pn = He.makeMessageType("livekit.ImageOutput", (() => [{ no: 1, name: "capture_interval", kind: "scalar", T: 13 }, { no: 2, name: "width", kind: "scalar", T: 5 }, { no: 3, name: "height", kind: "scalar", T: 5 }, { no: 4, name: "filename_prefix", kind: "scalar", T: 9 }, { no: 5, name: "filename_suffix", kind: "enum", T: He.getEnumType(Sn) }, { no: 6, name: "image_codec", kind: "enum", T: He.getEnumType(et) }, { no: 7, name: "disable_manifest", kind: "scalar", T: 8 }, { no: 8, name: "s3", kind: "message", T: In, oneof: "output" }, { no: 9, name: "gcp", kind: "message", T: _n, oneof: "output" }, { no: 10, name: "azure", kind: "message", T: Mn, oneof: "output" }, { no: 11, name: "aliOSS", kind: "message", T: Dn, oneof: "output" }])), In = He.makeMessageType("livekit.S3Upload", (() => [{ no: 1, name: "access_key", kind: "scalar", T: 9 }, { no: 2, name: "secret", kind: "scalar", T: 9 }, { no: 11, name: "session_token", kind: "scalar", T: 9 }, { no: 12, name: "assume_role_arn", kind: "scalar", T: 9 }, { no: 13, name: "assume_role_external_id", kind: "scalar", T: 9 }, { no: 3, name: "region", kind: "scalar", T: 9 }, { no: 4, name: "endpoint", kind: "scalar", T: 9 }, { no: 5, name: "bucket", kind: "scalar", T: 9 }, { no: 6, name: "force_path_style", kind: "scalar", T: 8 }, { no: 7, name: "metadata", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 8, name: "tagging", kind: "scalar", T: 9 }, { no: 9, name: "content_disposition", kind: "scalar", T: 9 }, { no: 10, name: "proxy", kind: "message", T: On }])), _n = He.makeMessageType("livekit.GCPUpload", (() => [{ no: 1, name: "credentials", kind: "scalar", T: 9 }, { no: 2, name: "bucket", kind: "scalar", T: 9 }, { no: 3, name: "proxy", kind: "message", T: On }])), Mn = He.makeMessageType("livekit.AzureBlobUpload", (() => [{ no: 1, name: "account_name", kind: "scalar", T: 9 }, { no: 2, name: "account_key", kind: "scalar", T: 9 }, { no: 3, name: "container_name", kind: "scalar", T: 9 }])), Dn = He.makeMessageType("livekit.AliOSSUpload", (() => [{ no: 1, name: "access_key", kind: "scalar", T: 9 }, { no: 2, name: "secret", kind: "scalar", T: 9 }, { no: 3, name: "region", kind: "scalar", T: 9 }, { no: 4, name: "endpoint", kind: "scalar", T: 9 }, { no: 5, name: "bucket", kind: "scalar", T: 9 }])), On = He.makeMessageType("livekit.ProxyConfig", (() => [{ no: 1, name: "url", kind: "scalar", T: 9 }, { no: 2, name: "username", kind: "scalar", T: 9 }, { no: 3, name: "password", kind: "scalar", T: 9 }])), An = He.makeMessageType("livekit.AutoParticipantEgress", (() => [{ no: 1, name: "preset", kind: "enum", T: He.getEnumType(fn), oneof: "options" }, { no: 2, name: "advanced", kind: "message", T: Cn, oneof: "options" }, { no: 3, name: "file_outputs", kind: "message", T: xn, repeated: true }, { no: 4, name: "segment_outputs", kind: "message", T: Rn, repeated: true }])), Ln = He.makeMessageType("livekit.AutoTrackEgress", (() => [{ no: 1, name: "filepath", kind: "scalar", T: 9 }, { no: 5, name: "disable_manifest", kind: "scalar", T: 8 }, { no: 2, name: "s3", kind: "message", T: In, oneof: "output" }, { no: 3, name: "gcp", kind: "message", T: _n, oneof: "output" }, { no: 4, name: "azure", kind: "message", T: Mn, oneof: "output" }, { no: 6, name: "aliOSS", kind: "message", T: Dn, oneof: "output" }])), Nn = He.makeMessageType("livekit.RoomCompositeEgressRequest", (() => [{ no: 1, name: "room_name", kind: "scalar", T: 9 }, { no: 2, name: "layout", kind: "scalar", T: 9 }, { no: 3, name: "audio_only", kind: "scalar", T: 8 }, { no: 15, name: "audio_mixing", kind: "enum", T: He.getEnumType(En) }, { no: 4, name: "video_only", kind: "scalar", T: 8 }, { no: 5, name: "custom_base_url", kind: "scalar", T: 9 }, { no: 6, name: "file", kind: "message", T: xn, oneof: "output" }, { no: 7, name: "stream", kind: "message", T: wn, oneof: "output" }, { no: 10, name: "segments", kind: "message", T: Rn, oneof: "output" }, { no: 8, name: "preset", kind: "enum", T: He.getEnumType(fn), oneof: "options" }, { no: 9, name: "advanced", kind: "message", T: Cn, oneof: "options" }, { no: 11, name: "file_outputs", kind: "message", T: xn, repeated: true }, { no: 12, name: "stream_outputs", kind: "message", T: wn, repeated: true }, { no: 13, name: "segment_outputs", kind: "message", T: Rn, repeated: true }, { no: 14, name: "image_outputs", kind: "message", T: Pn, repeated: true }, { no: 16, name: "webhooks", kind: "message", T: pn, repeated: true }])), xn = He.makeMessageType("livekit.EncodedFileOutput", (() => [{ no: 1, name: "file_type", kind: "enum", T: He.getEnumType(kn) }, { no: 2, name: "filepath", kind: "scalar", T: 9 }, { no: 6, name: "disable_manifest", kind: "scalar", T: 8 }, { no: 3, name: "s3", kind: "message", T: In, oneof: "output" }, { no: 4, name: "gcp", kind: "message", T: _n, oneof: "output" }, { no: 5, name: "azure", kind: "message", T: Mn, oneof: "output" }, { no: 7, name: "aliOSS", kind: "message", T: Dn, oneof: "output" }])), Un = He.makeMessageType("livekit.RoomEgress", (() => [{ no: 1, name: "room", kind: "message", T: Nn }, { no: 3, name: "participant", kind: "message", T: An }, { no: 2, name: "tracks", kind: "message", T: Ln }])), Fn = He.makeMessageType("livekit.RoomConfiguration", (() => [{ no: 1, name: "name", kind: "scalar", T: 9 }, { no: 2, name: "empty_timeout", kind: "scalar", T: 13 }, { no: 3, name: "departure_timeout", kind: "scalar", T: 13 }, { no: 4, name: "max_participants", kind: "scalar", T: 13 }, { no: 11, name: "metadata", kind: "scalar", T: 9 }, { no: 5, name: "egress", kind: "message", T: Un }, { no: 7, name: "min_playout_delay", kind: "scalar", T: 13 }, { no: 8, name: "max_playout_delay", kind: "scalar", T: 13 }, { no: 9, name: "sync_streams", kind: "scalar", T: 8 }, { no: 10, name: "agents", kind: "message", T: vn, repeated: true }, { no: 12, name: "tags", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }])), jn = He.makeEnum("livekit.SignalTarget", [{ no: 0, name: "PUBLISHER" }, { no: 1, name: "SUBSCRIBER" }]), Bn = He.makeEnum("livekit.StreamState", [{ no: 0, name: "ACTIVE" }, { no: 1, name: "PAUSED" }]), qn = He.makeEnum("livekit.CandidateProtocol", [{ no: 0, name: "UDP" }, { no: 1, name: "TCP" }, { no: 2, name: "TLS" }]), Vn = He.makeMessageType("livekit.SignalRequest", (() => [{ no: 1, name: "offer", kind: "message", T: ri, oneof: "message" }, { no: 2, name: "answer", kind: "message", T: ri, oneof: "message" }, { no: 3, name: "trickle", kind: "message", T: Zn, oneof: "message" }, { no: 4, name: "add_track", kind: "message", T: Kn, oneof: "message" }, { no: 5, name: "mute", kind: "message", T: $n, oneof: "message" }, { no: 6, name: "subscription", kind: "message", T: si, oneof: "message" }, { no: 7, name: "track_setting", kind: "message", T: pi, oneof: "message" }, { no: 8, name: "leave", kind: "message", T: vi, oneof: "message" }, { no: 10, name: "update_layers", kind: "message", T: ki, oneof: "message" }, { no: 11, name: "subscription_permission", kind: "message", T: Oi, oneof: "message" }, { no: 12, name: "sync_state", kind: "message", T: Ni, oneof: "message" }, { no: 13, name: "simulate", kind: "message", T: Fi, oneof: "message" }, { no: 14, name: "ping", kind: "scalar", T: 3, oneof: "message" }, { no: 15, name: "update_metadata", kind: "message", T: yi, oneof: "message" }, { no: 16, name: "ping_req", kind: "message", T: ji, oneof: "message" }, { no: 17, name: "update_audio_track", kind: "message", T: mi, oneof: "message" }, { no: 18, name: "update_video_track", kind: "message", T: gi, oneof: "message" }, { no: 19, name: "publish_data_track_request", kind: "message", T: zn, oneof: "message" }, { no: 20, name: "unpublish_data_track_request", kind: "message", T: Jn, oneof: "message" }, { no: 21, name: "update_data_subscription", kind: "message", T: ai, oneof: "message" }, { no: 22, name: "store_data_blob_request", kind: "message", T: di, oneof: "message" }, { no: 23, name: "get_data_blob_request", kind: "message", T: ui, oneof: "message" }])), Wn = He.makeMessageType("livekit.SignalResponse", (() => [{ no: 1, name: "join", kind: "message", T: ei, oneof: "message" }, { no: 2, name: "answer", kind: "message", T: ri, oneof: "message" }, { no: 3, name: "offer", kind: "message", T: ri, oneof: "message" }, { no: 4, name: "trickle", kind: "message", T: Zn, oneof: "message" }, { no: 5, name: "update", kind: "message", T: oi, oneof: "message" }, { no: 6, name: "track_published", kind: "message", T: ni, oneof: "message" }, { no: 8, name: "leave", kind: "message", T: vi, oneof: "message" }, { no: 9, name: "mute", kind: "message", T: $n, oneof: "message" }, { no: 10, name: "speakers_changed", kind: "message", T: Ti, oneof: "message" }, { no: 11, name: "room_update", kind: "message", T: Si, oneof: "message" }, { no: 12, name: "connection_quality", kind: "message", T: Ci, oneof: "message" }, { no: 13, name: "stream_state_update", kind: "message", T: Ri, oneof: "message" }, { no: 14, name: "subscribed_quality_update", kind: "message", T: _i, oneof: "message" }, { no: 15, name: "subscription_permission_update", kind: "message", T: Ai, oneof: "message" }, { no: 16, name: "refresh_token", kind: "scalar", T: 9, oneof: "message" }, { no: 17, name: "track_unpublished", kind: "message", T: ii, oneof: "message" }, { no: 18, name: "pong", kind: "scalar", T: 3, oneof: "message" }, { no: 19, name: "reconnect", kind: "message", T: ti, oneof: "message" }, { no: 20, name: "pong_resp", kind: "message", T: Bi, oneof: "message" }, { no: 21, name: "subscription_response", kind: "message", T: Wi, oneof: "message" }, { no: 22, name: "request_response", kind: "message", T: Hi, oneof: "message" }, { no: 23, name: "track_subscribed", kind: "message", T: zi, oneof: "message" }, { no: 24, name: "room_moved", kind: "message", T: Li, oneof: "message" }, { no: 25, name: "media_sections_requirement", kind: "message", T: Xi, oneof: "message" }, { no: 26, name: "subscribed_audio_codec_update", kind: "message", T: Mi, oneof: "message" }, { no: 27, name: "publish_data_track_response", kind: "message", T: Gn, oneof: "message" }, { no: 28, name: "unpublish_data_track_response", kind: "message", T: Qn, oneof: "message" }, { no: 29, name: "data_track_subscriber_handles", kind: "message", T: Yn, oneof: "message" }, { no: 30, name: "store_data_blob_response", kind: "message", T: li, oneof: "message" }, { no: 31, name: "get_data_blob_response", kind: "message", T: hi, oneof: "message" }])), Hn = He.makeMessageType("livekit.SimulcastCodec", (() => [{ no: 1, name: "codec", kind: "scalar", T: 9 }, { no: 2, name: "cid", kind: "scalar", T: 9 }, { no: 4, name: "layers", kind: "message", T: Dt, repeated: true }, { no: 5, name: "video_layer_mode", kind: "enum", T: He.getEnumType(Ot) }])), Kn = He.makeMessageType("livekit.AddTrackRequest", (() => [{ no: 1, name: "cid", kind: "scalar", T: 9 }, { no: 2, name: "name", kind: "scalar", T: 9 }, { no: 3, name: "type", kind: "enum", T: He.getEnumType(nt) }, { no: 4, name: "width", kind: "scalar", T: 13 }, { no: 5, name: "height", kind: "scalar", T: 13 }, { no: 6, name: "muted", kind: "scalar", T: 8 }, { no: 7, name: "disable_dtx", kind: "scalar", T: 8 }, { no: 8, name: "source", kind: "enum", T: He.getEnumType(it) }, { no: 9, name: "layers", kind: "message", T: Dt, repeated: true }, { no: 10, name: "simulcast_codecs", kind: "message", T: Hn, repeated: true }, { no: 11, name: "sid", kind: "scalar", T: 9 }, { no: 12, name: "stereo", kind: "scalar", T: 8 }, { no: 13, name: "disable_red", kind: "scalar", T: 8 }, { no: 14, name: "encryption", kind: "enum", T: He.getEnumType(yt) }, { no: 15, name: "stream", kind: "scalar", T: 9 }, { no: 16, name: "backup_codec_policy", kind: "enum", T: He.getEnumType(tt) }, { no: 17, name: "audio_features", kind: "enum", T: He.getEnumType(lt), repeated: true }, { no: 18, name: "packet_trailer_features", kind: "enum", T: He.getEnumType(ut), repeated: true }])), zn = He.makeMessageType("livekit.PublishDataTrackRequest", (() => [{ no: 1, name: "pub_handle", kind: "scalar", T: 13 }, { no: 2, name: "name", kind: "scalar", T: 9 }, { no: 3, name: "encryption", kind: "enum", T: He.getEnumType(yt) }, { no: 4, name: "frame_encoding", kind: "message", T: Et, opt: true }, { no: 5, name: "schema", kind: "message", T: Pt, opt: true }])), Gn = He.makeMessageType("livekit.PublishDataTrackResponse", (() => [{ no: 1, name: "info", kind: "message", T: St }])), Jn = He.makeMessageType("livekit.UnpublishDataTrackRequest", (() => [{ no: 1, name: "pub_handle", kind: "scalar", T: 13 }])), Qn = He.makeMessageType("livekit.UnpublishDataTrackResponse", (() => [{ no: 1, name: "info", kind: "message", T: St }])), Yn = He.makeMessageType("livekit.DataTrackSubscriberHandles", (() => [{ no: 1, name: "sub_handles", kind: "map", K: 13, V: { kind: "message", T: Xn } }])), Xn = He.makeMessageType("livekit.DataTrackSubscriberHandles.PublishedDataTrack", (() => [{ no: 1, name: "publisher_identity", kind: "scalar", T: 9 }, { no: 2, name: "publisher_sid", kind: "scalar", T: 9 }, { no: 3, name: "track_sid", kind: "scalar", T: 9 }]), { localName: "DataTrackSubscriberHandles_PublishedDataTrack" }), Zn = He.makeMessageType("livekit.TrickleRequest", (() => [{ no: 1, name: "candidateInit", kind: "scalar", T: 9 }, { no: 2, name: "target", kind: "enum", T: He.getEnumType(jn) }, { no: 3, name: "final", kind: "scalar", T: 8 }])), $n = He.makeMessageType("livekit.MuteTrackRequest", (() => [{ no: 1, name: "sid", kind: "scalar", T: 9 }, { no: 2, name: "muted", kind: "scalar", T: 8 }])), ei = He.makeMessageType("livekit.JoinResponse", (() => [{ no: 1, name: "room", kind: "message", T: ht }, { no: 2, name: "participant", kind: "message", T: gt }, { no: 3, name: "other_participants", kind: "message", T: gt, repeated: true }, { no: 4, name: "server_version", kind: "scalar", T: 9 }, { no: 5, name: "ice_servers", kind: "message", T: bi, repeated: true }, { no: 6, name: "subscriber_primary", kind: "scalar", T: 8 }, { no: 7, name: "alternative_url", kind: "scalar", T: 9 }, { no: 8, name: "client_configuration", kind: "message", T: en }, { no: 9, name: "server_region", kind: "scalar", T: 9 }, { no: 10, name: "ping_timeout", kind: "scalar", T: 5 }, { no: 11, name: "ping_interval", kind: "scalar", T: 5 }, { no: 12, name: "server_info", kind: "message", T: Qt }, { no: 13, name: "sif_trailer", kind: "scalar", T: 12 }, { no: 14, name: "enabled_publish_codecs", kind: "message", T: pt, repeated: true }, { no: 15, name: "fast_publish", kind: "scalar", T: 8 }])), ti = He.makeMessageType("livekit.ReconnectResponse", (() => [{ no: 1, name: "ice_servers", kind: "message", T: bi, repeated: true }, { no: 2, name: "client_configuration", kind: "message", T: en }, { no: 3, name: "server_info", kind: "message", T: Qt }, { no: 4, name: "last_message_seq", kind: "scalar", T: 13 }])), ni = He.makeMessageType("livekit.TrackPublishedResponse", (() => [{ no: 1, name: "cid", kind: "scalar", T: 9 }, { no: 2, name: "track", kind: "message", T: Tt }])), ii = He.makeMessageType("livekit.TrackUnpublishedResponse", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }])), ri = He.makeMessageType("livekit.SessionDescription", (() => [{ no: 1, name: "type", kind: "scalar", T: 9 }, { no: 2, name: "sdp", kind: "scalar", T: 9 }, { no: 3, name: "id", kind: "scalar", T: 13 }, { no: 4, name: "mid_to_track_id", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }])), oi = He.makeMessageType("livekit.ParticipantUpdate", (() => [{ no: 1, name: "participants", kind: "message", T: gt, repeated: true }])), si = He.makeMessageType("livekit.UpdateSubscription", (() => [{ no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true }, { no: 2, name: "subscribe", kind: "scalar", T: 8 }, { no: 3, name: "participant_tracks", kind: "message", T: Jt, repeated: true }])), ai = He.makeMessageType("livekit.UpdateDataSubscription", (() => [{ no: 1, name: "updates", kind: "message", T: ci, repeated: true }])), ci = He.makeMessageType("livekit.UpdateDataSubscription.Update", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "subscribe", kind: "scalar", T: 8 }, { no: 3, name: "options", kind: "message", T: It }]), { localName: "UpdateDataSubscription_Update" }), di = He.makeMessageType("livekit.StoreDataBlobRequest", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 13 }, { no: 2, name: "blob", kind: "message", T: Mt }])), li = He.makeMessageType("livekit.StoreDataBlobResponse", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 13 }, { no: 2, name: "key", kind: "message", T: _t }])), ui = He.makeMessageType("livekit.GetDataBlobRequest", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 13 }, { no: 2, name: "participant_identity", kind: "scalar", T: 9 }, { no: 3, name: "key", kind: "message", T: _t }])), hi = He.makeMessageType("livekit.GetDataBlobResponse", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 13 }, { no: 2, name: "blob", kind: "message", T: Mt }])), pi = He.makeMessageType("livekit.UpdateTrackSettings", (() => [{ no: 1, name: "track_sids", kind: "scalar", T: 9, repeated: true }, { no: 3, name: "disabled", kind: "scalar", T: 8 }, { no: 4, name: "quality", kind: "enum", T: He.getEnumType(rt) }, { no: 5, name: "width", kind: "scalar", T: 13 }, { no: 6, name: "height", kind: "scalar", T: 13 }, { no: 7, name: "fps", kind: "scalar", T: 13 }, { no: 8, name: "priority", kind: "scalar", T: 13 }])), mi = He.makeMessageType("livekit.UpdateLocalAudioTrack", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "features", kind: "enum", T: He.getEnumType(lt), repeated: true }])), gi = He.makeMessageType("livekit.UpdateLocalVideoTrack", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "width", kind: "scalar", T: 13 }, { no: 3, name: "height", kind: "scalar", T: 13 }])), vi = He.makeMessageType("livekit.LeaveRequest", (() => [{ no: 1, name: "can_reconnect", kind: "scalar", T: 8 }, { no: 2, name: "reason", kind: "enum", T: He.getEnumType(at) }, { no: 3, name: "action", kind: "enum", T: He.getEnumType(fi) }, { no: 4, name: "regions", kind: "message", T: qi }])), fi = He.makeEnum("livekit.LeaveRequest.Action", [{ no: 0, name: "DISCONNECT" }, { no: 1, name: "RESUME" }, { no: 2, name: "RECONNECT" }]), ki = He.makeMessageType("livekit.UpdateVideoLayers", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "layers", kind: "message", T: Dt, repeated: true }])), yi = He.makeMessageType("livekit.UpdateParticipantMetadata", (() => [{ no: 1, name: "metadata", kind: "scalar", T: 9 }, { no: 2, name: "name", kind: "scalar", T: 9 }, { no: 3, name: "attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 4, name: "request_id", kind: "scalar", T: 13 }])), bi = He.makeMessageType("livekit.ICEServer", (() => [{ no: 1, name: "urls", kind: "scalar", T: 9, repeated: true }, { no: 2, name: "username", kind: "scalar", T: 9 }, { no: 3, name: "credential", kind: "scalar", T: 9 }])), Ti = He.makeMessageType("livekit.SpeakersChanged", (() => [{ no: 1, name: "speakers", kind: "message", T: Ft, repeated: true }])), Si = He.makeMessageType("livekit.RoomUpdate", (() => [{ no: 1, name: "room", kind: "message", T: ht }])), Ei = He.makeMessageType("livekit.ConnectionQualityInfo", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 2, name: "quality", kind: "enum", T: He.getEnumType(ot) }, { no: 3, name: "score", kind: "scalar", T: 2 }])), Ci = He.makeMessageType("livekit.ConnectionQualityUpdate", (() => [{ no: 1, name: "updates", kind: "message", T: Ei, repeated: true }])), wi = He.makeMessageType("livekit.StreamStateInfo", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 2, name: "track_sid", kind: "scalar", T: 9 }, { no: 3, name: "state", kind: "enum", T: He.getEnumType(Bn) }])), Ri = He.makeMessageType("livekit.StreamStateUpdate", (() => [{ no: 1, name: "stream_states", kind: "message", T: wi, repeated: true }])), Pi = He.makeMessageType("livekit.SubscribedQuality", (() => [{ no: 1, name: "quality", kind: "enum", T: He.getEnumType(rt) }, { no: 2, name: "enabled", kind: "scalar", T: 8 }])), Ii = He.makeMessageType("livekit.SubscribedCodec", (() => [{ no: 1, name: "codec", kind: "scalar", T: 9 }, { no: 2, name: "qualities", kind: "message", T: Pi, repeated: true }])), _i = He.makeMessageType("livekit.SubscribedQualityUpdate", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "subscribed_qualities", kind: "message", T: Pi, repeated: true }, { no: 3, name: "subscribed_codecs", kind: "message", T: Ii, repeated: true }])), Mi = He.makeMessageType("livekit.SubscribedAudioCodecUpdate", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "subscribed_audio_codecs", kind: "message", T: mn, repeated: true }])), Di = He.makeMessageType("livekit.TrackPermission", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 2, name: "all_tracks", kind: "scalar", T: 8 }, { no: 3, name: "track_sids", kind: "scalar", T: 9, repeated: true }, { no: 4, name: "participant_identity", kind: "scalar", T: 9 }])), Oi = He.makeMessageType("livekit.SubscriptionPermission", (() => [{ no: 1, name: "all_participants", kind: "scalar", T: 8 }, { no: 2, name: "track_permissions", kind: "message", T: Di, repeated: true }])), Ai = He.makeMessageType("livekit.SubscriptionPermissionUpdate", (() => [{ no: 1, name: "participant_sid", kind: "scalar", T: 9 }, { no: 2, name: "track_sid", kind: "scalar", T: 9 }, { no: 3, name: "allowed", kind: "scalar", T: 8 }])), Li = He.makeMessageType("livekit.RoomMovedResponse", (() => [{ no: 1, name: "room", kind: "message", T: ht }, { no: 2, name: "token", kind: "scalar", T: 9 }, { no: 3, name: "participant", kind: "message", T: gt }, { no: 4, name: "other_participants", kind: "message", T: gt, repeated: true }])), Ni = He.makeMessageType("livekit.SyncState", (() => [{ no: 1, name: "answer", kind: "message", T: ri }, { no: 2, name: "subscription", kind: "message", T: si }, { no: 3, name: "publish_tracks", kind: "message", T: ni, repeated: true }, { no: 4, name: "data_channels", kind: "message", T: Ui, repeated: true }, { no: 5, name: "offer", kind: "message", T: ri }, { no: 6, name: "track_sids_disabled", kind: "scalar", T: 9, repeated: true }, { no: 7, name: "datachannel_receive_states", kind: "message", T: xi, repeated: true }, { no: 8, name: "publish_data_tracks", kind: "message", T: Gn, repeated: true }, { no: 9, name: "data_subscription", kind: "message", T: ai }])), xi = He.makeMessageType("livekit.DataChannelReceiveState", (() => [{ no: 1, name: "publisher_sid", kind: "scalar", T: 9 }, { no: 2, name: "last_seq", kind: "scalar", T: 13 }])), Ui = He.makeMessageType("livekit.DataChannelInfo", (() => [{ no: 1, name: "label", kind: "scalar", T: 9 }, { no: 2, name: "id", kind: "scalar", T: 13 }, { no: 3, name: "target", kind: "enum", T: He.getEnumType(jn) }])), Fi = He.makeMessageType("livekit.SimulateScenario", (() => [{ no: 1, name: "speaker_update", kind: "scalar", T: 5, oneof: "scenario" }, { no: 2, name: "node_failure", kind: "scalar", T: 8, oneof: "scenario" }, { no: 3, name: "migration", kind: "scalar", T: 8, oneof: "scenario" }, { no: 4, name: "server_leave", kind: "scalar", T: 8, oneof: "scenario" }, { no: 5, name: "switch_candidate_protocol", kind: "enum", T: He.getEnumType(qn), oneof: "scenario" }, { no: 6, name: "subscriber_bandwidth", kind: "scalar", T: 3, oneof: "scenario" }, { no: 7, name: "disconnect_signal_on_resume", kind: "scalar", T: 8, oneof: "scenario" }, { no: 8, name: "disconnect_signal_on_resume_no_messages", kind: "scalar", T: 8, oneof: "scenario" }, { no: 9, name: "leave_request_full_reconnect", kind: "scalar", T: 8, oneof: "scenario" }])), ji = He.makeMessageType("livekit.Ping", (() => [{ no: 1, name: "timestamp", kind: "scalar", T: 3 }, { no: 2, name: "rtt", kind: "scalar", T: 3 }])), Bi = He.makeMessageType("livekit.Pong", (() => [{ no: 1, name: "last_ping_timestamp", kind: "scalar", T: 3 }, { no: 2, name: "timestamp", kind: "scalar", T: 3 }])), qi = He.makeMessageType("livekit.RegionSettings", (() => [{ no: 1, name: "regions", kind: "message", T: Vi, repeated: true }])), Vi = He.makeMessageType("livekit.RegionInfo", (() => [{ no: 1, name: "region", kind: "scalar", T: 9 }, { no: 2, name: "url", kind: "scalar", T: 9 }, { no: 3, name: "distance", kind: "scalar", T: 3 }])), Wi = He.makeMessageType("livekit.SubscriptionResponse", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }, { no: 2, name: "err", kind: "enum", T: He.getEnumType(dt) }])), Hi = He.makeMessageType("livekit.RequestResponse", (() => [{ no: 1, name: "request_id", kind: "scalar", T: 13 }, { no: 2, name: "reason", kind: "enum", T: He.getEnumType(Ki) }, { no: 3, name: "message", kind: "scalar", T: 9 }, { no: 4, name: "trickle", kind: "message", T: Zn, oneof: "request" }, { no: 5, name: "add_track", kind: "message", T: Kn, oneof: "request" }, { no: 6, name: "mute", kind: "message", T: $n, oneof: "request" }, { no: 7, name: "update_metadata", kind: "message", T: yi, oneof: "request" }, { no: 8, name: "update_audio_track", kind: "message", T: mi, oneof: "request" }, { no: 9, name: "update_video_track", kind: "message", T: gi, oneof: "request" }, { no: 10, name: "publish_data_track", kind: "message", T: zn, oneof: "request" }, { no: 11, name: "unpublish_data_track", kind: "message", T: Jn, oneof: "request" }])), Ki = He.makeEnum("livekit.RequestResponse.Reason", [{ no: 0, name: "OK" }, { no: 1, name: "NOT_FOUND" }, { no: 2, name: "NOT_ALLOWED" }, { no: 3, name: "LIMIT_EXCEEDED" }, { no: 4, name: "QUEUED" }, { no: 5, name: "UNSUPPORTED_TYPE" }, { no: 6, name: "UNCLASSIFIED_ERROR" }, { no: 7, name: "INVALID_HANDLE" }, { no: 8, name: "INVALID_NAME" }, { no: 9, name: "DUPLICATE_HANDLE" }, { no: 10, name: "DUPLICATE_NAME" }, { no: 11, name: "INVALID_REQUEST" }]), zi = He.makeMessageType("livekit.TrackSubscribed", (() => [{ no: 1, name: "track_sid", kind: "scalar", T: 9 }])), Gi = He.makeMessageType("livekit.ConnectionSettings", (() => [{ no: 1, name: "auto_subscribe", kind: "scalar", T: 8 }, { no: 2, name: "adaptive_stream", kind: "scalar", T: 8 }, { no: 3, name: "subscriber_allow_pause", kind: "scalar", T: 8, opt: true }, { no: 4, name: "disable_ice_lite", kind: "scalar", T: 8 }, { no: 5, name: "auto_subscribe_data_track", kind: "scalar", T: 8, opt: true }])), Ji = He.makeMessageType("livekit.JoinRequest", (() => [{ no: 1, name: "client_info", kind: "message", T: Xt }, { no: 2, name: "connection_settings", kind: "message", T: Gi }, { no: 3, name: "metadata", kind: "scalar", T: 9 }, { no: 4, name: "participant_attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 5, name: "add_track_requests", kind: "message", T: Kn, repeated: true }, { no: 6, name: "publisher_offer", kind: "message", T: ri }, { no: 7, name: "reconnect", kind: "scalar", T: 8 }, { no: 8, name: "reconnect_reason", kind: "enum", T: He.getEnumType(ct) }, { no: 9, name: "participant_sid", kind: "scalar", T: 9 }, { no: 10, name: "sync_state", kind: "message", T: Ni }])), Qi = He.makeMessageType("livekit.WrappedJoinRequest", (() => [{ no: 1, name: "compression", kind: "enum", T: He.getEnumType(Yi) }, { no: 2, name: "join_request", kind: "scalar", T: 12 }])), Yi = He.makeEnum("livekit.WrappedJoinRequest.Compression", [{ no: 0, name: "NONE" }, { no: 1, name: "GZIP" }]), Xi = He.makeMessageType("livekit.MediaSectionsRequirement", (() => [{ no: 1, name: "num_audios", kind: "scalar", T: 13 }, { no: 2, name: "num_videos", kind: "scalar", T: 13 }])), Zi = He.makeMessageType("livekit.TokenSourceRequest", (() => [{ no: 1, name: "room_name", kind: "scalar", T: 9, opt: true }, { no: 2, name: "participant_name", kind: "scalar", T: 9, opt: true }, { no: 3, name: "participant_identity", kind: "scalar", T: 9, opt: true }, { no: 4, name: "participant_metadata", kind: "scalar", T: 9, opt: true }, { no: 5, name: "participant_attributes", kind: "map", K: 9, V: { kind: "scalar", T: 9 } }, { no: 6, name: "room_config", kind: "message", T: Fn, opt: true }])), $i = He.makeMessageType("livekit.TokenSourceResponse", (() => [{ no: 1, name: "server_url", kind: "scalar", T: 9 }, { no: 2, name: "participant_token", kind: "scalar", T: 9 }]));
  function er(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  var tr, nr = { exports: {} }, ir = nr.exports;
  var rr, or, sr = (tr || (tr = 1, (function(e2) {
    var t2, i2;
    t2 = ir, i2 = function() {
      var e3 = function() {
      }, t3 = "undefined", i3 = typeof window !== t3 && typeof window.navigator !== t3 && /Trident\/|MSIE /.test(window.navigator.userAgent), r2 = ["trace", "debug", "info", "warn", "error"], o2 = {}, s2 = null;
      function a2(e4, t4) {
        var i4 = e4[t4];
        if ("function" == typeof i4.bind) return i4.bind(e4);
        try {
          return Function.prototype.bind.call(i4, e4);
        } catch (n2) {
          return function() {
            return Function.prototype.apply.apply(i4, [e4, arguments]);
          };
        }
      }
      function c2() {
        console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
      }
      function d2() {
        for (var n2 = this.getLevel(), i4 = 0; i4 < r2.length; i4++) {
          var o3 = r2[i4];
          this[o3] = i4 < n2 ? e3 : this.methodFactory(o3, n2, this.name);
        }
        if (this.log = this.debug, typeof console === t3 && n2 < this.levels.SILENT) return "No console available for logging";
      }
      function l2(e4) {
        return function() {
          typeof console !== t3 && (d2.call(this), this[e4].apply(this, arguments));
        };
      }
      function u2(n2, r3, o3) {
        return (function(n3) {
          return "debug" === n3 && (n3 = "log"), typeof console !== t3 && ("trace" === n3 && i3 ? c2 : void 0 !== console[n3] ? a2(console, n3) : void 0 !== console.log ? a2(console, "log") : e3);
        })(n2) || l2.apply(this, arguments);
      }
      function h2(e4, n2) {
        var i4, a3, c3, l3 = this, h3 = "loglevel";
        function p3() {
          var e5;
          if (typeof window !== t3 && h3) {
            try {
              e5 = window.localStorage[h3];
            } catch (o3) {
            }
            if (typeof e5 === t3) try {
              var n3 = window.document.cookie, i5 = encodeURIComponent(h3), r3 = n3.indexOf(i5 + "=");
              -1 !== r3 && (e5 = /^([^;]+)/.exec(n3.slice(r3 + i5.length + 1))[1]);
            } catch (o3) {
            }
            return void 0 === l3.levels[e5] && (e5 = void 0), e5;
          }
        }
        function m2(e5) {
          var t4 = e5;
          if ("string" == typeof t4 && void 0 !== l3.levels[t4.toUpperCase()] && (t4 = l3.levels[t4.toUpperCase()]), "number" == typeof t4 && t4 >= 0 && t4 <= l3.levels.SILENT) return t4;
          throw new TypeError("log.setLevel() called with invalid level: " + e5);
        }
        "string" == typeof e4 ? h3 += ":" + e4 : "symbol" == typeof e4 && (h3 = void 0), l3.name = e4, l3.levels = { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, SILENT: 5 }, l3.methodFactory = n2 || u2, l3.getLevel = function() {
          return null != c3 ? c3 : null != a3 ? a3 : i4;
        }, l3.setLevel = function(e5, n3) {
          return c3 = m2(e5), false !== n3 && (function(e6) {
            var n4 = (r2[e6] || "silent").toUpperCase();
            if (typeof window !== t3 && h3) {
              try {
                return void (window.localStorage[h3] = n4);
              } catch (i5) {
              }
              try {
                window.document.cookie = encodeURIComponent(h3) + "=" + n4 + ";";
              } catch (i5) {
              }
            }
          })(c3), d2.call(l3);
        }, l3.setDefaultLevel = function(e5) {
          a3 = m2(e5), p3() || l3.setLevel(e5, false);
        }, l3.resetLevel = function() {
          c3 = null, (function() {
            if (typeof window !== t3 && h3) {
              try {
                window.localStorage.removeItem(h3);
              } catch (e5) {
              }
              try {
                window.document.cookie = encodeURIComponent(h3) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
              } catch (e5) {
              }
            }
          })(), d2.call(l3);
        }, l3.enableAll = function(e5) {
          l3.setLevel(l3.levels.TRACE, e5);
        }, l3.disableAll = function(e5) {
          l3.setLevel(l3.levels.SILENT, e5);
        }, l3.rebuild = function() {
          if (s2 !== l3 && (i4 = m2(s2.getLevel())), d2.call(l3), s2 === l3) for (var e5 in o2) o2[e5].rebuild();
        }, i4 = m2(s2 ? s2.getLevel() : "WARN");
        var g2 = p3();
        null != g2 && (c3 = m2(g2)), d2.call(l3);
      }
      (s2 = new h2()).getLogger = function(e4) {
        if ("symbol" != typeof e4 && "string" != typeof e4 || "" === e4) throw new TypeError("You must supply a name when creating a logger.");
        var t4 = o2[e4];
        return t4 || (t4 = o2[e4] = new h2(e4, s2.methodFactory)), t4;
      };
      var p2 = typeof window !== t3 ? window.log : void 0;
      return s2.noConflict = function() {
        return typeof window !== t3 && window.log === s2 && (window.log = p2), s2;
      }, s2.getLoggers = function() {
        return o2;
      }, s2.default = s2, s2;
    }, e2.exports ? e2.exports = i2() : t2.log = i2();
  })(nr)), nr.exports);
  e.LogLevel = void 0, (rr = e.LogLevel || (e.LogLevel = {}))[rr.trace = 0] = "trace", rr[rr.debug = 1] = "debug", rr[rr.info = 2] = "info", rr[rr.warn = 3] = "warn", rr[rr.error = 4] = "error", rr[rr.silent = 5] = "silent", e.LoggerNames = void 0, (or = e.LoggerNames || (e.LoggerNames = {})).Default = "livekit", or.Room = "livekit-room", or.TokenSource = "livekit-token-source", or.Participant = "livekit-participant", or.Track = "livekit-track", or.Publication = "livekit-track-publication", or.Engine = "livekit-engine", or.Signal = "livekit-signal", or.PCManager = "livekit-pc-manager", or.PCTransport = "livekit-pc-transport", or.E2EE = "lk-e2ee", or.DataTracks = "livekit-data-tracks", or.Region = "livekit-region", or.ICE = "livekit-ice", or.Stats = "livekit-stats";
  let ar = sr.getLogger(e.LoggerNames.Default);
  const cr = Object.values(e.LoggerNames).map(((e2) => sr.getLogger(e2)));
  function dr(e2, t2) {
    const n2 = sr.getLogger(e2);
    return n2.setDefaultLevel(ar.getLevel()), t2 ? (function(e3, t3) {
      const n3 = (n4) => (i3, r2) => {
        const o2 = t3(), s2 = o2 || r2 ? Object.assign(Object.assign({}, o2), r2) : void 0;
        e3[n4](i3, s2);
      }, i2 = Object.create(e3);
      return i2.trace = n3("trace"), i2.debug = n3("debug"), i2.info = n3("info"), i2.warn = n3("warn"), i2.error = n3("error"), i2;
    })(n2, t2) : n2;
  }
  ar.setDefaultLevel(e.LogLevel.info);
  const lr = sr.getLogger(e.LoggerNames.E2EE), ur = /* @__PURE__ */ new Set(), hr = lr.setLevel.bind(lr);
  function pr(e2) {
    return ur.add(e2), () => {
      ur.delete(e2);
    };
  }
  lr.setLevel = (e2, t2) => {
    hr(e2, t2);
    const n2 = lr.getLevel();
    ur.forEach(((e3) => e3(n2)));
  };
  const mr = 7e3, gr = [0, 300, 1200, 2700, 4800, mr, mr, mr, mr, mr];
  class vr {
    constructor(e2) {
      this._retryDelays = void 0 !== e2 ? [...e2] : gr;
    }
    nextRetryDelayInMs(e2) {
      if (e2.retryCount >= this._retryDelays.length) return null;
      const t2 = this._retryDelays[e2.retryCount];
      return 0 === e2.retryCount && 0 === t2 ? 500 * Math.random() : Math.round(t2 * (0.5 + Math.random()));
    }
  }
  function fr(e2, t2) {
    var n2 = {};
    for (var i2 in e2) Object.prototype.hasOwnProperty.call(e2, i2) && t2.indexOf(i2) < 0 && (n2[i2] = e2[i2]);
    if (null != e2 && "function" == typeof Object.getOwnPropertySymbols) {
      var r2 = 0;
      for (i2 = Object.getOwnPropertySymbols(e2); r2 < i2.length; r2++) t2.indexOf(i2[r2]) < 0 && Object.prototype.propertyIsEnumerable.call(e2, i2[r2]) && (n2[i2[r2]] = e2[i2[r2]]);
    }
    return n2;
  }
  function kr(e2, t2, i2, r2) {
    return new (i2 || (i2 = Promise))((function(o2, s2) {
      function a2(e3) {
        try {
          d2(r2.next(e3));
        } catch (n2) {
          s2(n2);
        }
      }
      function c2(e3) {
        try {
          d2(r2.throw(e3));
        } catch (n2) {
          s2(n2);
        }
      }
      function d2(e3) {
        var t3;
        e3.done ? o2(e3.value) : (t3 = e3.value, t3 instanceof i2 ? t3 : new i2((function(e4) {
          e4(t3);
        }))).then(a2, c2);
      }
      d2((r2 = r2.apply(e2, t2 || [])).next());
    }));
  }
  function yr(e2) {
    var t2 = "function" == typeof Symbol && Symbol.iterator, n2 = t2 && e2[t2], i2 = 0;
    if (n2) return n2.call(e2);
    if (e2 && "number" == typeof e2.length) return { next: function() {
      return e2 && i2 >= e2.length && (e2 = void 0), { value: e2 && e2[i2++], done: !e2 };
    } };
    throw new TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function br(e2) {
    return this instanceof br ? (this.v = e2, this) : new br(e2);
  }
  function Tr(e2, t2, i2) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r2, o2 = i2.apply(e2, t2 || []), s2 = [];
    return r2 = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), a2("next"), a2("throw"), a2("return", (function(e3) {
      return function(t3) {
        return Promise.resolve(t3).then(e3, l2);
      };
    })), r2[Symbol.asyncIterator] = function() {
      return this;
    }, r2;
    function a2(e3, t3) {
      o2[e3] && (r2[e3] = function(t4) {
        return new Promise((function(n2, i3) {
          s2.push([e3, t4, n2, i3]) > 1 || c2(e3, t4);
        }));
      }, t3 && (r2[e3] = t3(r2[e3])));
    }
    function c2(e3, t3) {
      try {
        (i3 = o2[e3](t3)).value instanceof br ? Promise.resolve(i3.value.v).then(d2, l2) : u2(s2[0][2], i3);
      } catch (n2) {
        u2(s2[0][3], n2);
      }
      var i3;
    }
    function d2(e3) {
      c2("next", e3);
    }
    function l2(e3) {
      c2("throw", e3);
    }
    function u2(e3, t3) {
      e3(t3), s2.shift(), s2.length && c2(s2[0][0], s2[0][1]);
    }
  }
  function Sr(e2) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t2, n2 = e2[Symbol.asyncIterator];
    return n2 ? n2.call(e2) : (e2 = yr(e2), t2 = {}, i2("next"), i2("throw"), i2("return"), t2[Symbol.asyncIterator] = function() {
      return this;
    }, t2);
    function i2(n3) {
      t2[n3] = e2[n3] && function(t3) {
        return new Promise((function(i3, r2) {
          (function(e3, t4, n4, i4) {
            Promise.resolve(i4).then((function(t5) {
              e3({ value: t5, done: n4 });
            }), t4);
          })(i3, r2, (t3 = e2[n3](t3)).done, t3.value);
        }));
      };
    }
  }
  "function" == typeof SuppressedError && SuppressedError;
  var Er, Cr = { exports: {} };
  var wr = (function() {
    if (Er) return Cr.exports;
    Er = 1;
    var e2, t2 = "object" == typeof Reflect ? Reflect : null, n2 = t2 && "function" == typeof t2.apply ? t2.apply : function(e3, t3, n3) {
      return Function.prototype.apply.call(e3, t3, n3);
    };
    e2 = t2 && "function" == typeof t2.ownKeys ? t2.ownKeys : Object.getOwnPropertySymbols ? function(e3) {
      return Object.getOwnPropertyNames(e3).concat(Object.getOwnPropertySymbols(e3));
    } : function(e3) {
      return Object.getOwnPropertyNames(e3);
    };
    var i2 = Number.isNaN || function(e3) {
      return e3 != e3;
    };
    function r2() {
      r2.init.call(this);
    }
    Cr.exports = r2, Cr.exports.once = function(e3, t3) {
      return new Promise((function(n3, i3) {
        function r3(n4) {
          e3.removeListener(t3, o3), i3(n4);
        }
        function o3() {
          "function" == typeof e3.removeListener && e3.removeListener("error", r3), n3([].slice.call(arguments));
        }
        m2(e3, t3, o3, { once: true }), "error" !== t3 && (function(e4, t4, n4) {
          "function" == typeof e4.on && m2(e4, "error", t4, n4);
        })(e3, r3, { once: true });
      }));
    }, r2.EventEmitter = r2, r2.prototype._events = void 0, r2.prototype._eventsCount = 0, r2.prototype._maxListeners = void 0;
    var o2 = 10;
    function s2(e3) {
      if ("function" != typeof e3) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e3);
    }
    function a2(e3) {
      return void 0 === e3._maxListeners ? r2.defaultMaxListeners : e3._maxListeners;
    }
    function c2(e3, t3, n3, i3) {
      var r3, o3, c3, d3;
      if (s2(n3), void 0 === (o3 = e3._events) ? (o3 = e3._events = /* @__PURE__ */ Object.create(null), e3._eventsCount = 0) : (void 0 !== o3.newListener && (e3.emit("newListener", t3, n3.listener ? n3.listener : n3), o3 = e3._events), c3 = o3[t3]), void 0 === c3) c3 = o3[t3] = n3, ++e3._eventsCount;
      else if ("function" == typeof c3 ? c3 = o3[t3] = i3 ? [n3, c3] : [c3, n3] : i3 ? c3.unshift(n3) : c3.push(n3), (r3 = a2(e3)) > 0 && c3.length > r3 && !c3.warned) {
        c3.warned = true;
        var l3 = new Error("Possible EventEmitter memory leak detected. " + c3.length + " " + String(t3) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        l3.name = "MaxListenersExceededWarning", l3.emitter = e3, l3.type = t3, l3.count = c3.length, d3 = l3, console && console.warn && console.warn(d3);
      }
      return e3;
    }
    function d2() {
      if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function l2(e3, t3, n3) {
      var i3 = { fired: false, wrapFn: void 0, target: e3, type: t3, listener: n3 }, r3 = d2.bind(i3);
      return r3.listener = n3, i3.wrapFn = r3, r3;
    }
    function u2(e3, t3, n3) {
      var i3 = e3._events;
      if (void 0 === i3) return [];
      var r3 = i3[t3];
      return void 0 === r3 ? [] : "function" == typeof r3 ? n3 ? [r3.listener || r3] : [r3] : n3 ? (function(e4) {
        for (var t4 = new Array(e4.length), n4 = 0; n4 < t4.length; ++n4) t4[n4] = e4[n4].listener || e4[n4];
        return t4;
      })(r3) : p2(r3, r3.length);
    }
    function h2(e3) {
      var t3 = this._events;
      if (void 0 !== t3) {
        var n3 = t3[e3];
        if ("function" == typeof n3) return 1;
        if (void 0 !== n3) return n3.length;
      }
      return 0;
    }
    function p2(e3, t3) {
      for (var n3 = new Array(t3), i3 = 0; i3 < t3; ++i3) n3[i3] = e3[i3];
      return n3;
    }
    function m2(e3, t3, n3, i3) {
      if ("function" == typeof e3.on) i3.once ? e3.once(t3, n3) : e3.on(t3, n3);
      else {
        if ("function" != typeof e3.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e3);
        e3.addEventListener(t3, (function r3(o3) {
          i3.once && e3.removeEventListener(t3, r3), n3(o3);
        }));
      }
    }
    return Object.defineProperty(r2, "defaultMaxListeners", { enumerable: true, get: function() {
      return o2;
    }, set: function(e3) {
      if ("number" != typeof e3 || e3 < 0 || i2(e3)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e3 + ".");
      o2 = e3;
    } }), r2.init = function() {
      void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, r2.prototype.setMaxListeners = function(e3) {
      if ("number" != typeof e3 || e3 < 0 || i2(e3)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e3 + ".");
      return this._maxListeners = e3, this;
    }, r2.prototype.getMaxListeners = function() {
      return a2(this);
    }, r2.prototype.emit = function(e3) {
      for (var t3 = [], i3 = 1; i3 < arguments.length; i3++) t3.push(arguments[i3]);
      var r3 = "error" === e3, o3 = this._events;
      if (void 0 !== o3) r3 = r3 && void 0 === o3.error;
      else if (!r3) return false;
      if (r3) {
        var s3;
        if (t3.length > 0 && (s3 = t3[0]), s3 instanceof Error) throw s3;
        var a3 = new Error("Unhandled error." + (s3 ? " (" + s3.message + ")" : ""));
        throw a3.context = s3, a3;
      }
      var c3 = o3[e3];
      if (void 0 === c3) return false;
      if ("function" == typeof c3) n2(c3, this, t3);
      else {
        var d3 = c3.length, l3 = p2(c3, d3);
        for (i3 = 0; i3 < d3; ++i3) n2(l3[i3], this, t3);
      }
      return true;
    }, r2.prototype.addListener = function(e3, t3) {
      return c2(this, e3, t3, false);
    }, r2.prototype.on = r2.prototype.addListener, r2.prototype.prependListener = function(e3, t3) {
      return c2(this, e3, t3, true);
    }, r2.prototype.once = function(e3, t3) {
      return s2(t3), this.on(e3, l2(this, e3, t3)), this;
    }, r2.prototype.prependOnceListener = function(e3, t3) {
      return s2(t3), this.prependListener(e3, l2(this, e3, t3)), this;
    }, r2.prototype.removeListener = function(e3, t3) {
      var n3, i3, r3, o3, a3;
      if (s2(t3), void 0 === (i3 = this._events)) return this;
      if (void 0 === (n3 = i3[e3])) return this;
      if (n3 === t3 || n3.listener === t3) 0 === --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : (delete i3[e3], i3.removeListener && this.emit("removeListener", e3, n3.listener || t3));
      else if ("function" != typeof n3) {
        for (r3 = -1, o3 = n3.length - 1; o3 >= 0; o3--) if (n3[o3] === t3 || n3[o3].listener === t3) {
          a3 = n3[o3].listener, r3 = o3;
          break;
        }
        if (r3 < 0) return this;
        0 === r3 ? n3.shift() : (function(e4, t4) {
          for (; t4 + 1 < e4.length; t4++) e4[t4] = e4[t4 + 1];
          e4.pop();
        })(n3, r3), 1 === n3.length && (i3[e3] = n3[0]), void 0 !== i3.removeListener && this.emit("removeListener", e3, a3 || t3);
      }
      return this;
    }, r2.prototype.off = r2.prototype.removeListener, r2.prototype.removeAllListeners = function(e3) {
      var t3, n3, i3;
      if (void 0 === (n3 = this._events)) return this;
      if (void 0 === n3.removeListener) return 0 === arguments.length ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : void 0 !== n3[e3] && (0 === --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : delete n3[e3]), this;
      if (0 === arguments.length) {
        var r3, o3 = Object.keys(n3);
        for (i3 = 0; i3 < o3.length; ++i3) "removeListener" !== (r3 = o3[i3]) && this.removeAllListeners(r3);
        return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
      }
      if ("function" == typeof (t3 = n3[e3])) this.removeListener(e3, t3);
      else if (void 0 !== t3) for (i3 = t3.length - 1; i3 >= 0; i3--) this.removeListener(e3, t3[i3]);
      return this;
    }, r2.prototype.listeners = function(e3) {
      return u2(this, e3, true);
    }, r2.prototype.rawListeners = function(e3) {
      return u2(this, e3, false);
    }, r2.listenerCount = function(e3, t3) {
      return "function" == typeof e3.listenerCount ? e3.listenerCount(t3) : h2.call(e3, t3);
    }, r2.prototype.listenerCount = h2, r2.prototype.eventNames = function() {
      return this._eventsCount > 0 ? e2(this._events) : [];
    }, Cr.exports;
  })();
  let Rr = true, Pr = true;
  function Ir(e2, t2, n2) {
    const i2 = e2.match(t2);
    return i2 && i2.length >= n2 && parseFloat(i2[n2], 10);
  }
  function _r(e2, t2, n2) {
    if (!e2.RTCPeerConnection) return;
    if (!Object.getOwnPropertyDescriptor(EventTarget.prototype, "addEventListener").writable) return void Or("Unable to polyfill events");
    const i2 = e2.RTCPeerConnection.prototype, r2 = i2.addEventListener;
    i2.addEventListener = function(e3, i3) {
      if (e3 !== t2) return r2.apply(this, arguments);
      const o3 = (e4) => {
        const t3 = n2(e4);
        t3 && (i3.handleEvent ? i3.handleEvent(t3) : i3(t3));
      };
      return this._eventMap = this._eventMap || {}, this._eventMap[t2] || (this._eventMap[t2] = /* @__PURE__ */ new Map()), this._eventMap[t2].set(i3, o3), r2.apply(this, [e3, o3]);
    };
    const o2 = i2.removeEventListener;
    i2.removeEventListener = function(e3, n3) {
      if (e3 !== t2 || !this._eventMap || !this._eventMap[t2]) return o2.apply(this, arguments);
      if (!this._eventMap[t2].has(n3)) return o2.apply(this, arguments);
      const i3 = this._eventMap[t2].get(n3);
      return this._eventMap[t2].delete(n3), 0 === this._eventMap[t2].size && delete this._eventMap[t2], 0 === Object.keys(this._eventMap).length && delete this._eventMap, o2.apply(this, [e3, i3]);
    }, Object.defineProperty(i2, "on" + t2, { get() {
      return this["_on" + t2];
    }, set(e3) {
      this["_on" + t2] && (this.removeEventListener(t2, this["_on" + t2]), delete this["_on" + t2]), e3 && this.addEventListener(t2, this["_on" + t2] = e3);
    }, enumerable: true, configurable: true });
  }
  function Mr(e2) {
    return "boolean" != typeof e2 ? new Error("Argument type: " + typeof e2 + ". Please use a boolean.") : (Rr = e2, e2 ? "adapter.js logging disabled" : "adapter.js logging enabled");
  }
  function Dr(e2) {
    return "boolean" != typeof e2 ? new Error("Argument type: " + typeof e2 + ". Please use a boolean.") : (Pr = !e2, "adapter.js deprecation warnings " + (e2 ? "disabled" : "enabled"));
  }
  function Or() {
    if ("object" == typeof window) {
      if (Rr) return;
      "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments);
    }
  }
  function Ar(e2, t2) {
    Pr && console.warn(e2 + " is deprecated, please use " + t2 + " instead.");
  }
  function Lr(e2) {
    return "[object Object]" === Object.prototype.toString.call(e2);
  }
  function Nr(e2) {
    return Lr(e2) ? Object.keys(e2).reduce((function(t2, n2) {
      const i2 = Lr(e2[n2]), r2 = i2 ? Nr(e2[n2]) : e2[n2], o2 = i2 && !Object.keys(r2).length;
      return void 0 === r2 || o2 ? t2 : Object.assign(t2, { [n2]: r2 });
    }), {}) : e2;
  }
  function xr(e2, t2, n2) {
    t2 && !n2.has(t2.id) && (n2.set(t2.id, t2), Object.keys(t2).forEach(((i2) => {
      i2.endsWith("Id") ? xr(e2, e2.get(t2[i2]), n2) : i2.endsWith("Ids") && t2[i2].forEach(((t3) => {
        xr(e2, e2.get(t3), n2);
      }));
    })));
  }
  function Ur(e2, t2, n2) {
    const i2 = n2 ? "outbound-rtp" : "inbound-rtp", r2 = /* @__PURE__ */ new Map();
    if (null === t2) return r2;
    const o2 = [];
    return e2.forEach(((e3) => {
      "track" === e3.type && e3.trackIdentifier === t2.id && o2.push(e3);
    })), o2.forEach(((t3) => {
      e2.forEach(((n3) => {
        n3.type === i2 && n3.trackId === t3.id && xr(e2, n3, r2);
      }));
    })), r2;
  }
  const Fr = Or;
  function jr(e2, t2) {
    if (t2.version >= 64) return;
    const n2 = e2 && e2.navigator;
    if (!n2.mediaDevices) return;
    const i2 = function(e3) {
      if ("object" != typeof e3 || e3.mandatory || e3.optional) return e3;
      const t3 = {};
      return Object.keys(e3).forEach(((n3) => {
        if ("require" === n3 || "advanced" === n3 || "mediaSource" === n3) return;
        const i3 = "object" == typeof e3[n3] ? e3[n3] : { ideal: e3[n3] };
        void 0 !== i3.exact && "number" == typeof i3.exact && (i3.min = i3.max = i3.exact);
        const r3 = function(e4, t4) {
          return e4 ? e4 + t4.charAt(0).toUpperCase() + t4.slice(1) : "deviceId" === t4 ? "sourceId" : t4;
        };
        if (void 0 !== i3.ideal) {
          t3.optional = t3.optional || [];
          let e4 = {};
          "number" == typeof i3.ideal ? (e4[r3("min", n3)] = i3.ideal, t3.optional.push(e4), e4 = {}, e4[r3("max", n3)] = i3.ideal, t3.optional.push(e4)) : (e4[r3("", n3)] = i3.ideal, t3.optional.push(e4));
        }
        void 0 !== i3.exact && "number" != typeof i3.exact ? (t3.mandatory = t3.mandatory || {}, t3.mandatory[r3("", n3)] = i3.exact) : ["min", "max"].forEach(((e4) => {
          void 0 !== i3[e4] && (t3.mandatory = t3.mandatory || {}, t3.mandatory[r3(e4, n3)] = i3[e4]);
        }));
      })), e3.advanced && (t3.optional = (t3.optional || []).concat(e3.advanced)), t3;
    }, r2 = function(e3, r3) {
      if (t2.version >= 61) return r3(e3);
      if ((e3 = JSON.parse(JSON.stringify(e3))) && "object" == typeof e3.audio) {
        const t3 = function(e4, t4, n3) {
          t4 in e4 && !(n3 in e4) && (e4[n3] = e4[t4], delete e4[t4]);
        };
        t3((e3 = JSON.parse(JSON.stringify(e3))).audio, "autoGainControl", "googAutoGainControl"), t3(e3.audio, "noiseSuppression", "googNoiseSuppression"), e3.audio = i2(e3.audio);
      }
      if (e3 && "object" == typeof e3.video) {
        let o3 = e3.video.facingMode;
        o3 = o3 && ("object" == typeof o3 ? o3 : { ideal: o3 });
        const s2 = t2.version < 66;
        if (o3 && ("user" === o3.exact || "environment" === o3.exact || "user" === o3.ideal || "environment" === o3.ideal) && (!n2.mediaDevices.getSupportedConstraints || !n2.mediaDevices.getSupportedConstraints().facingMode || s2)) {
          let t3;
          if (delete e3.video.facingMode, "environment" === o3.exact || "environment" === o3.ideal ? t3 = ["back", "rear"] : "user" !== o3.exact && "user" !== o3.ideal || (t3 = ["front"]), t3) return n2.mediaDevices.enumerateDevices().then(((n3) => {
            let s3 = (n3 = n3.filter(((e4) => "videoinput" === e4.kind))).find(((e4) => t3.some(((t4) => e4.label.toLowerCase().includes(t4)))));
            return !s3 && n3.length && t3.includes("back") && (s3 = n3[n3.length - 1]), s3 && (e3.video.deviceId = o3.exact ? { exact: s3.deviceId } : { ideal: s3.deviceId }), e3.video = i2(e3.video), Fr("chrome: " + JSON.stringify(e3)), r3(e3);
          }));
        }
        e3.video = i2(e3.video);
      }
      return Fr("chrome: " + JSON.stringify(e3)), r3(e3);
    }, o2 = function(e3) {
      return t2.version >= 64 ? e3 : { name: { PermissionDeniedError: "NotAllowedError", PermissionDismissedError: "NotAllowedError", InvalidStateError: "NotAllowedError", DevicesNotFoundError: "NotFoundError", ConstraintNotSatisfiedError: "OverconstrainedError", TrackStartError: "NotReadableError", MediaDeviceFailedDueToShutdown: "NotAllowedError", MediaDeviceKillSwitchOn: "NotAllowedError", TabCaptureError: "AbortError", ScreenCaptureError: "AbortError", DeviceCaptureError: "AbortError" }[e3.name] || e3.name, message: e3.message, constraint: e3.constraint || e3.constraintName, toString() {
        return this.name + (this.message && ": ") + this.message;
      } };
    };
    if (n2.getUserMedia = function(e3, t3, i3) {
      r2(e3, ((e4) => {
        n2.webkitGetUserMedia(e4, t3, ((e5) => {
          i3 && i3(o2(e5));
        }));
      }));
    }.bind(n2), n2.mediaDevices.getUserMedia) {
      const e3 = n2.mediaDevices.getUserMedia.bind(n2.mediaDevices);
      n2.mediaDevices.getUserMedia = function(t3) {
        return r2(t3, ((t4) => e3(t4).then(((e4) => {
          if (t4.audio && !e4.getAudioTracks().length || t4.video && !e4.getVideoTracks().length) throw e4.getTracks().forEach(((e5) => {
            e5.stop();
          })), new DOMException("", "NotFoundError");
          return e4;
        }), ((e4) => Promise.reject(o2(e4))))));
      };
    }
  }
  function Br(e2) {
    e2.MediaStream = e2.MediaStream || e2.webkitMediaStream;
  }
  function qr(e2, t2) {
    if (!(t2.version > 102)) if ("object" == typeof e2 && e2.RTCPeerConnection && !("ontrack" in e2.RTCPeerConnection.prototype)) {
      Object.defineProperty(e2.RTCPeerConnection.prototype, "ontrack", { get() {
        return this._ontrack;
      }, set(e3) {
        this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e3);
      }, enumerable: true, configurable: true });
      const t3 = e2.RTCPeerConnection.prototype.setRemoteDescription;
      e2.RTCPeerConnection.prototype.setRemoteDescription = function() {
        return this._ontrackpoly || (this._ontrackpoly = (t4) => {
          t4.stream.addEventListener("addtrack", ((n2) => {
            let i2;
            i2 = e2.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(((e3) => e3.track && e3.track.id === n2.track.id)) : { track: n2.track };
            const r2 = new Event("track");
            r2.track = n2.track, r2.receiver = i2, r2.transceiver = { receiver: i2 }, r2.streams = [t4.stream], this.dispatchEvent(r2);
          })), t4.stream.getTracks().forEach(((n2) => {
            let i2;
            i2 = e2.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(((e3) => e3.track && e3.track.id === n2.id)) : { track: n2 };
            const r2 = new Event("track");
            r2.track = n2, r2.receiver = i2, r2.transceiver = { receiver: i2 }, r2.streams = [t4.stream], this.dispatchEvent(r2);
          }));
        }, this.addEventListener("addstream", this._ontrackpoly)), t3.apply(this, arguments);
      };
    } else _r(e2, "track", ((e3) => (e3.transceiver || Object.defineProperty(e3, "transceiver", { value: { receiver: e3.receiver } }), e3)));
  }
  function Vr(e2) {
    if ("object" == typeof e2 && e2.RTCPeerConnection && !("getSenders" in e2.RTCPeerConnection.prototype) && "createDTMFSender" in e2.RTCPeerConnection.prototype) {
      const t2 = function(e3, t3) {
        return { track: t3, get dtmf() {
          return void 0 === this._dtmf && ("audio" === t3.kind ? this._dtmf = e3.createDTMFSender(t3) : this._dtmf = null), this._dtmf;
        }, _pc: e3 };
      };
      if (!e2.RTCPeerConnection.prototype.getSenders) {
        e2.RTCPeerConnection.prototype.getSenders = function() {
          return this._senders = this._senders || [], this._senders.slice();
        };
        const n3 = e2.RTCPeerConnection.prototype.addTrack;
        e2.RTCPeerConnection.prototype.addTrack = function(e3, i4) {
          let r2 = n3.apply(this, arguments);
          return r2 || (r2 = t2(this, e3), this._senders.push(r2)), r2;
        };
        const i3 = e2.RTCPeerConnection.prototype.removeTrack;
        e2.RTCPeerConnection.prototype.removeTrack = function(e3) {
          i3.apply(this, arguments);
          const t3 = this._senders.indexOf(e3);
          -1 !== t3 && this._senders.splice(t3, 1);
        };
      }
      const n2 = e2.RTCPeerConnection.prototype.addStream;
      e2.RTCPeerConnection.prototype.addStream = function(e3) {
        this._senders = this._senders || [], n2.apply(this, [e3]), e3.getTracks().forEach(((e4) => {
          this._senders.push(t2(this, e4));
        }));
      };
      const i2 = e2.RTCPeerConnection.prototype.removeStream;
      e2.RTCPeerConnection.prototype.removeStream = function(e3) {
        this._senders = this._senders || [], i2.apply(this, [e3]), e3.getTracks().forEach(((e4) => {
          const t3 = this._senders.find(((t4) => t4.track === e4));
          t3 && this._senders.splice(this._senders.indexOf(t3), 1);
        }));
      };
    } else if ("object" == typeof e2 && e2.RTCPeerConnection && "getSenders" in e2.RTCPeerConnection.prototype && "createDTMFSender" in e2.RTCPeerConnection.prototype && e2.RTCRtpSender && !("dtmf" in e2.RTCRtpSender.prototype)) {
      const t2 = e2.RTCPeerConnection.prototype.getSenders;
      e2.RTCPeerConnection.prototype.getSenders = function() {
        const e3 = t2.apply(this, []);
        return e3.forEach(((e4) => e4._pc = this)), e3;
      }, Object.defineProperty(e2.RTCRtpSender.prototype, "dtmf", { get() {
        return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf;
      } });
    }
  }
  function Wr(e2, t2) {
    if (t2.version >= 67) return;
    if (!("object" == typeof e2 && e2.RTCPeerConnection && e2.RTCRtpSender && e2.RTCRtpReceiver)) return;
    if (!("getStats" in e2.RTCRtpSender.prototype)) {
      const t3 = e2.RTCPeerConnection.prototype.getSenders;
      t3 && (e2.RTCPeerConnection.prototype.getSenders = function() {
        const e3 = t3.apply(this, []);
        return e3.forEach(((e4) => e4._pc = this)), e3;
      });
      const n3 = e2.RTCPeerConnection.prototype.addTrack;
      n3 && (e2.RTCPeerConnection.prototype.addTrack = function() {
        const e3 = n3.apply(this, arguments);
        return e3._pc = this, e3;
      }), e2.RTCRtpSender.prototype.getStats = function() {
        const e3 = this;
        return this._pc.getStats().then(((t4) => Ur(t4, e3.track, true)));
      };
    }
    if (!("getStats" in e2.RTCRtpReceiver.prototype)) {
      const t3 = e2.RTCPeerConnection.prototype.getReceivers;
      t3 && (e2.RTCPeerConnection.prototype.getReceivers = function() {
        const e3 = t3.apply(this, []);
        return e3.forEach(((e4) => e4._pc = this)), e3;
      }), _r(e2, "track", ((e3) => (e3.receiver._pc = e3.srcElement, e3))), e2.RTCRtpReceiver.prototype.getStats = function() {
        const e3 = this;
        return this._pc.getStats().then(((t4) => Ur(t4, e3.track, false)));
      };
    }
    if (!("getStats" in e2.RTCRtpSender.prototype) || !("getStats" in e2.RTCRtpReceiver.prototype)) return;
    const n2 = e2.RTCPeerConnection.prototype.getStats;
    e2.RTCPeerConnection.prototype.getStats = function() {
      if (arguments.length > 0 && arguments[0] instanceof e2.MediaStreamTrack) {
        const e3 = arguments[0];
        let t3, n3, i2;
        return this.getSenders().forEach(((n4) => {
          n4.track === e3 && (t3 ? i2 = true : t3 = n4);
        })), this.getReceivers().forEach(((t4) => (t4.track === e3 && (n3 ? i2 = true : n3 = t4), t4.track === e3))), i2 || t3 && n3 ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : t3 ? t3.getStats() : n3 ? n3.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
      }
      return n2.apply(this, arguments);
    };
  }
  function Hr(e2) {
    e2.RTCPeerConnection.prototype.getLocalStreams = function() {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map(((e3) => this._shimmedLocalStreams[e3][0]));
    };
    const t2 = e2.RTCPeerConnection.prototype.addTrack;
    e2.RTCPeerConnection.prototype.addTrack = function(e3, n3) {
      if (!n3) return t2.apply(this, arguments);
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      const i3 = t2.apply(this, arguments);
      return this._shimmedLocalStreams[n3.id] ? -1 === this._shimmedLocalStreams[n3.id].indexOf(i3) && this._shimmedLocalStreams[n3.id].push(i3) : this._shimmedLocalStreams[n3.id] = [n3, i3], i3;
    };
    const n2 = e2.RTCPeerConnection.prototype.addStream;
    e2.RTCPeerConnection.prototype.addStream = function(e3) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e3.getTracks().forEach(((e4) => {
        if (this.getSenders().find(((t4) => t4.track === e4))) throw new DOMException("Track already exists.", "InvalidAccessError");
      }));
      const t3 = this.getSenders();
      n2.apply(this, arguments);
      const i3 = this.getSenders().filter(((e4) => -1 === t3.indexOf(e4)));
      this._shimmedLocalStreams[e3.id] = [e3].concat(i3);
    };
    const i2 = e2.RTCPeerConnection.prototype.removeStream;
    e2.RTCPeerConnection.prototype.removeStream = function(e3) {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e3.id], i2.apply(this, arguments);
    };
    const r2 = e2.RTCPeerConnection.prototype.removeTrack;
    e2.RTCPeerConnection.prototype.removeTrack = function(e3) {
      return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e3 && Object.keys(this._shimmedLocalStreams).forEach(((t3) => {
        const n3 = this._shimmedLocalStreams[t3].indexOf(e3);
        -1 !== n3 && this._shimmedLocalStreams[t3].splice(n3, 1), 1 === this._shimmedLocalStreams[t3].length && delete this._shimmedLocalStreams[t3];
      })), r2.apply(this, arguments);
    };
  }
  function Kr(e2, t2) {
    if (!e2.RTCPeerConnection) return;
    if (e2.RTCPeerConnection.prototype.addTrack && t2.version >= 65) return Hr(e2);
    const n2 = e2.RTCPeerConnection.prototype.getLocalStreams;
    e2.RTCPeerConnection.prototype.getLocalStreams = function() {
      const e3 = n2.apply(this);
      return this._reverseStreams = this._reverseStreams || {}, e3.map(((e4) => this._reverseStreams[e4.id]));
    };
    const i2 = e2.RTCPeerConnection.prototype.addStream;
    e2.RTCPeerConnection.prototype.addStream = function(t3) {
      if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, t3.getTracks().forEach(((e3) => {
        if (this.getSenders().find(((t4) => t4.track === e3))) throw new DOMException("Track already exists.", "InvalidAccessError");
      })), !this._reverseStreams[t3.id]) {
        const n3 = new e2.MediaStream(t3.getTracks());
        this._streams[t3.id] = n3, this._reverseStreams[n3.id] = t3, t3 = n3;
      }
      i2.apply(this, [t3]);
    };
    const r2 = e2.RTCPeerConnection.prototype.removeStream;
    function o2(e3, t3) {
      let n3 = t3.sdp;
      return Object.keys(e3._reverseStreams || []).forEach(((t4) => {
        const i3 = e3._reverseStreams[t4], r3 = e3._streams[i3.id];
        n3 = n3.replace(new RegExp(r3.id, "g"), i3.id);
      })), new RTCSessionDescription({ type: t3.type, sdp: n3 });
    }
    e2.RTCPeerConnection.prototype.removeStream = function(e3) {
      this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, r2.apply(this, [this._streams[e3.id] || e3]), delete this._reverseStreams[this._streams[e3.id] ? this._streams[e3.id].id : e3.id], delete this._streams[e3.id];
    }, e2.RTCPeerConnection.prototype.addTrack = function(t3, n3) {
      if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
      const i3 = [].slice.call(arguments, 1);
      if (1 !== i3.length || !i3[0].getTracks().find(((e3) => e3 === t3))) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
      if (this.getSenders().find(((e3) => e3.track === t3))) throw new DOMException("Track already exists.", "InvalidAccessError");
      this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
      const r3 = this._streams[n3.id];
      if (r3) r3.addTrack(t3), Promise.resolve().then((() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      }));
      else {
        const i4 = new e2.MediaStream([t3]);
        this._streams[n3.id] = i4, this._reverseStreams[i4.id] = n3, this.addStream(i4);
      }
      return this.getSenders().find(((e3) => e3.track === t3));
    }, ["createOffer", "createAnswer"].forEach((function(t3) {
      const n3 = e2.RTCPeerConnection.prototype[t3], i3 = { [t3]() {
        const e3 = arguments;
        return arguments.length && "function" == typeof arguments[0] ? n3.apply(this, [(t4) => {
          const n4 = o2(this, t4);
          e3[0].apply(null, [n4]);
        }, (t4) => {
          e3[1] && e3[1].apply(null, t4);
        }, arguments[2]]) : n3.apply(this, arguments).then(((e4) => o2(this, e4)));
      } };
      e2.RTCPeerConnection.prototype[t3] = i3[t3];
    }));
    const s2 = e2.RTCPeerConnection.prototype.setLocalDescription;
    e2.RTCPeerConnection.prototype.setLocalDescription = function() {
      return arguments.length && arguments[0].type ? (arguments[0] = (function(e3, t3) {
        let n3 = t3.sdp;
        return Object.keys(e3._reverseStreams || []).forEach(((t4) => {
          const i3 = e3._reverseStreams[t4], r3 = e3._streams[i3.id];
          n3 = n3.replace(new RegExp(i3.id, "g"), r3.id);
        })), new RTCSessionDescription({ type: t3.type, sdp: n3 });
      })(this, arguments[0]), s2.apply(this, arguments)) : s2.apply(this, arguments);
    };
    const a2 = Object.getOwnPropertyDescriptor(e2.RTCPeerConnection.prototype, "localDescription");
    Object.defineProperty(e2.RTCPeerConnection.prototype, "localDescription", { get() {
      const e3 = a2.get.apply(this);
      return "" === e3.type ? e3 : o2(this, e3);
    } }), e2.RTCPeerConnection.prototype.removeTrack = function(e3) {
      if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
      if (!e3._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
      if (!(e3._pc === this)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
      let t3;
      this._streams = this._streams || {}, Object.keys(this._streams).forEach(((n3) => {
        this._streams[n3].getTracks().find(((t4) => e3.track === t4)) && (t3 = this._streams[n3]);
      })), t3 && (1 === t3.getTracks().length ? this.removeStream(this._reverseStreams[t3.id]) : t3.removeTrack(e3.track), this.dispatchEvent(new Event("negotiationneeded")));
    };
  }
  function zr(e2, t2) {
    !e2.RTCPeerConnection && e2.webkitRTCPeerConnection && (e2.RTCPeerConnection = e2.webkitRTCPeerConnection), e2.RTCPeerConnection && t2.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach((function(t3) {
      const n2 = e2.RTCPeerConnection.prototype[t3], i2 = { [t3]() {
        return arguments[0] = new ("addIceCandidate" === t3 ? e2.RTCIceCandidate : e2.RTCSessionDescription)(arguments[0]), n2.apply(this, arguments);
      } };
      e2.RTCPeerConnection.prototype[t3] = i2[t3];
    }));
  }
  function Gr(e2, t2) {
    t2.version > 102 || _r(e2, "negotiationneeded", ((e3) => {
      const n2 = e3.target;
      if (!(t2.version < 72 || n2.getConfiguration && "plan-b" === n2.getConfiguration().sdpSemantics) || "stable" === n2.signalingState) return e3;
    }));
  }
  var Jr = Object.freeze({ __proto__: null, fixNegotiationNeeded: Gr, shimAddTrackRemoveTrack: Kr, shimAddTrackRemoveTrackWithNative: Hr, shimGetSendersWithDtmf: Vr, shimGetUserMedia: jr, shimMediaStream: Br, shimOnTrack: qr, shimPeerConnection: zr, shimSenderReceiverGetStats: Wr });
  function Qr(e2, t2) {
    const n2 = e2 && e2.navigator;
    if (!n2.mediaDevices) return;
    const i2 = e2 && e2.MediaStreamTrack;
    if (n2.getUserMedia = function(e3, t3, i3) {
      Ar("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), n2.mediaDevices.getUserMedia(e3).then(t3, i3);
    }, !(t2.version > 55 && "autoGainControl" in n2.mediaDevices.getSupportedConstraints())) {
      const e3 = function(e4, t4, n3) {
        t4 in e4 && !(n3 in e4) && (e4[n3] = e4[t4], delete e4[t4]);
      }, t3 = n2.mediaDevices.getUserMedia.bind(n2.mediaDevices);
      if (n2.mediaDevices.getUserMedia = function(n3) {
        return "object" == typeof n3 && "object" == typeof n3.audio && (n3 = JSON.parse(JSON.stringify(n3)), e3(n3.audio, "autoGainControl", "mozAutoGainControl"), e3(n3.audio, "noiseSuppression", "mozNoiseSuppression")), t3(n3);
      }, i2 && i2.prototype.getSettings) {
        const t4 = i2.prototype.getSettings;
        i2.prototype.getSettings = function() {
          const n3 = t4.apply(this, arguments);
          return e3(n3, "mozAutoGainControl", "autoGainControl"), e3(n3, "mozNoiseSuppression", "noiseSuppression"), n3;
        };
      }
      if (i2 && i2.prototype.applyConstraints) {
        const t4 = i2.prototype.applyConstraints;
        i2.prototype.applyConstraints = function(n3) {
          return "audio" === this.kind && "object" == typeof n3 && (n3 = JSON.parse(JSON.stringify(n3)), e3(n3, "autoGainControl", "mozAutoGainControl"), e3(n3, "noiseSuppression", "mozNoiseSuppression")), t4.apply(this, [n3]);
        };
      }
    }
  }
  function Yr(e2) {
    "object" == typeof e2 && e2.RTCTrackEvent && "receiver" in e2.RTCTrackEvent.prototype && !("transceiver" in e2.RTCTrackEvent.prototype) && Object.defineProperty(e2.RTCTrackEvent.prototype, "transceiver", { get() {
      return { receiver: this.receiver };
    } });
  }
  function Xr(e2, t2) {
    "object" == typeof e2 && (e2.RTCPeerConnection || e2.mozRTCPeerConnection) && (!e2.RTCPeerConnection && e2.mozRTCPeerConnection && (e2.RTCPeerConnection = e2.mozRTCPeerConnection), t2.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach((function(t3) {
      const n2 = e2.RTCPeerConnection.prototype[t3], i2 = { [t3]() {
        return arguments[0] = new ("addIceCandidate" === t3 ? e2.RTCIceCandidate : e2.RTCSessionDescription)(arguments[0]), n2.apply(this, arguments);
      } };
      e2.RTCPeerConnection.prototype[t3] = i2[t3];
    })));
  }
  function Zr(e2, t2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection && !e2.mozRTCPeerConnection) return;
    if (t2.version >= 151) return;
    const i2 = { inboundrtp: "inbound-rtp", outboundrtp: "outbound-rtp", candidatepair: "candidate-pair", localcandidate: "local-candidate", remotecandidate: "remote-candidate" }, r2 = e2.RTCPeerConnection.prototype.getStats;
    e2.RTCPeerConnection.prototype.getStats = function() {
      const e3 = Array.prototype.slice.call(arguments), o2 = e3[0], s2 = e3[1], a2 = e3[2];
      return "closed" === this.signalingState ? Promise.resolve(/* @__PURE__ */ new Map()) : r2.apply(this, [o2 || null]).then(((e4) => {
        if (t2.version < 53 && !s2) try {
          e4.forEach(((e5) => {
            e5.type = i2[e5.type] || e5.type;
          }));
        } catch (n2) {
          if ("TypeError" !== n2.name) throw n2;
          e4.forEach(((t3, n3) => {
            e4.set(n3, Object.assign({}, t3, { type: i2[t3.type] || t3.type }));
          }));
        }
        return e4;
      })).then(s2, a2);
    };
  }
  function $r(e2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection || !e2.RTCRtpSender) return;
    if (e2.RTCRtpSender && "getStats" in e2.RTCRtpSender.prototype) return;
    const t2 = e2.RTCPeerConnection.prototype.getSenders;
    t2 && (e2.RTCPeerConnection.prototype.getSenders = function() {
      const e3 = t2.apply(this, []);
      return e3.forEach(((e4) => e4._pc = this)), e3;
    });
    const n2 = e2.RTCPeerConnection.prototype.addTrack;
    n2 && (e2.RTCPeerConnection.prototype.addTrack = function() {
      const e3 = n2.apply(this, arguments);
      return e3._pc = this, e3;
    }), e2.RTCRtpSender.prototype.getStats = function() {
      return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
    };
  }
  function eo(e2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection || !e2.RTCRtpSender) return;
    if (e2.RTCRtpSender && "getStats" in e2.RTCRtpReceiver.prototype) return;
    const t2 = e2.RTCPeerConnection.prototype.getReceivers;
    t2 && (e2.RTCPeerConnection.prototype.getReceivers = function() {
      const e3 = t2.apply(this, []);
      return e3.forEach(((e4) => e4._pc = this)), e3;
    }), _r(e2, "track", ((e3) => (e3.receiver._pc = e3.srcElement, e3))), e2.RTCRtpReceiver.prototype.getStats = function() {
      return this._pc.getStats(this.track);
    };
  }
  function to(e2) {
    e2.RTCPeerConnection && !("removeStream" in e2.RTCPeerConnection.prototype) && (e2.RTCPeerConnection.prototype.removeStream = function(e3) {
      Ar("removeStream", "removeTrack"), this.getSenders().forEach(((t2) => {
        t2.track && e3.getTracks().includes(t2.track) && this.removeTrack(t2);
      }));
    });
  }
  function no(e2) {
    e2.DataChannel && !e2.RTCDataChannel && (e2.RTCDataChannel = e2.DataChannel);
  }
  function io(e2, t2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection) return;
    if (t2.version >= 110) return;
    const n2 = e2.RTCPeerConnection.prototype.addTransceiver;
    n2 && (e2.RTCPeerConnection.prototype.addTransceiver = function() {
      this.setParametersPromises = [];
      let e3 = arguments[1] && arguments[1].sendEncodings;
      void 0 === e3 && (e3 = []), e3 = [...e3];
      const t3 = e3.length > 0;
      t3 && e3.forEach(((e4) => {
        if ("rid" in e4) {
          if (!/^[a-z0-9]{0,16}$/i.test(e4.rid)) throw new TypeError("Invalid RID value provided.");
        }
        if ("scaleResolutionDownBy" in e4 && !(parseFloat(e4.scaleResolutionDownBy) >= 1)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
        if ("maxFramerate" in e4 && !(parseFloat(e4.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0");
      }));
      const i2 = n2.apply(this, arguments);
      if (t3) {
        const t4 = i2.sender, n3 = t4.getParameters();
        (!("encodings" in n3) || 1 === n3.encodings.length && 0 === Object.keys(n3.encodings[0]).length) && (n3.encodings = e3, t4.sendEncodings = e3, this.setParametersPromises.push(t4.setParameters(n3).then((() => {
          delete t4.sendEncodings;
        })).catch((() => {
          delete t4.sendEncodings;
        }))));
      }
      return i2;
    });
  }
  function ro(e2, t2) {
    if ("object" != typeof e2 || !e2.RTCRtpSender) return;
    if (t2.version >= 110) return;
    const n2 = e2.RTCRtpSender.prototype.getParameters;
    n2 && (e2.RTCRtpSender.prototype.getParameters = function() {
      const e3 = n2.apply(this, arguments);
      return "encodings" in e3 || (e3.encodings = [].concat(this.sendEncodings || [{}])), e3;
    });
  }
  function oo(e2, t2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection) return;
    if (t2.version >= 110) return;
    const n2 = e2.RTCPeerConnection.prototype.createOffer;
    e2.RTCPeerConnection.prototype.createOffer = function() {
      return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then((() => n2.apply(this, arguments))).finally((() => {
        this.setParametersPromises = [];
      })) : n2.apply(this, arguments);
    };
  }
  function so(e2, t2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection) return;
    if (t2.version >= 110) return;
    const n2 = e2.RTCPeerConnection.prototype.createAnswer;
    e2.RTCPeerConnection.prototype.createAnswer = function() {
      return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then((() => n2.apply(this, arguments))).finally((() => {
        this.setParametersPromises = [];
      })) : n2.apply(this, arguments);
    };
  }
  var ao = Object.freeze({ __proto__: null, shimAddTransceiver: io, shimCreateAnswer: so, shimCreateOffer: oo, shimGetDisplayMedia: function(e2, t2) {
    e2.navigator.mediaDevices && (e2.navigator.mediaDevices && "getDisplayMedia" in e2.navigator.mediaDevices || (e2.navigator.mediaDevices.getDisplayMedia = function(n2) {
      if (!n2 || !n2.video) {
        const e3 = new DOMException("getDisplayMedia without video constraints is undefined");
        return e3.name = "NotFoundError", e3.code = 8, Promise.reject(e3);
      }
      return true === n2.video ? n2.video = { mediaSource: t2 } : n2.video.mediaSource = t2, e2.navigator.mediaDevices.getUserMedia(n2);
    }));
  }, shimGetParameters: ro, shimGetStats: Zr, shimGetUserMedia: Qr, shimOnTrack: Yr, shimPeerConnection: Xr, shimRTCDataChannel: no, shimReceiverGetStats: eo, shimRemoveStream: to, shimSenderGetStats: $r });
  function co(e2) {
    if ("object" == typeof e2 && e2.RTCPeerConnection) {
      if ("getLocalStreams" in e2.RTCPeerConnection.prototype || (e2.RTCPeerConnection.prototype.getLocalStreams = function() {
        return this._localStreams || (this._localStreams = []), this._localStreams;
      }), !("addStream" in e2.RTCPeerConnection.prototype)) {
        const t2 = e2.RTCPeerConnection.prototype.addTrack;
        e2.RTCPeerConnection.prototype.addStream = function(e3) {
          this._localStreams || (this._localStreams = []), this._localStreams.includes(e3) || this._localStreams.push(e3), e3.getAudioTracks().forEach(((n2) => t2.call(this, n2, e3))), e3.getVideoTracks().forEach(((n2) => t2.call(this, n2, e3)));
        }, e2.RTCPeerConnection.prototype.addTrack = function(e3) {
          for (var n2 = arguments.length, i2 = new Array(n2 > 1 ? n2 - 1 : 0), r2 = 1; r2 < n2; r2++) i2[r2 - 1] = arguments[r2];
          return i2 && i2.forEach(((e4) => {
            this._localStreams ? this._localStreams.includes(e4) || this._localStreams.push(e4) : this._localStreams = [e4];
          })), t2.apply(this, arguments);
        };
      }
      "removeStream" in e2.RTCPeerConnection.prototype || (e2.RTCPeerConnection.prototype.removeStream = function(e3) {
        this._localStreams || (this._localStreams = []);
        const t2 = this._localStreams.indexOf(e3);
        if (-1 === t2) return;
        this._localStreams.splice(t2, 1);
        const n2 = e3.getTracks();
        this.getSenders().forEach(((e4) => {
          n2.includes(e4.track) && this.removeTrack(e4);
        }));
      });
    }
  }
  function lo(e2) {
    if ("object" == typeof e2 && e2.RTCPeerConnection && ("getRemoteStreams" in e2.RTCPeerConnection.prototype || (e2.RTCPeerConnection.prototype.getRemoteStreams = function() {
      return this._remoteStreams ? this._remoteStreams : [];
    }), !("onaddstream" in e2.RTCPeerConnection.prototype))) {
      Object.defineProperty(e2.RTCPeerConnection.prototype, "onaddstream", { get() {
        return this._onaddstream;
      }, set(e3) {
        this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e3), this.addEventListener("track", this._onaddstreampoly = (e4) => {
          e4.streams.forEach(((e5) => {
            if (this._remoteStreams || (this._remoteStreams = []), this._remoteStreams.includes(e5)) return;
            this._remoteStreams.push(e5);
            const t3 = new Event("addstream");
            t3.stream = e5, this.dispatchEvent(t3);
          }));
        });
      } });
      const t2 = e2.RTCPeerConnection.prototype.setRemoteDescription;
      e2.RTCPeerConnection.prototype.setRemoteDescription = function() {
        const e3 = this;
        return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(t3) {
          t3.streams.forEach(((t4) => {
            if (e3._remoteStreams || (e3._remoteStreams = []), e3._remoteStreams.indexOf(t4) >= 0) return;
            e3._remoteStreams.push(t4);
            const n2 = new Event("addstream");
            n2.stream = t4, e3.dispatchEvent(n2);
          }));
        }), t2.apply(e3, arguments);
      };
    }
  }
  function uo(e2) {
    if ("object" != typeof e2 || !e2.RTCPeerConnection) return;
    const t2 = e2.RTCPeerConnection.prototype, n2 = t2.createOffer, i2 = t2.createAnswer, r2 = t2.setLocalDescription, o2 = t2.setRemoteDescription, s2 = t2.addIceCandidate;
    t2.createOffer = function(e3, t3) {
      const i3 = arguments.length >= 2 ? arguments[2] : arguments[0], r3 = n2.apply(this, [i3]);
      return t3 ? (r3.then(e3, t3), Promise.resolve()) : r3;
    }, t2.createAnswer = function(e3, t3) {
      const n3 = arguments.length >= 2 ? arguments[2] : arguments[0], r3 = i2.apply(this, [n3]);
      return t3 ? (r3.then(e3, t3), Promise.resolve()) : r3;
    };
    let a2 = function(e3, t3, n3) {
      const i3 = r2.apply(this, [e3]);
      return n3 ? (i3.then(t3, n3), Promise.resolve()) : i3;
    };
    t2.setLocalDescription = a2, a2 = function(e3, t3, n3) {
      const i3 = o2.apply(this, [e3]);
      return n3 ? (i3.then(t3, n3), Promise.resolve()) : i3;
    }, t2.setRemoteDescription = a2, a2 = function(e3, t3, n3) {
      const i3 = s2.apply(this, [e3]);
      return n3 ? (i3.then(t3, n3), Promise.resolve()) : i3;
    }, t2.addIceCandidate = a2;
  }
  function ho(e2) {
    const t2 = e2 && e2.navigator;
    if (t2.mediaDevices && t2.mediaDevices.getUserMedia) {
      const e3 = t2.mediaDevices, n2 = e3.getUserMedia.bind(e3);
      t2.mediaDevices.getUserMedia = (e4) => n2(po(e4));
    }
    !t2.getUserMedia && t2.mediaDevices && t2.mediaDevices.getUserMedia && (t2.getUserMedia = function(e3, n2, i2) {
      t2.mediaDevices.getUserMedia(e3).then(n2, i2);
    }.bind(t2));
  }
  function po(e2) {
    return e2 && void 0 !== e2.video ? Object.assign({}, e2, { video: Nr(e2.video) }) : e2;
  }
  function mo(e2) {
    if (!e2.RTCPeerConnection) return;
    const t2 = e2.RTCPeerConnection;
    e2.RTCPeerConnection = function(e3, n2) {
      if (e3 && e3.iceServers) {
        const t3 = [];
        for (let n3 = 0; n3 < e3.iceServers.length; n3++) {
          let i2 = e3.iceServers[n3];
          void 0 === i2.urls && i2.url ? (Ar("RTCIceServer.url", "RTCIceServer.urls"), i2 = JSON.parse(JSON.stringify(i2)), i2.urls = i2.url, delete i2.url, t3.push(i2)) : t3.push(e3.iceServers[n3]);
        }
        e3.iceServers = t3;
      }
      return new t2(e3, n2);
    }, e2.RTCPeerConnection.prototype = t2.prototype, "generateCertificate" in t2 && Object.defineProperty(e2.RTCPeerConnection, "generateCertificate", { get: () => t2.generateCertificate });
  }
  function go(e2) {
    "object" == typeof e2 && e2.RTCTrackEvent && "receiver" in e2.RTCTrackEvent.prototype && !("transceiver" in e2.RTCTrackEvent.prototype) && Object.defineProperty(e2.RTCTrackEvent.prototype, "transceiver", { get() {
      return { receiver: this.receiver };
    } });
  }
  function vo(e2) {
    const t2 = e2.RTCPeerConnection.prototype.createOffer;
    e2.RTCPeerConnection.prototype.createOffer = function(e3) {
      if (e3) {
        void 0 !== e3.offerToReceiveAudio && (e3.offerToReceiveAudio = !!e3.offerToReceiveAudio);
        const t3 = this.getTransceivers().find(((e4) => "audio" === e4.receiver.track.kind));
        false === e3.offerToReceiveAudio && t3 ? "sendrecv" === t3.direction ? t3.setDirection ? t3.setDirection("sendonly") : t3.direction = "sendonly" : "recvonly" === t3.direction && (t3.setDirection ? t3.setDirection("inactive") : t3.direction = "inactive") : true !== e3.offerToReceiveAudio || t3 || this.addTransceiver("audio", { direction: "recvonly" }), void 0 !== e3.offerToReceiveVideo && (e3.offerToReceiveVideo = !!e3.offerToReceiveVideo);
        const n2 = this.getTransceivers().find(((e4) => "video" === e4.receiver.track.kind));
        false === e3.offerToReceiveVideo && n2 ? "sendrecv" === n2.direction ? n2.setDirection ? n2.setDirection("sendonly") : n2.direction = "sendonly" : "recvonly" === n2.direction && (n2.setDirection ? n2.setDirection("inactive") : n2.direction = "inactive") : true !== e3.offerToReceiveVideo || n2 || this.addTransceiver("video", { direction: "recvonly" });
      }
      return t2.apply(this, arguments);
    };
  }
  function fo(e2) {
    "object" != typeof e2 || e2.AudioContext || (e2.AudioContext = e2.webkitAudioContext);
  }
  var ko, yo = Object.freeze({ __proto__: null, shimAudioContext: fo, shimCallbacksAPI: uo, shimConstraints: po, shimCreateOfferLegacy: vo, shimGetUserMedia: ho, shimLocalStreamsAPI: co, shimRTCIceServerUrls: mo, shimRemoteStreamsAPI: lo, shimTrackEventTransceiver: go }), bo = { exports: {} };
  var To = (ko || (ko = 1, (function(e2) {
    const t2 = { generateIdentifier: function() {
      return Math.random().toString(36).substring(2, 12);
    } };
    t2.localCName = t2.generateIdentifier(), t2.splitLines = function(e3) {
      return e3.trim().split("\n").map(((e4) => e4.trim()));
    }, t2.splitSections = function(e3) {
      return e3.split("\nm=").map(((e4, t3) => (t3 > 0 ? "m=" + e4 : e4).trim() + "\r\n"));
    }, t2.getDescription = function(e3) {
      const n2 = t2.splitSections(e3);
      return n2 && n2[0];
    }, t2.getMediaSections = function(e3) {
      const n2 = t2.splitSections(e3);
      return n2.shift(), n2;
    }, t2.matchPrefix = function(e3, n2) {
      return t2.splitLines(e3).filter(((e4) => 0 === e4.indexOf(n2)));
    }, t2.parseCandidate = function(e3) {
      let t3;
      t3 = 0 === e3.indexOf("a=candidate:") ? e3.substring(12).split(" ") : e3.substring(10).split(" ");
      const n2 = { foundation: t3[0], component: { 1: "rtp", 2: "rtcp" }[t3[1]] || t3[1], protocol: t3[2].toLowerCase(), priority: parseInt(t3[3], 10), ip: t3[4], address: t3[4], port: parseInt(t3[5], 10), type: t3[7] };
      for (let i2 = 8; i2 < t3.length; i2 += 2) switch (t3[i2]) {
        case "raddr":
          n2.relatedAddress = t3[i2 + 1];
          break;
        case "rport":
          n2.relatedPort = parseInt(t3[i2 + 1], 10);
          break;
        case "tcptype":
          n2.tcpType = t3[i2 + 1];
          break;
        case "ufrag":
          n2.ufrag = t3[i2 + 1], n2.usernameFragment = t3[i2 + 1];
          break;
        default:
          void 0 === n2[t3[i2]] && (n2[t3[i2]] = t3[i2 + 1]);
      }
      return n2;
    }, t2.writeCandidate = function(e3) {
      const t3 = [];
      t3.push(e3.foundation);
      const n2 = e3.component;
      "rtp" === n2 ? t3.push(1) : "rtcp" === n2 ? t3.push(2) : t3.push(n2), t3.push(e3.protocol.toUpperCase()), t3.push(e3.priority), t3.push(e3.address || e3.ip), t3.push(e3.port);
      const i2 = e3.type;
      return t3.push("typ"), t3.push(i2), "host" !== i2 && e3.relatedAddress && void 0 !== e3.relatedPort && (t3.push("raddr"), t3.push(e3.relatedAddress), t3.push("rport"), t3.push(e3.relatedPort)), e3.tcpType && "tcp" === e3.protocol.toLowerCase() && (t3.push("tcptype"), t3.push(e3.tcpType)), (e3.usernameFragment || e3.ufrag) && (t3.push("ufrag"), t3.push(e3.usernameFragment || e3.ufrag)), "candidate:" + t3.join(" ");
    }, t2.parseIceOptions = function(e3) {
      return e3.substring(14).split(" ");
    }, t2.parseRtpMap = function(e3) {
      let t3 = e3.substring(9).split(" ");
      const n2 = { payloadType: parseInt(t3.shift(), 10) };
      return t3 = t3[0].split("/"), n2.name = t3[0], n2.clockRate = parseInt(t3[1], 10), n2.channels = 3 === t3.length ? parseInt(t3[2], 10) : 1, n2.numChannels = n2.channels, n2;
    }, t2.writeRtpMap = function(e3) {
      let t3 = e3.payloadType;
      void 0 !== e3.preferredPayloadType && (t3 = e3.preferredPayloadType);
      const n2 = e3.channels || e3.numChannels || 1;
      return "a=rtpmap:" + t3 + " " + e3.name + "/" + e3.clockRate + (1 !== n2 ? "/" + n2 : "") + "\r\n";
    }, t2.parseExtmap = function(e3) {
      const t3 = e3.substring(9).split(" ");
      return { id: parseInt(t3[0], 10), direction: t3[0].indexOf("/") > 0 ? t3[0].split("/")[1] : "sendrecv", uri: t3[1], attributes: t3.slice(2).join(" ") };
    }, t2.writeExtmap = function(e3) {
      return "a=extmap:" + (e3.id || e3.preferredId) + (e3.direction && "sendrecv" !== e3.direction ? "/" + e3.direction : "") + " " + e3.uri + (e3.attributes ? " " + e3.attributes : "") + "\r\n";
    }, t2.parseFmtp = function(e3) {
      const t3 = {};
      let n2;
      const i2 = e3.substring(e3.indexOf(" ") + 1).split(";");
      for (let r2 = 0; r2 < i2.length; r2++) n2 = i2[r2].trim().split("="), t3[n2[0].trim()] = n2[1];
      return t3;
    }, t2.writeFmtp = function(e3) {
      let t3 = "", n2 = e3.payloadType;
      if (void 0 !== e3.preferredPayloadType && (n2 = e3.preferredPayloadType), e3.parameters && Object.keys(e3.parameters).length) {
        const i2 = [];
        Object.keys(e3.parameters).forEach(((t4) => {
          void 0 !== e3.parameters[t4] ? i2.push(t4 + "=" + e3.parameters[t4]) : i2.push(t4);
        })), t3 += "a=fmtp:" + n2 + " " + i2.join(";") + "\r\n";
      }
      return t3;
    }, t2.parseRtcpFb = function(e3) {
      const t3 = e3.substring(e3.indexOf(" ") + 1).split(" ");
      return { type: t3.shift(), parameter: t3.join(" ") };
    }, t2.writeRtcpFb = function(e3) {
      let t3 = "", n2 = e3.payloadType;
      return void 0 !== e3.preferredPayloadType && (n2 = e3.preferredPayloadType), e3.rtcpFeedback && e3.rtcpFeedback.length && e3.rtcpFeedback.forEach(((e4) => {
        t3 += "a=rtcp-fb:" + n2 + " " + e4.type + (e4.parameter && e4.parameter.length ? " " + e4.parameter : "") + "\r\n";
      })), t3;
    }, t2.parseSsrcMedia = function(e3) {
      const t3 = e3.indexOf(" "), n2 = { ssrc: parseInt(e3.substring(7, t3), 10) }, i2 = e3.indexOf(":", t3);
      return i2 > -1 ? (n2.attribute = e3.substring(t3 + 1, i2), n2.value = e3.substring(i2 + 1)) : n2.attribute = e3.substring(t3 + 1), n2;
    }, t2.parseSsrcGroup = function(e3) {
      const t3 = e3.substring(13).split(" ");
      return { semantics: t3.shift(), ssrcs: t3.map(((e4) => parseInt(e4, 10))) };
    }, t2.getMid = function(e3) {
      const n2 = t2.matchPrefix(e3, "a=mid:")[0];
      if (n2) return n2.substring(6);
    }, t2.parseFingerprint = function(e3) {
      const t3 = e3.substring(14).split(" ");
      return { algorithm: t3[0].toLowerCase(), value: t3[1].toUpperCase() };
    }, t2.getDtlsParameters = function(e3, n2) {
      return { role: "auto", fingerprints: t2.matchPrefix(e3 + n2, "a=fingerprint:").map(t2.parseFingerprint) };
    }, t2.writeDtlsParameters = function(e3, t3) {
      let n2 = "a=setup:" + t3 + "\r\n";
      return e3.fingerprints.forEach(((e4) => {
        n2 += "a=fingerprint:" + e4.algorithm + " " + e4.value + "\r\n";
      })), n2;
    }, t2.parseCryptoLine = function(e3) {
      const t3 = e3.substring(9).split(" ");
      return { tag: parseInt(t3[0], 10), cryptoSuite: t3[1], keyParams: t3[2], sessionParams: t3.slice(3) };
    }, t2.writeCryptoLine = function(e3) {
      return "a=crypto:" + e3.tag + " " + e3.cryptoSuite + " " + ("object" == typeof e3.keyParams ? t2.writeCryptoKeyParams(e3.keyParams) : e3.keyParams) + (e3.sessionParams ? " " + e3.sessionParams.join(" ") : "") + "\r\n";
    }, t2.parseCryptoKeyParams = function(e3) {
      if (0 !== e3.indexOf("inline:")) return null;
      const t3 = e3.substring(7).split("|");
      return { keyMethod: "inline", keySalt: t3[0], lifeTime: t3[1], mkiValue: t3[2] ? t3[2].split(":")[0] : void 0, mkiLength: t3[2] ? t3[2].split(":")[1] : void 0 };
    }, t2.writeCryptoKeyParams = function(e3) {
      return e3.keyMethod + ":" + e3.keySalt + (e3.lifeTime ? "|" + e3.lifeTime : "") + (e3.mkiValue && e3.mkiLength ? "|" + e3.mkiValue + ":" + e3.mkiLength : "");
    }, t2.getCryptoParameters = function(e3, n2) {
      return t2.matchPrefix(e3 + n2, "a=crypto:").map(t2.parseCryptoLine);
    }, t2.getIceParameters = function(e3, n2) {
      const i2 = t2.matchPrefix(e3 + n2, "a=ice-ufrag:")[0], r2 = t2.matchPrefix(e3 + n2, "a=ice-pwd:")[0];
      return i2 && r2 ? { usernameFragment: i2.substring(12), password: r2.substring(10) } : null;
    }, t2.writeIceParameters = function(e3) {
      let t3 = "a=ice-ufrag:" + e3.usernameFragment + "\r\na=ice-pwd:" + e3.password + "\r\n";
      return e3.iceLite && (t3 += "a=ice-lite\r\n"), t3;
    }, t2.parseRtpParameters = function(e3) {
      const n2 = { codecs: [], headerExtensions: [], fecMechanisms: [], rtcp: [] }, i2 = t2.splitLines(e3)[0].split(" ");
      n2.profile = i2[2];
      for (let o2 = 3; o2 < i2.length; o2++) {
        const r3 = i2[o2], s2 = t2.matchPrefix(e3, "a=rtpmap:" + r3 + " ")[0];
        if (s2) {
          const i3 = t2.parseRtpMap(s2), o3 = t2.matchPrefix(e3, "a=fmtp:" + r3 + " ");
          switch (i3.parameters = o3.length ? t2.parseFmtp(o3[0]) : {}, i3.rtcpFeedback = t2.matchPrefix(e3, "a=rtcp-fb:" + r3 + " ").map(t2.parseRtcpFb), n2.codecs.push(i3), i3.name.toUpperCase()) {
            case "RED":
            case "ULPFEC":
              n2.fecMechanisms.push(i3.name.toUpperCase());
          }
        }
      }
      t2.matchPrefix(e3, "a=extmap:").forEach(((e4) => {
        n2.headerExtensions.push(t2.parseExtmap(e4));
      }));
      const r2 = t2.matchPrefix(e3, "a=rtcp-fb:* ").map(t2.parseRtcpFb);
      return n2.codecs.forEach(((e4) => {
        r2.forEach(((t3) => {
          e4.rtcpFeedback.find(((e5) => e5.type === t3.type && e5.parameter === t3.parameter)) || e4.rtcpFeedback.push(t3);
        }));
      })), n2;
    }, t2.writeRtpDescription = function(e3, n2) {
      let i2 = "";
      i2 += "m=" + e3 + " ", i2 += n2.codecs.length > 0 ? "9" : "0", i2 += " " + (n2.profile || "UDP/TLS/RTP/SAVPF") + " ", i2 += n2.codecs.map(((e4) => void 0 !== e4.preferredPayloadType ? e4.preferredPayloadType : e4.payloadType)).join(" ") + "\r\n", i2 += "c=IN IP4 0.0.0.0\r\n", i2 += "a=rtcp:9 IN IP4 0.0.0.0\r\n", n2.codecs.forEach(((e4) => {
        i2 += t2.writeRtpMap(e4), i2 += t2.writeFmtp(e4), i2 += t2.writeRtcpFb(e4);
      }));
      let r2 = 0;
      return n2.codecs.forEach(((e4) => {
        e4.maxptime > r2 && (r2 = e4.maxptime);
      })), r2 > 0 && (i2 += "a=maxptime:" + r2 + "\r\n"), n2.headerExtensions && n2.headerExtensions.forEach(((e4) => {
        i2 += t2.writeExtmap(e4);
      })), i2;
    }, t2.parseRtpEncodingParameters = function(e3) {
      const n2 = [], i2 = t2.parseRtpParameters(e3), r2 = -1 !== i2.fecMechanisms.indexOf("RED"), o2 = -1 !== i2.fecMechanisms.indexOf("ULPFEC"), s2 = t2.matchPrefix(e3, "a=ssrc:").map(((e4) => t2.parseSsrcMedia(e4))).filter(((e4) => "cname" === e4.attribute)), a2 = s2.length > 0 && s2[0].ssrc;
      let c2;
      const d2 = t2.matchPrefix(e3, "a=ssrc-group:FID").map(((e4) => e4.substring(17).split(" ").map(((e5) => parseInt(e5, 10)))));
      d2.length > 0 && d2[0].length > 1 && d2[0][0] === a2 && (c2 = d2[0][1]), i2.codecs.forEach(((e4) => {
        if ("RTX" === e4.name.toUpperCase() && e4.parameters.apt) {
          let t3 = { ssrc: a2, codecPayloadType: parseInt(e4.parameters.apt, 10) };
          a2 && c2 && (t3.rtx = { ssrc: c2 }), n2.push(t3), r2 && (t3 = JSON.parse(JSON.stringify(t3)), t3.fec = { ssrc: a2, mechanism: o2 ? "red+ulpfec" : "red" }, n2.push(t3));
        }
      })), 0 === n2.length && a2 && n2.push({ ssrc: a2 });
      let l2 = t2.matchPrefix(e3, "b=");
      return l2.length && (l2 = 0 === l2[0].indexOf("b=TIAS:") ? parseInt(l2[0].substring(7), 10) : 0 === l2[0].indexOf("b=AS:") ? 1e3 * parseInt(l2[0].substring(5), 10) * 0.95 - 16e3 : void 0, n2.forEach(((e4) => {
        e4.maxBitrate = l2;
      }))), n2;
    }, t2.parseRtcpParameters = function(e3) {
      const n2 = {}, i2 = t2.matchPrefix(e3, "a=ssrc:").map(((e4) => t2.parseSsrcMedia(e4))).filter(((e4) => "cname" === e4.attribute))[0];
      i2 && (n2.cname = i2.value, n2.ssrc = i2.ssrc);
      const r2 = t2.matchPrefix(e3, "a=rtcp-rsize");
      n2.reducedSize = r2.length > 0, n2.compound = 0 === r2.length;
      const o2 = t2.matchPrefix(e3, "a=rtcp-mux");
      return n2.mux = o2.length > 0, n2;
    }, t2.writeRtcpParameters = function(e3) {
      let t3 = "";
      return e3.reducedSize && (t3 += "a=rtcp-rsize\r\n"), e3.mux && (t3 += "a=rtcp-mux\r\n"), void 0 !== e3.ssrc && e3.cname && (t3 += "a=ssrc:" + e3.ssrc + " cname:" + e3.cname + "\r\n"), t3;
    }, t2.parseMsid = function(e3) {
      let n2;
      const i2 = t2.matchPrefix(e3, "a=msid:");
      if (1 === i2.length) return n2 = i2[0].substring(7).split(" "), { stream: n2[0], track: n2[1] };
      const r2 = t2.matchPrefix(e3, "a=ssrc:").map(((e4) => t2.parseSsrcMedia(e4))).filter(((e4) => "msid" === e4.attribute));
      return r2.length > 0 ? (n2 = r2[0].value.split(" "), { stream: n2[0], track: n2[1] }) : void 0;
    }, t2.parseSctpDescription = function(e3) {
      const n2 = t2.parseMLine(e3), i2 = t2.matchPrefix(e3, "a=max-message-size:");
      let r2;
      i2.length > 0 && (r2 = parseInt(i2[0].substring(19), 10)), isNaN(r2) && (r2 = 65536);
      const o2 = t2.matchPrefix(e3, "a=sctp-port:");
      if (o2.length > 0) return { port: parseInt(o2[0].substring(12), 10), protocol: n2.fmt, maxMessageSize: r2 };
      const s2 = t2.matchPrefix(e3, "a=sctpmap:");
      if (s2.length > 0) {
        const e4 = s2[0].substring(10).split(" ");
        return { port: parseInt(e4[0], 10), protocol: e4[1], maxMessageSize: r2 };
      }
    }, t2.writeSctpDescription = function(e3, t3) {
      let n2 = [];
      return n2 = "DTLS/SCTP" !== e3.protocol ? ["m=" + e3.kind + " 9 " + e3.protocol + " " + t3.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + t3.port + "\r\n"] : ["m=" + e3.kind + " 9 " + e3.protocol + " " + t3.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + t3.port + " " + t3.protocol + " 65535\r\n"], void 0 !== t3.maxMessageSize && n2.push("a=max-message-size:" + t3.maxMessageSize + "\r\n"), n2.join("");
    }, t2.generateSessionId = function() {
      return Math.random().toString().substr(2, 22);
    }, t2.writeSessionBoilerplate = function(e3, n2, i2) {
      let r2;
      const o2 = void 0 !== n2 ? n2 : 2;
      return r2 = e3 || t2.generateSessionId(), "v=0\r\no=" + (i2 || "thisisadapterortc") + " " + r2 + " " + o2 + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
    }, t2.getDirection = function(e3, n2) {
      const i2 = t2.splitLines(e3);
      for (let t3 = 0; t3 < i2.length; t3++) switch (i2[t3]) {
        case "a=sendrecv":
        case "a=sendonly":
        case "a=recvonly":
        case "a=inactive":
          return i2[t3].substring(2);
      }
      return n2 ? t2.getDirection(n2) : "sendrecv";
    }, t2.getKind = function(e3) {
      return t2.splitLines(e3)[0].split(" ")[0].substring(2);
    }, t2.isRejected = function(e3) {
      return "0" === e3.split(" ", 2)[1];
    }, t2.parseMLine = function(e3) {
      const n2 = t2.splitLines(e3)[0].substring(2).split(" ");
      return { kind: n2[0], port: parseInt(n2[1], 10), protocol: n2[2], fmt: n2.slice(3).join(" ") };
    }, t2.parseOLine = function(e3) {
      const n2 = t2.matchPrefix(e3, "o=")[0].substring(2).split(" ");
      return { username: n2[0], sessionId: n2[1], sessionVersion: parseInt(n2[2], 10), netType: n2[3], addressType: n2[4], address: n2[5] };
    }, t2.isValidSDP = function(e3) {
      if ("string" != typeof e3 || 0 === e3.length) return false;
      const n2 = t2.splitLines(e3);
      for (let t3 = 0; t3 < n2.length; t3++) if (n2[t3].length < 2 || "=" !== n2[t3].charAt(1)) return false;
      return true;
    }, e2.exports = t2;
  })(bo)), bo.exports), So = er(To), Eo = t({ __proto__: null, default: So }, [To]);
  function Co(e2) {
    if (!e2.RTCIceCandidate || e2.RTCIceCandidate && "foundation" in e2.RTCIceCandidate.prototype) return;
    const t2 = e2.RTCIceCandidate;
    e2.RTCIceCandidate = function(e3) {
      if ("object" == typeof e3 && e3.candidate && 0 === e3.candidate.indexOf("a=") && ((e3 = JSON.parse(JSON.stringify(e3))).candidate = e3.candidate.substring(2)), e3.candidate && e3.candidate.length) {
        const n2 = new t2(e3), i2 = So.parseCandidate(e3.candidate);
        for (const e4 in i2) e4 in n2 || Object.defineProperty(n2, e4, { value: i2[e4] });
        return n2.toJSON = function() {
          return { candidate: n2.candidate, sdpMid: n2.sdpMid, sdpMLineIndex: n2.sdpMLineIndex, usernameFragment: n2.usernameFragment };
        }, n2;
      }
      return new t2(e3);
    }, e2.RTCIceCandidate.prototype = t2.prototype, _r(e2, "icecandidate", ((t3) => (t3.candidate && Object.defineProperty(t3, "candidate", { value: new e2.RTCIceCandidate(t3.candidate), writable: "false" }), t3)));
  }
  function wo(e2) {
    !e2.RTCIceCandidate || e2.RTCIceCandidate && "relayProtocol" in e2.RTCIceCandidate.prototype || _r(e2, "icecandidate", ((e3) => {
      if (e3.candidate) {
        const t2 = So.parseCandidate(e3.candidate.candidate);
        "relay" === t2.type && (e3.candidate.relayProtocol = { 0: "tls", 1: "tcp", 2: "udp" }[t2.priority >> 24]);
      }
      return e3;
    }));
  }
  function Ro(e2, t2) {
    if (!e2.RTCPeerConnection) return;
    if ("chrome" === t2.browser && t2.version > 102) return;
    if ("firefox" === t2.browser && t2.version >= 113) return;
    "sctp" in e2.RTCPeerConnection.prototype || Object.defineProperty(e2.RTCPeerConnection.prototype, "sctp", { get() {
      return void 0 === this._sctp ? null : this._sctp;
    } });
    const n2 = e2.RTCPeerConnection.prototype.setRemoteDescription;
    e2.RTCPeerConnection.prototype.setRemoteDescription = function() {
      if (this._sctp = null, "chrome" === t2.browser && t2.version >= 76) {
        "plan-b" === this.getConfiguration().sdpSemantics && Object.defineProperty(this, "sctp", { get() {
          return void 0 === this._sctp ? null : this._sctp;
        }, enumerable: true, configurable: true });
      }
      if ((function(e3) {
        if (!e3 || !e3.sdp) return false;
        const t3 = So.splitSections(e3.sdp);
        return t3.shift(), t3.some(((e4) => {
          const t4 = So.parseMLine(e4);
          return t4 && "application" === t4.kind && -1 !== t4.protocol.indexOf("SCTP");
        }));
      })(arguments[0])) {
        const e3 = (function(e4) {
          const t3 = e4.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
          if (null === t3 || t3.length < 2) return -1;
          const n4 = parseInt(t3[1], 10);
          return n4 != n4 ? -1 : n4;
        })(arguments[0]), n3 = (function(e4) {
          let n4 = 65536;
          return "firefox" === t2.browser && (n4 = t2.version < 57 ? -1 === e4 ? 16384 : 2147483637 : t2.version < 60 ? 57 === t2.version ? 65535 : 65536 : 2147483637), n4;
        })(e3), i2 = (function(e4, n4) {
          let i3 = 65536;
          "firefox" === t2.browser && 57 === t2.version && (i3 = 65535);
          const r3 = So.matchPrefix(e4.sdp, "a=max-message-size:");
          return r3.length > 0 ? i3 = parseInt(r3[0].substring(19), 10) : "firefox" === t2.browser && -1 !== n4 && (i3 = 2147483637), i3;
        })(arguments[0], e3);
        let r2;
        r2 = 0 === n3 && 0 === i2 ? Number.POSITIVE_INFINITY : 0 === n3 || 0 === i2 ? Math.max(n3, i2) : Math.min(n3, i2);
        const o2 = {};
        Object.defineProperty(o2, "maxMessageSize", { get: () => r2 }), this._sctp = o2;
      }
      return n2.apply(this, arguments);
    };
  }
  function Po(e2, t2) {
    if (!e2.RTCPeerConnection || !("createDataChannel" in e2.RTCPeerConnection.prototype)) return;
    if ("chrome" === t2.browser && t2.version >= 149) return;
    if ("firefox" === t2.browser && t2.version > 60) return;
    function n2(e3, t3) {
      const n3 = e3.send;
      e3.send = function() {
        const i3 = arguments[0], r2 = i3.length || i3.size || i3.byteLength;
        if ("open" === e3.readyState && t3.sctp && r2 > t3.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + t3.sctp.maxMessageSize + " bytes)");
        return n3.apply(e3, arguments);
      };
    }
    const i2 = e2.RTCPeerConnection.prototype.createDataChannel;
    e2.RTCPeerConnection.prototype.createDataChannel = function() {
      const e3 = i2.apply(this, arguments);
      return n2(e3, this), e3;
    }, _r(e2, "datachannel", ((e3) => (n2(e3.channel, e3.target), e3)));
  }
  function Io(e2) {
    if (!e2.RTCPeerConnection || "connectionState" in e2.RTCPeerConnection.prototype) return;
    const t2 = e2.RTCPeerConnection.prototype;
    Object.defineProperty(t2, "connectionState", { get() {
      return { completed: "connected", checking: "connecting" }[this.iceConnectionState] || this.iceConnectionState;
    }, enumerable: true, configurable: true }), Object.defineProperty(t2, "onconnectionstatechange", { get() {
      return this._onconnectionstatechange || null;
    }, set(e3) {
      this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), e3 && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e3);
    }, enumerable: true, configurable: true }), ["setLocalDescription", "setRemoteDescription"].forEach(((e3) => {
      const n2 = t2[e3];
      t2[e3] = function() {
        return this._connectionstatechangepoly || (this._connectionstatechangepoly = (e4) => {
          const t3 = e4.target;
          if (t3._lastConnectionState !== t3.connectionState) {
            t3._lastConnectionState = t3.connectionState;
            const n3 = new Event("connectionstatechange", e4);
            t3.dispatchEvent(n3);
          }
          return e4;
        }, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), n2.apply(this, arguments);
      };
    }));
  }
  function _o(e2, t2) {
    if (!e2.RTCPeerConnection) return;
    if ("chrome" === t2.browser && t2.version >= 71) return;
    if ("safari" === t2.browser && t2._safariVersion >= 13.1) return;
    const n2 = e2.RTCPeerConnection.prototype.setRemoteDescription;
    e2.RTCPeerConnection.prototype.setRemoteDescription = function(t3) {
      if (t3 && t3.sdp && -1 !== t3.sdp.indexOf("\na=extmap-allow-mixed")) {
        const n3 = t3.sdp.split("\n").filter(((e3) => "a=extmap-allow-mixed" !== e3.trim())).join("\n");
        e2.RTCSessionDescription && t3 instanceof e2.RTCSessionDescription ? arguments[0] = new e2.RTCSessionDescription({ type: t3.type, sdp: n3 }) : t3.sdp = n3;
      }
      return n2.apply(this, arguments);
    };
  }
  function Mo(e2, t2) {
    if (!e2.RTCPeerConnection || !e2.RTCPeerConnection.prototype) return;
    const n2 = e2.RTCPeerConnection.prototype.addIceCandidate;
    n2 && 0 !== n2.length && (e2.RTCPeerConnection.prototype.addIceCandidate = function() {
      return arguments[0] ? ("chrome" === t2.browser && t2.version < 78 || "firefox" === t2.browser && t2.version < 68 || "safari" === t2.browser) && arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : n2.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve());
    });
  }
  function Do(e2, t2) {
    if (!e2.RTCPeerConnection || !e2.RTCPeerConnection.prototype) return;
    const n2 = e2.RTCPeerConnection.prototype.setLocalDescription;
    n2 && 0 !== n2.length && (e2.RTCPeerConnection.prototype.setLocalDescription = function() {
      let e3 = arguments[0] || {};
      if ("object" != typeof e3 || e3.type && e3.sdp) return n2.apply(this, arguments);
      if (e3 = { type: e3.type, sdp: e3.sdp }, !e3.type) switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          e3.type = "offer";
          break;
        default:
          e3.type = "answer";
      }
      if (e3.sdp || "offer" !== e3.type && "answer" !== e3.type) return n2.apply(this, [e3]);
      return ("offer" === e3.type ? this.createOffer : this.createAnswer).apply(this).then(((e4) => n2.apply(this, [e4])));
    });
  }
  var Oo, Ao, Lo = Object.freeze({ __proto__: null, removeExtmapAllowMixed: _o, shimAddIceCandidateNullOrEmpty: Mo, shimConnectionState: Io, shimMaxMessageSize: Ro, shimParameterlessSetLocalDescription: Do, shimRTCIceCandidate: Co, shimRTCIceCandidateRelayProtocol: wo, shimSendThrowTypeError: Po });
  !(function() {
    let e2 = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).window, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { shimChrome: true, shimFirefox: true, shimSafari: true };
    const n2 = Or, i2 = (function(e3) {
      const t3 = { browser: null, version: null };
      if (void 0 === e3 || !e3.navigator || !e3.navigator.userAgent) return t3.browser = "Not a browser.", t3;
      const n3 = e3.navigator;
      if (n3.userAgentData && n3.userAgentData.brands) {
        const e4 = n3.userAgentData.brands.find(((e5) => "Chromium" === e5.brand));
        if (e4) {
          const t4 = parseInt(e4.version, 10);
          if (t4 >= 90) return { browser: "chrome", version: t4 };
        }
      }
      if (n3.mozGetUserMedia) t3.browser = "firefox", t3.version = parseInt(Ir(n3.userAgent, /Firefox\/(\d+)\./, 1));
      else if (n3.webkitGetUserMedia || false === e3.isSecureContext && e3.webkitRTCPeerConnection) t3.browser = "chrome", t3.version = parseInt(Ir(n3.userAgent, /Chrom(e|ium)\/(\d+)\./, 2)) || null;
      else {
        if (!e3.RTCPeerConnection || !n3.userAgent.match(/AppleWebKit\/(\d+)\./)) return t3.browser = "Not a supported browser.", t3;
        t3.browser = "safari", t3.version = parseInt(Ir(n3.userAgent, /AppleWebKit\/(\d+)\./, 1)), t3.supportsUnifiedPlan = e3.RTCRtpTransceiver && "currentDirection" in e3.RTCRtpTransceiver.prototype, t3._safariVersion = Ir(n3.userAgent, /Version\/(\d+(\.?\d+))/, 1);
      }
      return t3;
    })(e2), r2 = { browserDetails: i2, commonShim: Lo, extractVersion: Ir, disableLog: Mr, disableWarnings: Dr, sdp: Eo };
    switch (i2.browser) {
      case "chrome":
        if (!Jr || !zr || !t2.shimChrome) return n2("Chrome shim is not included in this adapter release."), r2;
        if (null === i2.version) return n2("Chrome shim can not determine version, not shimming."), r2;
        n2("adapter.js shimming chrome."), r2.browserShim = Jr, Mo(e2, i2), Do(e2), jr(e2, i2), Br(e2), zr(e2, i2), qr(e2, i2), Kr(e2, i2), Vr(e2), Wr(e2, i2), Gr(e2, i2), Co(e2), wo(e2), Io(e2), Ro(e2, i2), Po(e2, i2), _o(e2, i2);
        break;
      case "firefox":
        if (!ao || !Xr || !t2.shimFirefox) return n2("Firefox shim is not included in this adapter release."), r2;
        n2("adapter.js shimming firefox."), r2.browserShim = ao, Mo(e2, i2), Do(e2), Qr(e2, i2), Xr(e2, i2), Zr(e2, i2), Yr(e2), to(e2), $r(e2), eo(e2), no(e2), io(e2, i2), ro(e2, i2), oo(e2, i2), so(e2, i2), Co(e2), Io(e2), Ro(e2, i2), Po(e2, i2);
        break;
      case "safari":
        if (!yo || !t2.shimSafari) return n2("Safari shim is not included in this adapter release."), r2;
        n2("adapter.js shimming safari."), r2.browserShim = yo, Mo(e2, i2), Do(e2), mo(e2), vo(e2), uo(e2), co(e2), lo(e2), go(e2), ho(e2), fo(e2), Co(e2), wo(e2), Ro(e2, i2), Po(e2, i2), _o(e2, i2);
        break;
      default:
        n2("Unsupported browser!");
    }
  })({ window: "undefined" == typeof window ? void 0 : window });
  class No extends (Ao = Promise) {
    constructor(e2) {
      super(e2);
    }
    catch(e2) {
      return super.catch(e2);
    }
    static reject(e2) {
      return super.reject(e2);
    }
    static all(e2) {
      return super.all(e2);
    }
    static race(e2) {
      return super.race(e2);
    }
  }
  Oo = No, No.resolve = (e2) => Reflect.get(Ao, "resolve", Oo).call(Oo, e2);
  const xo = /version\/(\d+(\.?_?\d+)+)/i;
  let Uo;
  function Fo(e2) {
    let t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
    if (void 0 === e2 && "undefined" == typeof navigator) return;
    const n2 = (null != e2 ? e2 : navigator.userAgent).toLowerCase();
    if (void 0 === Uo || t2) {
      const e3 = jo.find(((e4) => e4.test.test(n2)));
      Uo = null == e3 ? void 0 : e3.describe(n2);
    }
    return Uo;
  }
  const jo = [{ test: /firefox|iceweasel|fxios/i, describe: (e2) => ({ name: "Firefox", version: Bo(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e2), os: e2.toLowerCase().includes("fxios") ? "iOS" : void 0, osVersion: qo(e2) }) }, { test: /chrom|crios|crmo/i, describe: (e2) => ({ name: "Chrome", version: Bo(/(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e2), os: e2.toLowerCase().includes("crios") ? "iOS" : void 0, osVersion: qo(e2) }) }, { test: /safari|applewebkit/i, describe: (e2) => ({ name: "Safari", version: Bo(xo, e2), os: e2.includes("mobile/") ? "iOS" : "macOS", osVersion: qo(e2) }) }];
  function Bo(e2, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
    const i2 = t2.match(e2);
    return i2 && i2.length >= n2 && i2[n2] || "";
  }
  function qo(e2) {
    return e2.includes("mac os") ? Bo(/\(.+?(\d+_\d+(:?_\d+)?)/, e2, 1).replace(/_/g, ".") : void 0;
  }
  const Vo = "2.23.0";
  class Wo extends Error {
    constructor(e2, t2, n2) {
      super(t2 || "an error has occurred"), this.name = "LiveKitError", this.code = e2, void 0 !== (null == n2 ? void 0 : n2.cause) && (this.cause = null == n2 ? void 0 : n2.cause);
    }
  }
  class Ho extends Wo {
  }
  var Ko, zo, Go, Jo, Qo, Yo, Xo;
  e.ConnectionErrorReason = void 0, (Ko = e.ConnectionErrorReason || (e.ConnectionErrorReason = {}))[Ko.NotAllowed = 0] = "NotAllowed", Ko[Ko.ServerUnreachable = 1] = "ServerUnreachable", Ko[Ko.InternalError = 2] = "InternalError", Ko[Ko.Cancelled = 3] = "Cancelled", Ko[Ko.LeaveRequest = 4] = "LeaveRequest", Ko[Ko.Timeout = 5] = "Timeout", Ko[Ko.WebSocket = 6] = "WebSocket", Ko[Ko.ServiceNotFound = 7] = "ServiceNotFound";
  class Zo extends Ho {
    constructor(t2, n2, i2, r2) {
      super(1, t2), this.name = "ConnectionError", this.status = i2, this.reason = n2, this.context = r2, this.reasonName = e.ConnectionErrorReason[n2];
    }
    static notAllowed(t2, n2, i2) {
      return new Zo(t2, e.ConnectionErrorReason.NotAllowed, n2, i2);
    }
    static timeout(t2) {
      return new Zo(t2, e.ConnectionErrorReason.Timeout);
    }
    static leaveRequest(t2, n2) {
      return new Zo(t2, e.ConnectionErrorReason.LeaveRequest, void 0, n2);
    }
    static internal(t2, n2) {
      return new Zo(t2, e.ConnectionErrorReason.InternalError, void 0, n2);
    }
    static cancelled(t2) {
      return new Zo(t2, e.ConnectionErrorReason.Cancelled);
    }
    static serverUnreachable(t2, n2) {
      return new Zo(t2, e.ConnectionErrorReason.ServerUnreachable, n2);
    }
    static websocket(t2, n2, i2) {
      return new Zo(t2, e.ConnectionErrorReason.WebSocket, n2, i2);
    }
    static serviceNotFound(t2, n2) {
      return new Zo(t2, e.ConnectionErrorReason.ServiceNotFound, void 0, n2);
    }
  }
  function $o(t2) {
    return t2.reason !== e.ConnectionErrorReason.Cancelled && (t2.reason !== e.ConnectionErrorReason.NotAllowed || 403 === t2.status);
  }
  class es extends Wo {
    constructor(e2) {
      super(21, null != e2 ? e2 : "device is unsupported"), this.name = "DeviceUnsupportedError";
    }
  }
  class ts extends Wo {
    constructor(e2) {
      super(20, null != e2 ? e2 : "track is invalid"), this.name = "TrackInvalidError";
    }
  }
  class ns extends Wo {
    constructor(e2) {
      super(10, e2 || "unsupported server"), this.name = "UnsupportedServer";
    }
  }
  class is extends Wo {
    constructor(e2) {
      super(12, e2 || "unexpected connection state"), this.name = "UnexpectedConnectionState";
    }
  }
  class rs extends Wo {
    constructor(e2) {
      super(13, e2 || "unable to negotiate"), this.name = "NegotiationError";
    }
  }
  class os extends Wo {
    constructor(e2) {
      super(14, e2 || "unable to publish data"), this.name = "PublishDataError";
    }
  }
  class ss extends Wo {
    constructor(e2, t2) {
      super(15, e2), this.name = "PublishTrackError", this.status = t2;
    }
  }
  class as extends Ho {
    constructor(e2, t2) {
      super(15, e2), this.name = "SignalRequestError", this.reason = t2, this.reasonName = "string" == typeof t2 ? t2 : Ki[t2];
    }
  }
  e.DataStreamErrorReason = void 0, (zo = e.DataStreamErrorReason || (e.DataStreamErrorReason = {}))[zo.AlreadyOpened = 0] = "AlreadyOpened", zo[zo.AbnormalEnd = 1] = "AbnormalEnd", zo[zo.DecodeFailed = 2] = "DecodeFailed", zo[zo.LengthExceeded = 3] = "LengthExceeded", zo[zo.Incomplete = 4] = "Incomplete", zo[zo.HandlerAlreadyRegistered = 7] = "HandlerAlreadyRegistered", zo[zo.EncryptionTypeMismatch = 8] = "EncryptionTypeMismatch", zo[zo.HeaderTooLarge = 9] = "HeaderTooLarge", zo[zo.PayloadTooLarge = 10] = "PayloadTooLarge";
  class cs extends Ho {
    constructor(t2, n2) {
      super(16, t2), this.name = "DataStreamError", this.reason = n2, this.reasonName = e.DataStreamErrorReason[n2];
    }
  }
  class ds extends Wo {
    constructor(e2) {
      super(18, e2), this.name = "SignalReconnectError";
    }
  }
  e.MediaDeviceFailure = void 0, (Go = e.MediaDeviceFailure || (e.MediaDeviceFailure = {})).PermissionDenied = "PermissionDenied", Go.NotFound = "NotFound", Go.DeviceInUse = "DeviceInUse", Go.Other = "Other", (function(e2) {
    e2.getFailure = function(t2) {
      if (t2 && "name" in t2) return "NotFoundError" === t2.name || "DevicesNotFoundError" === t2.name ? e2.NotFound : "NotAllowedError" === t2.name || "PermissionDeniedError" === t2.name ? e2.PermissionDenied : "NotReadableError" === t2.name || "TrackStartError" === t2.name ? e2.DeviceInUse : e2.Other;
    };
  })(e.MediaDeviceFailure || (e.MediaDeviceFailure = {}));
  class ls {
  }
  function us(e2) {
    const t2 = {};
    for (const i2 of Object.entries(e2)) {
      var n2 = j(i2, 2);
      const e3 = n2[0], r2 = n2[1];
      void 0 !== r2 && (t2[e3] = r2);
    }
    return t2;
  }
  function hs(e2, t2) {
    return e2 && t2 ? "".concat(e2, "x").concat(t2) : void 0;
  }
  function ps(e2) {
    return Math.round(1e4 * e2) / 1e4;
  }
  function ms(e2) {
    const t2 = e2.jitterBufferDelay, n2 = e2.jitterBufferEmittedCount;
    return void 0 !== t2 && n2 ? ps(t2 / n2) : void 0;
  }
  function gs(e2, t2) {
    if (void 0 !== e2.playoutDelay) return ps(e2.playoutDelay);
    const n2 = null == t2 ? void 0 : t2.totalPlayoutDelay, i2 = null == t2 ? void 0 : t2.totalSamplesCount;
    return void 0 !== n2 && i2 ? ps(n2 / i2) : void 0;
  }
  function vs(e2) {
    var t2, n2;
    const i2 = /* @__PURE__ */ new Map(), r2 = [], o2 = [], s2 = [];
    let a2;
    e2.forEach(((e3) => i2.set(e3.id, e3)));
    const c2 = (e3) => {
      var t3;
      return e3.codecId ? null === (t3 = i2.get(e3.codecId)) || void 0 === t3 ? void 0 : t3.mimeType : void 0;
    }, d2 = (e3, t3) => e3[t3] ? i2.get(e3[t3]) : void 0;
    e2.forEach(((e3) => {
      switch (e3.type) {
        case "inbound-rtp": {
          const t3 = d2(e3, "playoutId");
          o2.push(us({ kind: e3.kind, ssrc: e3.ssrc, mid: e3.mid, trackId: e3.trackIdentifier, codec: c2(e3), decoder: e3.decoderImplementation, resolution: hs(e3.frameWidth, e3.frameHeight), fps: e3.framesPerSecond, bytesReceived: e3.bytesReceived, packetsReceived: e3.packetsReceived, packetsLost: e3.packetsLost, packetsDiscarded: e3.packetsDiscarded, framesReceived: e3.framesReceived, framesDecoded: e3.framesDecoded, framesDropped: e3.framesDropped, keyFramesDecoded: e3.keyFramesDecoded, freezeCount: e3.freezeCount, totalFreezesDuration: e3.totalFreezesDuration, pauseCount: e3.pauseCount, nackCount: e3.nackCount, pliCount: e3.pliCount, firCount: e3.firCount, jitter: e3.jitter, jitterBuffer: ms(e3), playoutDelay: gs(e3, t3), audioLevel: e3.audioLevel, totalSamplesReceived: e3.totalSamplesReceived, concealedSamples: e3.concealedSamples }));
          break;
        }
        case "outbound-rtp": {
          const t3 = d2(e3, "remoteId"), n3 = d2(e3, "mediaSourceId");
          s2.push(us({ kind: e3.kind, ssrc: e3.ssrc, mid: e3.mid, rid: e3.rid, trackId: null == n3 ? void 0 : n3.trackIdentifier, active: e3.active, codec: c2(e3), encoder: e3.encoderImplementation, resolution: hs(e3.frameWidth, e3.frameHeight), fps: e3.framesPerSecond, captureResolution: hs(null == n3 ? void 0 : n3.width, null == n3 ? void 0 : n3.height), captureFps: null == n3 ? void 0 : n3.framesPerSecond, audioLevel: null == n3 ? void 0 : n3.audioLevel, targetBitrate: e3.targetBitrate, bytesSent: e3.bytesSent, packetsSent: e3.packetsSent, retransmittedPacketsSent: e3.retransmittedPacketsSent, framesEncoded: e3.framesEncoded, keyFramesEncoded: e3.keyFramesEncoded, limitedBy: "none" === e3.qualityLimitationReason ? void 0 : e3.qualityLimitationReason, nackCount: e3.nackCount, pliCount: e3.pliCount, firCount: e3.firCount, remotePacketsLost: null == t3 ? void 0 : t3.packetsLost, remoteFractionLost: null == t3 ? void 0 : t3.fractionLost, remoteJitter: null == t3 ? void 0 : t3.jitter, remoteRoundTripTime: null == t3 ? void 0 : t3.roundTripTime }));
          break;
        }
        case "transport":
          a2 = e3;
          break;
        case "candidate-pair":
          r2.push(e3);
      }
    }));
    const l2 = null == a2 ? void 0 : a2.selectedCandidatePairId, u2 = null !== (n2 = null !== (t2 = l2 ? i2.get(l2) : void 0) && void 0 !== t2 ? t2 : r2.find(((e3) => e3.selected))) && void 0 !== n2 ? n2 : r2.find(((e3) => e3.nominated)), h2 = (null == u2 ? void 0 : u2.localCandidateId) ? i2.get(u2.localCandidateId) : void 0, p2 = (null == u2 ? void 0 : u2.remoteCandidateId) ? i2.get(u2.remoteCandidateId) : void 0, m2 = us({ ice: null == a2 ? void 0 : a2.iceState, dtls: null == a2 ? void 0 : a2.dtlsState, route: h2 && p2 ? "".concat(h2.candidateType, "/").concat(h2.protocol, " -> ").concat(p2.candidateType) : void 0, network: null == h2 ? void 0 : h2.networkType, currentRoundTripTime: null == u2 ? void 0 : u2.currentRoundTripTime, availableOutgoingBitrate: null == u2 ? void 0 : u2.availableOutgoingBitrate, availableIncomingBitrate: null == u2 ? void 0 : u2.availableIncomingBitrate, bytesSent: null == u2 ? void 0 : u2.bytesSent, bytesReceived: null == u2 ? void 0 : u2.bytesReceived, candidatePairChanges: null == a2 ? void 0 : a2.selectedCandidatePairChanges });
    return { connection: Object.keys(m2).length > 0 ? m2 : void 0, outbound: s2.length > 0 ? s2 : void 0, inbound: o2.length > 0 ? o2 : void 0 };
  }
  ls.setTimeout = function() {
    return setTimeout(...arguments);
  }, ls.setInterval = function() {
    return setInterval(...arguments);
  }, ls.clearTimeout = function() {
    return clearTimeout(...arguments);
  }, ls.clearInterval = function() {
    return clearInterval(...arguments);
  }, e.RoomEvent = void 0, (Jo = e.RoomEvent || (e.RoomEvent = {})).Connected = "connected", Jo.Reconnecting = "reconnecting", Jo.SignalReconnecting = "signalReconnecting", Jo.Reconnected = "reconnected", Jo.Disconnected = "disconnected", Jo.ConnectionStateChanged = "connectionStateChanged", Jo.Moved = "moved", Jo.MediaDevicesChanged = "mediaDevicesChanged", Jo.ParticipantConnected = "participantConnected", Jo.ParticipantDisconnected = "participantDisconnected", Jo.TrackPublished = "trackPublished", Jo.TrackSubscribed = "trackSubscribed", Jo.TrackSubscriptionFailed = "trackSubscriptionFailed", Jo.TrackUnpublished = "trackUnpublished", Jo.TrackUnsubscribed = "trackUnsubscribed", Jo.TrackMuted = "trackMuted", Jo.TrackUnmuted = "trackUnmuted", Jo.LocalTrackPublished = "localTrackPublished", Jo.LocalTrackUnpublished = "localTrackUnpublished", Jo.LocalAudioSilenceDetected = "localAudioSilenceDetected", Jo.ActiveSpeakersChanged = "activeSpeakersChanged", Jo.ParticipantMetadataChanged = "participantMetadataChanged", Jo.ParticipantNameChanged = "participantNameChanged", Jo.ParticipantAttributesChanged = "participantAttributesChanged", Jo.ParticipantActive = "participantActive", Jo.RoomMetadataChanged = "roomMetadataChanged", Jo.DataReceived = "dataReceived", Jo.SipDTMFReceived = "sipDTMFReceived", Jo.TranscriptionReceived = "transcriptionReceived", Jo.ConnectionQualityChanged = "connectionQualityChanged", Jo.TrackStreamStateChanged = "trackStreamStateChanged", Jo.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", Jo.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", Jo.AudioPlaybackStatusChanged = "audioPlaybackChanged", Jo.VideoPlaybackStatusChanged = "videoPlaybackChanged", Jo.MediaDevicesError = "mediaDevicesError", Jo.ParticipantPermissionsChanged = "participantPermissionsChanged", Jo.SignalConnected = "signalConnected", Jo.RecordingStatusChanged = "recordingStatusChanged", Jo.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", Jo.EncryptionError = "encryptionError", Jo.DCBufferStatusChanged = "dcBufferStatusChanged", Jo.ActiveDeviceChanged = "activeDeviceChanged", Jo.ChatMessage = "chatMessage", Jo.LocalTrackSubscribed = "localTrackSubscribed", Jo.MetricsReceived = "metricsReceived", Jo.DataTrackPublished = "dataTrackPublished", Jo.DataTrackUnpublished = "dataTrackUnpublished", Jo.LocalDataTrackPublished = "localDataTrackPublished", Jo.LocalDataTrackUnpublished = "localDataTrackUnpublished", e.ParticipantEvent = void 0, (Qo = e.ParticipantEvent || (e.ParticipantEvent = {})).TrackPublished = "trackPublished", Qo.TrackSubscribed = "trackSubscribed", Qo.TrackSubscriptionFailed = "trackSubscriptionFailed", Qo.TrackUnpublished = "trackUnpublished", Qo.TrackUnsubscribed = "trackUnsubscribed", Qo.TrackMuted = "trackMuted", Qo.TrackUnmuted = "trackUnmuted", Qo.LocalTrackPublished = "localTrackPublished", Qo.LocalTrackUnpublished = "localTrackUnpublished", Qo.LocalTrackCpuConstrained = "localTrackCpuConstrained", Qo.LocalSenderCreated = "localSenderCreated", Qo.ParticipantMetadataChanged = "participantMetadataChanged", Qo.ParticipantNameChanged = "participantNameChanged", Qo.DataReceived = "dataReceived", Qo.SipDTMFReceived = "sipDTMFReceived", Qo.TranscriptionReceived = "transcriptionReceived", Qo.IsSpeakingChanged = "isSpeakingChanged", Qo.ConnectionQualityChanged = "connectionQualityChanged", Qo.TrackStreamStateChanged = "trackStreamStateChanged", Qo.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", Qo.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", Qo.TrackCpuConstrained = "trackCpuConstrained", Qo.MediaDevicesError = "mediaDevicesError", Qo.AudioStreamAcquired = "audioStreamAcquired", Qo.ParticipantPermissionsChanged = "participantPermissionsChanged", Qo.PCTrackAdded = "pcTrackAdded", Qo.AttributesChanged = "attributesChanged", Qo.LocalTrackSubscribed = "localTrackSubscribed", Qo.ChatMessage = "chatMessage", Qo.Active = "active", e.EngineEvent = void 0, (Yo = e.EngineEvent || (e.EngineEvent = {})).TransportsCreated = "transportsCreated", Yo.Connected = "connected", Yo.Disconnected = "disconnected", Yo.Resuming = "resuming", Yo.Resumed = "resumed", Yo.Restarting = "restarting", Yo.Restarted = "restarted", Yo.SignalResumed = "signalResumed", Yo.SignalRestarted = "signalRestarted", Yo.Closing = "closing", Yo.MediaTrackAdded = "mediaTrackAdded", Yo.ActiveSpeakersUpdate = "activeSpeakersUpdate", Yo.DataPacketReceived = "dataPacketReceived", Yo.RTPVideoMapUpdate = "rtpVideoMapUpdate", Yo.DCBufferStatusChanged = "dcBufferStatusChanged", Yo.ParticipantUpdate = "participantUpdate", Yo.RoomUpdate = "roomUpdate", Yo.SpeakersChanged = "speakersChanged", Yo.StreamStateChanged = "streamStateChanged", Yo.ConnectionQualityUpdate = "connectionQualityUpdate", Yo.SubscriptionError = "subscriptionError", Yo.SubscriptionPermissionUpdate = "subscriptionPermissionUpdate", Yo.RemoteMute = "remoteMute", Yo.SubscribedQualityUpdate = "subscribedQualityUpdate", Yo.LocalTrackUnpublished = "localTrackUnpublished", Yo.LocalTrackSubscribed = "localTrackSubscribed", Yo.Offline = "offline", Yo.SignalRequestResponse = "signalRequestResponse", Yo.SignalConnected = "signalConnected", Yo.RoomMoved = "roomMoved", Yo.PublishDataTrackResponse = "publishDataTrackResponse", Yo.UnPublishDataTrackResponse = "unPublishDataTrackResponse", Yo.DataTrackSubscriberHandles = "dataTrackSubscriberHandles", Yo.DataTrackPacketReceived = "dataTrackPacketReceived", Yo.Joined = "joined", Yo.TokenRefreshed = "tokenRefreshed", Yo.ServerRegionsReported = "serverRegionsReported", Yo.RequestSubscribedCodecRefresh = "requestSubscribedCodecRefresh", e.TrackEvent = void 0, (Xo = e.TrackEvent || (e.TrackEvent = {})).Message = "message", Xo.Muted = "muted", Xo.Unmuted = "unmuted", Xo.Restarted = "restarted", Xo.Ended = "ended", Xo.Subscribed = "subscribed", Xo.Unsubscribed = "unsubscribed", Xo.CpuConstrained = "cpuConstrained", Xo.UpdateSettings = "updateSettings", Xo.UpdateSubscription = "updateSubscription", Xo.AudioPlaybackStarted = "audioPlaybackStarted", Xo.AudioPlaybackFailed = "audioPlaybackFailed", Xo.AudioSilenceDetected = "audioSilenceDetected", Xo.VisibilityChanged = "visibilityChanged", Xo.VideoDimensionsChanged = "videoDimensionsChanged", Xo.VideoPlaybackStarted = "videoPlaybackStarted", Xo.VideoPlaybackFailed = "videoPlaybackFailed", Xo.ElementAttached = "elementAttached", Xo.ElementDetached = "elementDetached", Xo.UpstreamPaused = "upstreamPaused", Xo.UpstreamResumed = "upstreamResumed", Xo.SubscriptionPermissionChanged = "subscriptionPermissionChanged", Xo.SubscriptionStatusChanged = "subscriptionStatusChanged", Xo.SubscriptionFailed = "subscriptionFailed", Xo.TrackProcessorUpdate = "trackProcessorUpdate", Xo.AudioTrackFeatureUpdate = "audioTrackFeatureUpdate", Xo.TranscriptionReceived = "transcriptionReceived", Xo.TimeSyncUpdate = "timeSyncUpdate", Xo.PreConnectBufferFlushed = "preConnectBufferFlushed";
  class fs {
    constructor(e2, t2, n2, i2, r2) {
      if ("object" == typeof e2) this.width = e2.width, this.height = e2.height, this.aspectRatio = e2.aspectRatio, this.encoding = { maxBitrate: e2.maxBitrate, maxFramerate: e2.maxFramerate, priority: e2.priority };
      else {
        if (void 0 === t2 || void 0 === n2) throw new TypeError("Unsupported options: provide at least width, height and maxBitrate");
        this.width = e2, this.height = t2, this.aspectRatio = e2 / t2, this.encoding = { maxBitrate: n2, maxFramerate: i2, priority: r2 };
      }
    }
    get resolution() {
      return { width: this.width, height: this.height, frameRate: this.encoding.maxFramerate, aspectRatio: this.aspectRatio };
    }
  }
  const ks = ["opus", "red"], ys = ["vp8", "h264"], bs = ["vp8", "h264", "vp9", "av1", "h265"];
  function Ts(e2) {
    return !!ys.find(((t2) => t2 === e2));
  }
  const Ss = Ts;
  var Es, Cs;
  e.BackupCodecPolicy = void 0, (Es = e.BackupCodecPolicy || (e.BackupCodecPolicy = {}))[Es.PREFER_REGRESSION = 0] = "PREFER_REGRESSION", Es[Es.SIMULCAST = 1] = "SIMULCAST", Es[Es.REGRESSION = 2] = "REGRESSION", e.AudioPresets = void 0, (Cs = e.AudioPresets || (e.AudioPresets = {})).telephone = { maxBitrate: 12e3 }, Cs.speech = { maxBitrate: 24e3 }, Cs.music = { maxBitrate: 48e3 }, Cs.musicStereo = { maxBitrate: 64e3 }, Cs.musicHighQuality = { maxBitrate: 96e3 }, Cs.musicHighQualityStereo = { maxBitrate: 128e3 };
  const ws = { h90: new fs(160, 90, 9e4, 20), h180: new fs(320, 180, 16e4, 20), h216: new fs(384, 216, 18e4, 20), h360: new fs(640, 360, 45e4, 20), h540: new fs(960, 540, 8e5, 25), h720: new fs(1280, 720, 17e5, 30), h1080: new fs(1920, 1080, 3e6, 30), h1440: new fs(2560, 1440, 5e6, 30), h2160: new fs(3840, 2160, 8e6, 30) }, Rs = { h120: new fs(160, 120, 7e4, 20), h180: new fs(240, 180, 125e3, 20), h240: new fs(320, 240, 14e4, 20), h360: new fs(480, 360, 33e4, 20), h480: new fs(640, 480, 5e5, 20), h540: new fs(720, 540, 6e5, 25), h720: new fs(960, 720, 13e5, 30), h1080: new fs(1440, 1080, 23e5, 30), h1440: new fs(1920, 1440, 38e5, 30) }, Ps = { h360fps3: new fs(640, 360, 2e5, 3, "medium"), h360fps15: new fs(640, 360, 4e5, 15, "medium"), h720fps5: new fs(1280, 720, 8e5, 5, "medium"), h720fps15: new fs(1280, 720, 15e5, 15, "medium"), h720fps30: new fs(1280, 720, 2e6, 30, "medium"), h1080fps15: new fs(1920, 1080, 25e5, 15, "medium"), h1080fps30: new fs(1920, 1080, 5e6, 30, "medium"), original: new fs(0, 0, 7e6, 30, "medium") };
  function Is(e2, t2, n2) {
    var i2, r2, o2, s2;
    const a2 = js(null != e2 ? e2 : {}), c2 = a2.optionsWithoutProcessor, d2 = a2.audioProcessor, l2 = a2.videoProcessor, u2 = null == t2 ? void 0 : t2.processor, h2 = null == n2 ? void 0 : n2.processor, p2 = null != c2 ? c2 : {};
    return true === p2.audio && (p2.audio = {}), true === p2.video && (p2.video = {}), p2.audio && (_s(p2.audio, t2), null !== (i2 = (o2 = p2.audio).deviceId) && void 0 !== i2 || (o2.deviceId = { ideal: "default" }), (d2 || u2) && (p2.audio.processor = null != d2 ? d2 : u2)), p2.video && (_s(p2.video, n2), null !== (r2 = (s2 = p2.video).deviceId) && void 0 !== r2 || (s2.deviceId = { ideal: "default" }), (l2 || h2) && (p2.video.processor = null != l2 ? l2 : h2)), p2;
  }
  function _s(e2, t2) {
    return Object.keys(t2).forEach(((n2) => {
      void 0 === e2[n2] && (e2[n2] = t2[n2]);
    })), e2;
  }
  function Ms(e2) {
    var t2, n2, i2, r2;
    const o2 = {};
    if (e2.video) if ("object" == typeof e2.video) {
      const n3 = {}, r3 = n3, s2 = e2.video;
      Object.keys(s2).forEach(((e3) => {
        if ("resolution" === e3) _s(r3, s2.resolution);
        else r3[e3] = s2[e3];
      })), o2.video = n3, null !== (t2 = (i2 = o2.video).deviceId) && void 0 !== t2 || (i2.deviceId = { ideal: "default" });
    } else o2.video = !!e2.video && { deviceId: { ideal: "default" } };
    else o2.video = false;
    return e2.audio ? "object" == typeof e2.audio ? (o2.audio = e2.audio, null !== (n2 = (r2 = o2.audio).deviceId) && void 0 !== n2 || (r2.deviceId = { ideal: "default" })) : o2.audio = { deviceId: { ideal: "default" } } : o2.audio = false, o2;
  }
  function Ds(e2) {
    return kr(this, arguments, void 0, (function(e3) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200;
      return (function* () {
        const n2 = Os();
        if (!n2) return false;
        let i2, r2;
        try {
          r2 = n2.createAnalyser(), r2.fftSize = 2048;
          const o2 = r2.frequencyBinCount, s2 = new Uint8Array(o2);
          i2 = n2.createMediaStreamSource(new MediaStream([e3.mediaStreamTrack])), i2.connect(r2);
          const a2 = () => "running" === n2.state;
          if (!a2()) {
            try {
              yield Promise.race([n2.resume(), Js(200)]);
            } catch (Oo2) {
            }
            if (!a2()) return false;
          }
          yield Js(t2), r2.getByteTimeDomainData(s2);
          return !s2.some(((e4) => 128 !== e4 && 0 !== e4));
        } finally {
          null == i2 || i2.disconnect(), null == r2 || r2.disconnect(), yield n2.close().catch((() => {
          }));
        }
      })();
    }));
  }
  function Os() {
    var e2;
    const t2 = "undefined" != typeof window && (window.AudioContext || window.webkitAudioContext);
    if (t2) {
      const i2 = new t2({ latencyHint: "interactive" });
      if ("suspended" === i2.state && "undefined" != typeof window && (null === (e2 = window.document) || void 0 === e2 ? void 0 : e2.body)) {
        const e3 = () => kr(this, void 0, void 0, (function* () {
          var t3;
          try {
            "suspended" === i2.state && (yield i2.resume());
          } catch (n2) {
            console.warn("Error trying to auto-resume audio context", n2);
          } finally {
            null === (t3 = window.document.body) || void 0 === t3 || t3.removeEventListener("click", e3);
          }
        }));
        i2.addEventListener("statechange", (() => {
          var t3;
          "closed" === i2.state && (null === (t3 = window.document.body) || void 0 === t3 || t3.removeEventListener("click", e3));
        })), window.document.body.addEventListener("click", e3);
      }
      return i2;
    }
  }
  function As(e2) {
    return "audioinput" === e2 ? Ws.Source.Microphone : "videoinput" === e2 ? Ws.Source.Camera : Ws.Source.Unknown;
  }
  function Ls(e2) {
    return e2 === Ws.Source.Microphone ? "audioinput" : e2 === Ws.Source.Camera ? "videoinput" : void 0;
  }
  function Ns(e2) {
    var t2, n2;
    let i2 = null === (t2 = e2.video) || void 0 === t2 || t2;
    return e2.resolution && e2.resolution.width > 0 && e2.resolution.height > 0 && (i2 = "boolean" == typeof i2 ? {} : i2, i2 = ca() ? Object.assign(Object.assign({}, i2), { width: { max: e2.resolution.width }, height: { max: e2.resolution.height }, frameRate: e2.resolution.frameRate }) : Object.assign(Object.assign({}, i2), { width: { ideal: e2.resolution.width }, height: { ideal: e2.resolution.height }, frameRate: e2.resolution.frameRate })), { audio: null !== (n2 = e2.audio) && void 0 !== n2 && n2, video: i2, controller: e2.controller, selfBrowserSurface: e2.selfBrowserSurface, surfaceSwitching: e2.surfaceSwitching, systemAudio: e2.systemAudio, preferCurrentTab: e2.preferCurrentTab };
  }
  function xs(e2) {
    return e2.split("/")[1].toLowerCase();
  }
  function Us(e2) {
    const t2 = [];
    return e2.forEach(((e3) => {
      void 0 !== e3.track && t2.push(new ni({ cid: e3.track.mediaStreamID, track: e3.trackInfo }));
    })), t2;
  }
  function Fs(e2) {
    return "mediaStreamTrack" in e2 ? { trackID: e2.sid, source: e2.source, muted: e2.isMuted, enabled: e2.mediaStreamTrack.enabled, kind: e2.kind, streamID: e2.mediaStreamID, streamTrackID: e2.mediaStreamTrack.id } : { trackID: e2.trackSid, enabled: e2.isEnabled, muted: e2.isMuted, trackInfo: Object.assign({ mimeType: e2.mimeType, name: e2.trackName, encrypted: e2.isEncrypted, kind: e2.kind, source: e2.source }, e2.track ? Fs(e2.track) : {}) };
  }
  function js(e2) {
    const t2 = Object.assign({}, e2);
    let n2, i2;
    return "object" == typeof t2.audio && t2.audio.processor && (n2 = t2.audio.processor, t2.audio = Object.assign(Object.assign({}, t2.audio), { processor: void 0 })), "object" == typeof t2.video && t2.video.processor && (i2 = t2.video.processor, t2.video = Object.assign(Object.assign({}, t2.video), { processor: void 0 })), { audioProcessor: n2, videoProcessor: i2, optionsWithoutProcessor: (r2 = t2, void 0 === r2 ? r2 : "function" == typeof structuredClone ? "object" == typeof r2 && null !== r2 ? structuredClone(Object.assign({}, r2)) : structuredClone(r2) : JSON.parse(JSON.stringify(r2))) };
    var r2;
  }
  function Bs(e2, t2) {
    return e2.width * e2.height < t2.width * t2.height;
  }
  const qs = [];
  var Vs;
  e.VideoQuality = void 0, (Vs = e.VideoQuality || (e.VideoQuality = {}))[Vs.LOW = 0] = "LOW", Vs[Vs.MEDIUM = 1] = "MEDIUM", Vs[Vs.HIGH = 2] = "HIGH";
  class Ws extends wr.EventEmitter {
    get streamState() {
      return this._streamState;
    }
    setStreamState(e2) {
      this._streamState !== e2 && this.log.debug("stream state changed: ".concat(this._streamState, " -> ").concat(e2)), this._streamState = e2;
    }
    constructor(t2, n2) {
      let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      var r2;
      super(), this.attachedElements = [], this.isMuted = false, this._streamState = Ws.StreamState.Active, this.isInBackground = false, this._currentBitrate = 0, this.finalStatsLogged = false, this.log = ar, this.appVisibilityChangedListener = () => {
        this.backgroundTimeout && clearTimeout(this.backgroundTimeout), "hidden" === document.visibilityState ? this.backgroundTimeout = setTimeout((() => this.handleAppVisibilityChanged()), 5e3) : this.handleAppVisibilityChanged();
      }, this.loggerContextCb = i2.loggerContextCb, this.log = dr(null !== (r2 = i2.loggerName) && void 0 !== r2 ? r2 : e.LoggerNames.Track, (() => this.logContext)), this.setMaxListeners(100), this.kind = n2, this._mediaStreamTrack = t2, this._mediaStreamID = t2.id, this.source = Ws.Source.Unknown;
    }
    get logContext() {
      var e2;
      return Object.assign(Object.assign({}, null === (e2 = this.loggerContextCb) || void 0 === e2 ? void 0 : e2.call(this)), Fs(this));
    }
    get currentBitrate() {
      return this._currentBitrate;
    }
    get mediaStreamTrack() {
      return this._mediaStreamTrack;
    }
    get mediaStreamID() {
      return this._mediaStreamID;
    }
    attach(t2) {
      let n2 = "audio";
      this.kind === Ws.Kind.Video && (n2 = "video"), 0 === this.attachedElements.length && this.kind === Ws.Kind.Video && this.addAppVisibilityListener(), t2 || ("audio" === n2 && (qs.forEach(((e2) => {
        null !== e2.parentElement || t2 || (t2 = e2);
      })), t2 && qs.splice(qs.indexOf(t2), 1)), t2 || (t2 = document.createElement(n2))), this.attachedElements.includes(t2) || this.attachedElements.push(t2), Hs(this.mediaStreamTrack, t2);
      const i2 = t2.srcObject.getTracks(), r2 = i2.some(((e2) => "audio" === e2.kind));
      return t2.play().then((() => {
        this.emit(r2 ? e.TrackEvent.AudioPlaybackStarted : e.TrackEvent.VideoPlaybackStarted);
      })).catch(((n3) => {
        "NotAllowedError" === n3.name ? this.emit(r2 ? e.TrackEvent.AudioPlaybackFailed : e.TrackEvent.VideoPlaybackFailed, n3) : "AbortError" === n3.name ? this.log.debug("".concat(r2 ? "audio" : "video", " playback aborted, likely due to new play request")) : this.log.warn("could not playback ".concat(r2 ? "audio" : "video"), { error: n3 }), r2 && t2 && i2.some(((e2) => "video" === e2.kind)) && "NotAllowedError" === n3.name && (t2.muted = true, t2.play().catch((() => {
        })));
      })), this.emit(e.TrackEvent.ElementAttached, t2), t2;
    }
    detach(t2) {
      try {
        if (t2) {
          Ks(this.mediaStreamTrack, t2);
          const n3 = this.attachedElements.indexOf(t2);
          return n3 >= 0 && (this.attachedElements.splice(n3, 1), this.recycleElement(t2), this.emit(e.TrackEvent.ElementDetached, t2)), t2;
        }
        const n2 = [];
        return this.attachedElements.forEach(((t3) => {
          Ks(this.mediaStreamTrack, t3), n2.push(t3), this.recycleElement(t3), this.emit(e.TrackEvent.ElementDetached, t3);
        })), this.attachedElements = [], n2;
      } finally {
        0 === this.attachedElements.length && this.removeAppVisibilityListener();
      }
    }
    stop() {
      this.log.debug("stopping track"), this.stopMonitor(), this._mediaStreamTrack.stop();
    }
    enable() {
      this._mediaStreamTrack.enabled = true;
    }
    disable() {
      this._mediaStreamTrack.enabled = false;
    }
    stopMonitor() {
      this.monitorInterval && clearInterval(this.monitorInterval), void 0 !== this.timeSyncHandle && (cancelAnimationFrame(this.timeSyncHandle), this.timeSyncHandle = void 0), this.logFinalStats();
    }
    logFinalStats() {
      this.finalStatsLogged || (this.finalStatsLogged = true, this.getRTCStatsReport().then(((e2) => {
        e2 && this.log.info("final track stats", vs(e2));
      })).catch(((e2) => this.log.debug("could not collect final track stats", { error: e2 }))));
    }
    updateLoggerOptions(e2) {
      e2.loggerContextCb && (this.loggerContextCb = e2.loggerContextCb), e2.loggerName && (this.log = dr(e2.loggerName, (() => this.logContext)));
    }
    recycleElement(e2) {
      if (e2 instanceof HTMLAudioElement) {
        let t2 = true;
        e2.pause(), qs.forEach(((e3) => {
          e3.parentElement || (t2 = false);
        })), t2 && qs.push(e2);
      }
    }
    handleAppVisibilityChanged() {
      return kr(this, void 0, void 0, (function* () {
        this.isInBackground = "hidden" === document.visibilityState, this.isInBackground || this.kind !== Ws.Kind.Video || setTimeout((() => this.attachedElements.forEach(((e2) => e2.play().catch((() => {
        }))))), 0);
      }));
    }
    addAppVisibilityListener() {
      pa() ? (this.isInBackground = "hidden" === document.visibilityState, document.addEventListener("visibilitychange", this.appVisibilityChangedListener)) : this.isInBackground = false;
    }
    removeAppVisibilityListener() {
      pa() && document.removeEventListener("visibilitychange", this.appVisibilityChangedListener);
    }
  }
  function Hs(e2, t2) {
    let n2, i2;
    n2 = t2.srcObject instanceof MediaStream ? t2.srcObject : new MediaStream(), i2 = "audio" === e2.kind ? n2.getAudioTracks() : n2.getVideoTracks(), i2.includes(e2) || (i2.forEach(((e3) => {
      n2.removeTrack(e3);
    })), n2.addTrack(e2)), ca() && t2 instanceof HTMLVideoElement || (t2.autoplay = true), t2.muted = 0 === n2.getAudioTracks().length, t2 instanceof HTMLVideoElement && (t2.playsInline = true), t2.srcObject !== n2 && (t2.srcObject = n2, (ca() || oa()) && t2 instanceof HTMLVideoElement && setTimeout((() => {
      t2.srcObject = n2, t2.play().catch((() => {
      }));
    }), 0));
  }
  function Ks(e2, t2) {
    if (t2.srcObject instanceof MediaStream) {
      const n2 = t2.srcObject;
      n2.removeTrack(e2), n2.getTracks().length > 0 ? t2.srcObject = n2 : t2.srcObject = null;
    }
  }
  !(function(e2) {
    let t2, n2, i2;
    !(function(e3) {
      e3.Audio = "audio", e3.Video = "video", e3.Unknown = "unknown";
    })(t2 = e2.Kind || (e2.Kind = {})), (function(e3) {
      e3.Camera = "camera", e3.Microphone = "microphone", e3.ScreenShare = "screen_share", e3.ScreenShareAudio = "screen_share_audio", e3.Unknown = "unknown";
    })(n2 = e2.Source || (e2.Source = {})), (function(e3) {
      e3.Active = "active", e3.Paused = "paused", e3.Unknown = "unknown";
    })(i2 = e2.StreamState || (e2.StreamState = {})), e2.kindToProto = function(e3) {
      switch (e3) {
        case t2.Audio:
          return nt.AUDIO;
        case t2.Video:
          return nt.VIDEO;
        default:
          return nt.DATA;
      }
    }, e2.kindFromProto = function(e3) {
      switch (e3) {
        case nt.AUDIO:
          return t2.Audio;
        case nt.VIDEO:
          return t2.Video;
        default:
          return t2.Unknown;
      }
    }, e2.sourceToProto = function(e3) {
      switch (e3) {
        case n2.Camera:
          return it.CAMERA;
        case n2.Microphone:
          return it.MICROPHONE;
        case n2.ScreenShare:
          return it.SCREEN_SHARE;
        case n2.ScreenShareAudio:
          return it.SCREEN_SHARE_AUDIO;
        default:
          return it.UNKNOWN;
      }
    }, e2.sourceFromProto = function(e3) {
      switch (e3) {
        case it.CAMERA:
          return n2.Camera;
        case it.MICROPHONE:
          return n2.Microphone;
        case it.SCREEN_SHARE:
          return n2.ScreenShare;
        case it.SCREEN_SHARE_AUDIO:
          return n2.ScreenShareAudio;
        default:
          return n2.Unknown;
      }
    }, e2.streamStateFromProto = function(e3) {
      switch (e3) {
        case Bn.ACTIVE:
          return i2.Active;
        case Bn.PAUSED:
          return i2.Paused;
        default:
          return i2.Unknown;
      }
    };
  })(Ws || (Ws = {}));
  const zs = "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension";
  function Gs(e2) {
    const t2 = e2.split("|");
    return t2.length > 1 ? [t2[0], e2.substr(t2[0].length + 1)] : [e2, ""];
  }
  function Js(e2) {
    return new No(((t2) => ls.setTimeout(t2, e2)));
  }
  function Qs() {
    return "addTransceiver" in RTCPeerConnection.prototype;
  }
  function Ys() {
    return "addTrack" in RTCPeerConnection.prototype;
  }
  function Xs() {
    if (!("getCapabilities" in RTCRtpSender)) return false;
    if (ca() || oa()) return false;
    const e2 = RTCRtpSender.getCapabilities("video");
    let t2 = false;
    if (e2) {
      for (const n2 of e2.codecs) if ("video/av1" === n2.mimeType.toLowerCase()) {
        t2 = true;
        break;
      }
    }
    return t2;
  }
  function Zs() {
    if (!("getCapabilities" in RTCRtpSender)) return false;
    if (oa()) return false;
    if (ca()) {
      const e3 = Fo();
      if ((null == e3 ? void 0 : e3.version) && ba(e3.version, "16") < 0) return false;
      if ("iOS" === (null == e3 ? void 0 : e3.os) && (null == e3 ? void 0 : e3.osVersion) && ba(e3.osVersion, "16") < 0) return false;
    }
    const e2 = RTCRtpSender.getCapabilities("video");
    let t2 = false;
    if (e2) {
      for (const n2 of e2.codecs) if ("video/vp9" === n2.mimeType.toLowerCase()) {
        t2 = true;
        break;
      }
    }
    return t2;
  }
  function $s(e2) {
    return "av1" === e2 || "vp9" === e2;
  }
  function ea(e2) {
    var t2;
    const i2 = null === (t2 = e2.getHeaderExtensionsToNegotiate) || void 0 === t2 ? void 0 : t2.call(e2);
    if (!i2 || !e2.setHeaderExtensionsToNegotiate) return false;
    const r2 = i2.find(((e3) => e3.uri === zs));
    if (!r2) return false;
    if ("stopped" !== r2.direction) return true;
    r2.direction = "sendrecv";
    try {
      return e2.setHeaderExtensionsToNegotiate(i2), true;
    } catch (n2) {
      return false;
    }
  }
  function ta(e2, t2) {
    var n2;
    return $s(e2) && !!(null == t2 ? void 0 : t2.simulcast) && !!(null === (n2 = t2.scalabilityMode) || void 0 === n2 ? void 0 : n2.startsWith("L1T"));
  }
  function na() {
    const e2 = Fo();
    return da() || ma() || "Chrome" === (null == e2 ? void 0 : e2.name) && ba(e2.version, "113") < 0;
  }
  function ia(e2) {
    return !(!document || da()) && (e2 || (e2 = document.createElement("audio")), "setSinkId" in e2);
  }
  function ra() {
    return "undefined" != typeof RTCPeerConnection && (Qs() || Ys());
  }
  function oa() {
    var e2;
    return "Firefox" === (null === (e2 = Fo()) || void 0 === e2 ? void 0 : e2.name);
  }
  function sa() {
    const e2 = Fo();
    return !!e2 && "Chrome" === e2.name && "iOS" !== e2.os;
  }
  function aa() {
    return "undefined" != typeof window && void 0 !== window.RTCRtpScriptTransform && !sa();
  }
  function ca() {
    var e2;
    return "Safari" === (null === (e2 = Fo()) || void 0 === e2 ? void 0 : e2.name);
  }
  function da() {
    const e2 = Fo();
    return "Safari" === (null == e2 ? void 0 : e2.name) || "iOS" === (null == e2 ? void 0 : e2.os);
  }
  function la() {
    var e2;
    return "iOS" === (null === (e2 = Fo()) || void 0 === e2 ? void 0 : e2.os) || (function() {
      if (!pa()) return false;
      const e3 = Fo();
      return "Safari" === (null == e3 ? void 0 : e3.name) && "macOS" === (null == e3 ? void 0 : e3.os) && navigator.maxTouchPoints > 1;
    })();
  }
  function ua() {
    const e2 = Fo();
    return "Safari" === (null == e2 ? void 0 : e2.name) && e2.version.startsWith("17.") || "iOS" === (null == e2 ? void 0 : e2.os) && !!(null == e2 ? void 0 : e2.osVersion) && ba(e2.osVersion, "17") >= 0;
  }
  function ha() {
    var e2, t2;
    return !!pa() && (null !== (t2 = null === (e2 = navigator.userAgentData) || void 0 === e2 ? void 0 : e2.mobile) && void 0 !== t2 ? t2 : /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent));
  }
  function pa() {
    return "undefined" != typeof document;
  }
  function ma() {
    return "ReactNative" == navigator.product;
  }
  function ga(e2) {
    return e2.hostname.endsWith(".livekit.cloud") || e2.hostname.endsWith(".livekit.run");
  }
  function va(e2) {
    return ga(e2) ? e2.hostname.split(".")[0] : null;
  }
  function fa() {
    if (global && global.LiveKitReactNativeGlobal) return global.LiveKitReactNativeGlobal;
  }
  function ka() {
    if (!ma()) return;
    let e2 = fa();
    return e2 ? e2.platform : void 0;
  }
  function ya() {
    if (pa()) return window.devicePixelRatio;
    if (ma()) {
      let e2 = fa();
      if (e2) return e2.devicePixelRatio;
    }
    return 1;
  }
  function ba(e2, t2) {
    const n2 = e2.split("."), i2 = t2.split("."), r2 = Math.min(n2.length, i2.length);
    for (let o2 = 0; o2 < r2; ++o2) {
      const e3 = parseInt(n2[o2], 10), t3 = parseInt(i2[o2], 10);
      if (e3 > t3) return 1;
      if (e3 < t3) return -1;
      if (o2 === r2 - 1 && e3 === t3) return 0;
    }
    return "" === e2 && "" !== t2 ? -1 : "" === t2 ? 1 : n2.length == i2.length ? 0 : n2.length < i2.length ? -1 : 1;
  }
  function Ta(e2) {
    for (const t2 of e2) t2.target.handleResize(t2);
  }
  function Sa(e2) {
    for (const t2 of e2) t2.target.handleVisibilityChanged(t2);
  }
  let Ea = null;
  const Ca = () => (Ea || (Ea = new ResizeObserver(Ta)), Ea);
  let wa = null;
  const Ra = () => (wa || (wa = new IntersectionObserver(Sa, { root: null, rootMargin: "0px" })), wa);
  let Pa, Ia, _a;
  function Ma() {
    let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 16, n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    const r2 = document.createElement("canvas");
    r2.width = e2, r2.height = t2;
    const o2 = r2.getContext("2d");
    null == o2 || o2.fillRect(0, 0, r2.width, r2.height), i2 && o2 && (o2.beginPath(), o2.arc(e2 / 2, t2 / 2, 50, 0, 2 * Math.PI, true), o2.closePath(), o2.fillStyle = "grey", o2.fill());
    const s2 = j(r2.captureStream().getTracks(), 1)[0];
    if (!s2) throw Error("Could not get empty media stream video track");
    return s2.enabled = n2, s2;
  }
  const Da = /* @__PURE__ */ new Set();
  function Oa() {
    if (!Ia) {
      const t3 = new AudioContext(), n2 = t3.createOscillator(), i2 = t3.createGain();
      i2.gain.setValueAtTime(0, 0);
      const r2 = t3.createMediaStreamDestination();
      n2.connect(i2), i2.connect(r2), n2.start();
      var e2 = j(r2.stream.getAudioTracks(), 1);
      if (Ia = e2[0], !Ia) throw t3.close().catch((() => {
      })), Error("Could not get empty media stream audio track");
      Ia.enabled = false, _a = t3;
    }
    const t2 = Ia.clone();
    return Da.add(t2), t2;
  }
  function Aa(e2) {
    return kr(this, void 0, void 0, (function* () {
      if (!Da.delete(e2)) return;
      if (e2.stop(), Da.size > 0) return;
      const t2 = _a;
      null == Ia || Ia.stop(), Ia = void 0, _a = void 0, yield null == t2 ? void 0 : t2.close();
    }));
  }
  class La {
    get isResolved() {
      return this._isResolved;
    }
    constructor(e2, t2) {
      this._isResolved = false, this.onFinally = t2, this.promise = new Promise(((t3, n2) => kr(this, void 0, void 0, (function* () {
        this.resolve = t3, this.reject = n2, e2 && (yield e2(t3, n2));
      })))).finally((() => {
        var e3;
        this._isResolved = true, null === (e3 = this.onFinally) || void 0 === e3 || e3.call(this);
      }));
    }
  }
  function Na(e2) {
    return bs.includes(e2);
  }
  function xa(e2) {
    if ("string" == typeof e2 || "number" == typeof e2) return e2;
    if (Array.isArray(e2)) return e2[0];
    if (void 0 !== e2.exact) return Array.isArray(e2.exact) ? e2.exact[0] : e2.exact;
    if (void 0 !== e2.ideal) return Array.isArray(e2.ideal) ? e2.ideal[0] : e2.ideal;
    throw Error("could not unwrap constraint");
  }
  const Ua = /* @__PURE__ */ new WeakSet();
  function Fa(e2) {
    return e2.startsWith("ws") ? e2.replace(/^(ws)/, "http") : e2;
  }
  function ja(t2) {
    switch (t2.reason) {
      case e.ConnectionErrorReason.LeaveRequest:
        return t2.context;
      case e.ConnectionErrorReason.Cancelled:
        return at.CLIENT_INITIATED;
      case e.ConnectionErrorReason.NotAllowed:
        return at.USER_REJECTED;
      case e.ConnectionErrorReason.ServerUnreachable:
        return at.JOIN_FAILURE;
      default:
        return at.UNKNOWN_REASON;
    }
  }
  function Ba(e2) {
    return void 0 !== e2 ? Number(e2) : void 0;
  }
  function qa(e2) {
    return void 0 !== e2 ? BigInt(e2) : void 0;
  }
  function Va(e2) {
    return !!e2 && !(e2 instanceof MediaStreamTrack) && e2.isLocal;
  }
  function Wa(e2) {
    return !!e2 && e2.kind == Ws.Kind.Audio;
  }
  function Ha(e2) {
    return !!e2 && e2.kind == Ws.Kind.Video;
  }
  function Ka(e2) {
    return Va(e2) && Ha(e2);
  }
  function za(e2) {
    return Va(e2) && Wa(e2);
  }
  function Ga(e2) {
    return !!e2 && !e2.isLocal;
  }
  function Ja(e2) {
    return !!e2 && !e2.isLocal;
  }
  function Qa(e2) {
    return Ga(e2) && Ha(e2);
  }
  function Ya(e2) {
    return e2.isLocal;
  }
  function Xa(e2) {
    return new ReadableStream({ start(t2) {
      t2.enqueue(e2), t2.close();
    } });
  }
  function Za() {
    return "undefined" != typeof CompressionStream;
  }
  let $a = null;
  function ec() {
    return "boolean" != typeof $a && ($a = (function() {
      if ("undefined" == typeof CompressionStream || "undefined" == typeof DecompressionStream) return false;
      try {
        return new CompressionStream("deflate-raw"), new DecompressionStream("deflate-raw"), true;
      } catch (Oo2) {
        return false;
      }
    })()), $a;
  }
  function tc(e2, t2) {
    const n2 = j(Gs(t2.id), 2)[1];
    return (null == n2 ? void 0 : n2.startsWith("TR")) ? n2 : e2.id.startsWith("TR") ? e2.id : void 0;
  }
  function nc(e2, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    const i2 = (function(e3, t3) {
      const n3 = new URL((function(e4) {
        return e4.startsWith("http") ? e4.replace(/^(http)/, "ws") : e4;
      })(e3));
      return t3.forEach(((e4, t4) => {
        n3.searchParams.set(t4, e4);
      })), rc(n3, "rtc");
    })(e2, t2);
    return n2 ? i2 : rc(i2, "v1");
  }
  function ic(e2) {
    return e2.endsWith("/") ? e2 : "".concat(e2, "/");
  }
  function rc(e2, t2) {
    return e2.pathname = "".concat(ic(e2.pathname)).concat(t2), e2;
  }
  function oc(e2) {
    if ("string" == typeof e2) return Wn.fromJson(JSON.parse(e2), { ignoreUnknownFields: true });
    if (e2 instanceof ArrayBuffer) return Wn.fromBinary(new Uint8Array(e2));
    throw new Error("could not decode websocket message: ".concat(typeof e2));
  }
  const sc = "AES-GCM", ac = "lk_e2ee", cc = "lk_e2ee_track_id", dc = { sharedKey: false, ratchetSalt: "LKFrameEncryptionKey", ratchetWindowSize: 8, failureTolerance: 10, keyringSize: 16, keySize: 128 };
  var lc, uc;
  function hc() {
    return mc() || pc();
  }
  function pc() {
    return "undefined" != typeof window && void 0 !== window.RTCRtpScriptTransform;
  }
  function mc() {
    return "undefined" != typeof window && void 0 !== window.RTCRtpSender && void 0 !== window.RTCRtpSender.prototype.createEncodedStreams;
  }
  function gc(e2) {
    return kr(this, void 0, void 0, (function* () {
      let t2 = new TextEncoder();
      return yield crypto.subtle.importKey("raw", t2.encode(e2), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
    }));
  }
  function vc(e2) {
    return kr(this, void 0, void 0, (function* () {
      return yield crypto.subtle.importKey("raw", e2, "HKDF", false, ["deriveBits", "deriveKey"]);
    }));
  }
  function fc(e2, t2) {
    const n2 = new TextEncoder().encode(t2);
    switch (e2) {
      case "HKDF":
        return { name: "HKDF", salt: n2, hash: "SHA-256", info: new ArrayBuffer(128) };
      case "PBKDF2":
        return { name: "PBKDF2", salt: n2, hash: "SHA-256", iterations: 1e5 };
      default:
        throw new Error("algorithm ".concat(e2, " is currently unsupported"));
    }
  }
  e.KeyProviderEvent = void 0, (lc = e.KeyProviderEvent || (e.KeyProviderEvent = {})).SetKey = "setKey", lc.RatchetRequest = "ratchetRequest", lc.KeyRatcheted = "keyRatcheted", e.KeyHandlerEvent = void 0, (e.KeyHandlerEvent || (e.KeyHandlerEvent = {})).KeyRatcheted = "keyRatcheted", e.EncryptionEvent = void 0, (uc = e.EncryptionEvent || (e.EncryptionEvent = {})).ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", uc.EncryptionError = "encryptionError", e.CryptorEvent = void 0, (e.CryptorEvent || (e.CryptorEvent = {})).Error = "cryptorError";
  function kc(e2) {
    var t2, n2, i2, r2, o2;
    if ("sipDtmf" !== (null === (t2 = e2.value) || void 0 === t2 ? void 0 : t2.case) && "metrics" !== (null === (n2 = e2.value) || void 0 === n2 ? void 0 : n2.case) && "speaker" !== (null === (i2 = e2.value) || void 0 === i2 ? void 0 : i2.case) && "transcription" !== (null === (r2 = e2.value) || void 0 === r2 ? void 0 : r2.case) && "encryptedPacket" !== (null === (o2 = e2.value) || void 0 === o2 ? void 0 : o2.case)) return new xt({ value: e2.value });
  }
  class yc extends wr.EventEmitter {
    constructor() {
      let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      super(), this.latestManuallySetKeyIndex = 0, this.onKeyRatcheted = (e2, t3, n2) => {
        ar.debug("key ratcheted event received", { ratchetResult: e2, participantId: t3, keyIndex: n2 });
      }, this.keyInfoMap = /* @__PURE__ */ new Map(), this.options = Object.assign(Object.assign({}, dc), t2), this.on(e.KeyProviderEvent.KeyRatcheted, this.onKeyRatcheted);
    }
    onSetEncryptionKey(t2, n2, i2) {
      const r2 = { key: t2, participantIdentity: n2, keyIndex: i2 };
      if (!this.options.sharedKey && !n2) throw new Error("participant identity needs to be passed for encryption key if sharedKey option is false");
      this.keyInfoMap.set("".concat(null != n2 ? n2 : "shared", "-").concat(null != i2 ? i2 : 0), r2), void 0 !== i2 && (this.latestManuallySetKeyIndex = i2), this.emit(e.KeyProviderEvent.SetKey, r2, void 0 !== i2);
    }
    getKeys() {
      return Array.from(this.keyInfoMap.values());
    }
    getLatestManuallySetKeyIndex() {
      return this.latestManuallySetKeyIndex;
    }
    getOptions() {
      return this.options;
    }
    ratchetKey(t2, n2) {
      this.emit(e.KeyProviderEvent.RatchetRequest, t2, n2);
    }
  }
  var bc;
  e.CryptorErrorReason = void 0, (bc = e.CryptorErrorReason || (e.CryptorErrorReason = {}))[bc.InvalidKey = 0] = "InvalidKey", bc[bc.MissingKey = 1] = "MissingKey", bc[bc.InternalError = 2] = "InternalError";
  class Tc extends Wo {
    constructor(t2) {
      let n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e.CryptorErrorReason.InternalError, i2 = arguments.length > 2 ? arguments[2] : void 0;
      super(40, t2), this.reason = n2, this.participantIdentity = i2;
    }
  }
  function Sc() {
    return aa();
  }
  function Ec(e2) {
    return !!(null == e2 ? void 0 : e2.worker) && (mc() || Sc());
  }
  function Cc(e2) {
    return !(!(null == e2 ? void 0 : e2.timestamp) && !(null == e2 ? void 0 : e2.frameId));
  }
  function wc(e2) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50, n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var i2, r2;
    let o2;
    const s2 = null !== (i2 = n2.isImmediate) && void 0 !== i2 && i2, a2 = null !== (r2 = n2.callback) && void 0 !== r2 && r2, c2 = n2.maxWait;
    let d2 = Date.now(), l2 = [];
    const u2 = function() {
      for (var n3 = arguments.length, i3 = new Array(n3), r3 = 0; r3 < n3; r3++) i3[r3] = arguments[r3];
      const u3 = this;
      return new Promise(((n4, r4) => {
        const h2 = s2 && void 0 === o2;
        if (void 0 !== o2 && ls.clearTimeout(o2), o2 = ls.setTimeout((function() {
          if (o2 = void 0, d2 = Date.now(), !s2) {
            const t3 = e2.apply(u3, i3);
            a2 && a2(t3), l2.forEach(((e3) => (0, e3.resolve)(t3))), l2 = [];
          }
        }), (function() {
          if (void 0 !== c2) {
            const e3 = Date.now() - d2;
            if (e3 + t2 >= c2) return c2 - e3;
          }
          return t2;
        })()), h2) {
          const t3 = e2.apply(u3, i3);
          return a2 && a2(t3), n4(t3);
        }
        l2.push({ resolve: n4, reject: r4 });
      }));
    };
    return u2.cancel = function(e3) {
      void 0 !== o2 && ls.clearTimeout(o2), l2.forEach(((t3) => (0, t3.reject)(e3))), l2 = [];
    }, u2;
  }
  const Rc = 2e3;
  function Pc(e2, t2) {
    if (!t2) return 0;
    let n2, i2;
    return "bytesReceived" in e2 ? (n2 = e2.bytesReceived, i2 = t2.bytesReceived) : "bytesSent" in e2 && (n2 = e2.bytesSent, i2 = t2.bytesSent), void 0 === n2 || void 0 === i2 || void 0 === e2.timestamp || void 0 === t2.timestamp ? 0 : 8 * (n2 - i2) * 1e3 / (e2.timestamp - t2.timestamp);
  }
  class Ic extends Ws {
    constructor(t2, n2, i2, r2, o2) {
      super(t2, i2, o2), this.timeSyncLoop = () => {
        var t3;
        if (0 === this.listenerCount(e.TrackEvent.TimeSyncUpdate)) return void (this.timeSyncHandle = void 0);
        this.timeSyncHandle = requestAnimationFrame(this.timeSyncLoop);
        const n3 = null === (t3 = this.receiver) || void 0 === t3 ? void 0 : t3.getSynchronizationSources()[0];
        if (n3) {
          const t4 = n3.timestamp, i3 = n3.rtpTimestamp;
          i3 && this.rtpTimestamp !== i3 && (this.emit(e.TrackEvent.TimeSyncUpdate, { timestamp: t4, rtpTimestamp: i3 }), this.rtpTimestamp = i3);
        }
      }, this.onTimeSyncListenerAdded = (t3) => {
        t3 === e.TrackEvent.TimeSyncUpdate && void 0 === this.timeSyncHandle && (this.timeSyncHandle = requestAnimationFrame(this.timeSyncLoop));
      }, this.sid = n2, this.receiver = r2;
    }
    get isLocal() {
      return false;
    }
    setMuted(t2) {
      this.isMuted !== t2 && (this.isMuted = t2, this._mediaStreamTrack.enabled = !t2, this.emit(t2 ? e.TrackEvent.Muted : e.TrackEvent.Unmuted, this));
    }
    setMediaStream(t2) {
      this.mediaStream = t2;
      const n2 = (i2) => {
        i2.track === this._mediaStreamTrack && (t2.removeEventListener("removetrack", n2), this.receiver && "playoutDelayHint" in this.receiver && (this.receiver.playoutDelayHint = void 0), this.receiver = void 0, this._currentBitrate = 0, this.emit(e.TrackEvent.Ended, this));
      };
      t2.addEventListener("removetrack", n2);
    }
    start() {
      this.startMonitor(), super.enable();
    }
    stop() {
      this.stopMonitor(), super.disable();
    }
    getRTCStatsReport() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!(null === (e2 = this.receiver) || void 0 === e2 ? void 0 : e2.getStats)) return;
        return yield this.receiver.getStats();
      }));
    }
    setPlayoutDelay(e2) {
      this.receiver ? "playoutDelayHint" in this.receiver ? this.receiver.playoutDelayHint = e2 : this.log.warn("Playout delay not supported in this browser") : this.log.warn("Cannot set playout delay, track already ended");
    }
    getPlayoutDelay() {
      if (this.receiver) {
        if ("playoutDelayHint" in this.receiver) return this.receiver.playoutDelayHint;
        this.log.warn("Playout delay not supported in this browser");
      } else this.log.warn("Cannot get playout delay, track already ended");
      return 0;
    }
    startMonitor() {
      this.monitorInterval || (this.monitorInterval = setInterval((() => this.monitorReceiver()), Rc)), "undefined" != typeof RTCRtpReceiver && "function" == typeof RTCRtpReceiver.prototype.getSynchronizationSources && this.registerTimeSyncUpdate();
    }
    stopMonitor() {
      super.stopMonitor(), this.off("newListener", this.onTimeSyncListenerAdded);
    }
    registerTimeSyncUpdate() {
      this.off("newListener", this.onTimeSyncListenerAdded), this.on("newListener", this.onTimeSyncListenerAdded), void 0 === this.timeSyncHandle && this.timeSyncLoop();
    }
  }
  class _c extends Ic {
    constructor(e2, t2, n2, i2, r2) {
      super(e2, t2, Ws.Kind.Video, n2, r2), this.elementInfos = [], this.monitorReceiver = () => kr(this, void 0, void 0, (function* () {
        if (!this.receiver) return void (this._currentBitrate = 0);
        const e3 = yield this.getReceiverStats();
        e3 && this.prevStats && this.receiver && (this._currentBitrate = Pc(e3, this.prevStats)), this.prevStats = e3;
      })), this.debouncedHandleResize = wc((() => {
        this.updateDimensions();
      }), 100), this.adaptiveStreamSettings = i2;
    }
    get isAdaptiveStream() {
      return void 0 !== this.adaptiveStreamSettings;
    }
    lookupFrameMetadata(e2) {
      let t2 = e2.rtpTimestamp;
      var n2;
      return null === (n2 = this.frameMetadataExtractor) || void 0 === n2 ? void 0 : n2.lookupMetadata(t2);
    }
    setStreamState(e2) {
      super.setStreamState(e2), this.log.debug("setStreamState", e2), this.isAdaptiveStream && e2 === Ws.StreamState.Active && this.updateVisibility();
    }
    get mediaStreamTrack() {
      return this._mediaStreamTrack;
    }
    setMuted(e2) {
      super.setMuted(e2), this.attachedElements.forEach(((t2) => {
        e2 ? Ks(this._mediaStreamTrack, t2) : Hs(this._mediaStreamTrack, t2);
      }));
    }
    attach(e2) {
      if (e2 ? super.attach(e2) : e2 = super.attach(), this.adaptiveStreamSettings && void 0 === this.elementInfos.find(((t2) => t2.element === e2))) {
        const t2 = new Mc(e2);
        this.observeElementInfo(t2);
      }
      return e2;
    }
    observeElementInfo(e2) {
      this.adaptiveStreamSettings && void 0 === this.elementInfos.find(((t2) => t2 === e2)) ? (e2.handleResize = () => {
        this.debouncedHandleResize();
      }, e2.handleVisibilityChanged = () => {
        this.updateVisibility();
      }, this.elementInfos.push(e2), e2.observe(), this.debouncedHandleResize(), this.updateVisibility()) : this.log.warn("visibility resize observer not triggered", this.logContext);
    }
    stopObservingElementInfo(e2) {
      if (!this.isAdaptiveStream) return void this.log.warn("stopObservingElementInfo ignored", this.logContext);
      const t2 = this.elementInfos.filter(((t3) => t3 === e2));
      for (const n2 of t2) n2.stopObserving();
      this.elementInfos = this.elementInfos.filter(((t3) => t3 !== e2)), this.updateVisibility(), this.debouncedHandleResize();
    }
    detach(e2) {
      if (e2) return this.stopObservingElement(e2), super.detach(e2);
      const t2 = super.detach();
      for (const n2 of t2) this.stopObservingElement(n2);
      return t2;
    }
    getDecoderImplementation() {
      var e2;
      return null === (e2 = this.prevStats) || void 0 === e2 ? void 0 : e2.decoderImplementation;
    }
    getReceiverStats() {
      return kr(this, void 0, void 0, (function* () {
        if (!this.receiver || !this.receiver.getStats) return;
        const e2 = yield this.receiver.getStats();
        let t2, n2 = "", i2 = /* @__PURE__ */ new Map();
        return e2.forEach(((e3) => {
          "inbound-rtp" === e3.type ? (n2 = e3.codecId, t2 = { type: "video", streamId: e3.id, framesDecoded: e3.framesDecoded, framesDropped: e3.framesDropped, framesReceived: e3.framesReceived, packetsReceived: e3.packetsReceived, packetsLost: e3.packetsLost, frameWidth: e3.frameWidth, frameHeight: e3.frameHeight, pliCount: e3.pliCount, firCount: e3.firCount, nackCount: e3.nackCount, jitter: e3.jitter, timestamp: e3.timestamp, bytesReceived: e3.bytesReceived, decoderImplementation: e3.decoderImplementation }) : "codec" === e3.type && i2.set(e3.id, e3);
        })), t2 && "" !== n2 && i2.get(n2) && (t2.mimeType = i2.get(n2).mimeType), t2;
      }));
    }
    stopObservingElement(e2) {
      const t2 = this.elementInfos.filter(((t3) => t3.element === e2));
      for (const n2 of t2) this.stopObservingElementInfo(n2);
    }
    handleAppVisibilityChanged() {
      const e2 = Object.create(null, { handleAppVisibilityChanged: { get: () => super.handleAppVisibilityChanged } });
      return kr(this, void 0, void 0, (function* () {
        yield e2.handleAppVisibilityChanged.call(this), this.isAdaptiveStream && this.updateVisibility();
      }));
    }
    updateVisibility(t2) {
      var n2, i2;
      const r2 = this.elementInfos.reduce(((e2, t3) => Math.max(e2, t3.visibilityChangedAt || 0)), 0), o2 = !(null !== (i2 = null === (n2 = this.adaptiveStreamSettings) || void 0 === n2 ? void 0 : n2.pauseVideoInBackground) && void 0 !== i2 && !i2) && this.isInBackground, s2 = this.elementInfos.some(((e2) => e2.pictureInPicture)), a2 = this.elementInfos.some(((e2) => e2.visible)) && !o2 || s2;
      (this.lastVisible !== a2 || t2) && (!a2 && Date.now() - r2 < 100 ? ls.setTimeout((() => {
        this.updateVisibility();
      }), 100) : (this.lastVisible = a2, this.emit(e.TrackEvent.VisibilityChanged, a2, this)));
    }
    updateDimensions() {
      var t2, n2;
      let i2 = 0, r2 = 0;
      const o2 = this.getPixelDensity();
      for (const e2 of this.elementInfos) {
        const t3 = e2.width() * o2, n3 = e2.height() * o2;
        t3 + n3 > i2 + r2 && (i2 = t3, r2 = n3);
      }
      (null === (t2 = this.lastDimensions) || void 0 === t2 ? void 0 : t2.width) === i2 && (null === (n2 = this.lastDimensions) || void 0 === n2 ? void 0 : n2.height) === r2 || (this.lastDimensions = { width: i2, height: r2 }, this.emit(e.TrackEvent.VideoDimensionsChanged, this.lastDimensions, this));
    }
    getPixelDensity() {
      var e2;
      const t2 = null === (e2 = this.adaptiveStreamSettings) || void 0 === e2 ? void 0 : e2.pixelDensity;
      if ("screen" === t2) return ya();
      if (!t2) {
        return ya() > 2 ? 2 : 1;
      }
      return t2;
    }
  }
  class Mc {
    get visible() {
      return this.isPiP || this.isIntersecting;
    }
    get pictureInPicture() {
      return this.isPiP;
    }
    constructor(e2, t2) {
      this.onVisibilityChanged = (e3) => {
        var t3;
        const n2 = e3.target, i2 = e3.isIntersecting;
        n2 === this.element && (this.isIntersecting = i2, this.isPiP = Dc(this.element), this.visibilityChangedAt = Date.now(), null === (t3 = this.handleVisibilityChanged) || void 0 === t3 || t3.call(this));
      }, this.onEnterPiP = () => {
        var e3, t3;
        null === (t3 = null === (e3 = window.documentPictureInPicture) || void 0 === e3 ? void 0 : e3.window) || void 0 === t3 || t3.addEventListener("pagehide", this.onLeavePiP), queueMicrotask((() => {
          requestAnimationFrame((() => {
            var e4;
            this.isPiP = Dc(this.element), null === (e4 = this.handleVisibilityChanged) || void 0 === e4 || e4.call(this);
          }));
        }));
      }, this.onLeavePiP = () => {
        var e3;
        this.isPiP = Dc(this.element), null === (e3 = this.handleVisibilityChanged) || void 0 === e3 || e3.call(this);
      }, this.element = e2, this.isIntersecting = null != t2 ? t2 : Oc(e2), this.isPiP = pa() && Dc(e2), this.visibilityChangedAt = 0;
    }
    width() {
      return this.element.clientWidth;
    }
    height() {
      return this.element.clientHeight;
    }
    observe() {
      var e2, t2, n2;
      this.isIntersecting = Oc(this.element), this.isPiP = Dc(this.element), this.element.handleResize = () => {
        var e3;
        null === (e3 = this.handleResize) || void 0 === e3 || e3.call(this);
      }, this.element.handleVisibilityChanged = this.onVisibilityChanged, Ra().observe(this.element), Ca().observe(this.element), this.element.addEventListener("enterpictureinpicture", this.onEnterPiP), this.element.addEventListener("leavepictureinpicture", this.onLeavePiP), null === (e2 = window.documentPictureInPicture) || void 0 === e2 || e2.addEventListener("enter", this.onEnterPiP), null === (n2 = null === (t2 = window.documentPictureInPicture) || void 0 === t2 ? void 0 : t2.window) || void 0 === n2 || n2.addEventListener("pagehide", this.onLeavePiP);
    }
    stopObserving() {
      var e2, t2, n2, i2, r2;
      null === (e2 = Ra()) || void 0 === e2 || e2.unobserve(this.element), null === (t2 = Ca()) || void 0 === t2 || t2.unobserve(this.element), this.element.removeEventListener("enterpictureinpicture", this.onEnterPiP), this.element.removeEventListener("leavepictureinpicture", this.onLeavePiP), null === (n2 = window.documentPictureInPicture) || void 0 === n2 || n2.removeEventListener("enter", this.onEnterPiP), null === (r2 = null === (i2 = window.documentPictureInPicture) || void 0 === i2 ? void 0 : i2.window) || void 0 === r2 || r2.removeEventListener("pagehide", this.onLeavePiP);
    }
  }
  function Dc(e2) {
    var t2;
    if (document.pictureInPictureElement === e2) return true;
    const n2 = null === (t2 = window.documentPictureInPicture) || void 0 === t2 ? void 0 : t2.window;
    return !!n2 && ((function(e3, t3) {
      var n3, i2, r2;
      if ((null === (n3 = e3.defaultView) || void 0 === n3 ? void 0 : n3.top) === t3) return true;
      let o2 = e3;
      for (; o2; ) {
        if (o2 === t3.document) return true;
        try {
          o2 = null === (r2 = null === (i2 = o2.defaultView) || void 0 === i2 ? void 0 : i2.frameElement) || void 0 === r2 ? void 0 : r2.ownerDocument;
        } catch (s2) {
          return false;
        }
      }
      return false;
    })(e2.ownerDocument, n2) && Oc(e2, n2));
  }
  function Oc(e2, t2) {
    const n2 = t2 || window;
    let i2 = e2.offsetTop, r2 = e2.offsetLeft;
    const o2 = e2.offsetWidth, s2 = e2.offsetHeight, a2 = e2.hidden, c2 = getComputedStyle(e2).display;
    for (; e2.offsetParent; ) i2 += (e2 = e2.offsetParent).offsetTop, r2 += e2.offsetLeft;
    return i2 < n2.pageYOffset + n2.innerHeight && r2 < n2.pageXOffset + n2.innerWidth && i2 + s2 > n2.pageYOffset && r2 + o2 > n2.pageXOffset && !a2 && "none" !== c2;
  }
  class Ac extends wr.EventEmitter {
    get logContext() {
      var e2, t2;
      return { room: null === (e2 = this.room) || void 0 === e2 ? void 0 : e2.name, participant: null === (t2 = this.room) || void 0 === t2 ? void 0 : t2.localParticipant.identity };
    }
    constructor(t2, n2) {
      super(), this.decryptDataRequests = /* @__PURE__ */ new Map(), this.encryptDataRequests = /* @__PURE__ */ new Map(), this.log = dr(e.LoggerNames.E2EE, (() => this.logContext)), this.onWorkerMessage = (t3) => {
        var n3, i2;
        const r2 = t3.data, o2 = r2.kind, s2 = r2.data;
        switch (o2) {
          case "error":
            if (s2.uuid) {
              const e2 = this.decryptDataRequests.get(s2.uuid);
              if (null == e2 ? void 0 : e2.reject) {
                e2.reject(s2.error);
                break;
              }
              const t5 = this.encryptDataRequests.get(s2.uuid);
              if (null == t5 ? void 0 : t5.reject) {
                t5.reject(s2.error);
                break;
              }
            }
            this.log.error(s2.error.message), this.emit(e.EncryptionEvent.EncryptionError, s2.error, s2.participantIdentity);
            break;
          case "initAck":
            s2.enabled && this.keyProvider.getKeys().forEach(((e2) => {
              this.postKey(e2, false);
            }));
            break;
          case "enable":
            if (s2.enabled && this.keyProvider.getKeys().forEach(((e2) => {
              this.postKey(e2, false);
            })), this.encryptionEnabled !== s2.enabled && s2.participantIdentity === (null === (n3 = this.room) || void 0 === n3 ? void 0 : n3.localParticipant.identity)) this.emit(e.EncryptionEvent.ParticipantEncryptionStatusChanged, s2.enabled, this.room.localParticipant), this.encryptionEnabled = s2.enabled;
            else if (s2.participantIdentity) {
              const t5 = null === (i2 = this.room) || void 0 === i2 ? void 0 : i2.getParticipantByIdentity(s2.participantIdentity);
              if (!t5) throw TypeError("couldn't set encryption status, participant not found".concat(s2.participantIdentity));
              this.emit(e.EncryptionEvent.ParticipantEncryptionStatusChanged, s2.enabled, t5);
            }
            break;
          case "ratchetKey":
            this.keyProvider.emit(e.KeyProviderEvent.KeyRatcheted, s2.ratchetResult, s2.participantIdentity, s2.keyIndex);
            break;
          case "decryptDataResponse":
            const t4 = this.decryptDataRequests.get(s2.uuid);
            (null == t4 ? void 0 : t4.resolve) && t4.resolve(s2);
            break;
          case "encryptDataResponse":
            const r3 = this.encryptDataRequests.get(s2.uuid);
            (null == r3 ? void 0 : r3.resolve) && r3.resolve(s2);
            break;
          case "packetTrailerMetadata":
            this.handleFrameMetadata(s2.trackId, s2.rtpTimestamp, s2.ssrc, s2.metadata);
            break;
          case "log":
            lr[s2.level](s2.msg, s2.context);
        }
      }, this.onWorkerError = (t3) => {
        this.log.error("e2ee worker encountered an error:", { error: t3.error }), this.emit(e.EncryptionEvent.EncryptionError, t3.error, void 0);
      }, this.keyProvider = t2.keyProvider, this.worker = t2.worker, this.encryptionEnabled = false, this.dataChannelEncryptionEnabled = n2;
    }
    get isEnabled() {
      return this.encryptionEnabled;
    }
    get isDataChannelEncryptionEnabled() {
      return this.isEnabled && this.dataChannelEncryptionEnabled;
    }
    setup(e2) {
      if (!hc()) throw new es("tried to setup end-to-end encryption on an unsupported browser");
      if (this.log.info("setting up e2ee"), e2 !== this.room) {
        this.room = e2, this.setupEventListeners(e2, this.keyProvider);
        const t2 = { kind: "init", data: { keyProviderOptions: this.keyProvider.getOptions(), loglevel: lr.getLevel() } };
        this.worker && (this.log.info("initializing worker", { worker: this.worker }), this.worker.onmessage = this.onWorkerMessage, this.worker.onerror = this.onWorkerError, this.worker.postMessage(t2), this.subscribeToLogLevelChanges());
      }
    }
    subscribeToLogLevelChanges() {
      var e2;
      let t2;
      if (null === (e2 = this.unsubscribeLogLevel) || void 0 === e2 || e2.call(this), Ac.disposeRegistry) {
        const e3 = new WeakRef(this.worker);
        t2 = pr(((n2) => {
          const i2 = e3.deref();
          i2 ? i2.postMessage({ kind: "setLogLevel", data: { level: n2 } }) : null == t2 || t2();
        })), Ac.disposeRegistry.register(this, t2, this);
      } else {
        const e3 = this.worker;
        t2 = pr(((t3) => {
          e3.postMessage({ kind: "setLogLevel", data: { level: t3 } });
        }));
      }
      this.unsubscribeLogLevel = t2;
    }
    dispose() {
      var t2, n2, i2;
      null === (t2 = this.unsubscribeLogLevel) || void 0 === t2 || t2.call(this), this.unsubscribeLogLevel = void 0, Ac.disposeRegistry && Ac.disposeRegistry.unregister(this);
      const r2 = new Tc("E2EEManager disposed", e.CryptorErrorReason.InternalError);
      for (const e2 of [...this.encryptDataRequests.values()]) null === (n2 = e2.reject) || void 0 === n2 || n2.call(e2, r2);
      for (const e2 of [...this.decryptDataRequests.values()]) null === (i2 = e2.reject) || void 0 === i2 || i2.call(e2, r2);
      this.worker && (this.worker.onmessage = null, this.worker.onerror = null), this.removeAllListeners();
    }
    setParticipantCryptorEnabled(e2, t2) {
      this.log.debug("set e2ee to ".concat(e2, " for participant ").concat(t2)), this.postEnable(e2, t2);
    }
    setSifTrailer(e2) {
      e2 && 0 !== e2.length ? this.postSifTrailer(e2) : this.log.warn("ignoring server sent trailer as it's empty");
    }
    handleFrameMetadata(e2, t2, n2, i2) {
      if (this.room) {
        for (const r2 of [this.room.localParticipant, ...this.room.remoteParticipants.values()]) for (const o2 of r2.trackPublications.values()) if (o2.track && o2.track.mediaStreamID === e2 && o2.track instanceof _c && o2.track.frameMetadataExtractor) return void o2.track.frameMetadataExtractor.storeMetadata(t2, n2, i2);
      }
    }
    setupEngine(t2) {
      t2.on(e.EngineEvent.RTPVideoMapUpdate, ((e2) => {
        this.postRTPMap(e2);
      }));
    }
    setupEventListeners(t2, n2) {
      t2.on(e.RoomEvent.TrackPublished, ((e2, t3) => this.setParticipantCryptorEnabledForPublication(e2, t3.identity))), t2.on(e.RoomEvent.ConnectionStateChanged, ((n3) => {
        n3 === e.ConnectionState.Connected && t2.remoteParticipants.forEach(((e2) => {
          e2.trackPublications.forEach(((t3) => {
            this.setParticipantCryptorEnabledForPublication(t3, e2.identity);
          }));
        }));
      })).on(e.RoomEvent.TrackUnsubscribed, ((e2, t3, n3) => {
        var i2;
        const r2 = { kind: "removeTransform", data: { participantIdentity: n3.identity, trackId: e2.mediaStreamID } };
        null === (i2 = this.worker) || void 0 === i2 || i2.postMessage(r2);
      })).on(e.RoomEvent.TrackSubscribed, ((e2, t3, n3) => {
        this.setupE2EEReceiver(e2, n3.identity, t3.trackInfo);
      })).on(e.RoomEvent.SignalConnected, (() => {
        if (!this.room) throw new TypeError("expected room to be present on signal connect");
        const e2 = n2.getLatestManuallySetKeyIndex();
        n2.getKeys().forEach(((t3) => {
          var n3;
          this.postKey(t3, e2 === (null !== (n3 = t3.keyIndex) && void 0 !== n3 ? n3 : 0));
        })), this.setParticipantCryptorEnabled(this.room.localParticipant.isE2EEEnabled, this.room.localParticipant.identity);
      })), t2.localParticipant.on(e.ParticipantEvent.LocalSenderCreated, ((e2, t3) => kr(this, void 0, void 0, (function* () {
        this.setupE2EESender(t3, e2);
      })))), t2.localParticipant.on(e.ParticipantEvent.LocalTrackPublished, ((e2) => {
        if (!Ha(e2.track) || !da()) return;
        const t3 = { kind: "updateCodec", data: { trackId: e2.track.mediaStreamID, codec: xs(e2.trackInfo.codecs[0].mimeType), participantIdentity: this.room.localParticipant.identity, hasPacketTrailer: false } };
        this.worker.postMessage(t3);
      })), n2.on(e.KeyProviderEvent.SetKey, ((e2, t3) => this.postKey(e2, null == t3 || t3))).on(e.KeyProviderEvent.RatchetRequest, ((e2, t3) => this.postRatchetRequest(e2, t3)));
    }
    encryptData(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.worker) throw Error("could not encrypt data, worker is missing");
        const t2 = crypto.randomUUID(), n2 = { kind: "encryptDataRequest", data: { uuid: t2, payload: e2, participantIdentity: this.room.localParticipant.identity } }, i2 = new La();
        return i2.onFinally = () => {
          this.encryptDataRequests.delete(t2);
        }, this.encryptDataRequests.set(t2, i2), this.worker.postMessage(n2), i2.promise;
      }));
    }
    handleEncryptedData(e2, t2, n2, i2) {
      if (!this.worker) throw Error("could not handle encrypted data, worker is missing");
      const r2 = crypto.randomUUID(), o2 = { kind: "decryptDataRequest", data: { uuid: r2, payload: e2, iv: t2, participantIdentity: n2, keyIndex: i2 } }, s2 = new La();
      return s2.onFinally = () => {
        this.decryptDataRequests.delete(r2);
      }, this.decryptDataRequests.set(r2, s2), this.worker.postMessage(o2), s2.promise;
    }
    postRatchetRequest(e2, t2) {
      if (!this.worker) throw Error("could not ratchet key, worker is missing");
      const n2 = { kind: "ratchetRequest", data: { participantIdentity: e2, keyIndex: t2 } };
      this.worker.postMessage(n2);
    }
    postKey(e2, t2) {
      let n2 = e2.key, i2 = e2.participantIdentity, r2 = e2.keyIndex;
      var o2;
      if (!this.worker) throw Error("could not set key, worker is missing");
      const s2 = { kind: "setKey", data: { participantIdentity: i2, isPublisher: i2 === (null === (o2 = this.room) || void 0 === o2 ? void 0 : o2.localParticipant.identity), key: n2, keyIndex: r2, updateCurrentKeyIndex: t2 } };
      this.worker.postMessage(s2);
    }
    postEnable(e2, t2) {
      if (!this.worker) throw new ReferenceError("failed to enable e2ee, worker is not ready");
      {
        const n2 = { kind: "enable", data: { enabled: e2, participantIdentity: t2 } };
        this.worker.postMessage(n2);
      }
    }
    postRTPMap(e2) {
      var t2;
      if (!this.worker) throw TypeError("could not post rtp map, worker is missing");
      if (!(null === (t2 = this.room) || void 0 === t2 ? void 0 : t2.localParticipant.identity)) throw TypeError("could not post rtp map, local participant identity is missing");
      const n2 = { kind: "setRTPMap", data: { map: e2, participantIdentity: this.room.localParticipant.identity } };
      this.worker.postMessage(n2);
    }
    postSifTrailer(e2) {
      if (!this.worker) throw Error("could not post SIF trailer, worker is missing");
      const t2 = { kind: "setSifTrailer", data: { trailer: e2 } };
      this.worker.postMessage(t2);
    }
    setParticipantCryptorEnabledForPublication(e2, t2) {
      e2.trackInfo ? this.setParticipantCryptorEnabled(e2.trackInfo.encryption !== yt.NONE, t2) : this.log.warn("skipping e2ee enabled update for publication without trackInfo", { trackSid: e2.trackSid });
    }
    setupE2EEReceiver(e2, t2, n2) {
      if (!e2.receiver) return;
      if (!(null == n2 ? void 0 : n2.mimeType) || "" === n2.mimeType) throw new TypeError("MimeType missing from trackInfo, cannot set up E2EE cryptor");
      const i2 = "video" === e2.kind && !!n2.packetTrailerFeatures && n2.packetTrailerFeatures.length > 0;
      this.handleReceiver(e2.receiver, e2.mediaStreamID, t2, "video" === e2.kind ? xs(n2.mimeType) : void 0, i2);
    }
    setupE2EESender(e2, t2) {
      var n2, i2, r2, o2;
      if (!Va(e2) || !t2) return void (t2 || this.log.warn("early return because sender is not ready"));
      const s2 = Ha(e2), a2 = s2 ? null === (n2 = e2.publishOptions) || void 0 === n2 ? void 0 : n2.videoCodec : void 0;
      this.handleSender(t2, e2.mediaStreamID, "h264" === a2 || "h265" === a2 ? a2 : void 0, s2 ? null !== (r2 = null === (i2 = e2.publishOptions) || void 0 === i2 ? void 0 : i2.frameMetadata) && void 0 !== r2 ? r2 : null === (o2 = e2.publishOptions) || void 0 === o2 ? void 0 : o2.packetTrailer : void 0);
    }
    handleReceiver(e2, t2, n2, i2, r2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.worker) {
          if (aa()) {
            const o2 = { kind: "decode", participantIdentity: n2, trackId: t2, codec: i2, hasPacketTrailer: r2 };
            e2.transform = new RTCRtpScriptTransform(this.worker, o2);
          } else {
            if (ac in e2 && cc in e2) {
              const o3 = { kind: "updateCodec", data: { trackId: t2, previousTrackId: e2[cc], codec: i2, participantIdentity: n2, hasPacketTrailer: r2 } };
              return this.worker.postMessage(o3), void (e2[cc] = t2);
            }
            let o2 = e2.writableStream, s2 = e2.readableStream;
            if (!o2 || !s2) {
              const t3 = e2.createEncodedStreams();
              e2.writableStream = t3.writable, o2 = t3.writable, e2.readableStream = t3.readable, s2 = t3.readable;
            }
            const a2 = { kind: "decode", data: { readableStream: s2, writableStream: o2, trackId: t2, codec: i2, participantIdentity: n2, hasPacketTrailer: r2 } };
            this.worker.postMessage(a2, [s2, o2]);
          }
          e2[ac] = true, e2[cc] = t2;
        }
      }));
    }
    handleSender(e2, t2, n2, i2) {
      var r2;
      if (!(ac in e2) && this.worker) {
        if (!(null === (r2 = this.room) || void 0 === r2 ? void 0 : r2.localParticipant.identity) || "" === this.room.localParticipant.identity) throw TypeError("local identity needs to be known in order to set up encrypted sender");
        if (aa()) {
          this.log.info("initialize script transform");
          const r3 = { kind: "encode", participantIdentity: this.room.localParticipant.identity, trackId: t2, codec: n2, hasPacketTrailer: Cc(i2), packetTrailer: i2 };
          e2.transform = new RTCRtpScriptTransform(this.worker, r3);
        } else {
          this.log.info("initialize encoded streams");
          const r3 = e2.createEncodedStreams(), o2 = { kind: "encode", data: { readableStream: r3.readable, writableStream: r3.writable, codec: n2, trackId: t2, participantIdentity: this.room.localParticipant.identity, hasPacketTrailer: Cc(i2), packetTrailer: i2 } };
          this.worker.postMessage(o2, [r3.readable, r3.writable]);
        }
        e2[ac] = true;
      }
    }
  }
  Ac.disposeRegistry = "undefined" != typeof FinalizationRegistry && "undefined" != typeof WeakRef && new FinalizationRegistry(((e2) => {
    e2();
  }));
  class Lc {
    constructor() {
      this.metadataMap = /* @__PURE__ */ new Map(), this.activeSsrc = 0;
    }
    storeMetadata(e2, t2, n2) {
      for (0 !== this.activeSsrc && this.activeSsrc !== t2 && this.metadataMap.clear(), this.activeSsrc = t2; this.metadataMap.size >= 300; ) {
        const e3 = this.metadataMap.keys().next().value;
        this.metadataMap.delete(e3);
      }
      this.metadataMap.set(e2, n2);
    }
    lookupMetadata(e2) {
      return this.metadataMap.get(e2);
    }
    dispose() {
      this.metadataMap.clear(), this.activeSsrc = 0;
    }
  }
  class Nc {
    constructor(e2) {
      this.extractors = /* @__PURE__ */ new Map(), this.workerPipelines = /* @__PURE__ */ new Map(), this.onWorkerMessage = (e3) => {
        const t2 = e3.data;
        if ("metadata" === t2.kind) {
          const e4 = this.extractors.get(t2.data.trackId);
          e4 && e4.storeMetadata(t2.data.rtpTimestamp, t2.data.ssrc, t2.data.metadata);
        }
      }, this.onWorkerError = (e3) => {
        ar.error("frame metadata worker encountered an error:", { error: e3.error });
      }, this.worker = null == e2 ? void 0 : e2.worker;
    }
    setup(t2) {
      t2 !== this.room && (this.room = t2, this.worker && (this.worker.onmessage = this.onWorkerMessage, this.worker.onerror = this.onWorkerError, this.worker.postMessage({ kind: "init" })), t2.on(e.RoomEvent.TrackSubscribed, ((e2, t3, n2) => {
        "video" === e2.kind && this.setupReceiver(e2, t3.trackInfo);
      })).on(e.RoomEvent.TrackUnsubscribed, ((e2) => {
        this.teardownTrack(e2);
      })).on(e.RoomEvent.Disconnected, (() => {
        this.cleanup();
      })));
    }
    setupReceiver(e2, t2) {
      var n2, i2, r2;
      const o2 = e2.receiver;
      if (!o2) return;
      if (!(!!(null == t2 ? void 0 : t2.packetTrailerFeatures) && t2.packetTrailerFeatures.length > 0)) return void ((null === (n2 = this.room) || void 0 === n2 ? void 0 : n2.hasE2EESetup) || this.setupPassthroughReceiver(o2, e2.mediaStreamID));
      if (!Ec(this.worker ? { worker: this.worker } : void 0) && !(null === (i2 = this.room) || void 0 === i2 ? void 0 : i2.hasE2EESetup)) return void ar.warn("frame metadata transform not supported; skipping extraction");
      const s2 = new Lc(), a2 = e2.mediaStreamID;
      this.extractors.set(a2, s2), e2.frameMetadataExtractor = s2, (null === (r2 = this.room) || void 0 === r2 ? void 0 : r2.hasE2EESetup) || this.setupWorkerReceiver(o2, a2, true);
    }
    setupPassthroughReceiver(e2, t2) {
      Sc() ? "transform" in e2 && (e2.transform = null) : (this.worker && Ec({ worker: this.worker }) && !this.workerPipelines.has(e2) || this.worker && this.workerPipelines.has(e2)) && this.setupWorkerReceiver(e2, t2, false);
    }
    setupWorkerReceiver(e2, t2) {
      let n2 = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
      const i2 = this.worker;
      if (!i2) return;
      if (Sc()) return void (e2.transform = new RTCRtpScriptTransform(i2, { kind: "decode", trackId: t2 }));
      const r2 = this.workerPipelines.get(e2);
      if (r2) {
        const o3 = { kind: "updateTrackId", data: { oldTrackId: r2, newTrackId: t2, hasPacketTrailer: n2 } };
        return i2.postMessage(o3), void this.workerPipelines.set(e2, t2);
      }
      if (!("createEncodedStreams" in e2)) return void ar.warn("createEncodedStreams not supported");
      let o2;
      try {
        o2 = e2.createEncodedStreams();
      } catch (a2) {
        return void ar.warn("failed to create encoded streams", { error: a2 });
      }
      const s2 = { kind: "decode", data: { readableStream: o2.readable, writableStream: o2.writable, trackId: t2, hasPacketTrailer: n2 } };
      i2.postMessage(s2, [o2.readable, o2.writable]), this.workerPipelines.set(e2, t2);
    }
    teardownTrack(e2) {
      const t2 = e2.mediaStreamID, n2 = this.extractors.get(t2);
      n2 && (n2.dispose(), this.extractors.delete(t2)), e2 instanceof _c && (e2.frameMetadataExtractor = void 0);
    }
    cleanup() {
      var e2;
      for (const t2 of this.extractors.values()) t2.dispose();
      this.extractors.clear(), this.workerPipelines.clear(), null === (e2 = this.worker) || void 0 === e2 || e2.terminate();
    }
  }
  const xc = Nc;
  class Uc {
    constructor() {
      this.failedConnectionAttempts = /* @__PURE__ */ new Map(), this.backOffPromises = /* @__PURE__ */ new Map();
    }
    static getInstance() {
      return this._instance || (this._instance = new Uc()), this._instance;
    }
    addFailedConnectionAttempt(e2) {
      var t2;
      const n2 = va(new URL(e2));
      if (!n2) return;
      let i2 = null !== (t2 = this.failedConnectionAttempts.get(n2)) && void 0 !== t2 ? t2 : 0;
      this.failedConnectionAttempts.set(n2, i2 + 1), this.backOffPromises.set(n2, Js(Math.min(500 * Math.pow(2, i2), 15e3)));
    }
    getBackOffPromise(e2) {
      const t2 = new URL(e2), n2 = t2 && va(t2);
      return n2 && this.backOffPromises.get(n2) || Promise.resolve();
    }
    resetFailedConnectionAttempts(e2) {
      const t2 = new URL(e2), n2 = t2 && va(t2);
      n2 && (this.failedConnectionAttempts.set(n2, 0), this.backOffPromises.set(n2, Promise.resolve()));
    }
    resetAll() {
      this.backOffPromises.clear(), this.failedConnectionAttempts.clear();
    }
  }
  Uc._instance = null;
  const Fc = "default";
  class jc {
    constructor() {
      this._previousDevices = [];
    }
    static getInstance() {
      return void 0 === this.instance && (this.instance = new jc()), this.instance;
    }
    get previousDevices() {
      return this._previousDevices;
    }
    getDevices(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let i2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (function* () {
          var r2;
          if ((null === (r2 = jc.userMediaPromiseMap) || void 0 === r2 ? void 0 : r2.size) > 0) {
            ar.debug("awaiting getUserMedia promise");
            try {
              e3 ? yield jc.userMediaPromiseMap.get(e3) : yield Promise.all(jc.userMediaPromiseMap.values());
            } catch (n2) {
              ar.warn("error waiting for media permissons");
            }
          }
          let o2 = yield navigator.mediaDevices.enumerateDevices();
          if (i2 && (!ca() || !t2.hasDeviceInUse(e3))) {
            if (0 === o2.filter(((t3) => t3.kind === e3)).length || o2.some(((t3) => {
              const n2 = "" === t3.label, i3 = !e3 || t3.kind === e3;
              return n2 && i3;
            }))) {
              const t3 = { video: "audioinput" !== e3 && "audiooutput" !== e3, audio: "videoinput" !== e3 && { deviceId: { ideal: "default" } } }, n2 = yield navigator.mediaDevices.getUserMedia(t3);
              o2 = yield navigator.mediaDevices.enumerateDevices(), n2.getTracks().forEach(((e4) => {
                e4.stop();
              }));
            }
          }
          return t2._previousDevices = o2, e3 && (o2 = o2.filter(((t3) => t3.kind === e3))), o2;
        })();
      }));
    }
    normalizeDeviceId(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        if (t2 !== Fc) return t2;
        const i2 = yield this.getDevices(e2), r2 = i2.find(((e3) => e3.deviceId === Fc));
        if (!r2) return void ar.warn("could not reliably determine default device");
        const o2 = i2.find(((e3) => e3.deviceId !== Fc && e3.groupId === (null != n2 ? n2 : r2.groupId)));
        if (o2) return null == o2 ? void 0 : o2.deviceId;
        ar.warn("could not reliably determine default device");
      }));
    }
    hasDeviceInUse(e2) {
      return e2 ? jc.userMediaPromiseMap.has(e2) : jc.userMediaPromiseMap.size > 0;
    }
  }
  jc.mediaDeviceKinds = ["audioinput", "audiooutput", "videoinput"], jc.userMediaPromiseMap = /* @__PURE__ */ new Map();
  const Bc = 65535, qc = 4294967295;
  class Vc {
    static u16(e2) {
      return new Vc(e2, Bc);
    }
    static u32(e2) {
      return new Vc(e2, qc);
    }
    constructor(e2, t2) {
      if (this.value = e2, e2 < 0) throw new Error("WrapAroundUnsignedInt: cannot faithfully represent an integer smaller than 0");
      if (t2 > Number.MAX_SAFE_INTEGER) throw new Error("WrapAroundUnsignedInt: cannot faithfully represent an integer bigger than MAX_SAFE_INTEGER.");
      this.maxSize = t2, this.clamp();
    }
    clamp() {
      for (; this.value > this.maxSize; ) this.value -= this.maxSize + 1;
      for (; this.value < 0; ) this.value += this.maxSize + 1;
    }
    clone() {
      return new Vc(this.value, this.maxSize);
    }
    update(e2) {
      this.value = e2(this.value), this.clamp();
    }
    increment() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
      this.update(((t2) => t2 + e2));
    }
    decrement() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
      this.update(((t2) => t2 - e2));
    }
    getThenIncrement() {
      const e2 = this.value;
      return this.increment(), new Vc(e2, this.maxSize);
    }
    isBefore(e2) {
      const t2 = this.value >>> 0, n2 = (e2.value >>> 0) - t2 >>> 0;
      return 0 !== n2 && n2 < this.maxSize + 1;
    }
  }
  class Wc {
    static fromRtpTicks(e2) {
      return new Wc(e2, 9e4);
    }
    static rtpRandom() {
      const e2 = Math.round(Math.random() * qc);
      return Wc.fromRtpTicks(e2);
    }
    constructor(e2, t2) {
      this.timestamp = Vc.u32(e2), this.rateInHz = t2;
    }
    asTicks() {
      return this.timestamp.value;
    }
    clone() {
      return new Wc(this.timestamp.value, this.rateInHz);
    }
    wrappingAdd(e2) {
      this.timestamp.increment(e2);
    }
    isBefore(e2) {
      return this.timestamp.isBefore(e2.timestamp);
    }
  }
  class Hc {
    constructor(e2, t2, n2) {
      this.epoch = t2, this.base = n2, this.previous = n2.clone(), this.rateInHz = e2;
    }
    static startingNow(e2, t2) {
      return new Hc(t2, /* @__PURE__ */ new Date(), e2);
    }
    static startingAtTime(e2, t2, n2) {
      return new Hc(n2, e2, t2);
    }
    static rtpStartingNow(e2) {
      return Hc.startingNow(e2, 9e4);
    }
    static rtpStartingAtTime(e2, t2) {
      return Hc.startingAtTime(e2, t2, 9e4);
    }
    now() {
      return this.at(/* @__PURE__ */ new Date());
    }
    at(e2) {
      let t2 = e2.getTime() - this.epoch.getTime(), n2 = Hc.durationInMsToTicks(t2, this.rateInHz), i2 = this.base.clone();
      return i2.wrappingAdd(n2), i2.isBefore(this.previous) && (i2 = this.previous), this.previous = i2.clone(), i2.clone();
    }
    static durationInMsToTicks(e2, t2) {
      let n2 = (1e6 * e2 * t2 + 5e8) / 1e9;
      return Math.round(n2);
    }
  }
  function Kc(e2) {
    if (e2 instanceof DataView) return e2;
    if (e2 instanceof ArrayBuffer) return new DataView(e2);
    if (e2 instanceof Uint8Array) return new DataView(e2.buffer, e2.byteOffset, e2.byteLength);
    throw new Error("Error coercing ".concat(e2, " to DataView - input was not DataView, ArrayBuffer, or Uint8Array."));
  }
  var zc;
  !(function(e2) {
    e2[e2.Reserved = 0] = "Reserved", e2[e2.TooLarge = 1] = "TooLarge";
  })(zc || (zc = {}));
  class Gc extends Ho {
    constructor(e2, t2) {
      super(19, e2), this.name = "DataTrackHandleError", this.reason = t2, this.reasonName = zc[t2];
    }
    isReason(e2) {
      return this.reason === e2;
    }
    static tooLarge() {
      return new Gc("Value too large to be a valid track handle", zc.TooLarge);
    }
    static reserved(e2) {
      return new Gc("0x".concat(e2.toString(16), " is a reserved value."), zc.Reserved);
    }
  }
  const Jc = { fromNumber(e2) {
    if (0 === e2) throw Gc.reserved(e2);
    if (e2 > Bc) throw Gc.tooLarge();
    return e2;
  } };
  class Qc {
    constructor() {
      this.value = 0;
    }
    get() {
      return this.value += 1, this.value > Bc ? null : this.value;
    }
    reset() {
      this.value = 0;
    }
  }
  const Yc = { from: (e2) => ({ sid: e2.sid, pubHandle: e2.pubHandle, name: e2.name, usesE2ee: e2.encryption !== yt.NONE }), toProtobuf: (e2) => new St({ sid: e2.sid, pubHandle: e2.pubHandle, name: e2.name, encryption: e2.usesE2ee ? yt.GCM : yt.NONE }) };
  var Xc;
  !(function(e2) {
    e2[e2.WAITING = 0] = "WAITING", e2[e2.RUNNING = 1] = "RUNNING", e2[e2.COMPLETED = 2] = "COMPLETED";
  })(Xc || (Xc = {}));
  class Zc {
    constructor() {
      this.pendingTasks = /* @__PURE__ */ new Map(), this.taskMutex = new r(), this.nextTaskIndex = 0;
    }
    run(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = { id: this.nextTaskIndex++, enqueuedAt: Date.now(), status: Xc.WAITING };
        this.pendingTasks.set(t2.id, t2);
        const n2 = yield this.taskMutex.lock();
        try {
          return t2.executedAt = Date.now(), t2.status = Xc.RUNNING, yield e2();
        } finally {
          t2.status = Xc.COMPLETED, this.pendingTasks.delete(t2.id), n2();
        }
      }));
    }
    flush() {
      return kr(this, void 0, void 0, (function* () {
        return this.run((() => kr(this, void 0, void 0, (function* () {
        }))));
      }));
    }
    snapshot() {
      return Array.from(this.pendingTasks.values());
    }
  }
  function $c(e2) {
    if (0 === e2.length) {
      return new AbortController().signal;
    }
    if (1 === e2.length) return e2[0];
    for (const i2 of e2) if (i2.aborted) return i2;
    const t2 = new AbortController(), n2 = Array(e2.length);
    return e2.forEach(((e3, i2) => {
      const r2 = () => {
        t2.abort(e3.reason), (() => {
          for (const e4 of n2) e4();
        })();
      };
      e3.addEventListener("abort", r2), n2[i2] = () => e3.removeEventListener("abort", r2);
    })), t2.signal;
  }
  function ed(e2) {
    const t2 = new AbortController();
    return setTimeout((() => {
      t2.abort(new DOMException("signal timed out after ".concat(e2, " ms"), "TimeoutError"));
    }), e2), t2.signal;
  }
  const td = ["client"];
  var nd = class {
    constructor() {
      x(this, "listeners", /* @__PURE__ */ new Map());
    }
    on(e2, t2) {
      let n2 = this.listeners.get(e2);
      return n2 || (n2 = /* @__PURE__ */ new Set(), this.listeners.set(e2, n2)), n2.add(t2), { off: () => {
        n2.delete(t2);
      } };
    }
    emit(e2, t2) {
      const n2 = this.listeners.get("*");
      if (n2) for (const r2 of n2) r2(e2, t2);
      const i2 = this.listeners.get(e2);
      if (i2) for (const r2 of i2) r2(t2);
    }
    clear() {
      this.listeners.clear();
    }
  }, id = class extends Error {
    constructor(e2, t2) {
      super("non-serializable value at ".concat(e2, " (").concat(t2, ")")), this.path = e2, this.label = t2;
    }
  };
  const rd = (e2, t2, n2) => {
    if (null === e2) return null;
    switch (typeof e2) {
      case "string":
      case "boolean":
        return e2;
      case "number":
        if (!Number.isFinite(e2)) throw new id(t2, sd(e2));
        return e2;
      case "object":
        return od(e2, t2, n2);
      default:
        throw new id(t2, typeof e2);
    }
  }, od = (e2, t2, n2) => {
    var i2, r2;
    if (n2.has(e2)) throw new id(t2, "circular reference");
    if (Array.isArray(e2)) {
      if (e2.length !== Object.keys(e2).length) throw new id(t2, "sparse array or array with non-index properties");
      n2.add(e2);
      const i3 = e2.map(((e3, i4) => rd(e3, "".concat(t2, "[").concat(i4, "]"), n2)));
      return n2.delete(e2), i3;
    }
    const o2 = Object.getPrototypeOf(e2);
    if (o2 !== Object.prototype && null !== o2) throw new id(t2, null !== (i2 = null === (r2 = e2.constructor) || void 0 === r2 ? void 0 : r2.name) && void 0 !== i2 ? i2 : "object");
    n2.add(e2);
    const s2 = {};
    for (const a2 of Object.keys(e2)) {
      const i3 = rd(e2[a2], "".concat(t2, ".").concat(a2), n2);
      Object.defineProperty(s2, a2, { value: i3, enumerable: true, writable: true, configurable: true });
    }
    return n2.delete(e2), s2;
  }, sd = (e2) => Number.isNaN(e2) ? "NaN" : e2 > 0 ? "Infinity" : "-Infinity", ad = function(e2) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : /* @__PURE__ */ new Set();
    if (null === e2 || "object" != typeof e2) return e2;
    if (t2.has(e2)) return e2;
    if (Array.isArray(e2)) {
      t2.add(e2);
      const n3 = e2.map(((e3) => ad(e3, t2)));
      return t2.delete(e2), n3;
    }
    const n2 = Object.getPrototypeOf(e2);
    if (n2 !== Object.prototype && null !== n2) return e2;
    t2.add(e2);
    const i2 = {};
    for (const r2 of Object.keys(e2)) {
      const n3 = ad(e2[r2], t2);
      Object.defineProperty(i2, r2, { value: n3, enumerable: true, writable: true, configurable: true });
    }
    return t2.delete(e2), i2;
  }, cd = /* @__PURE__ */ Symbol("machina.type");
  var dd = class {
    constructor(e2) {
      x(this, "id", void 0), x(this, "initialState", void 0), x(this, cd, "BehavioralFsm"), x(this, "states", void 0), x(this, "emitter", new nd()), x(this, "clients", /* @__PURE__ */ new WeakMap()), x(this, "knownClients", /* @__PURE__ */ new Set()), x(this, "childSubscriptions", []), x(this, "disposed", false), x(this, "transitionDepth", 0), this.id = e2.id, this.initialState = e2.initialState, this.states = e2.states, this.wrapChildLinks(), this.setupChildSubscriptions();
    }
    handle(e2, t2) {
      var n2;
      if (this.disposed) return;
      const i2 = this.getOrCreateClientMeta(e2);
      for (var r2 = arguments.length, o2 = new Array(r2 > 2 ? r2 - 2 : 0), s2 = 2; s2 < r2; s2++) o2[s2 - 2] = arguments[s2];
      i2.currentActionArgs = o2;
      const a2 = null === (n2 = this.states[i2.state]) || void 0 === n2 ? void 0 : n2._child;
      if (a2 && a2.canHandle(e2, t2)) try {
        a2.handle(e2, t2, ...o2);
      } finally {
        i2.currentActionArgs = void 0;
      }
      else this.handleLocally(e2, t2, o2, i2);
    }
    canHandle(e2, t2) {
      var n2, i2, r2;
      if (this.disposed) return false;
      const o2 = null !== (n2 = null === (i2 = this.clients.get(e2)) || void 0 === i2 ? void 0 : i2.state) && void 0 !== n2 ? n2 : this.initialState, s2 = this.states[o2];
      if (null !== (r2 = null == s2 ? void 0 : s2[t2]) && void 0 !== r2 ? r2 : null == s2 ? void 0 : s2["*"]) return true;
      const a2 = null == s2 ? void 0 : s2._child;
      return !!a2 && a2.canHandle(e2, t2);
    }
    reset(e2) {
      this.disposed || this.transition(e2, this.initialState);
    }
    currentState(e2) {
      var t2;
      return null === (t2 = this.clients.get(e2)) || void 0 === t2 ? void 0 : t2.state;
    }
    transition(e2, t2) {
      if (this.disposed) return;
      const n2 = this.getOrCreateClientMeta(e2), i2 = n2.state;
      if (t2 !== i2) if (Object.hasOwn(this.states, t2)) {
        if (this.transitionDepth++, this.transitionDepth > 20) throw this.transitionDepth = 0, new Error("Max transition depth (".concat(20, ') exceeded in FSM "').concat(this.id, '". Likely an infinite _onEnter \u2192 transition loop.'));
        try {
          const r2 = this.states[i2], o2 = this.states[t2];
          if (null != r2 && r2._onExit && "function" == typeof r2._onExit) {
            const t3 = this.buildHandlerArgs(e2, "", n2);
            r2._onExit(t3);
          }
          n2.state = t2;
          const s2 = { fromState: i2, toState: t2, client: e2 };
          let a2;
          if (this.emitter.emit("transitioning", s2), null != o2 && o2._onEnter && "function" == typeof o2._onEnter) {
            const t3 = this.buildHandlerArgs(e2, "", n2);
            a2 = o2._onEnter(t3);
          }
          this.emitter.emit("transitioned", s2);
          const c2 = null == o2 ? void 0 : o2._child;
          c2 && c2.reset(e2), this.processQueue(e2, n2), "string" == typeof a2 && n2.state === t2 && this.transition(e2, a2);
        } finally {
          this.transitionDepth--;
        }
      } else this.emitter.emit("invalidstate", { stateName: t2, client: e2 });
    }
    compositeState(e2) {
      var t2;
      const n2 = this.clients.get(e2);
      if (!n2) return "";
      const i2 = null === (t2 = this.states[n2.state]) || void 0 === t2 ? void 0 : t2._child;
      if (i2) {
        const t3 = i2.compositeState(e2);
        if (t3) return "".concat(n2.state, ".").concat(t3);
      }
      return n2.state;
    }
    rehydrate(e2, t2) {
      if (this.disposed) return;
      if ("string" == typeof t2) return void this.rehydrateCompositePath(e2, t2);
      const n2 = this.planSnapshotWrites(e2, t2);
      for (const i2 of n2) i2();
    }
    dehydrate(e2) {
      let t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      const n2 = this.clients.get(e2);
      if (!n2) return;
      const i2 = { state: n2.state, deferred: n2.deferredQueue.map(((e3) => this.snapshotDeferredInput(e3))) }, r2 = this.collectChildSnapshots(e2, n2.state, t2);
      return r2 && (i2.children = r2), i2;
    }
    planSnapshotWrites(e2, t2) {
      if (this.disposed) return [];
      const n2 = t2.state, i2 = t2.deferred, r2 = t2.children;
      if (!Object.hasOwn(this.states, n2)) throw new Error('rehydrate: unknown state "'.concat(n2, '" in FSM "').concat(this.id, '". Valid states: ').concat(Object.keys(this.states).join(", ")));
      const o2 = [];
      if (r2) for (const c2 of Object.keys(r2)) {
        var s2;
        if (!Object.hasOwn(this.states, c2)) throw new Error('rehydrate: unknown state "'.concat(c2, '" in FSM "').concat(this.id, '" referenced by snapshot.children.'));
        const t3 = null === (s2 = this.states[c2]) || void 0 === s2 ? void 0 : s2._child;
        if (!t3) throw new Error('rehydrate: state "'.concat(c2, '" in FSM "').concat(this.id, '" has no _child, but the snapshot has a children["').concat(c2, '"] entry.'));
        o2.push(...t3.planRehydrate(e2, r2[c2]));
      }
      const a2 = i2.map(((e3) => (function(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var n3 = null != arguments[t3] ? arguments[t3] : {};
          t3 % 2 ? F(Object(n3), true).forEach((function(t4) {
            x(e4, t4, n3[t4]);
          })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(n3)) : F(Object(n3)).forEach((function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(n3, t4));
          }));
        }
        return e4;
      })({ inputName: e3.inputName, args: ad(e3.args) }, void 0 !== e3.untilState ? { untilState: e3.untilState } : {})));
      return o2.push((() => {
        this.clients.has(e2) || this.knownClients.add(new WeakRef(e2)), this.clients.set(e2, { state: n2, deferredQueue: a2 });
      })), o2;
    }
    rehydrateCompositePath(e2, t2) {
      const n2 = B(t2.split(".")), i2 = n2[0], r2 = L(n2).slice(1);
      if (!Object.hasOwn(this.states, i2)) throw new Error('rehydrate: unknown state "'.concat(i2, '" in FSM "').concat(this.id, '". Valid states: ').concat(Object.keys(this.states).join(", ")));
      if (r2.length > 0) {
        var o2;
        const n3 = r2.join("."), s2 = null === (o2 = this.states[i2]) || void 0 === o2 ? void 0 : o2._child;
        if (!s2) throw new Error('rehydrate: state "'.concat(i2, '" in FSM "').concat(this.id, '" has no _child, but composite path "').concat(t2, '" requires one.'));
        s2.rehydrate(e2, n3);
      }
      this.clients.has(e2) || this.knownClients.add(new WeakRef(e2)), this.clients.set(e2, { state: i2, deferredQueue: [] });
    }
    collectChildSnapshots(e2, t2, n2) {
      const i2 = /* @__PURE__ */ new Map();
      for (const s2 of Object.keys(this.states)) {
        var r2;
        const e3 = null === (r2 = this.states[s2]) || void 0 === r2 ? void 0 : r2._child;
        if (!e3) continue;
        const t3 = i2.get(e3.instance);
        t3 ? t3.stateNames.push(s2) : i2.set(e3.instance, { childLink: e3, stateNames: [s2] });
      }
      let o2;
      for (const s2 of i2.values()) {
        const i3 = s2.childLink, r3 = s2.stateNames, a2 = n2 && r3.includes(t2);
        if ("Fsm" === i3.instance[cd] && !a2) continue;
        const c2 = i3.dehydrate(e2, a2);
        if (c2) {
          null != o2 || (o2 = {});
          for (const e3 of r3) o2[e3] = c2;
        }
      }
      return o2;
    }
    snapshotDeferredInput(e2) {
      let t2;
      try {
        n2 = e2.args, t2 = rd(n2, "args", /* @__PURE__ */ new Set());
      } catch (r2) {
        if (!(r2 instanceof id)) throw r2;
        const t3 = e2.untilState ? ' (until "'.concat(e2.untilState, '")') : "";
        throw new Error('dehydrate: deferred input "'.concat(e2.inputName, '"').concat(t3, ' in FSM "').concat(this.id, '" has a non-serializable value at ').concat(r2.path, " (").concat(r2.label, ")"));
      }
      var n2;
      const i2 = { inputName: e2.inputName, args: t2 };
      return void 0 !== e2.untilState && (i2.untilState = e2.untilState), i2;
    }
    on(e2, t2) {
      return this.disposed ? { off() {
      } } : this.emitter.on(e2, t2);
    }
    emit(e2, t2) {
      this.disposed || this.emitter.emit(e2, t2);
    }
    dispose(e2) {
      this.disposed = true;
      for (const n2 of this.childSubscriptions) n2.off();
      if (null == e2 || !e2.preserveChildren) {
        const e3 = /* @__PURE__ */ new Set();
        for (const n2 of Object.keys(this.states)) {
          var t2;
          const i2 = null === (t2 = this.states[n2]) || void 0 === t2 ? void 0 : t2._child;
          i2 && !e3.has(i2.instance) && (e3.add(i2.instance), i2.dispose());
        }
      }
      this.emitter.clear();
    }
    wrapChildLinks() {
      for (const e2 of Object.keys(this.states)) {
        const t2 = this.states[e2], n2 = null == t2 ? void 0 : t2._child;
        if (n2) {
          if ("object" != typeof n2) throw new Error('State "'.concat(e2, '"._child: expected an Fsm or BehavioralFsm instance, got ').concat(String(n2)));
          if (!(cd in n2)) throw new Error('State "'.concat(e2, '"._child: expected an Fsm or BehavioralFsm instance, got a plain object'));
          t2._child = ld(n2);
        }
      }
    }
    setupChildSubscriptions() {
      const e2 = /* @__PURE__ */ new Set();
      for (const n2 of Object.keys(this.states)) {
        var t2;
        const i2 = null === (t2 = this.states[n2]) || void 0 === t2 ? void 0 : t2._child;
        if (!i2 || e2.has(i2.instance)) continue;
        e2.add(i2.instance);
        const r2 = i2.onAny(((e3, t3) => {
          if ("nohandler" === e3) {
            var n3;
            const e4 = t3;
            if (void 0 !== e4.client) this.bubbleNohandler(e4.client, i2, e4.inputName, null !== (n3 = e4.args) && void 0 !== n3 ? n3 : []);
            else for (const t4 of this.knownClients) {
              var r3;
              const n4 = t4.deref();
              void 0 !== n4 ? this.bubbleNohandler(n4, i2, e4.inputName, null !== (r3 = e4.args) && void 0 !== r3 ? r3 : []) : this.knownClients.delete(t4);
            }
            return;
          }
          const o2 = t3;
          if (o2 && "object" == typeof o2 && "client" in o2) this.isChildActiveForClient(o2.client, i2) && this.emitter.emit(e3, t3);
          else for (const s2 of this.knownClients) {
            const n4 = s2.deref();
            if (n4) {
              if (this.isChildActiveForClient(n4, i2)) {
                this.emitter.emit(e3, t3);
                break;
              }
            } else this.knownClients.delete(s2);
          }
        }));
        this.childSubscriptions.push(r2);
      }
    }
    bubbleNohandler(e2, t2, n2, i2) {
      if (!this.isChildActiveForClient(e2, t2)) return;
      const r2 = this.clients.get(e2);
      r2.currentActionArgs = i2, this.handleLocally(e2, n2, i2, r2);
    }
    isChildActiveForClient(e2, t2) {
      var n2;
      const i2 = this.clients.get(e2);
      return !!i2 && (null === (n2 = this.states[i2.state]) || void 0 === n2 || null === (n2 = n2._child) || void 0 === n2 ? void 0 : n2.instance) === t2.instance;
    }
    handleLocally(e2, t2, n2, i2) {
      var r2;
      const o2 = this.states[i2.state], s2 = null !== (r2 = null == o2 ? void 0 : o2[t2]) && void 0 !== r2 ? r2 : null == o2 ? void 0 : o2["*"];
      if (!s2) return this.emitter.emit("nohandler", { inputName: t2, args: n2, client: e2 }), void (i2.currentActionArgs = void 0);
      try {
        this.emitter.emit("handling", { inputName: t2, client: e2 });
        const r3 = this.buildHandlerArgs(e2, t2, i2);
        let o3;
        "string" == typeof s2 ? o3 = s2 : "function" == typeof s2 && (o3 = s2(r3, ...n2)), this.emitter.emit("handled", { inputName: t2, client: e2 }), "string" == typeof o3 && this.transition(e2, o3);
      } finally {
        i2.currentActionArgs = void 0;
      }
    }
    getOrCreateClientMeta(e2) {
      let t2 = this.clients.get(e2);
      return t2 || (t2 = { state: void 0, deferredQueue: [] }, this.clients.set(e2, t2), this.knownClients.add(new WeakRef(e2)), this.transition(e2, this.initialState), t2);
    }
    buildHandlerArgs(e2, t2, n2) {
      return { ctx: e2, inputName: t2, defer: (i2) => {
        if (!n2.currentActionArgs) return;
        const r2 = { inputName: t2, args: [...n2.currentActionArgs], untilState: null == i2 ? void 0 : i2.until };
        n2.deferredQueue.push(r2), this.emitter.emit("deferred", { inputName: t2, client: e2 });
      }, emit: (e3, t3) => {
        this.emitter.emit(e3, t3);
      } };
    }
    processQueue(e2, t2) {
      const n2 = [], i2 = [];
      for (const r2 of t2.deferredQueue) void 0 === r2.untilState || r2.untilState === t2.state ? n2.push(r2) : i2.push(r2);
      t2.deferredQueue = i2;
      for (const r2 of n2) this.handle(e2, r2.inputName, ...r2.args);
    }
  };
  function ld(e2) {
    if (!e2 || "object" != typeof e2) throw new Error("createChildLink: expected an Fsm or BehavioralFsm instance, got ".concat(String(e2)));
    const t2 = e2[cd];
    if ("BehavioralFsm" === t2) return { instance: e2, canHandle: (t3, n2) => e2.canHandle(t3, n2), handle(t3, n2) {
      for (var i2 = arguments.length, r2 = new Array(i2 > 2 ? i2 - 2 : 0), o2 = 2; o2 < i2; o2++) r2[o2 - 2] = arguments[o2];
      e2.handle(t3, n2, ...r2);
    }, reset(t3) {
      e2.transition(t3, e2.initialState);
    }, onAny: (t3) => e2.on("*", t3), compositeState: (t3) => e2.compositeState(t3), rehydrate(t3, n2) {
      e2.rehydrate(t3, n2);
    }, dehydrate: (t3, n2) => e2.dehydrate(t3, n2), planRehydrate: (t3, n2) => e2.planSnapshotWrites(t3, n2), dispose() {
      e2.dispose();
    } };
    if ("Fsm" === t2) return { instance: e2, canHandle: (t3, n2) => e2.canHandle(n2), handle(t3, n2) {
      for (var i2 = arguments.length, r2 = new Array(i2 > 2 ? i2 - 2 : 0), o2 = 2; o2 < i2; o2++) r2[o2 - 2] = arguments[o2];
      e2.handle(n2, ...r2);
    }, reset(t3) {
      e2.reset();
    }, onAny: (t3) => e2.on("*", t3), compositeState: (t3) => e2.compositeState(), rehydrate(e3, t3) {
      throw new Error("rehydrate: cannot rehydrate an Fsm child. Fsm owns its own context; rehydrate is only valid for BehavioralFsm hierarchies.");
    }, dehydrate(e3, t3) {
      throw new Error("dehydrate: cannot dehydrate an Fsm child. Fsm owns its own context; dehydrate is only valid for BehavioralFsm hierarchies.");
    }, planRehydrate(e3, t3) {
      throw new Error("rehydrate: cannot rehydrate an Fsm child. Fsm owns its own context; rehydrate is only valid for BehavioralFsm hierarchies.");
    }, dispose() {
      e2.dispose();
    } };
    throw new Error("createChildLink: expected an Fsm or BehavioralFsm instance, got [MACHINA_TYPE] = ".concat(String(null != t2 ? t2 : "undefined")));
  }
  var ud = class {
    constructor(e2) {
      var t2;
      x(this, "id", void 0), x(this, "initialState", void 0), x(this, cd, "Fsm"), x(this, "states", void 0), x(this, "bfsm", void 0), x(this, "context", void 0), x(this, "emitter", new nd()), x(this, "disposed", false), this.id = e2.id, this.initialState = e2.initialState, this.context = null !== (t2 = e2.context) && void 0 !== t2 ? t2 : {}, this.bfsm = new dd(e2), this.states = e2.states, this.bfsm.on("*", ((e3, t3) => {
        if (t3 && "object" == typeof t3 && "client" in t3) {
          t3.client;
          const n2 = (function(e4, t4) {
            if (null == e4) return {};
            var n3, i2, r2 = (function(e5, t5) {
              if (null == e5) return {};
              var n4 = {};
              for (var i3 in e5) if ({}.hasOwnProperty.call(e5, i3)) {
                if (-1 !== t5.indexOf(i3)) continue;
                n4[i3] = e5[i3];
              }
              return n4;
            })(e4, t4);
            if (Object.getOwnPropertySymbols) {
              var o2 = Object.getOwnPropertySymbols(e4);
              for (i2 = 0; i2 < o2.length; i2++) n3 = o2[i2], -1 === t4.indexOf(n3) && {}.propertyIsEnumerable.call(e4, n3) && (r2[n3] = e4[n3]);
            }
            return r2;
          })(t3, td);
          this.emitter.emit(e3, n2);
        } else this.emitter.emit(e3, t3);
      })), this.bfsm.transition(this.context, e2.initialState);
    }
    handle(e2) {
      if (!this.disposed) {
        for (var t2 = arguments.length, n2 = new Array(t2 > 1 ? t2 - 1 : 0), i2 = 1; i2 < t2; i2++) n2[i2 - 1] = arguments[i2];
        this.bfsm.handle(this.context, e2, ...n2);
      }
    }
    canHandle(e2) {
      return !this.disposed && this.bfsm.canHandle(this.context, e2);
    }
    reset() {
      this.disposed || this.bfsm.reset(this.context);
    }
    currentState() {
      return this.bfsm.currentState(this.context);
    }
    transition(e2) {
      this.disposed || this.bfsm.transition(this.context, e2);
    }
    compositeState() {
      return this.bfsm.compositeState(this.context);
    }
    on(e2, t2) {
      return this.disposed ? { off() {
      } } : this.emitter.on(e2, t2);
    }
    emit(e2, t2) {
      this.disposed || this.bfsm.emit(e2, t2);
    }
    dispose(e2) {
      this.disposed = true, this.bfsm.dispose(e2), this.emitter.clear();
    }
  };
  function hd(e2, t2) {
    return t2.attemptId === e2.attemptId;
  }
  const pd = (e2, t2) => {
    if (hd(e2.ctx, t2)) return "connected";
  }, md = (e2) => {
    let t2 = e2.ctx;
    return t2.attemptId += 1, t2.lastError = void 0, "connecting";
  }, gd = (e2) => {
    let t2 = e2.ctx;
    return t2.attemptId += 1, t2.lastError = void 0, "reconnecting";
  }, vd = (e2, t2) => (e2.ctx.closeReason = t2.reason, "disconnecting"), fd = { new: { connect: md, close: vd }, connecting: { connectComplete: pd, connectFailed: (e2, t2) => (e2.ctx.lastError = t2.error, "closed"), close: vd }, connected: { reconnect: gd, transportFailed: (e2, t2) => {
    let n2 = e2.ctx;
    if (hd(n2, t2)) return n2.lastError = t2.reason, "offline";
  }, close: vd }, offline: { connect: md, reconnect: gd, close: vd }, reconnecting: { reconnectComplete: pd, reconnectFailed: (e2, t2) => (e2.ctx.lastError = t2.error, t2.recoverable ? "offline" : "closed"), close: vd }, disconnecting: { closeComplete: "closed" }, closed: { connect: md, reconnect: gd } };
  function kd() {
    return new ud({ id: "signal", initialState: arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "new", context: { attemptId: 0 }, states: fd });
  }
  class yd {
    get readyState() {
      return this.ws.readyState;
    }
    constructor(e2) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      var n2, i2;
      if (null === (n2 = t2.signal) || void 0 === n2 ? void 0 : n2.aborted) throw new DOMException("This operation was aborted", "AbortError");
      this.url = e2;
      const r2 = new WebSocket(e2, null !== (i2 = t2.protocols) && void 0 !== i2 ? i2 : []);
      r2.binaryType = "arraybuffer", this.ws = r2;
      const o2 = function() {
        let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = e3.closeCode, n3 = e3.reason;
        return r2.close(t3, void 0 === n3 ? void 0 : (function(e4) {
          const t4 = new TextEncoder();
          if (t4.encode(e4).length <= bd) return e4;
          let n4 = "", i3 = 0;
          for (const r3 of e4) {
            if (i3 += t4.encode(r3).length, i3 > bd) break;
            n4 += r3;
          }
          return n4;
        })(n3));
      };
      this.opened = new No(((e3, t3) => {
        const n3 = () => {
          t3(Zo.websocket("Encountered websocket error during connection establishment"));
        };
        r2.onopen = () => {
          e3({ readable: new ReadableStream({ start(e4) {
            r2.onmessage = (t4) => {
              let n4 = t4.data;
              return e4.enqueue(n4);
            }, r2.onerror = (t4) => {
              return e4.error(Zo.websocket((i3 = "websocket", (n4 = t4) instanceof Error ? n4.name && n4.message ? "".concat(n4.name, ": ").concat(n4.message) : n4.name : "Encountered unknown ".concat(i3, " error: ").concat(String(n4)))));
              var n4, i3;
            }, r2.onclose = (t4) => {
              t4.wasClean || 1e3 === t4.code ? e4.close() : e4.error(Zo.websocket("WS closed unexpectedly with code ".concat(t4.code)));
            };
          }, cancel: o2 }), writable: new WritableStream({ write(e4) {
            r2.send(e4);
          }, abort() {
            r2.close();
          }, close: o2 }), protocol: r2.protocol, extensions: r2.extensions }), r2.removeEventListener("error", n3);
        }, r2.addEventListener("error", n3);
      })), this.closed = new No(((e3, t3) => {
        const n3 = () => kr(this, void 0, void 0, (function* () {
          const n4 = new No(((e4) => {
            r2.readyState !== WebSocket.CLOSED && r2.addEventListener("close", ((t4) => {
              e4(t4);
            }), { once: true });
          })), i3 = yield No.race([Js(250), n4]);
          i3 ? e3(i3) : t3(Zo.websocket("Encountered unspecified websocket error without a timely close event"));
        }));
        r2.addEventListener("close", ((t4) => {
          let i3 = t4.code, o3 = t4.reason;
          e3({ closeCode: i3, reason: o3 }), r2.removeEventListener("error", n3);
        })), r2.addEventListener("error", n3);
      })), t2.signal && (t2.signal.onabort = () => r2.close()), this.close = o2;
    }
  }
  const bd = 123;
  const Td = ["syncState", "trickle", "offer", "answer", "simulate", "leave"];
  var Sd;
  !(function(e2) {
    e2[e2.CONNECTING = 0] = "CONNECTING", e2[e2.CONNECTED = 1] = "CONNECTED", e2[e2.RECONNECTING = 2] = "RECONNECTING", e2[e2.DISCONNECTING = 3] = "DISCONNECTING", e2[e2.DISCONNECTED = 4] = "DISCONNECTED";
  })(Sd || (Sd = {}));
  class Ed {
    get currentState() {
      return (function(e2) {
        switch (e2) {
          case "connected":
            return Sd.CONNECTED;
          case "connecting":
            return Sd.CONNECTING;
          case "reconnecting":
            return Sd.RECONNECTING;
          case "disconnecting":
            return Sd.DISCONNECTING;
          default:
            return Sd.DISCONNECTED;
        }
      })(this.lifecycleState);
    }
    get isDisconnected() {
      const e2 = this.currentState;
      return e2 === Sd.DISCONNECTING || e2 === Sd.DISCONNECTED;
    }
    get lifecycleState() {
      return this.machine.currentState();
    }
    get attemptId() {
      return this.machine.context.attemptId;
    }
    sendLifecycleInput(e2) {
      const t2 = this.lifecycleState;
      return this.machine.handle(e2.type, e2), this.lifecycleState !== t2;
    }
    settleInFlightClose() {
      return kr(this, void 0, void 0, (function* () {
        this.log.debug("waiting for an in-flight close to settle before establishing a session"), (yield this.closingLock.lock())();
      }));
    }
    get isEstablishingConnection() {
      return "connecting" === this.lifecycleState || "reconnecting" === this.lifecycleState;
    }
    getNextRequestId() {
      return this._requestId += 1, this._requestId;
    }
    constructor() {
      let t2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      var i2;
      this.rtt = 0, this.log = ar, this._requestId = 0, this.useV0SignalPath = false, this.resetCallbacks = () => {
        this.onAnswer = void 0, this.onLeave = void 0, this.onLocalTrackPublished = void 0, this.onLocalTrackUnpublished = void 0, this.onNegotiateRequested = void 0, this.onOffer = void 0, this.onRemoteMuteChanged = void 0, this.onSubscribedQualityUpdate = void 0, this.onTokenRefresh = void 0, this.onTrickle = void 0, this.onClose = void 0, this.onMediaSectionsRequirement = void 0;
      }, this.loggerContextCb = n2.loggerContextCb, this.log = dr(null !== (i2 = n2.loggerName) && void 0 !== i2 ? i2 : e.LoggerNames.Signal, (() => this.logContext)), this.useJSON = t2, this.requestQueue = new Zc(), this.queuedRequests = [], this.closingLock = new r(), this.connectionLock = new r(), this.machine = kd(), this.machine.on("transitioned", ((e2) => {
        let t3 = e2.fromState, n3 = e2.toState;
        this.log.debug("signal lifecycle: ".concat(t3, " -> ").concat(n3));
      })), this.machine.on("nohandler", ((e2) => {
        let t3 = e2.inputName;
        this.log.debug("ignoring signal lifecycle input ".concat(t3, " in state ").concat(this.lifecycleState));
      })), this.machine;
    }
    get logContext() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.loggerContextCb) || void 0 === e2 ? void 0 : e2.call(this)) && void 0 !== t2 ? t2 : {};
    }
    join(e2, t2, i2, r2) {
      return kr(this, arguments, void 0, (function(e3, t3, i3, r3) {
        var o2 = this;
        let s2 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4], a2 = arguments.length > 5 ? arguments[5] : void 0;
        return (function* () {
          if ("disconnecting" === o2.lifecycleState && (yield o2.settleInFlightClose()), !o2.sendLifecycleInput({ type: "connect" })) throw Zo.internal("cannot establish a signal session from '".concat(o2.lifecycleState, "', close the current one first"));
          o2.options = i3;
          try {
            return yield o2.connect(e3, t3, i3, r3, s2, a2);
          } catch (n2) {
            throw o2.sendLifecycleInput({ type: "connectFailed", error: n2 }), n2;
          }
        })();
      }));
    }
    reconnect(t2, i2, r2, o2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.options) {
          if ("disconnecting" === this.lifecycleState && (yield this.settleInFlightClose()), !this.sendLifecycleInput({ type: "reconnect" })) throw Zo.internal("cannot resume the signal session from '".concat(this.lifecycleState, "'"));
          this.clearPingInterval();
          try {
            return yield this.connect(t2, i2, Object.assign(Object.assign({}, this.options), { reconnect: true, sid: r2, reconnectReason: o2 }), void 0, this.useV0SignalPath);
          } catch (n2) {
            throw this.sendLifecycleInput({ type: "reconnectFailed", error: n2, recoverable: (s2 = n2, !(s2 instanceof Zo) || s2.reason !== e.ConnectionErrorReason.LeaveRequest && s2.reason !== e.ConnectionErrorReason.NotAllowed) }), n2;
          }
          var s2;
        } else this.log.warn("attempted to reconnect without signal options being set, ignoring");
      }));
    }
    connect(e2, t2, i2, r2) {
      return kr(this, arguments, void 0, (function(e3, t3, i3, r3) {
        var o2 = this;
        let s2 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4], a2 = arguments.length > 5 ? arguments[5] : void 0;
        return (function* () {
          const c2 = yield o2.connectionLock.lock();
          let d2, l2;
          try {
            o2.connectOptions = i3, o2.useV0SignalPath = s2;
            const n2 = (function(e4) {
              var t4;
              const n3 = new Xt({ capabilities: e4, sdk: Zt.JS, protocol: 17, clientProtocol: 2, version: Vo });
              return ma() && (n3.os = null !== (t4 = ka()) && void 0 !== t4 ? t4 : ""), n3;
            })(i3.clientInfoCapabilities), r4 = s2 ? (function(e4, t4, n3) {
              var i4;
              const r5 = new URLSearchParams();
              r5.set("access_token", e4), n3.reconnect && (r5.set("reconnect", "1"), n3.sid && r5.set("sid", n3.sid));
              r5.set("auto_subscribe", n3.autoSubscribe ? "1" : "0"), r5.set("sdk", ma() ? "reactnative" : "js"), r5.set("version", t4.version), r5.set("protocol", t4.protocol.toString()), r5.set("client_protocol", t4.clientProtocol.toString()), t4.deviceModel && r5.set("device_model", t4.deviceModel);
              t4.os && r5.set("os", t4.os);
              t4.osVersion && r5.set("os_version", t4.osVersion);
              t4.browser && r5.set("browser", t4.browser);
              t4.browserVersion && r5.set("browser_version", t4.browserVersion);
              n3.adaptiveStream && r5.set("adaptive_stream", "1");
              n3.disableIceLite && r5.set("disable_ice_lite", "1");
              void 0 !== n3.subscriberAllowPause && r5.set("subscriber_allow_pause", n3.subscriberAllowPause ? "1" : "0");
              n3.reconnectReason && r5.set("reconnect_reason", n3.reconnectReason.toString());
              (null === (i4 = navigator.connection) || void 0 === i4 ? void 0 : i4.type) && r5.set("network", navigator.connection.type);
              return r5;
            })(t3, n2, i3) : yield (function(e4, t4, n3, i4) {
              return kr(this, void 0, void 0, (function* () {
                const r5 = new URLSearchParams();
                r5.set("access_token", e4);
                const o3 = new Ji({ clientInfo: t4, connectionSettings: new Gi({ autoSubscribe: !!n3.autoSubscribe, adaptiveStream: !!n3.adaptiveStream, disableIceLite: !!n3.disableIceLite, subscriberAllowPause: n3.subscriberAllowPause }), reconnect: !!n3.reconnect, participantSid: n3.sid ? n3.sid : void 0, publisherOffer: i4 });
                n3.reconnectReason && (o3.reconnectReason = n3.reconnectReason);
                const s3 = o3.toBinary();
                let a3, c3;
                if (Za()) {
                  const e5 = new CompressionStream("gzip"), t5 = e5.writable.getWriter();
                  t5.write(new Uint8Array(s3)), t5.close();
                  const n4 = [], i5 = e5.readable.getReader();
                  for (; ; ) {
                    const e6 = yield i5.read(), t6 = e6.done, r7 = e6.value;
                    if (t6) break;
                    n4.push(r7);
                  }
                  const r6 = n4.reduce(((e6, t6) => e6 + t6.length), 0), o4 = new Uint8Array(r6);
                  let d4 = 0;
                  for (const s4 of n4) o4.set(s4, d4), d4 += s4.length;
                  a3 = o4, c3 = Yi.GZIP;
                } else a3 = s3, c3 = Yi.NONE;
                const d3 = new Qi({ joinRequest: a3, compression: c3 }).toBinary(), l3 = (e5) => {
                  const t5 = Array.from(e5, ((e6) => String.fromCodePoint(e6))).join("");
                  return btoa(t5);
                };
                return r5.set("join_request", l3(d3).replace(/\+/g, "-").replace(/\//g, "_")), r5;
              }));
            })(t3, n2, i3, a2);
            d2 = nc(e3, r4, s2).toString(), l2 = (u2 = d2, rc(new URL(Fa(u2)), "validate")).toString();
          } catch (n2) {
            throw c2(), n2;
          }
          var u2;
          if (null == r3 ? void 0 : r3.aborted) throw c2(), o2.log.debug("signal connect abandoned before opening a transport"), Zo.cancelled("Connection aborted");
          return new Promise(((e4, t4) => kr(o2, void 0, void 0, (function* () {
            var o3, s3, a3, u3, h2;
            try {
              let c3 = false;
              const p2 = (e5) => kr(this, void 0, void 0, (function* () {
                if (c3) return;
                c3 = true;
                const n2 = (function(e6) {
                  let t5 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Unknown reason";
                  if (e6 instanceof Error) return e6.message;
                  if (!(e6 instanceof AbortSignal)) return t5;
                  const n3 = e6.reason;
                  switch (typeof n3) {
                    case "string":
                      return n3;
                    case "object":
                      return n3 instanceof Error ? n3.message : t5;
                    default:
                      return "toString" in n3 ? n3.toString() : t5;
                  }
                })(e5 instanceof Event ? e5.currentTarget : e5, "Abort handler called");
                this.streamWriter && !this.isDisconnected ? this.sendLeave().then((() => this.close(true, n2))).catch(((e6) => {
                  this.log.error(e6), this.close(true, n2);
                })) : this.close(true, n2), m2(), t4(e5 instanceof Zo ? e5 : Zo.cancelled(n2));
              }));
              null == r3 || r3.addEventListener("abort", p2);
              const m2 = () => {
                clearTimeout(g2), null == r3 || r3.removeEventListener("abort", p2);
              }, g2 = setTimeout((() => {
                p2(Zo.timeout("room connection has timed out (signal)"));
              }), i3.websocketTimeout), v2 = new URL(d2);
              if (v2.searchParams.has("access_token") && v2.searchParams.set("access_token", "<redacted>"), this.ws) {
                const e5 = performance.now();
                yield this.teardownTransport("replaced by a new connection attempt"), this.log.debug("closed previous ws connection in ".concat(performance.now() - e5, "ms"));
              }
              if (c3) return void this.log.debug("signal connect abandoned after tearing down the previous transport");
              const f2 = this.attemptId;
              this.log.info("signal connecting to ".concat(v2), { reconnect: i3.reconnect, reconnectReason: i3.reconnectReason }), this.ws = new yd(d2);
              let k2 = false;
              this.ws.opened.catch((() => {
                k2 = true;
              }));
              try {
                this.ws.closed.then(((e5) => {
                  this.isEstablishingConnection && !k2 && t4(Zo.internal("Websocket got closed during a (re)connection attempt: ".concat(e5.reason))), this.log.debug("websocket closed", { reason: e5.reason, code: e5.closeCode, attemptId: f2, state: this.lifecycleState }), this.handleOnClose(e5.reason || (1e3 === e5.closeCode ? "server closed the signal connection" : "Unexpected WS error"), f2);
                })).catch(((e5) => {
                  this.isEstablishingConnection && !k2 && t4(Zo.internal("Websocket error during a (re)connection attempt: ".concat(e5)));
                }));
                const r4 = yield this.ws.opened.catch(((e5) => kr(this, void 0, void 0, (function* () {
                  if (c3) this.log.debug("signal connect abandoned while the websocket was opening");
                  else if ("connected" === this.lifecycleState) this.handleWSError(e5), t4(e5);
                  else {
                    clearTimeout(g2);
                    const n2 = yield this.handleConnectionError(e5, l2);
                    t4(n2);
                  }
                }))));
                if (clearTimeout(g2), !r4) return;
                const d3 = r4.readable.getReader();
                let p3;
                this.streamWriter = r4.writable.getWriter();
                try {
                  const e5 = Date.now() + 5e3;
                  for (; ; ) {
                    const t5 = e5 - Date.now();
                    if (t5 <= 0) throw Zo.timeout("signal connection timed out while waiting for the first message");
                    let n2;
                    const i4 = yield Promise.race([d3.read(), new Promise(((e6, i5) => {
                      n2 = setTimeout((() => {
                        i5(Zo.timeout("signal connection timed out while waiting for the first message"));
                      }), t5);
                    }))]);
                    if (clearTimeout(n2), !i4.value) throw Zo.internal("no message received as first message");
                    const r5 = oc(i4.value);
                    if ("reconnecting" !== this.lifecycleState || "reconnect" === (null === (o3 = r5.message) || void 0 === o3 ? void 0 : o3.case) || "leave" === (null === (s3 = r5.message) || void 0 === s3 ? void 0 : s3.case)) {
                      p3 = r5;
                      break;
                    }
                    this.log.warn("dropping signal message while awaiting reconnect response", { messageCase: null === (a3 = r5.message) || void 0 === a3 ? void 0 : a3.case });
                  }
                } catch (n2) {
                  return d3.releaseLock(), t4(n2), void this.close();
                }
                if (d3.releaseLock(), c3) return void this.log.debug("signal connect abandoned while waiting for the first message");
                const m3 = this.validateFirstMessage(p3, null !== (u3 = i3.reconnect) && void 0 !== u3 && u3);
                if (!m3.isValid) return void t4(m3.error);
                "join" === (null === (h2 = p3.message) || void 0 === h2 ? void 0 : h2.case) && (this.pingTimeoutDuration = p3.message.value.pingTimeout, this.pingIntervalDuration = p3.message.value.pingInterval, this.pingTimeoutDuration && this.pingTimeoutDuration > 0 && this.log.debug("ping config", { timeout: this.pingTimeoutDuration, interval: this.pingIntervalDuration }), this.onJoined && this.onJoined(p3.message.value)), this.handleSignalConnected(r4, g2, f2), e4(m3.response);
              } catch (n2) {
                t4(n2);
              } finally {
                m2();
              }
            } finally {
              c2();
            }
          }))));
        })();
      }));
    }
    startReadingLoop(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.attemptId;
        for (; ; ) {
          this.signalLatency && (yield Js(this.signalLatency));
          try {
            const t3 = yield e2.read(), n2 = t3.done, i2 = t3.value;
            if (n2) break;
            const r2 = oc(i2);
            this.handleSignalResponse(r2);
          } catch (n2) {
            this.log.error("error reading from signal stream", { error: n2 }), yield this.handleOnClose("error in reading loop", t2);
            break;
          }
        }
      }));
    }
    close() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Close method called on signal client";
        return (function* () {
          const i2 = t2 && e2.sendLifecycleInput({ type: "close", reason: n2 }), r2 = yield e2.closingLock.lock();
          try {
            yield e2.teardownTransport(n2);
          } finally {
            i2 && e2.sendLifecycleInput({ type: "closeComplete" }), r2();
          }
        })();
      }));
    }
    teardownTransport(e2) {
      return kr(this, void 0, void 0, (function* () {
        try {
          this.clearPingInterval();
          const t2 = this.ws;
          t2 && (this.ws = void 0, this.streamWriter = void 0, t2.close({ closeCode: 1e3, reason: e2 }), yield Promise.race([t2.closed, Js(250)]));
        } catch (n2) {
          this.log.debug("websocket error while closing", { error: n2 });
        }
      }));
    }
    sendOffer(e2, t2) {
      this.log.debug("sending offer", { offerSdp: e2.sdp }), this.sendRequest({ case: "offer", value: wd(e2, t2) });
    }
    sendAnswer(e2, t2) {
      return this.log.debug("sending answer", { answerSdp: e2.sdp }), this.sendRequest({ case: "answer", value: wd(e2, t2) });
    }
    sendIceCandidate(e2, t2) {
      return this.log.debug("sending ice candidate", { candidate: e2 }), this.sendRequest({ case: "trickle", value: new Zn({ candidateInit: JSON.stringify(e2), target: t2 }) });
    }
    sendMuteTrack(e2, t2) {
      return this.sendRequest({ case: "mute", value: new $n({ sid: e2, muted: t2 }) });
    }
    sendAddTrack(e2) {
      return this.sendRequest({ case: "addTrack", value: e2 });
    }
    sendUpdateLocalMetadata(e2, t2) {
      return kr(this, arguments, void 0, (function(e3, t3) {
        var n2 = this;
        let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return (function* () {
          const r2 = n2.getNextRequestId();
          return yield n2.sendRequest({ case: "updateMetadata", value: new yi({ requestId: r2, metadata: e3, name: t3, attributes: i2 }) }), r2;
        })();
      }));
    }
    sendUpdateTrackSettings(e2) {
      this.sendRequest({ case: "trackSetting", value: e2 });
    }
    sendUpdateSubscription(e2) {
      return this.sendRequest({ case: "subscription", value: e2 });
    }
    sendSyncState(e2) {
      return this.sendRequest({ case: "syncState", value: e2 });
    }
    sendUpdateVideoLayers(e2, t2) {
      return this.sendRequest({ case: "updateLayers", value: new ki({ trackSid: e2, layers: t2 }) });
    }
    sendUpdateSubscriptionPermissions(e2, t2) {
      return this.sendRequest({ case: "subscriptionPermission", value: new Oi({ allParticipants: e2, trackPermissions: t2 }) });
    }
    sendSimulateScenario(e2) {
      return this.sendRequest({ case: "simulate", value: e2 });
    }
    sendPing() {
      return Promise.all([this.sendRequest({ case: "ping", value: R.parse(Date.now()) }), this.sendRequest({ case: "pingReq", value: new ji({ timestamp: R.parse(Date.now()), rtt: R.parse(this.rtt) }) })]);
    }
    sendUpdateLocalAudioTrack(e2, t2) {
      return this.sendRequest({ case: "updateAudioTrack", value: new mi({ trackSid: e2, features: t2 }) });
    }
    sendLeave() {
      return this.sendRequest({ case: "leave", value: new vi({ reason: at.CLIENT_INITIATED, action: fi.DISCONNECT }) });
    }
    sendPublishDataTrackRequest(e2, t2, n2) {
      return this.sendRequest({ case: "publishDataTrackRequest", value: new zn({ pubHandle: e2, name: t2, encryption: n2 ? yt.GCM : yt.NONE }) });
    }
    sendUnPublishDataTrackRequest(e2) {
      return this.sendRequest({ case: "unpublishDataTrackRequest", value: new Jn({ pubHandle: e2 }) });
    }
    sendUpdateDataSubscription(e2, t2) {
      return this.sendRequest({ case: "updateDataSubscription", value: new ai({ updates: [new ci({ trackSid: e2, subscribe: t2 })] }) });
    }
    sendRequest(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let i2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return (function* () {
          const r2 = !i2 && !(function(e4) {
            const t3 = Td.indexOf(e4.case) >= 0;
            return ar.trace("request allowed to bypass queue:", { canPass: t3, req: e4 }), t3;
          })(e3), o2 = "reconnecting" === t2.lifecycleState || t2.queuedRequests.length > 0;
          if (r2 && o2) return void t2.queuedRequests.push((() => kr(t2, void 0, void 0, (function* () {
            yield this.sendRequest(e3, true);
          }))));
          i2 || (yield t2.requestQueue.flush()), t2.signalLatency && (yield Js(t2.signalLatency));
          const s2 = "leave" === e3.case && !!t2.streamWriter;
          if (t2.isDisconnected && !s2) return void t2.log.debug("skipping signal request (type: ".concat(e3.case, ") - SignalClient disconnected"));
          if (!t2.streamWriter) return void t2.log.error("cannot send signal request before connected, type: ".concat(null == e3 ? void 0 : e3.case));
          const a2 = new Vn({ message: e3 });
          try {
            t2.useJSON ? yield t2.streamWriter.write(a2.toJsonString()) : yield t2.streamWriter.write(a2.toBinary().buffer);
          } catch (n2) {
            t2.log.error("error sending signal message", { error: n2 });
          }
        })();
      }));
    }
    handleSignalResponse(e2) {
      var t2, n2;
      const i2 = e2.message;
      if (null == i2) return void this.log.debug("received unsupported message");
      let r2 = false;
      if ("answer" === i2.case) {
        const e3 = Cd(i2.value);
        this.onAnswer && this.onAnswer(e3, i2.value.id, i2.value.midToTrackId);
      } else if ("offer" === i2.case) {
        const e3 = Cd(i2.value);
        this.onOffer && this.onOffer(e3, i2.value.id, i2.value.midToTrackId);
      } else if ("trickle" === i2.case) {
        const e3 = JSON.parse(i2.value.candidateInit);
        this.onTrickle && this.onTrickle(e3, i2.value.target);
      } else "update" === i2.case ? this.onParticipantUpdate && this.onParticipantUpdate(null !== (t2 = i2.value.participants) && void 0 !== t2 ? t2 : []) : "trackPublished" === i2.case ? this.onLocalTrackPublished && this.onLocalTrackPublished(i2.value) : "speakersChanged" === i2.case ? this.onSpeakersChanged && this.onSpeakersChanged(null !== (n2 = i2.value.speakers) && void 0 !== n2 ? n2 : []) : "leave" === i2.case ? this.onLeave && this.onLeave(i2.value) : "mute" === i2.case ? this.onRemoteMuteChanged && this.onRemoteMuteChanged(i2.value.sid, i2.value.muted) : "roomUpdate" === i2.case ? this.onRoomUpdate && i2.value.room && this.onRoomUpdate(i2.value.room) : "connectionQuality" === i2.case ? this.onConnectionQuality && this.onConnectionQuality(i2.value) : "streamStateUpdate" === i2.case ? this.onStreamStateUpdate && this.onStreamStateUpdate(i2.value) : "subscribedQualityUpdate" === i2.case ? this.onSubscribedQualityUpdate && this.onSubscribedQualityUpdate(i2.value) : "subscriptionPermissionUpdate" === i2.case ? this.onSubscriptionPermissionUpdate && this.onSubscriptionPermissionUpdate(i2.value) : "refreshToken" === i2.case ? this.onTokenRefresh && this.onTokenRefresh(i2.value) : "trackUnpublished" === i2.case ? this.onLocalTrackUnpublished && this.onLocalTrackUnpublished(i2.value) : "subscriptionResponse" === i2.case ? this.onSubscriptionError && this.onSubscriptionError(i2.value) : "pong" === i2.case || ("pongResp" === i2.case ? (this.rtt = Date.now() - Number.parseInt(i2.value.lastPingTimestamp.toString()), this.resetPingTimeout(), r2 = true) : "requestResponse" === i2.case ? this.onRequestResponse && this.onRequestResponse(i2.value) : "trackSubscribed" === i2.case ? this.onLocalTrackSubscribed && this.onLocalTrackSubscribed(i2.value.trackSid) : "roomMoved" === i2.case ? (this.onTokenRefresh && this.onTokenRefresh(i2.value.token), this.onRoomMoved && this.onRoomMoved(i2.value)) : "mediaSectionsRequirement" === i2.case ? this.onMediaSectionsRequirement && this.onMediaSectionsRequirement(i2.value) : "publishDataTrackResponse" === i2.case ? this.onPublishDataTrackResponse && this.onPublishDataTrackResponse(i2.value) : "unpublishDataTrackResponse" === i2.case ? this.onUnPublishDataTrackResponse && this.onUnPublishDataTrackResponse(i2.value) : "dataTrackSubscriberHandles" === i2.case ? this.onDataTrackSubscriberHandles && this.onDataTrackSubscriberHandles(i2.value) : this.log.debug("unsupported message", { msgCase: i2.case }));
      r2 || this.resetPingTimeout();
    }
    setReconnected() {
      for (; this.queuedRequests.length > 0; ) {
        const e2 = this.queuedRequests.shift();
        e2 && this.requestQueue.run(e2);
      }
    }
    handleOnClose(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.attemptId, i2 = arguments.length > 2 ? arguments[2] : void 0;
        return (function* () {
          const r2 = t2.onClose;
          t2.sendLifecycleInput({ type: "transportFailed", attemptId: n2, reason: e3 }) ? (yield t2.teardownTransport(e3), t2.log.info("websocket connection closed: ".concat(e3), { reason: e3 }), i2 && (t2.log.info("waiting for ".concat(i2, "ms until reconnecting signal")), yield Js(i2)), r2 && r2(e3)) : t2.log.debug("ignoring transport close in state ".concat(t2.lifecycleState), { reason: e3, attemptId: n2, currentAttemptId: t2.attemptId });
        })();
      }));
    }
    handleWSError(e2) {
      this.log.error("websocket error", { error: e2 });
    }
    resetPingTimeout() {
      this.clearPingTimeout(), this.pingTimeoutDuration ? this.pingTimeout = ls.setTimeout((() => {
        this.log.warn("ping timeout triggered. last pong received at: ".concat(new Date(Date.now() - 1e3 * this.pingTimeoutDuration).toUTCString())), this.handleOnClose("ping timeout");
      }), 1e3 * this.pingTimeoutDuration) : this.log.warn("ping timeout duration not set");
    }
    clearPingTimeout() {
      this.pingTimeout && ls.clearTimeout(this.pingTimeout);
    }
    startPingInterval() {
      this.clearPingInterval(), this.resetPingTimeout(), this.pingIntervalDuration ? (this.log.debug("start ping interval"), this.pingInterval = ls.setInterval((() => {
        this.sendPing();
      }), 1e3 * this.pingIntervalDuration)) : this.log.warn("ping interval duration not set");
    }
    clearPingInterval() {
      this.log.debug("clearing ping interval"), this.clearPingTimeout(), this.pingInterval && ls.clearInterval(this.pingInterval);
    }
    handleSignalConnected(e2, t2, n2) {
      clearTimeout(t2);
      this.sendLifecycleInput("reconnecting" === this.lifecycleState ? { type: "reconnectComplete", attemptId: n2 } : { type: "connectComplete", attemptId: n2 }) ? (this.log.info("signal connected"), this.startPingInterval(), this.startReadingLoop(e2.readable.getReader())) : this.log.debug("discarding a connection whose attempt no longer owns the session", { attemptId: n2, currentAttemptId: this.attemptId, state: this.lifecycleState });
    }
    validateFirstMessage(e2, t2) {
      var n2, i2, r2, o2;
      return "join" === (null === (n2 = e2.message) || void 0 === n2 ? void 0 : n2.case) || "reconnecting" === this.lifecycleState && "reconnect" === (null === (i2 = e2.message) || void 0 === i2 ? void 0 : i2.case) ? { isValid: true, response: e2.message.value } : this.isEstablishingConnection && "leave" === (null === (r2 = e2.message) || void 0 === r2 ? void 0 : r2.case) ? { isValid: false, error: Zo.leaveRequest("Received leave request while trying to (re)connect", e2.message.value.reason) } : t2 ? { isValid: false, error: Zo.internal("Unexpected first message") } : { isValid: false, error: Zo.internal("did not receive join response, got ".concat(null === (o2 = e2.message) || void 0 === o2 ? void 0 : o2.case, " instead")) };
    }
    handleConnectionError(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        try {
          const n2 = yield fetch(t2, { signal: ed(3e3) });
          switch (n2.status) {
            case 404:
              const e3 = yield n2.text();
              return e3.includes("requested room does not exist") ? Zo.notAllowed(e3, n2.status) : Zo.serviceNotFound("v1 RTC path not found. Consider upgrading your LiveKit server version", "v0-rtc");
            case 401:
            case 403:
              const t3 = yield n2.text();
              return Zo.notAllowed(t3, n2.status);
          }
          return e2 instanceof Zo ? e2 : Zo.internal("Encountered unknown websocket error during connection: ".concat(e2), { status: n2.status, statusText: n2.statusText });
        } catch (n2) {
          return n2 instanceof Zo ? n2 : Zo.serverUnreachable(n2 instanceof Error ? n2.message : "server was not reachable");
        }
      }));
    }
  }
  function Cd(e2) {
    const t2 = { type: "offer", sdp: e2.sdp };
    switch (e2.type) {
      case "answer":
      case "offer":
      case "pranswer":
      case "rollback":
        t2.type = e2.type;
    }
    return t2;
  }
  function wd(e2, t2) {
    return new ri({ sdp: e2.sdp, type: e2.type, id: t2 });
  }
  class Rd {
    constructor(e2) {
      this._map = /* @__PURE__ */ new Map(), this._lastCleanup = 0, this.ttl = e2;
    }
    set(e2, t2) {
      const n2 = Date.now();
      n2 - this._lastCleanup > this.ttl / 2 && this.cleanup();
      const i2 = n2 + this.ttl;
      return this._map.set(e2, { value: t2, expiresAt: i2 }), this;
    }
    get(e2) {
      const t2 = this._map.get(e2);
      if (t2) {
        if (!(t2.expiresAt < Date.now())) return t2.value;
        this._map.delete(e2);
      }
    }
    has(e2) {
      const t2 = this._map.get(e2);
      return !!t2 && (!(t2.expiresAt < Date.now()) || (this._map.delete(e2), false));
    }
    delete(e2) {
      return this._map.delete(e2);
    }
    clear() {
      this._map.clear();
    }
    cleanup() {
      const e2 = Date.now();
      for (const n2 of this._map.entries()) {
        var t2 = j(n2, 2);
        const i2 = t2[0];
        t2[1].expiresAt < e2 && this._map.delete(i2);
      }
      this._lastCleanup = e2;
    }
    get size() {
      return this.cleanup(), this._map.size;
    }
    forEach(e2) {
      this.cleanup();
      for (const n2 of this._map.entries()) {
        var t2 = j(n2, 2);
        const i2 = t2[0], r2 = t2[1];
        r2.expiresAt >= Date.now() && e2(r2.value, i2, this.asValueMap());
      }
    }
    map(e2) {
      this.cleanup();
      const t2 = [], n2 = this.asValueMap();
      for (const r2 of n2.entries()) {
        var i2 = j(r2, 2);
        const o2 = i2[0], s2 = i2[1];
        t2.push(e2(s2, o2, n2));
      }
      return t2;
    }
    asValueMap() {
      const e2 = /* @__PURE__ */ new Map();
      for (const n2 of this._map.entries()) {
        var t2 = j(n2, 2);
        const i2 = t2[0], r2 = t2[1];
        r2.expiresAt >= Date.now() && e2.set(i2, r2.value);
      }
      return e2;
    }
  }
  var Pd, Id, _d, Md, Dd, Od = {}, Ad = {}, Ld = { exports: {} };
  function Nd() {
    if (Pd) return Ld.exports;
    Pd = 1;
    var e2 = Ld.exports = { v: [{ name: "version", reg: /^(\d*)$/ }], o: [{ name: "origin", reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/, names: ["username", "sessionId", "sessionVersion", "netType", "ipVer", "address"], format: "%s %s %d %s IP%d %s" }], s: [{ name: "name" }], i: [{ name: "description" }], u: [{ name: "uri" }], e: [{ name: "email" }], p: [{ name: "phone" }], z: [{ name: "timezones" }], r: [{ name: "repeats" }], t: [{ name: "timing", reg: /^(\d*) (\d*)/, names: ["start", "stop"], format: "%d %d" }], c: [{ name: "connection", reg: /^IN IP(\d) (\S*)/, names: ["version", "ip"], format: "IN IP%d %s" }], b: [{ push: "bandwidth", reg: /^(TIAS|AS|CT|RR|RS):(\d*)/, names: ["type", "limit"], format: "%s:%s" }], m: [{ reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/, names: ["type", "port", "protocol", "payloads"], format: "%s %d %s %s" }], a: [{ push: "rtp", reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/, names: ["payload", "codec", "rate", "encoding"], format: function(e3) {
      return e3.encoding ? "rtpmap:%d %s/%s/%s" : e3.rate ? "rtpmap:%d %s/%s" : "rtpmap:%d %s";
    } }, { push: "fmtp", reg: /^fmtp:(\d*) ([\S| ]*)/, names: ["payload", "config"], format: "fmtp:%d %s" }, { name: "control", reg: /^control:(.*)/, format: "control:%s" }, { name: "rtcp", reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/, names: ["port", "netType", "ipVer", "address"], format: function(e3) {
      return null != e3.address ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
    } }, { push: "rtcpFbTrrInt", reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/, names: ["payload", "value"], format: "rtcp-fb:%s trr-int %d" }, { push: "rtcpFb", reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/, names: ["payload", "type", "subtype"], format: function(e3) {
      return null != e3.subtype ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
    } }, { push: "ext", reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/, names: ["value", "direction", "encrypt-uri", "uri", "config"], format: function(e3) {
      return "extmap:%d" + (e3.direction ? "/%s" : "%v") + (e3["encrypt-uri"] ? " %s" : "%v") + " %s" + (e3.config ? " %s" : "");
    } }, { name: "extmapAllowMixed", reg: /^(extmap-allow-mixed)/ }, { push: "crypto", reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/, names: ["id", "suite", "config", "sessionConfig"], format: function(e3) {
      return null != e3.sessionConfig ? "crypto:%d %s %s %s" : "crypto:%d %s %s";
    } }, { name: "setup", reg: /^setup:(\w*)/, format: "setup:%s" }, { name: "connectionType", reg: /^connection:(new|existing)/, format: "connection:%s" }, { name: "mid", reg: /^mid:([^\s]*)/, format: "mid:%s" }, { name: "msid", reg: /^msid:(.*)/, format: "msid:%s" }, { name: "ptime", reg: /^ptime:(\d*(?:\.\d*)*)/, format: "ptime:%d" }, { name: "maxptime", reg: /^maxptime:(\d*(?:\.\d*)*)/, format: "maxptime:%d" }, { name: "direction", reg: /^(sendrecv|recvonly|sendonly|inactive)/ }, { name: "icelite", reg: /^(ice-lite)/ }, { name: "iceUfrag", reg: /^ice-ufrag:(\S*)/, format: "ice-ufrag:%s" }, { name: "icePwd", reg: /^ice-pwd:(\S*)/, format: "ice-pwd:%s" }, { name: "fingerprint", reg: /^fingerprint:(\S*) (\S*)/, names: ["type", "hash"], format: "fingerprint:%s %s" }, { push: "candidates", reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/, names: ["foundation", "component", "transport", "priority", "ip", "port", "type", "raddr", "rport", "tcptype", "generation", "network-id", "network-cost"], format: function(e3) {
      var t2 = "candidate:%s %d %s %d %s %d typ %s";
      return t2 += null != e3.raddr ? " raddr %s rport %d" : "%v%v", t2 += null != e3.tcptype ? " tcptype %s" : "%v", null != e3.generation && (t2 += " generation %d"), t2 += null != e3["network-id"] ? " network-id %d" : "%v", t2 += null != e3["network-cost"] ? " network-cost %d" : "%v";
    } }, { name: "endOfCandidates", reg: /^(end-of-candidates)/ }, { name: "remoteCandidates", reg: /^remote-candidates:(.*)/, format: "remote-candidates:%s" }, { name: "iceOptions", reg: /^ice-options:(\S*)/, format: "ice-options:%s" }, { push: "ssrcs", reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/, names: ["id", "attribute", "value"], format: function(e3) {
      var t2 = "ssrc:%d";
      return null != e3.attribute && (t2 += " %s", null != e3.value && (t2 += ":%s")), t2;
    } }, { push: "ssrcGroups", reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/, names: ["semantics", "ssrcs"], format: "ssrc-group:%s %s" }, { name: "msidSemantic", reg: /^msid-semantic:\s?(\w*) (\S*)/, names: ["semantic", "token"], format: "msid-semantic: %s %s" }, { push: "groups", reg: /^group:(\w*) (.*)/, names: ["type", "mids"], format: "group:%s %s" }, { name: "rtcpMux", reg: /^(rtcp-mux)/ }, { name: "rtcpRsize", reg: /^(rtcp-rsize)/ }, { name: "sctpmap", reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/, names: ["sctpmapNumber", "app", "maxMessageSize"], format: function(e3) {
      return null != e3.maxMessageSize ? "sctpmap:%s %s %s" : "sctpmap:%s %s";
    } }, { name: "xGoogleFlag", reg: /^x-google-flag:([^\s]*)/, format: "x-google-flag:%s" }, { push: "rids", reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/, names: ["id", "direction", "params"], format: function(e3) {
      return e3.params ? "rid:%s %s %s" : "rid:%s %s";
    } }, { push: "imageattrs", reg: new RegExp("^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"), names: ["pt", "dir1", "attrs1", "dir2", "attrs2"], format: function(e3) {
      return "imageattr:%s %s %s" + (e3.dir2 ? " %s %s" : "");
    } }, { name: "simulcast", reg: new RegExp("^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"), names: ["dir1", "list1", "dir2", "list2"], format: function(e3) {
      return "simulcast:%s %s" + (e3.dir2 ? " %s %s" : "");
    } }, { name: "simulcast_03", reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/, names: ["value"], format: "simulcast: %s" }, { name: "framerate", reg: /^framerate:(\d+(?:$|\.\d+))/, format: "framerate:%s" }, { name: "sourceFilter", reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/, names: ["filterMode", "netType", "addressTypes", "destAddress", "srcList"], format: "source-filter: %s %s %s %s %s" }, { name: "bundleOnly", reg: /^(bundle-only)/ }, { name: "label", reg: /^label:(.+)/, format: "label:%s" }, { name: "sctpPort", reg: /^sctp-port:(\d+)$/, format: "sctp-port:%s" }, { name: "maxMessageSize", reg: /^max-message-size:(\d+)$/, format: "max-message-size:%s" }, { push: "tsRefClocks", reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/, names: ["clksrc", "clksrcExt"], format: function(e3) {
      return "ts-refclk:%s" + (null != e3.clksrcExt ? "=%s" : "");
    } }, { name: "mediaClk", reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/, names: ["id", "mediaClockName", "mediaClockValue", "rateNumerator", "rateDenominator"], format: function(e3) {
      var t2 = "mediaclk:";
      return t2 += null != e3.id ? "id=%s %s" : "%v%s", t2 += null != e3.mediaClockValue ? "=%s" : "", t2 += null != e3.rateNumerator ? " rate=%s" : "", t2 += null != e3.rateDenominator ? "/%s" : "";
    } }, { name: "keywords", reg: /^keywds:(.+)$/, format: "keywds:%s" }, { name: "content", reg: /^content:(.+)/, format: "content:%s" }, { name: "bfcpFloorCtrl", reg: /^floorctrl:(c-only|s-only|c-s)/, format: "floorctrl:%s" }, { name: "bfcpConfId", reg: /^confid:(\d+)/, format: "confid:%s" }, { name: "bfcpUserId", reg: /^userid:(\d+)/, format: "userid:%s" }, { name: "bfcpFloorId", reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/, names: ["id", "mStream"], format: "floorid:%s mstrm:%s" }, { push: "invalid", names: ["value"] }] };
    return Object.keys(e2).forEach((function(t2) {
      e2[t2].forEach((function(e3) {
        e3.reg || (e3.reg = /(.*)/), e3.format || (e3.format = "%s");
      }));
    })), Ld.exports;
  }
  function xd() {
    return Id || (Id = 1, (function(e2) {
      var t2 = function(e3) {
        return String(Number(e3)) === e3 ? Number(e3) : e3;
      }, n2 = function(e3, n3, i3) {
        var r3 = e3.name && e3.names;
        e3.push && !n3[e3.push] ? n3[e3.push] = [] : r3 && !n3[e3.name] && (n3[e3.name] = {});
        var o3 = e3.push ? {} : r3 ? n3[e3.name] : n3;
        !(function(e4, n4, i4, r4) {
          if (r4 && !i4) n4[r4] = t2(e4[1]);
          else for (var o4 = 0; o4 < i4.length; o4 += 1) null != e4[o4 + 1] && (n4[i4[o4]] = t2(e4[o4 + 1]));
        })(i3.match(e3.reg), o3, e3.names, e3.name), e3.push && n3[e3.push].push(o3);
      }, i2 = Nd(), r2 = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
      e2.parse = function(e3) {
        var t3 = {}, o3 = [], s2 = t3;
        return e3.split(/(\r\n|\r|\n)/).filter(r2).forEach((function(e4) {
          var t4 = e4[0], r3 = e4.slice(2);
          "m" === t4 && (o3.push({ rtp: [], fmtp: [] }), s2 = o3[o3.length - 1]);
          for (var a2 = 0; a2 < (i2[t4] || []).length; a2 += 1) {
            var c2 = i2[t4][a2];
            if (c2.reg.test(r3)) return n2(c2, s2, r3);
          }
        })), t3.media = o3, t3;
      };
      var o2 = function(e3, n3) {
        var i3 = n3.split(/=(.+)/, 2);
        return 2 === i3.length ? e3[i3[0]] = t2(i3[1]) : 1 === i3.length && n3.length > 1 && (e3[i3[0]] = void 0), e3;
      };
      e2.parseParams = function(e3) {
        return e3.split(/;\s?/).reduce(o2, {});
      }, e2.parseFmtpConfig = e2.parseParams, e2.parsePayloads = function(e3) {
        return e3.toString().split(" ").map(Number);
      }, e2.parseRemoteCandidates = function(e3) {
        for (var n3 = [], i3 = e3.split(" ").map(t2), r3 = 0; r3 < i3.length; r3 += 3) n3.push({ component: i3[r3], ip: i3[r3 + 1], port: i3[r3 + 2] });
        return n3;
      }, e2.parseImageAttributes = function(e3) {
        return e3.split(" ").map((function(e4) {
          return e4.substring(1, e4.length - 1).split(",").reduce(o2, {});
        }));
      }, e2.parseSimulcastStreamList = function(e3) {
        return e3.split(";").map((function(e4) {
          return e4.split(",").map((function(e5) {
            var n3, i3 = false;
            return "~" !== e5[0] ? n3 = t2(e5) : (n3 = t2(e5.substring(1, e5.length)), i3 = true), { scid: n3, paused: i3 };
          }));
        }));
      };
    })(Ad)), Ad;
  }
  function Ud() {
    if (Md) return _d;
    Md = 1;
    var e2 = Nd(), t2 = /%[sdv%]/g, n2 = function(e3) {
      var n3 = 1, i3 = arguments, r3 = i3.length;
      return e3.replace(t2, (function(e4) {
        if (n3 >= r3) return e4;
        var t3 = i3[n3];
        switch (n3 += 1, e4) {
          case "%%":
            return "%";
          case "%s":
            return String(t3);
          case "%d":
            return Number(t3);
          case "%v":
            return "";
        }
      }));
    }, i2 = function(e3, t3, i3) {
      var r3 = [e3 + "=" + (t3.format instanceof Function ? t3.format(t3.push ? i3 : i3[t3.name]) : t3.format)];
      if (t3.names) for (var o3 = 0; o3 < t3.names.length; o3 += 1) {
        var s2 = t3.names[o3];
        t3.name ? r3.push(i3[t3.name][s2]) : r3.push(i3[t3.names[o3]]);
      }
      else r3.push(i3[t3.name]);
      return n2.apply(null, r3);
    }, r2 = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"], o2 = ["i", "c", "b", "a"];
    return _d = function(t3, n3) {
      n3 = n3 || {}, null == t3.version && (t3.version = 0), null == t3.name && (t3.name = " "), t3.media.forEach((function(e3) {
        null == e3.payloads && (e3.payloads = "");
      }));
      var s2 = n3.outerOrder || r2, a2 = n3.innerOrder || o2, c2 = [];
      return s2.forEach((function(n4) {
        e2[n4].forEach((function(e3) {
          e3.name in t3 && null != t3[e3.name] ? c2.push(i2(n4, e3, t3)) : e3.push in t3 && null != t3[e3.push] && t3[e3.push].forEach((function(t4) {
            c2.push(i2(n4, e3, t4));
          }));
        }));
      })), t3.media.forEach((function(t4) {
        c2.push(i2("m", e2.m[0], t4)), a2.forEach((function(n4) {
          e2[n4].forEach((function(e3) {
            e3.name in t4 && null != t4[e3.name] ? c2.push(i2(n4, e3, t4)) : e3.push in t4 && null != t4[e3.push] && t4[e3.push].forEach((function(t5) {
              c2.push(i2(n4, e3, t5));
            }));
          }));
        }));
      })), c2.join("\r\n") + "\r\n";
    }, _d;
  }
  var Fd = (function() {
    if (Dd) return Od;
    Dd = 1;
    var e2 = xd(), t2 = Ud(), n2 = Nd();
    return Od.grammar = n2, Od.write = t2, Od.parse = e2.parse, Od.parseParams = e2.parseParams, Od.parseFmtpConfig = e2.parseFmtpConfig, Od.parsePayloads = e2.parsePayloads, Od.parseRemoteCandidates = e2.parseRemoteCandidates, Od.parseImageAttributes = e2.parseImageAttributes, Od.parseSimulcastStreamList = e2.parseSimulcastStreamList, Od;
  })();
  const jd = 1e3, Bd = 300, qd = 1500;
  function Vd(e2, t2, n2) {
    var i2, r2, o2;
    if (null === (i2 = e2.msid) || void 0 === i2 ? void 0 : i2.includes(t2)) return null !== (o2 = null === (r2 = e2.rtp.find(((e3) => e3.codec.toUpperCase() === n2.toUpperCase()))) || void 0 === r2 ? void 0 : r2.payload) && void 0 !== o2 ? o2 : 0;
  }
  function Wd(e2, t2) {
    if (e2.maxbr < 300) return;
    const n2 = Math.min(Math.round(0.9 * e2.maxbr), e2.maxbr);
    if (e2.isScreenShare) return n2;
    const i2 = Math.min((function(e3) {
      if (void 0 === e3) return jd;
      const t3 = Math.min(Math.max((e3 - qd) / 2e3, 0), 1);
      return Math.round(jd - 700 * t3);
    })(t2), (function() {
      const e3 = "undefined" != typeof navigator ? navigator.connection : void 0;
      switch (null == e3 ? void 0 : e3.effectiveType) {
        case "slow-2g":
        case "2g":
          return Bd;
        case "3g":
          return 500;
        default:
          return jd;
      }
    })());
    return Math.min(n2, i2);
  }
  const Hd = "negotiationStarted", Kd = "negotiationComplete", zd = "offerAnswered", Gd = "rtpVideoPayloadTypes";
  class Jd extends wr.EventEmitter {
    get pc() {
      return this._pc || (this._pc = this.createPC()), this._pc;
    }
    constructor(t2) {
      let i2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      var o2;
      super(), this.log = ar, this.iceLog = ar, this.ddExtID = 0, this.latestOfferId = 0, this.answeredOfferId = 0, this.latestAcknowledgedOfferId = 0, this.pendingCandidates = [], this.restartingIce = false, this.renegotiate = false, this.trackBitrates = [], this.hasAppliedVideoStartBitrate = false, this.remoteStereoMids = [], this.remoteNackMids = [], this.negotiate = wc(((e2) => kr(this, void 0, void 0, (function* () {
        this.emit(Hd);
        try {
          yield this.createAndSendOffer();
        } catch (n2) {
          if (!e2) throw n2;
          e2(n2);
        }
      }))), 20), this.close = () => {
        this._pc && (this.log.debug("closing peer connection"), this.pendingInitialOffer = void 0, this._pc.close(), this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc.onicegatheringstatechange = null, this._pc.ondatachannel = null, this._pc.onnegotiationneeded = null, this._pc.onsignalingstatechange = null, this._pc.onicecandidate = null, this._pc.ondatachannel = null, this._pc.ontrack = null, this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc = null);
      }, this.loggerOptions = i2, this.log = dr(null !== (o2 = i2.loggerName) && void 0 !== o2 ? o2 : e.LoggerNames.PCTransport, (() => this.logContext)), this.iceLog = dr(e.LoggerNames.ICE, (() => this.logContext)), this.config = t2, this._pc = this.createPC(), this.offerLock = new r();
    }
    createPC() {
      const e2 = new RTCPeerConnection(this.config);
      return e2.onicecandidate = (e3) => {
        var t2;
        e3.candidate && (this.iceLog.debug("local ICE candidate gathered", { candidate: e3.candidate.candidate }), null === (t2 = this.onIceCandidate) || void 0 === t2 || t2.call(this, e3.candidate));
      }, e2.onicecandidateerror = (e3) => {
        var t2;
        this.iceLog.debug("ICE candidate error", { event: e3 }), null === (t2 = this.onIceCandidateError) || void 0 === t2 || t2.call(this, e3);
      }, e2.oniceconnectionstatechange = () => {
        var t2;
        this.iceLog.debug("ICE connection state: ".concat(e2.iceConnectionState)), null === (t2 = this.onIceConnectionStateChange) || void 0 === t2 || t2.call(this, e2.iceConnectionState);
      }, e2.onsignalingstatechange = () => {
        var t2;
        this.log.debug("signaling state: ".concat(e2.signalingState)), null === (t2 = this.onSignalingStatechange) || void 0 === t2 || t2.call(this, e2.signalingState);
      }, e2.onconnectionstatechange = () => {
        var t2;
        this.log.debug("connection state: ".concat(e2.connectionState)), null === (t2 = this.onConnectionStateChange) || void 0 === t2 || t2.call(this, e2.connectionState);
      }, e2.ondatachannel = (e3) => {
        var t2;
        this.log.debug("data channel opened by peer", { label: e3.channel.label, id: e3.channel.id }), null === (t2 = this.onDataChannel) || void 0 === t2 || t2.call(this, e3);
      }, e2.ontrack = (e3) => {
        var t2;
        null === (t2 = this.onTrack) || void 0 === t2 || t2.call(this, e3);
      }, e2;
    }
    get logContext() {
      var e2, t2;
      return Object.assign({}, null === (t2 = (e2 = this.loggerOptions).loggerContextCb) || void 0 === t2 ? void 0 : t2.call(e2));
    }
    get isICEConnected() {
      return null !== this._pc && ("connected" === this.pc.iceConnectionState || "completed" === this.pc.iceConnectionState);
    }
    addIceCandidate(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.pc.remoteDescription && !this.restartingIce) return this.pc.addIceCandidate(e2);
        this.iceLog.debug("queuing remote ICE candidate until remote description applied", { pendingCount: this.pendingCandidates.length + 1 }), this.pendingCandidates.push(e2);
      }));
    }
    setRemoteDescription(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        if ("answer" === e2.type && this.latestOfferId > 0 && t2 > 0 && t2 !== this.latestOfferId) return this.log.warn("ignoring answer for old offer", { offerId: t2, latestOfferId: this.latestOfferId }), false;
        if ("answer" === e2.type) {
          if ((function(e3, t3, n3, i2, r2) {
            return t3 === e3 || (e3 > 0 ? e3 === n3 : "stable" === i2 && !r2);
          })(t2, this.answerInFlight, this.answeredOfferId, null === (n2 = this._pc) || void 0 === n2 ? void 0 : n2.signalingState, void 0 !== this.pendingInitialOffer)) return this.log.warn("ignoring duplicate answer", { offerId: t2 }), false;
          this.answerInFlight = t2;
        }
        try {
          return yield this.applyRemoteDescription(e2, t2);
        } finally {
          "answer" === e2.type && (this.answerInFlight = void 0);
        }
      }));
    }
    applyRemoteDescription(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2;
        let r2;
        if ("offer" === e2.type) {
          let t3 = (function(e3) {
            var t4;
            const n4 = [], i4 = [], r3 = Fd.parse(null !== (t4 = e3.sdp) && void 0 !== t4 ? t4 : "");
            let o2 = 0;
            return r3.media.forEach(((e4) => {
              var t5;
              const r4 = el(e4.mid);
              "audio" === e4.type && (e4.rtp.some(((e5) => "opus" === e5.codec.toLowerCase() && (o2 = e5.payload, true))), (null === (t5 = e4.rtcpFb) || void 0 === t5 ? void 0 : t5.some(((e5) => e5.payload === o2 && "nack" === e5.type))) && i4.push(r4), e4.fmtp.some(((e5) => e5.payload === o2 && (Yd(e5.config, "sprop-stereo=1") && n4.push(r4), true))));
            })), { stereoMids: n4, nackMids: i4 };
          })(e2), n3 = t3.stereoMids, i3 = t3.nackMids;
          this.remoteStereoMids = n3, this.remoteNackMids = i3;
        } else if ("answer" === e2.type) {
          if (this.pendingInitialOffer && this._pc) {
            const e3 = this.pendingInitialOffer;
            this.pendingInitialOffer = void 0;
            const t4 = Fd.parse(null !== (n2 = e3.sdp) && void 0 !== n2 ? n2 : "");
            t4.media.forEach(((e4) => {
              $d(e4);
            })), this.log.debug("setting pending initial offer before processing answer"), yield this.setMungedSDP(e3, Fd.write(t4));
          }
          const t3 = Fd.parse(null !== (i2 = e2.sdp) && void 0 !== i2 ? i2 : "");
          t3.media.forEach(((e3) => {
            const t4 = el(e3.mid);
            "audio" === e3.type && this.trackBitrates.some(((n3) => {
              if (!n3.transceiver || t4 != n3.transceiver.mid) return false;
              let i3 = 0;
              if (e3.rtp.some(((e4) => e4.codec.toUpperCase() === n3.codec.toUpperCase() && (i3 = e4.payload, true))), 0 === i3) return true;
              let r3 = false;
              for (const t5 of e3.fmtp) if (t5.payload === i3) {
                t5.config = t5.config.split(";").filter(((e4) => !e4.includes("maxaveragebitrate"))).join(";"), n3.maxbr > 0 && (t5.config += ";maxaveragebitrate=".concat(1e3 * n3.maxbr)), r3 = true;
                break;
              }
              return r3 || n3.maxbr > 0 && e3.fmtp.push({ payload: i3, config: "maxaveragebitrate=".concat(1e3 * n3.maxbr) }), true;
            }));
          }));
          const o2 = this.getPlaceholderMids();
          o2.size > 0 && Zd(t3.media, ((e3) => o2.has(el(e3.mid)))), r2 = Fd.write(t3);
        }
        if (yield this.setMungedSDP(e2, r2, true), "answer" === e2.type && t2 > 0 && (this.answeredOfferId = t2), this.pendingCandidates.length > 0 && this.iceLog.debug("flushing queued ICE candidates", { count: this.pendingCandidates.length }), this.pendingCandidates.forEach(((e3) => {
          this.pc.addIceCandidate(e3);
        })), this.pendingCandidates = [], this.restartingIce = false, "answer" === e2.type && (this.latestAcknowledgedOfferId = t2, this.emit(zd, t2)), this.renegotiate) this.renegotiate = false, yield this.createAndSendOffer();
        else if ("answer" === e2.type && (this.emit(Kd), e2.sdp)) {
          Fd.parse(e2.sdp).media.forEach(((e3) => {
            "video" === e3.type && this.emit(Gd, e3.rtp);
          }));
        }
        return true;
      }));
    }
    createInitialOffer() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        const t2 = yield this.offerLock.lock();
        try {
          if ("stable" !== this.pc.signalingState) return void this.log.warn("signaling state is not stable, cannot create initial offer");
          const t3 = this.latestOfferId + 1;
          this.latestOfferId = t3;
          const n2 = yield this.pc.createOffer();
          this.pendingInitialOffer = { sdp: n2.sdp, type: n2.type };
          const i2 = Fd.parse(null !== (e2 = n2.sdp) && void 0 !== e2 ? e2 : "");
          return i2.media.forEach(((e3) => {
            $d(e3);
          })), n2.sdp = Fd.write(i2), { offer: n2, offerId: t3 };
        } finally {
          t2();
        }
      }));
    }
    createAndSendOffer(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2;
        const n2 = yield this.offerLock.lock();
        try {
          if (void 0 === this.onOffer) return;
          if ((null == e2 ? void 0 : e2.iceRestart) && (this.iceLog.debug("restarting ICE"), this.restartingIce = true), this._pc && ("have-local-offer" === this._pc.signalingState || this.pendingInitialOffer)) {
            const t3 = this._pc.remoteDescription;
            if (!(null == e2 ? void 0 : e2.iceRestart) || !t3) {
              if (null == e2 ? void 0 : e2.iceRestart) throw new rs("ICE restart requested without a remote description, peer connection must be recreated");
              return this.renegotiate = true, void this.log.debug("requesting renegotiation");
            }
            yield this._pc.setRemoteDescription(t3);
          } else if (!this._pc || "closed" === this._pc.signalingState) return void this.log.warn("could not createOffer with closed peer connection");
          this.log.debug("starting to negotiate");
          const n3 = this.latestOfferId + 1;
          this.latestOfferId = n3;
          const i2 = yield this.pc.createOffer(e2);
          this.log.debug("original offer", { sdp: i2.sdp });
          const r2 = Fd.parse(null !== (t2 = i2.sdp) && void 0 !== t2 ? t2 : ""), o2 = this.hasAppliedVideoStartBitrate ? void 0 : (function(e3, t3, n4) {
            let i3;
            for (const r3 of e3) if ("video" === r3.type && "recvonly" !== r3.direction && "inactive" !== r3.direction) for (const e4 of t3) {
              if (!e4.cid) continue;
              const t4 = Vd(r3, e4.cid, e4.codec);
              if (void 0 === t4) continue;
              const o3 = t4 > 0 ? Wd(e4, n4) : void 0;
              void 0 !== o3 && (void 0 === i3 || o3 > i3) && (i3 = o3);
              break;
            }
            return i3;
          })(r2.media, this.trackBitrates, this.connectionSetupTimeEstimateMs());
          let s2 = false;
          r2.media.forEach(((e3) => {
            $d(e3), "audio" === e3.type ? Xd(e3, ["all"], []) : "video" === e3.type && this.trackBitrates.some(((t3) => {
              if (!t3.cid) return false;
              const n4 = Vd(e3, t3.cid, t3.codec);
              return void 0 !== n4 && (n4 > 0 && (void 0 !== o2 && (s2 = (function(e4, t4, n5) {
                const i3 = e4.fmtp.find(((e5) => e5.payload === t4));
                return i3 ? i3.config.includes("x-google-start-bitrate") || (i3.config += ";x-google-start-bitrate=".concat(n5)) : e4.fmtp.push({ payload: t4, config: "x-google-start-bitrate=".concat(n5) }), true;
              })(e3, n4, o2) || s2), $s(t3.codec) && !ca() && (this.ddExtID = (function(e4, t4, n5) {
                var i3, r3;
                const o3 = (function(e5, t5) {
                  const n6 = (function(e6, t6) {
                    var n7;
                    for (const i4 of e6.media) {
                      const e7 = null === (n7 = i4.ext) || void 0 === n7 ? void 0 : n7.find(((e8) => e8.uri === t6));
                      if (e7) return e7.value;
                    }
                    return;
                  })(e5, zs);
                  if (void 0 !== n6) return Qd(e5, n6, zs) ? void 0 : n6;
                  if (0 !== t5 && !Qd(e5, t5, zs)) return t5;
                  return (function(e6) {
                    let t6 = 0;
                    return e6.media.forEach(((e7) => {
                      var n7;
                      null === (n7 = e7.ext) || void 0 === n7 || n7.forEach(((e8) => {
                        e8.value > t6 && (t6 = e8.value);
                      }));
                    })), t6 + 1 === 15 ? 16 : t6 + 1;
                  })(e5);
                })(t4, n5);
                if (void 0 === o3) return n5;
                (null === (i3 = e4.ext) || void 0 === i3 ? void 0 : i3.some(((e5) => e5.uri === zs))) || (null !== (r3 = e4.ext) && void 0 !== r3 || (e4.ext = []), e4.ext.push({ value: o3, uri: zs }));
                return o3;
              })(e3, r2, this.ddExtID))), true);
            }));
          }));
          const a2 = this.getPlaceholderMids();
          if (a2.size > 0 && Zd(r2.media, ((e3) => a2.has(el(e3.mid)))), this.latestOfferId > n3) return void this.log.warn("latestOfferId mismatch", { latestOfferId: this.latestOfferId, offerId: n3 });
          const c2 = Fd.write(r2);
          yield this.setMungedSDP(i2, c2), s2 && i2.sdp === c2 && (this.hasAppliedVideoStartBitrate = true, this.log.info("applied x-google-start-bitrate", { startBitrateKbps: o2, connectionSetupTimeMs: this.connectionSetupTimeEstimateMs() })), this.onOffer(i2, this.latestOfferId);
        } finally {
          n2();
        }
      }));
    }
    createAndSetAnswer() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        const t2 = yield this.pc.createAnswer(), n2 = Fd.parse(null !== (e2 = t2.sdp) && void 0 !== e2 ? e2 : "");
        return n2.media.forEach(((e3) => {
          $d(e3), "audio" === e3.type && Xd(e3, this.remoteStereoMids, this.remoteNackMids);
        })), yield this.setMungedSDP(t2, Fd.write(n2)), t2;
      }));
    }
    getPlaceholderMids() {
      var e2, t2;
      return (function(e3) {
        const t3 = /* @__PURE__ */ new Set();
        for (const n2 of e3) n2.mid && !n2.sender.track && t3.add(n2.mid);
        return t3;
      })(null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.getTransceivers()) && void 0 !== t2 ? t2 : []);
    }
    createDataChannel(e2, t2) {
      return this.pc.createDataChannel(e2, t2);
    }
    addTransceiver(e2, t2) {
      return this.pc.addTransceiver(e2, t2);
    }
    addTransceiverOfKind(e2, t2) {
      return this.pc.addTransceiver(e2, t2);
    }
    addTrack(e2) {
      if (!this._pc) throw new is("PC closed, cannot add track");
      return this._pc.addTrack(e2);
    }
    setTrackCodecBitrate(e2) {
      this.trackBitrates.push(e2);
    }
    setConnectionSetupTime(e2) {
      this.connectionSetupTimeMs = e2;
    }
    setConnectionStartedAt(e2) {
      this.connectionStartedAt = e2;
    }
    connectionSetupTimeEstimateMs() {
      return void 0 !== this.connectionSetupTimeMs ? this.connectionSetupTimeMs : void 0 !== this.connectionStartedAt ? Math.round(performance.now() - this.connectionStartedAt) : void 0;
    }
    setConfiguration(e2) {
      var t2;
      if (!this._pc) throw new is("PC closed, cannot configure");
      return null === (t2 = this._pc) || void 0 === t2 ? void 0 : t2.setConfiguration(e2);
    }
    canRemoveTrack() {
      var e2;
      return !!(null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.removeTrack);
    }
    removeTrack(e2) {
      var t2;
      return null === (t2 = this._pc) || void 0 === t2 ? void 0 : t2.removeTrack(e2);
    }
    getConnectionState() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.connectionState) && void 0 !== t2 ? t2 : "closed";
    }
    getICEConnectionState() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.iceConnectionState) && void 0 !== t2 ? t2 : "closed";
    }
    getSignallingState() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.signalingState) && void 0 !== t2 ? t2 : "closed";
    }
    getTransceivers() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.getTransceivers()) && void 0 !== t2 ? t2 : [];
    }
    getSenders() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.getSenders()) && void 0 !== t2 ? t2 : [];
    }
    getLocalDescription() {
      var e2;
      return null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.localDescription;
    }
    getRemoteDescription() {
      var e2;
      return null === (e2 = this.pc) || void 0 === e2 ? void 0 : e2.remoteDescription;
    }
    getStats() {
      var e2;
      return null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.getStats();
    }
    getMaxMessageSize() {
      var e2, t2;
      return null === (t2 = null === (e2 = this._pc) || void 0 === e2 ? void 0 : e2.sctp) || void 0 === t2 ? void 0 : t2.maxMessageSize;
    }
    getConnectedAddress() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!this._pc) return;
        let t2 = "";
        const n2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Map();
        if ((yield this._pc.getStats()).forEach(((e3) => {
          switch (e3.type) {
            case "transport":
              t2 = e3.selectedCandidatePairId;
              break;
            case "candidate-pair":
              "" === t2 && e3.selected && (t2 = e3.id), n2.set(e3.id, e3);
              break;
            case "remote-candidate":
              i2.set(e3.id, "".concat(e3.address, ":").concat(e3.port));
          }
        })), "" === t2) return;
        const r2 = null === (e2 = n2.get(t2)) || void 0 === e2 ? void 0 : e2.remoteCandidateId;
        return void 0 !== r2 ? i2.get(r2) : void 0;
      }));
    }
    setMungedSDP(e2, t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        var r2, o2;
        const s2 = e2.sdp;
        if (t2) {
          e2.sdp = t2;
          try {
            return this.log.debug("setting munged ".concat(i2 ? "remote" : "local", " description")), void (i2 ? yield this.pc.setRemoteDescription(e2) : yield this.pc.setLocalDescription(e2));
          } catch (n2) {
            this.log.warn("not able to set ".concat(e2.type, ", falling back to unmodified sdp"), { error: n2, mungedSdp: t2, originalSdp: s2 }), e2.sdp = s2;
          }
        }
        try {
          i2 ? yield null === (r2 = this._pc) || void 0 === r2 ? void 0 : r2.setRemoteDescription(e2) : yield null === (o2 = this._pc) || void 0 === o2 ? void 0 : o2.setLocalDescription(e2);
        } catch (n2) {
          let o3 = "unknown error";
          n2 instanceof Error ? o3 = n2.message : "string" == typeof n2 && (o3 = n2);
          const a2 = { error: o3, sdp: e2.sdp };
          throw t2 && t2 !== s2 && (a2.mungedSdp = t2), !i2 && this.pc.remoteDescription && (a2.remoteSdp = this.pc.remoteDescription), this.log.error("unable to set ".concat(e2.type), { fields: a2 }), new rs(o3);
        }
      }));
    }
  }
  function Qd(e2, t2, n2) {
    return e2.media.some(((e3) => {
      var i2;
      return null === (i2 = e3.ext) || void 0 === i2 ? void 0 : i2.some(((e4) => e4.value === t2 && e4.uri !== n2));
    }));
  }
  function Yd(e2, t2) {
    return e2.split(";").some(((e3) => e3.trim() === t2));
  }
  function Xd(e2, t2, n2) {
    const i2 = el(e2.mid);
    let r2 = 0;
    e2.rtp.some(((e3) => "opus" === e3.codec.toLowerCase() && (r2 = e3.payload, true))), r2 > 0 && (e2.rtcpFb || (e2.rtcpFb = []), n2.includes(i2) && !e2.rtcpFb.some(((e3) => e3.payload === r2 && "nack" === e3.type)) && e2.rtcpFb.push({ payload: r2, type: "nack" }), (t2.includes(i2) || 1 === t2.length && "all" === t2[0]) && e2.fmtp.some(((e3) => e3.payload === r2 && (Yd(e3.config, "stereo=1") || (e3.config += ";stereo=1"), true))));
  }
  function Zd(e2, t2) {
    var n2, i2;
    const r2 = /* @__PURE__ */ new Map(), o2 = /* @__PURE__ */ new Set();
    for (const s2 of e2) {
      const e3 = t2(s2);
      for (const t3 of null !== (n2 = s2.fmtp) && void 0 !== n2 ? n2 : []) e3 ? r2.has(t3.payload) || r2.set(t3.payload, t3.config) : (r2.set(t3.payload, t3.config), o2.add(t3.payload));
    }
    if (0 !== r2.size) {
      for (const s2 of e2) if (t2(s2)) for (const e3 of null !== (i2 = s2.fmtp) && void 0 !== i2 ? i2 : []) {
        const t3 = r2.get(e3.payload);
        void 0 !== t3 && e3.config !== t3 && (e3.config = t3);
      }
    }
  }
  function $d(e2) {
    if (e2.connection) {
      const t2 = e2.connection.ip.indexOf(":") >= 0;
      (4 === e2.connection.version && t2 || 6 === e2.connection.version && !t2) && (e2.connection.ip = "0.0.0.0", e2.connection.version = 4);
    }
  }
  function el(e2) {
    return "number" == typeof e2 ? e2.toFixed(0) : e2;
  }
  const tl = "vp8", nl = { audioPreset: e.AudioPresets.music, dtx: true, red: true, forceStereo: false, simulcast: true, screenShareEncoding: Ps.h1080fps15.encoding, stopMicTrackOnMute: false, videoCodec: tl, backupCodec: true, preConnectBuffer: false }, il = { deviceId: { ideal: "default" }, autoGainControl: true, echoCancellation: true, noiseSuppression: true, voiceIsolation: true }, rl = { deviceId: { ideal: "default" }, resolution: ws.h720.resolution }, ol = { adaptiveStream: false, dynacast: false, stopLocalTrackOnUnpublish: true, reconnectPolicy: new vr(), disconnectOnPageLeave: true, webAudioMix: false, singlePeerConnection: true }, sl = { autoSubscribe: true, disableIceLite: false, maxRetries: 1, peerConnectionTimeout: 15e3, websocketTimeout: 15e3 };
  var al, cl;
  !(function(e2) {
    e2[e2.NEW = 0] = "NEW", e2[e2.CONNECTING = 1] = "CONNECTING", e2[e2.CONNECTED = 2] = "CONNECTED", e2[e2.FAILED = 3] = "FAILED", e2[e2.CLOSING = 4] = "CLOSING", e2[e2.CLOSED = 5] = "CLOSED";
  })(al || (al = {}));
  class dl {
    get needsPublisher() {
      return this.isPublisherConnectionRequired;
    }
    get needsSubscriber() {
      return this.isSubscriberConnectionRequired;
    }
    get currentState() {
      return this.state;
    }
    get mode() {
      return this._mode;
    }
    constructor(t2, n2, i2) {
      var o2;
      this.peerConnectionTimeout = sl.peerConnectionTimeout, this.log = ar, this.iceLog = ar, this.updateState = () => {
        var e2, t3;
        const n3 = this.state, i3 = this.requiredTransports.map(((e3) => e3.getConnectionState()));
        i3.every(((e3) => "connected" === e3)) ? this.state = al.CONNECTED : i3.some(((e3) => "failed" === e3)) ? this.state = al.FAILED : i3.some(((e3) => "connecting" === e3)) ? this.state = al.CONNECTING : i3.every(((e3) => "closed" === e3)) ? this.state = al.CLOSED : i3.some(((e3) => "closed" === e3)) ? this.state = al.CLOSING : i3.every(((e3) => "new" === e3)) && (this.state = al.NEW), n3 !== this.state && (this.log.debug("pc state change: from ".concat(al[n3], " to ").concat(al[this.state])), null === (e2 = this.onStateChange) || void 0 === e2 || e2.call(this, this.state, this.publisher.getConnectionState(), null === (t3 = this.subscriber) || void 0 === t3 ? void 0 : t3.getConnectionState()));
      }, this.loggerOptions = n2, this.log = dr(null !== (o2 = n2.loggerName) && void 0 !== o2 ? o2 : e.LoggerNames.PCManager, (() => this.logContext)), this.iceLog = dr(e.LoggerNames.ICE, (() => this.logContext)), this.isPublisherConnectionRequired = "subscriber-primary" !== t2, this.isSubscriberConnectionRequired = "subscriber-primary" === t2, this.publisher = new Jd(i2, n2), this._mode = t2, "publisher-only" !== t2 && (this.subscriber = new Jd(i2, n2), this.subscriber.onConnectionStateChange = this.updateState, this.subscriber.onIceConnectionStateChange = this.updateState, this.subscriber.onSignalingStatechange = this.updateState, this.subscriber.onIceCandidate = (e2) => {
        var t3;
        null === (t3 = this.onIceCandidate) || void 0 === t3 || t3.call(this, e2, jn.SUBSCRIBER);
      }, this.subscriber.onDataChannel = (e2) => {
        var t3;
        null === (t3 = this.onDataChannel) || void 0 === t3 || t3.call(this, e2);
      }, this.subscriber.onTrack = (e2) => {
        var t3;
        null === (t3 = this.onTrack) || void 0 === t3 || t3.call(this, e2);
      }), this.publisher.onConnectionStateChange = this.updateState, this.publisher.onIceConnectionStateChange = this.updateState, this.publisher.onSignalingStatechange = this.updateState, this.publisher.onIceCandidate = (e2) => {
        var t3;
        null === (t3 = this.onIceCandidate) || void 0 === t3 || t3.call(this, e2, jn.PUBLISHER);
      }, this.publisher.onTrack = (e2) => {
        var t3;
        null === (t3 = this.onTrack) || void 0 === t3 || t3.call(this, e2);
      }, this.publisher.onOffer = (e2, t3) => {
        var n3;
        null === (n3 = this.onPublisherOffer) || void 0 === n3 || n3.call(this, e2, t3);
      }, this.state = al.NEW, this.connectionLock = new r(), this.remoteOfferLock = new r();
    }
    get logContext() {
      var e2, t2;
      return Object.assign({}, null === (t2 = (e2 = this.loggerOptions).loggerContextCb) || void 0 === t2 ? void 0 : t2.call(e2));
    }
    requirePublisher() {
      let e2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
      this.isPublisherConnectionRequired = e2, this.updateState();
    }
    createAndSendPublisherOffer(e2) {
      return this.publisher.createAndSendOffer(e2);
    }
    setPublisherAnswer(e2, t2) {
      return this.publisher.setRemoteDescription(e2, t2);
    }
    removeTrack(e2) {
      return this.publisher.removeTrack(e2);
    }
    close() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (this.publisher && "closed" !== this.publisher.getSignallingState()) {
          const e3 = this.publisher;
          for (const t2 of e3.getSenders()) try {
            e3.canRemoveTrack() && e3.removeTrack(t2);
          } catch (n2) {
            this.log.warn("could not removeTrack", { error: n2 });
          }
        }
        yield Promise.all([this.publisher.close(), null === (e2 = this.subscriber) || void 0 === e2 ? void 0 : e2.close()]), this.updateState();
      }));
    }
    triggerIceRestart() {
      return kr(this, void 0, void 0, (function* () {
        this.iceLog.warn("triggering ICE restart"), this.needsPublisher && (yield this.createAndSendPublisherOffer({ iceRestart: true }));
      }));
    }
    addIceCandidate(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        this.iceLog.debug("adding remote ICE candidate", { target: t2, candidate: e2 }), t2 === jn.PUBLISHER ? yield this.publisher.addIceCandidate(e2) : yield null === (n2 = this.subscriber) || void 0 === n2 ? void 0 : n2.addIceCandidate(e2);
      }));
    }
    createSubscriberAnswerFromOffer(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2;
        this.log.debug("received server offer", { RTCSdpType: e2.type, sdp: e2.sdp, signalingState: null === (n2 = this.subscriber) || void 0 === n2 ? void 0 : n2.getSignallingState().toString() });
        const o2 = yield this.remoteOfferLock.lock();
        try {
          if (!(yield null === (i2 = this.subscriber) || void 0 === i2 ? void 0 : i2.setRemoteDescription(e2, t2))) return;
          return yield null === (r2 = this.subscriber) || void 0 === r2 ? void 0 : r2.createAndSetAnswer();
        } finally {
          o2();
        }
      }));
    }
    updateConfiguration(e2, t2) {
      var n2;
      this.log.debug("updating rtc configuration", { iceRestart: t2 }), this.publisher.setConfiguration(e2), null === (n2 = this.subscriber) || void 0 === n2 || n2.setConfiguration(e2), t2 && this.triggerIceRestart();
    }
    ensurePCTransportConnection(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        const i2 = yield this.connectionLock.lock();
        try {
          this.isPublisherConnectionRequired && "connected" !== this.publisher.getConnectionState() && "connecting" !== this.publisher.getConnectionState() && (this.log.debug("negotiation required, start negotiating"), this.publisher.negotiate().catch(((e3) => {
            this.log.error(e3);
          }))), yield Promise.all(null === (n2 = this.requiredTransports) || void 0 === n2 ? void 0 : n2.map(((n3) => this.ensureTransportConnected(n3, e2, t2))));
        } finally {
          i2();
        }
      }));
    }
    negotiate(e2) {
      return kr(this, void 0, void 0, (function* () {
        return new No(((t2, n2) => {
          const i2 = this.publisher.latestOfferId;
          if (this.publisher.latestAcknowledgedOfferId > i2) return this.log.debug("negotiation already handled in more recent acknowledged offer", this.logContext), void t2();
          let r2 = false;
          const o2 = () => {
            r2 || (r2 = true, clearTimeout(c2), this.publisher.off(zd, s2), e2.signal.removeEventListener("abort", a2));
          }, s2 = (e3) => {
            e3 > i2 && (o2(), t2());
          }, a2 = () => {
            o2(), n2(new rs("negotiation aborted"));
          }, c2 = setTimeout((() => {
            o2(), n2(new rs("negotiation timed out"));
          }), this.peerConnectionTimeout);
          e2.signal.addEventListener("abort", a2), this.publisher.on(zd, s2), this.publisher.negotiate(((e3) => {
            o2(), e3 instanceof Error ? n2(e3) : n2(new Error(String(e3)));
          }));
        }));
      }));
    }
    addPublisherTransceiver(e2, t2) {
      return this.publisher.addTransceiver(e2, t2);
    }
    addPublisherTransceiverOfKind(e2, t2) {
      return this.publisher.addTransceiverOfKind(e2, t2);
    }
    getMidForReceiver(e2) {
      const t2 = (this.subscriber ? this.subscriber.getTransceivers() : this.publisher.getTransceivers()).find(((t3) => t3.receiver === e2));
      return null == t2 ? void 0 : t2.mid;
    }
    getMaxPublisherMessageSize() {
      return this.publisher.getMaxMessageSize();
    }
    addPublisherTrack(e2) {
      return this.publisher.addTrack(e2);
    }
    createPublisherDataChannel(e2, t2) {
      return this.publisher.createDataChannel(e2, t2);
    }
    getConnectedAddress(e2) {
      return e2 === jn.PUBLISHER || e2 === jn.SUBSCRIBER ? this.publisher.getConnectedAddress() : this.requiredTransports[0].getConnectedAddress();
    }
    get requiredTransports() {
      const e2 = [];
      return this.isPublisherConnectionRequired && e2.push(this.publisher), this.isSubscriberConnectionRequired && this.subscriber && e2.push(this.subscriber), e2;
    }
    ensureTransportConnected(e2, t2) {
      return kr(this, arguments, void 0, (function(e3, t3) {
        var n2 = this;
        let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.peerConnectionTimeout;
        return (function* () {
          if ("connected" !== e3.getConnectionState()) return new Promise(((e4, r2) => kr(n2, void 0, void 0, (function* () {
            const n3 = () => {
              this.log.warn("abort transport connection"), ls.clearTimeout(o2), r2(Zo.cancelled("room connection has been cancelled"));
            };
            (null == t3 ? void 0 : t3.signal.aborted) && n3(), null == t3 || t3.signal.addEventListener("abort", n3);
            const o2 = ls.setTimeout((() => {
              null == t3 || t3.signal.removeEventListener("abort", n3), r2(Zo.internal("could not establish pc connection"));
            }), i2);
            for (; this.state !== al.CONNECTED; ) if (yield Js(50), null == t3 ? void 0 : t3.signal.aborted) return void r2(Zo.cancelled("room connection has been cancelled"));
            ls.clearTimeout(o2), null == t3 || t3.signal.removeEventListener("abort", n3), e4();
          }))));
        })();
      }));
    }
  }
  class ll {
    constructor(e2) {
      this.bufferStatusLow = true, this.headroomLock = new r(), this.waiterAbortController = new AbortController(), this.kind = e2.kind, this.lowWaterMark = e2.lowWaterMark, this.highWaterMark = e2.highWaterMark, this.isEngineClosed = e2.isEngineClosed, this.onBufferStatusChanged = e2.onBufferStatusChanged;
    }
    get channelHandle() {
      return this.handle;
    }
    attach(e2) {
      const t2 = this.handle;
      this.handle = e2, t2 && t2 !== e2 && this.release(t2, "data channel replaced");
    }
    detach() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "data channel torn down";
      const t2 = this.handle;
      this.handle = void 0, t2 && this.release(t2, e2);
    }
    release(e2, t2) {
      this.invalidateWaiters(t2), e2.close();
    }
    getChannel() {
      return this.handle;
    }
    isBelowHighWaterMark(e2) {
      return e2.bufferedAmount <= this.highWaterMark;
    }
    isBelowLowWaterMark(e2) {
      return e2.bufferedAmount <= e2.bufferedAmountLowThreshold;
    }
    lockHeadroom() {
      return this.headroomLock.lock();
    }
    waitForHeadroomWithLock(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.lockHeadroom();
        try {
          yield this.waitForHeadroomWithoutLock(e2);
        } finally {
          t2();
        }
      }));
    }
    waitForHeadroomWithoutLock(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.isEngineClosed()) throw new is("engine closed");
        if ("open" !== e2.readyState) throw new is("DataChannel ".concat(this.kind, " is ").concat(e2.readyState));
        if (this.isBelowHighWaterMark(e2)) return;
        const t2 = this.waiterAbortController.signal;
        yield new No(((n2, i2) => {
          const r2 = () => {
            a2(), n2();
          }, o2 = () => {
            a2(), i2(new is("DataChannel ".concat(this.kind, " closed while draining the buffer")));
          }, s2 = () => {
            a2(), i2(new is("DataChannel ".concat(this.kind, " was replaced or torn down while waiting for headroom")));
          }, a2 = () => {
            e2.removeEventListener("bufferedamountlow", r2), e2.removeEventListener("close", o2), t2.removeEventListener("abort", s2);
          };
          t2.aborted ? s2() : (e2.addEventListener("bufferedamountlow", r2), e2.addEventListener("close", o2), t2.addEventListener("abort", s2));
        }));
      }));
    }
    invalidateWaiters(e2) {
      this.waiterAbortController.abort(e2), this.waiterAbortController = new AbortController();
    }
    refreshBufferStatus() {
      var e2;
      const t2 = this.getChannel();
      if (!t2) return;
      const n2 = this.isBelowLowWaterMark(t2);
      n2 !== this.bufferStatusLow && (this.bufferStatusLow = n2, null === (e2 = this.onBufferStatusChanged) || void 0 === e2 || e2.call(this, n2));
    }
  }
  class ul extends ll {
    constructor(e2) {
      super(e2), this.statCurrentBytes = 0, this.statByterate = 0, this.dropCount = 0, this.bufferFullBehavior = e2.bufferFullBehavior, this.shouldSkipSends = e2.shouldSkipSends;
    }
    send(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.getChannel();
        if (t2) {
          switch (this.bufferFullBehavior) {
            case "wait":
              if (!this.isBelowHighWaterMark(t2)) try {
                yield this.waitForHeadroomWithLock(t2);
              } catch (n2) {
                if (this.isEngineClosed()) throw n2;
                return;
              }
              break;
            case "drop":
              if (!this.isBelowLowWaterMark(t2)) return this.dropCount += 1, void (this.dropCount % 100 == 0 && ar.warn("dropping lossy data channel messages, total dropped: ".concat(this.dropCount)));
          }
          if (this.statCurrentBytes += e2.byteLength, !this.shouldSkipSends()) try {
            t2.send(e2), this.refreshBufferStatus();
          } catch (n2) {
            if (!(n2 instanceof TypeError)) throw n2;
            ar.error(n2);
          }
        }
      }));
    }
    startThresholdTuning() {
      this.stopThresholdTuning(), this.statInterval = ls.setInterval((() => {
        this.statByterate = this.statCurrentBytes, this.statCurrentBytes = 0;
        const e2 = this.getChannel();
        if (e2) {
          const t2 = this.statByterate / 10;
          e2.bufferedAmountLowThreshold = Math.min(Math.max(t2, this.lowWaterMark), this.highWaterMark);
        }
      }), 1e3);
    }
    stopThresholdTuning() {
      this.statByterate = 0, this.statCurrentBytes = 0, this.statInterval && (ls.clearInterval(this.statInterval), this.statInterval = void 0), this.dropCount = 0;
    }
  }
  class hl {
    constructor() {
      this.buffer = [], this._totalSize = 0, this._sentSize = 0;
    }
    push(e2) {
      this.buffer.push(e2), this._totalSize += e2.data.byteLength, e2.sent && (this._sentSize += e2.data.byteLength);
    }
    pop() {
      const e2 = this.buffer.shift();
      return e2 && (this._totalSize -= e2.data.byteLength, e2.sent && (this._sentSize -= e2.data.byteLength)), e2;
    }
    getAll() {
      return this.buffer.slice();
    }
    getUnsent() {
      return this.buffer.filter(((e2) => !e2.sent));
    }
    markSent(e2) {
      e2.sent || (e2.sent = true, this._sentSize += e2.data.byteLength);
    }
    markAllUnsent() {
      for (const e2 of this.buffer) e2.sent = false;
      this._sentSize = 0;
    }
    popToSequence(e2) {
      for (; this.buffer.length > 0; ) {
        if (!(this.buffer[0].sequence <= e2)) break;
        this.pop();
      }
    }
    alignBufferedAmount(e2) {
      for (; this.buffer.length > 0; ) {
        const t2 = this.buffer[0];
        if (!t2.sent) break;
        if (this._sentSize - t2.data.byteLength <= e2) break;
        this.pop();
      }
    }
    get length() {
      return this.buffer.length;
    }
  }
  class pl extends ll {
    constructor(e2) {
      super(e2), this.messageBuffer = new hl(), this.sequence = 1, this.isDeferringSends = e2.isDeferringSends;
    }
    nextSequence() {
      const e2 = this.sequence;
      return this.sequence += 1, e2;
    }
    send(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.isDeferringSends()) return void this.messageBuffer.push({ data: e2, sequence: t2, sent: false });
        const n2 = this.getChannel();
        if (n2) {
          try {
            yield this.waitForHeadroomWithLock(n2);
          } catch (i2) {
            if (this.isEngineClosed()) throw i2;
            return void this.messageBuffer.push({ data: e2, sequence: t2, sent: false });
          }
          this.isDeferringSends() ? this.messageBuffer.push({ data: e2, sequence: t2, sent: false }) : (this.messageBuffer.push({ data: e2, sequence: t2, sent: true }), n2.send(e2), this.refreshBufferStatus());
        }
      }));
    }
    replay(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.getChannel()) return;
        this.messageBuffer.popToSequence(e2);
        const t2 = yield this.lockHeadroom();
        try {
          const e3 = this.getChannel();
          if (!e3) throw new is("DataChannel not found, kind: ".concat(this.kind));
          this.messageBuffer.markAllUnsent();
          for (let t3 = this.messageBuffer.getUnsent(); t3.length > 0; t3 = this.messageBuffer.getUnsent()) for (const n2 of t3) yield this.waitForHeadroomWithoutLock(e3), e3.send(n2.data), this.messageBuffer.markSent(n2);
        } finally {
          t2();
        }
        this.refreshBufferStatus();
      }));
    }
    refreshBufferStatus() {
      const e2 = this.channelHandle;
      e2 && this.messageBuffer.alignBufferedAmount(e2.bufferedAmount), super.refreshBufferStatus();
    }
    reset() {
      this.messageBuffer = new hl(), this.sequence = 1;
    }
  }
  !(function(e2) {
    e2[e2.RELIABLE = 0] = "RELIABLE", e2[e2.LOSSY = 1] = "LOSSY", e2[e2.DATA_TRACK_LOSSY = 2] = "DATA_TRACK_LOSSY";
  })(cl || (cl = {}));
  function ml(e2) {
    return e2 === cl.RELIABLE ? 65536 : 8192;
  }
  function gl(e2) {
    return e2 === cl.RELIABLE ? 1048576 : 262144;
  }
  const vl = "_lossy", fl = "_reliable", kl = "_data_track";
  function yl(e2) {
    e2.onbufferedamountlow = null, e2.onclose = null, e2.onclosing = null, e2.onerror = null, e2.onmessage = null, e2.onopen = null;
  }
  class bl {
    constructor(e2) {
      this.opts = e2;
      const t2 = (t3) => ({ kind: t3, lowWaterMark: ml(t3), highWaterMark: gl(t3), isEngineClosed: e2.isEngineClosed, onBufferStatusChanged: (n2) => e2.onBufferStatusChanged(t3, n2) });
      this.reliable = new pl(Object.assign(Object.assign({}, t2(cl.RELIABLE)), { isDeferringSends: e2.isReconnecting })), this.lossy = new ul(Object.assign(Object.assign({}, t2(cl.LOSSY)), { bufferFullBehavior: "drop", shouldSkipSends: e2.isReconnecting })), this.dataTrack = new ul(Object.assign(Object.assign({}, t2(cl.DATA_TRACK_LOSSY)), { bufferFullBehavior: "wait", shouldSkipSends: e2.isReconnecting }));
    }
    channelFor(e2) {
      switch (e2) {
        case cl.RELIABLE:
          return this.reliable;
        case cl.LOSSY:
          return this.lossy;
        case cl.DATA_TRACK_LOSSY:
          return this.dataTrack;
      }
    }
    getHandle(e2) {
      if (!(arguments.length > 1 && void 0 !== arguments[1] && arguments[1])) return this.channelFor(e2).channelHandle;
      switch (e2) {
        case cl.RELIABLE:
          return this.reliableSub;
        case cl.LOSSY:
          return this.lossySub;
        case cl.DATA_TRACK_LOSSY:
          return this.dataTrackSub;
      }
    }
    get hasPublisherChannels() {
      return Boolean(this.reliable.channelHandle || this.lossy.channelHandle || this.dataTrack.channelHandle);
    }
    createPublisherChannels(e2) {
      for (const n2 of [this.lossy, this.reliable, this.dataTrack]) {
        const e3 = n2.channelHandle;
        e3 && yl(e3);
      }
      const t2 = (e3, t3, n2) => {
        t3.onmessage = n2, t3.onerror = this.opts.onDataError, t3.onclose = () => this.opts.onChannelClose(e3.kind), t3.bufferedAmountLowThreshold = e3.lowWaterMark, t3.onbufferedamountlow = () => e3.refreshBufferStatus(), e3.attach(t3);
      };
      t2(this.lossy, e2.createPublisherDataChannel(vl, { ordered: false, maxRetransmits: 0 }), this.opts.onDataMessage), t2(this.reliable, e2.createPublisherDataChannel(fl, { ordered: true }), this.opts.onDataMessage), t2(this.dataTrack, e2.createPublisherDataChannel(kl, { ordered: false, maxRetransmits: 0 }), this.opts.onDataTrackMessage), this.lossy.startThresholdTuning();
    }
    adoptSubscriberChannel(e2) {
      let t2;
      if (e2.label === fl) this.reliableSub = e2, t2 = this.opts.onDataMessage;
      else if (e2.label === vl) this.lossySub = e2, t2 = this.opts.onDataMessage;
      else {
        if (e2.label !== kl) return false;
        this.dataTrackSub = e2, t2 = this.opts.onDataTrackMessage;
      }
      return e2.onmessage = t2, true;
    }
    teardown() {
      const e2 = [this.lossy, this.reliable, this.dataTrack], t2 = [this.lossySub, this.reliableSub, this.dataTrackSub];
      for (const n2 of e2) {
        const e3 = n2.channelHandle;
        e3 && yl(e3), n2.detach("peer connections cleaned up");
      }
      for (const n2 of t2) n2 && (yl(n2), n2.close());
      this.lossySub = void 0, this.reliableSub = void 0, this.dataTrackSub = void 0, this.reliable.reset();
    }
  }
  const Tl = "undefined" != typeof MediaRecorder;
  const Sl = Tl ? MediaRecorder : class {
    constructor() {
      throw new Error("MediaRecorder is not available in this environment");
    }
  };
  class El extends Sl {
    constructor(e2, t2) {
      if (!Tl) throw new Error("MediaRecorder is not available in this environment");
      let n2, i2;
      super(new MediaStream([e2.mediaStreamTrack]), t2);
      const r2 = () => {
        this.removeEventListener("dataavailable", n2), this.removeEventListener("stop", r2), this.removeEventListener("error", o2), null == i2 || i2.close(), i2 = void 0;
      }, o2 = (e3) => {
        null == i2 || i2.error(e3), this.removeEventListener("dataavailable", n2), this.removeEventListener("stop", r2), this.removeEventListener("error", o2), i2 = void 0;
      };
      this.byteStream = new ReadableStream({ start: (e3) => {
        i2 = e3, n2 = (t3) => kr(this, void 0, void 0, (function* () {
          let n3;
          if (t3.data.arrayBuffer) {
            const e4 = yield t3.data.arrayBuffer();
            n3 = new Uint8Array(e4);
          } else {
            if (!t3.data.byteArray) throw new Error("no data available!");
            n3 = t3.data.byteArray;
          }
          void 0 !== i2 && e3.enqueue(n3);
        })), this.addEventListener("dataavailable", n2);
      }, cancel: () => {
        r2();
      } }), this.addEventListener("stop", r2), this.addEventListener("error", o2);
    }
  }
  class Cl extends Ws {
    get sender() {
      return this._sender;
    }
    set sender(e2) {
      this._sender = e2;
    }
    get constraints() {
      return this._constraints;
    }
    get hasPreConnectBuffer() {
      return !!this.localTrackRecorder;
    }
    constructor(t2, n2, i2) {
      let o2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      super(t2, n2, arguments.length > 4 ? arguments[4] : void 0), this.manuallyStopped = false, this.pendingDeviceChange = false, this._isUpstreamPaused = false, this.handleTrackMuteEvent = () => this.debouncedTrackMuteHandler().catch((() => this.log.debug("track mute bounce got cancelled by an unmute event", this.logContext))), this.debouncedTrackMuteHandler = wc((() => kr(this, void 0, void 0, (function* () {
        yield this.pauseUpstream();
      }))), 5e3), this.handleTrackUnmuteEvent = () => kr(this, void 0, void 0, (function* () {
        this.debouncedTrackMuteHandler.cancel("unmute"), yield this.resumeUpstream();
      })), this.handleEnded = () => {
        this.isInBackground && (this.reacquireTrack = true), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), this.emit(e.TrackEvent.Ended, this);
      }, this.reacquireTrack = false, this.providedByUser = o2, this.muteLock = new r(), this.pauseUpstreamLock = new r(), this.trackChangeLock = new r(), this.trackChangeLock.lock().then(((e2) => kr(this, void 0, void 0, (function* () {
        try {
          yield this.setMediaStreamTrack(t2, true);
        } finally {
          e2();
        }
      })))), this._constraints = t2.getConstraints(), i2 && (this._constraints = i2);
    }
    get id() {
      return this._mediaStreamTrack.id;
    }
    get dimensions() {
      if (this.kind !== Ws.Kind.Video) return;
      const e2 = this._mediaStreamTrack.getSettings(), t2 = e2.width, n2 = e2.height;
      return t2 && n2 ? { width: t2, height: n2 } : void 0;
    }
    get isUpstreamPaused() {
      return this._isUpstreamPaused;
    }
    get isUserProvided() {
      return this.providedByUser;
    }
    get isStopped() {
      return this.manuallyStopped;
    }
    get mediaStreamTrack() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.processor) || void 0 === e2 ? void 0 : e2.processedTrack) && void 0 !== t2 ? t2 : this._mediaStreamTrack;
    }
    get isLocal() {
      return true;
    }
    getSourceTrackSettings() {
      return this._mediaStreamTrack.getSettings();
    }
    setMediaStreamTrack(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        var i2;
        if (e2 === this._mediaStreamTrack && !t2) return;
        let r2;
        if (this._mediaStreamTrack && (this.attachedElements.forEach(((e3) => {
          Ks(this._mediaStreamTrack, e3);
        })), this.debouncedTrackMuteHandler.cancel("new-track"), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent)), this.mediaStream = new MediaStream([e2]), e2 && (e2.addEventListener("ended", this.handleEnded), e2.addEventListener("mute", this.handleTrackMuteEvent), e2.addEventListener("unmute", this.handleTrackUnmuteEvent), this._constraints = e2.getConstraints()), this.processor && e2) {
          if (this.log.debug("restarting processor", this.logContext), "unknown" === this.kind) throw TypeError("cannot set processor on track of unknown kind");
          this.processorElement && (Hs(e2, this.processorElement), this.processorElement.muted = true), yield this.processor.restart({ track: e2, kind: this.kind, element: this.processorElement, audioContext: this.audioContext, localTrack: this }), r2 = this.processor.processedTrack;
        }
        this.sender && "closed" !== (null === (i2 = this.sender.transport) || void 0 === i2 ? void 0 : i2.state) && (yield this.sender.replaceTrack(null != r2 ? r2 : e2)), this.providedByUser || this._mediaStreamTrack === e2 || this._mediaStreamTrack.stop(), this._mediaStreamTrack = e2, e2 && (this._mediaStreamTrack.enabled = !!n2 || !this.isMuted, yield this.resumeUpstream(), this.attachedElements.forEach(((t3) => {
          Hs(null != r2 ? r2 : e2, t3);
        }))), yield this.onMediaStreamTrackChanged();
      }));
    }
    onMediaStreamTrackChanged() {
      return kr(this, void 0, void 0, (function* () {
      }));
    }
    waitForDimensions() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e3;
        return (function* () {
          if (e2.kind === Ws.Kind.Audio) throw new Error("cannot get dimensions for audio tracks");
          const n2 = Date.now();
          for (la() && (yield (function(e3, t3) {
            return kr(this, arguments, void 0, (function(e4, t4) {
              let n3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
              return (function* () {
                var i2;
                if ("undefined" == typeof document) return false;
                if ("ended" === e4.readyState || e4.muted || !e4.enabled) return false;
                const r2 = "function" == typeof HTMLVideoElement.prototype.requestVideoFrameCallback, o2 = n3.find(((t5) => t5 instanceof HTMLVideoElement && t5.srcObject instanceof MediaStream && t5.srcObject.getVideoTracks().includes(e4) && (r2 || t5.readyState < 2))), s2 = null != o2 ? o2 : document.createElement("video");
                let a2, c2, d2;
                o2 || (s2.playsInline = true, s2.muted = true, s2.srcObject = new MediaStream([e4]), s2.play().catch(((e5) => {
                  ar.debug("could not play element while waiting for the first video frame", { error: e5 });
                })));
                try {
                  return yield new Promise(((e5) => {
                    a2 = setTimeout((() => e5(false)), t4), r2 ? c2 = s2.requestVideoFrameCallback((() => e5(true))) : (d2 = () => e5(true), s2.addEventListener("loadeddata", d2));
                  }));
                } finally {
                  clearTimeout(a2), void 0 !== c2 && (null === (i2 = s2.cancelVideoFrameCallback) || void 0 === i2 || i2.call(s2, c2)), d2 && s2.removeEventListener("loadeddata", d2), o2 || (s2.pause(), s2.srcObject = null);
                }
              })();
            }));
          })(e2._mediaStreamTrack, t2, e2.attachedElements)); ; ) {
            const i2 = e2.dimensions;
            if (i2) return i2;
            if (Date.now() - n2 >= t2) break;
            yield Js(50);
          }
          throw new ts("unable to get track dimensions after timeout");
        })();
      }));
    }
    setDeviceId(e2) {
      return kr(this, void 0, void 0, (function* () {
        return this._constraints.deviceId === e2 && this._mediaStreamTrack.getSettings().deviceId === xa(e2) && "live" === this._mediaStreamTrack.readyState || (this._constraints.deviceId = e2, this.isMuted ? (this.pendingDeviceChange = true, true) : (yield this.restartTrack(), xa(e2) === this._mediaStreamTrack.getSettings().deviceId));
      }));
    }
    getDeviceId() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return (function* () {
          if (e2.source === Ws.Source.ScreenShare) return;
          const n2 = e2._mediaStreamTrack.getSettings(), i2 = n2.deviceId, r2 = n2.groupId, o2 = e2.kind === Ws.Kind.Audio ? "audioinput" : "videoinput";
          return t2 ? jc.getInstance().normalizeDeviceId(o2, i2, r2) : i2;
        })();
      }));
    }
    mute() {
      return kr(this, void 0, void 0, (function* () {
        return this.setTrackMuted(true), this;
      }));
    }
    unmute() {
      return kr(this, void 0, void 0, (function* () {
        return this.setTrackMuted(false), this;
      }));
    }
    replaceTrack(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = yield this.trackChangeLock.lock();
        try {
          if (!this.sender) throw new ts("unable to replace an unpublished track");
          let n3, i2;
          "boolean" == typeof t2 ? n3 = t2 : void 0 !== t2 && (n3 = t2.userProvidedTrack, i2 = t2.stopProcessor), this.providedByUser = null == n3 || n3, this.log.debug("replace MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(e2), i2 && this.processor && (yield this.internalStopProcessor());
        } finally {
          n2();
        }
        return yield this.onSenderTrackSwapped(), this;
      }));
    }
    onSenderTrackSwapped() {
      return kr(this, void 0, void 0, (function* () {
      }));
    }
    restart(t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        this.manuallyStopped = false;
        const r2 = yield this.trackChangeLock.lock();
        try {
          t2 || (t2 = this._constraints);
          const r3 = t2, o2 = r3.deviceId, s2 = r3.facingMode, a2 = fr(t2, ["deviceId", "facingMode"]);
          this.log.debug("restarting track with constraints", Object.assign(Object.assign({}, this.logContext), { constraints: t2 }));
          const c2 = { audio: false, video: false };
          let d2;
          this.kind === Ws.Kind.Video ? c2.video = !o2 && !s2 || { deviceId: o2, facingMode: s2 } : c2.audio = !o2 || Object.assign({ deviceId: o2 }, a2), this.attachedElements.forEach(((e2) => {
            Ks(this.mediaStreamTrack, e2);
          })), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.stop();
          try {
            d2 = yield navigator.mediaDevices.getUserMedia(c2);
          } catch (n2) {
            throw (function(e2) {
              "object" == typeof e2 && null !== e2 && Ua.add(e2);
            })(n2), n2;
          }
          const l2 = d2.getTracks()[0];
          try {
            this.kind === Ws.Kind.Video && (yield l2.applyConstraints(a2)), l2.addEventListener("ended", this.handleEnded), this.log.debug("re-acquired MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(l2, false, i2);
          } catch (n2) {
            throw this._mediaStreamTrack !== l2 && l2.stop(), n2;
          }
          return this._constraints = t2, this.pendingDeviceChange = false, this.emit(e.TrackEvent.Restarted, this), this;
        } finally {
          this.manuallyStopped && (this.log.warn("track was stopped during a restart, stopping restarted track", this.logContext), this.stop()), r2();
        }
      }));
    }
    setTrackMuted(t2) {
      this.log.debug("setting ".concat(this.kind, " track ").concat(t2 ? "muted" : "unmuted"), this.logContext), this.isMuted === t2 && this._mediaStreamTrack.enabled !== t2 || (this.isMuted = t2, this._mediaStreamTrack.enabled = !t2, this.emit(t2 ? e.TrackEvent.Muted : e.TrackEvent.Unmuted, this));
    }
    get needsReAcquisition() {
      return "live" !== this._mediaStreamTrack.readyState || this._mediaStreamTrack.muted || !this._mediaStreamTrack.enabled || this.reacquireTrack;
    }
    handleAppVisibilityChanged() {
      const e2 = Object.create(null, { handleAppVisibilityChanged: { get: () => super.handleAppVisibilityChanged } });
      return kr(this, void 0, void 0, (function* () {
        yield e2.handleAppVisibilityChanged.call(this), ha() && (this.log.debug("visibility changed, is in Background: ".concat(this.isInBackground), this.logContext), this.isInBackground || !this.needsReAcquisition || this.isUserProvided || this.isMuted || (this.log.debug("track needs to be reacquired, restarting ".concat(this.source), this.logContext), yield this.restart(), this.reacquireTrack = false));
      }));
    }
    stop() {
      var e2;
      this.manuallyStopped = true, super.stop(), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), null === (e2 = this.processor) || void 0 === e2 || e2.destroy().catch(((e3) => {
        this.log.error("failed to destroy processor", Object.assign(Object.assign({}, this.logContext), { error: e3 }));
      })), this.processor = void 0;
    }
    pauseUpstream() {
      return kr(this, void 0, void 0, (function* () {
        var t2;
        const n2 = yield this.pauseUpstreamLock.lock();
        try {
          if (true === this._isUpstreamPaused) return;
          if (!this.sender) return void this.log.warn("unable to pause upstream for an unpublished track", this.logContext);
          this._isUpstreamPaused = true, this.emit(e.TrackEvent.UpstreamPaused, this);
          const n3 = Fo();
          if ("Safari" === (null == n3 ? void 0 : n3.name) && ba(n3.version, "12.0") < 0) throw new es("pauseUpstream is not supported on Safari < 12.");
          "closed" !== (null === (t2 = this.sender.transport) || void 0 === t2 ? void 0 : t2.state) && (yield this.sender.replaceTrack(null));
        } finally {
          n2();
        }
      }));
    }
    resumeUpstream() {
      return kr(this, void 0, void 0, (function* () {
        var t2;
        const n2 = yield this.pauseUpstreamLock.lock();
        try {
          if (false === this._isUpstreamPaused) return;
          if (!this.sender) return void this.log.warn("unable to resume upstream for an unpublished track", this.logContext);
          this._isUpstreamPaused = false, this.emit(e.TrackEvent.UpstreamResumed, this), "closed" !== (null === (t2 = this.sender.transport) || void 0 === t2 ? void 0 : t2.state) && (yield this.sender.replaceTrack(this.mediaStreamTrack));
        } finally {
          n2();
        }
      }));
    }
    getRTCStatsReport() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!(null === (e2 = this.sender) || void 0 === e2 ? void 0 : e2.getStats)) return;
        return yield this.sender.getStats();
      }));
    }
    setProcessor(t2) {
      return kr(this, arguments, void 0, (function(t3) {
        var n2 = this;
        let i2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (function* () {
          var r2;
          const o2 = yield n2.trackChangeLock.lock();
          try {
            n2.log.debug("setting up processor", n2.logContext);
            const o3 = document.createElement(n2.kind), s2 = { kind: n2.kind, track: n2._mediaStreamTrack, element: o3, audioContext: n2.audioContext, localTrack: n2 };
            if (yield t3.init(s2), n2.log.debug("processor initialized", n2.logContext), n2.processor && (yield n2.internalStopProcessor()), "unknown" === n2.kind) throw TypeError("cannot set processor on track of unknown kind");
            if (Hs(n2._mediaStreamTrack, o3), o3.muted = true, o3.play().catch(((e2) => {
              e2 instanceof DOMException && "AbortError" === e2.name ? (n2.log.warn("failed to play processor element, retrying", Object.assign(Object.assign({}, n2.logContext), { error: e2 })), setTimeout((() => {
                o3.play().catch(((e3) => {
                  n2.log.error("failed to play processor element", Object.assign(Object.assign({}, n2.logContext), { err: e3 }));
                }));
              }), 100)) : n2.log.error("failed to play processor element", Object.assign(Object.assign({}, n2.logContext), { error: e2 }));
            })), n2.processor = t3, n2.processorElement = o3, n2.processor.processedTrack) {
              for (const e2 of n2.attachedElements) e2 !== n2.processorElement && i2 && (Ks(n2._mediaStreamTrack, e2), Hs(n2.processor.processedTrack, e2));
              yield null === (r2 = n2.sender) || void 0 === r2 ? void 0 : r2.replaceTrack(n2.processor.processedTrack);
            }
            n2.emit(e.TrackEvent.TrackProcessorUpdate, n2.processor);
          } finally {
            o2();
          }
          yield n2.onSenderTrackSwapped();
        })();
      }));
    }
    getProcessor() {
      return this.processor;
    }
    stopProcessor() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return (function* () {
          const n2 = yield e2.trackChangeLock.lock();
          try {
            yield e2.internalStopProcessor(t2);
          } finally {
            n2();
          }
          yield e2.onSenderTrackSwapped();
        })();
      }));
    }
    internalStopProcessor() {
      return kr(this, arguments, void 0, (function() {
        var t2 = this;
        let n2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return (function* () {
          var i2, r2;
          t2.processor && (t2.log.debug("stopping processor", t2.logContext), null === (i2 = t2.processor.processedTrack) || void 0 === i2 || i2.stop(), yield t2.processor.destroy(), t2.processor = void 0, n2 || (null === (r2 = t2.processorElement) || void 0 === r2 || r2.remove(), t2.processorElement = void 0), yield t2._mediaStreamTrack.applyConstraints(t2._constraints), yield t2.setMediaStreamTrack(t2._mediaStreamTrack, true), t2.emit(e.TrackEvent.TrackProcessorUpdate));
        })();
      }));
    }
    startPreConnectBuffer() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100;
      if (Tl) if (this.localTrackRecorder) this.log.warn("preconnect buffer already started");
      else {
        {
          let e3 = "audio/webm;codecs=opus";
          MediaRecorder.isTypeSupported(e3) || (e3 = "video/mp4"), this.localTrackRecorder = new El(this, { mimeType: e3 });
        }
        this.localTrackRecorder.start(e2), this.autoStopPreConnectBuffer = setTimeout((() => {
          this.log.warn("preconnect buffer timed out, stopping recording automatically", this.logContext), this.stopPreConnectBuffer();
        }), 1e4);
      }
      else this.log.warn("MediaRecorder is not available, cannot start preconnect buffer", this.logContext);
    }
    stopPreConnectBuffer() {
      clearTimeout(this.autoStopPreConnectBuffer), this.localTrackRecorder && (this.localTrackRecorder.stop(), this.localTrackRecorder = void 0);
    }
    getPreConnectBuffer() {
      var e2;
      return null === (e2 = this.localTrackRecorder) || void 0 === e2 ? void 0 : e2.byteStream;
    }
    getPreConnectBufferMimeType() {
      var e2;
      return null === (e2 = this.localTrackRecorder) || void 0 === e2 ? void 0 : e2.mimeType;
    }
  }
  class wl extends Cl {
    get enhancedNoiseCancellation() {
      return this.isKrispNoiseFilterEnabled;
    }
    constructor(t2, i2) {
      let r2 = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], o2 = arguments.length > 3 ? arguments[3] : void 0, s2 = arguments.length > 4 ? arguments[4] : void 0;
      super(t2, Ws.Kind.Audio, i2, r2, s2), this.stopOnMute = false, this.isKrispNoiseFilterEnabled = false, this.monitorSender = () => kr(this, void 0, void 0, (function* () {
        if (!this.sender) return void (this._currentBitrate = 0);
        let e2;
        try {
          e2 = yield this.getSenderStats();
        } catch (n2) {
          return void this.log.error("could not get audio sender stats", Object.assign(Object.assign({}, this.logContext), { error: n2 }));
        }
        e2 && this.prevStats && (this._currentBitrate = Pc(e2, this.prevStats)), this.prevStats = e2;
      })), this.handleKrispNoiseFilterEnable = () => {
        this.isKrispNoiseFilterEnabled = true, this.log.debug("Krisp noise filter enabled", this.logContext), this.emit(e.TrackEvent.AudioTrackFeatureUpdate, this, lt.TF_ENHANCED_NOISE_CANCELLATION, true);
      }, this.handleKrispNoiseFilterDisable = () => {
        this.isKrispNoiseFilterEnabled = false, this.log.debug("Krisp noise filter disabled", this.logContext), this.emit(e.TrackEvent.AudioTrackFeatureUpdate, this, lt.TF_ENHANCED_NOISE_CANCELLATION, false);
      }, this.audioContext = o2, this.checkForSilence();
    }
    mute() {
      const e2 = Object.create(null, { mute: { get: () => super.mute } });
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.log.debug("Track already muted", this.logContext), this) : (this.source === Ws.Source.Microphone && this.stopOnMute && !this.isUserProvided && (this.log.debug("stopping mic track", this.logContext), this._mediaStreamTrack.stop()), yield e2.mute.call(this), this);
        } finally {
          t2();
        }
      }));
    }
    unmute() {
      const e2 = Object.create(null, { unmute: { get: () => super.unmute } });
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.source !== Ws.Source.Microphone || !this.stopOnMute && "ended" !== this._mediaStreamTrack.readyState && !this.pendingDeviceChange || this.isUserProvided || (this.log.debug("reacquiring mic track", this.logContext), yield this.restart(void 0, true)), yield e2.unmute.call(this), this) : (this.log.debug("Track already unmuted", this.logContext), this);
        } finally {
          t2();
        }
      }));
    }
    restartTrack(e2) {
      return kr(this, void 0, void 0, (function* () {
        let t2;
        if (e2) {
          const n2 = Ms({ audio: e2 });
          "boolean" != typeof n2.audio && (t2 = n2.audio);
        }
        yield this.restart(t2);
      }));
    }
    applyConstraints(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.trackChangeLock.lock();
        try {
          const t3 = yield this._mediaStreamTrack.applyConstraints(e2);
          return this._constraints = Object.assign(Object.assign({}, this._constraints), e2), t3;
        } finally {
          t2();
        }
      }));
    }
    restart(e2, t2) {
      const n2 = Object.create(null, { restart: { get: () => super.restart } });
      return kr(this, void 0, void 0, (function* () {
        const i2 = yield n2.restart.call(this, e2, t2);
        return this.checkForSilence(), i2;
      }));
    }
    startMonitor() {
      pa() && (this.monitorInterval || (this.monitorInterval = setInterval((() => {
        this.monitorSender();
      }), Rc)));
    }
    observeProcessedTrack(e2) {
      this.observedProcessedTrack !== e2 && (this.observedProcessedTrack && (this.observedProcessedTrack.removeEventListener("enable-lk-krisp-noise-filter", this.handleKrispNoiseFilterEnable), this.observedProcessedTrack.removeEventListener("disable-lk-krisp-noise-filter", this.handleKrispNoiseFilterDisable), this.observedProcessedTrack = void 0, this.isKrispNoiseFilterEnabled && this.handleKrispNoiseFilterDisable()), e2 && (e2.addEventListener("enable-lk-krisp-noise-filter", this.handleKrispNoiseFilterEnable), e2.addEventListener("disable-lk-krisp-noise-filter", this.handleKrispNoiseFilterDisable), this.observedProcessedTrack = e2));
    }
    setProcessor(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        const i2 = yield this.trackChangeLock.lock();
        try {
          if (!ma() && !this.audioContext) throw Error("Audio context needs to be set on LocalAudioTrack in order to enable processors");
          this.processor && (yield this.internalStopProcessor());
          const i3 = { kind: this.kind, track: this._mediaStreamTrack, audioContext: this.audioContext, localTrack: this };
          this.log.debug("setting up audio processor ".concat(t2.name), this.logContext), yield t2.init(i3), this.processor = t2, this.processor.processedTrack && (yield null === (n2 = this.sender) || void 0 === n2 ? void 0 : n2.replaceTrack(this.processor.processedTrack), this.observeProcessedTrack(this.processor.processedTrack)), this.emit(e.TrackEvent.TrackProcessorUpdate, this.processor);
        } finally {
          i2();
        }
      }));
    }
    onMediaStreamTrackChanged() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        this.observeProcessedTrack(null === (e2 = this.processor) || void 0 === e2 ? void 0 : e2.processedTrack);
      }));
    }
    internalStopProcessor() {
      const e2 = Object.create(null, { internalStopProcessor: { get: () => super.internalStopProcessor } });
      return kr(this, arguments, void 0, (function() {
        var t2 = this;
        let n2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return (function* () {
          t2.observeProcessedTrack(void 0), yield e2.internalStopProcessor.call(t2, n2);
        })();
      }));
    }
    stop() {
      this.observeProcessedTrack(void 0), super.stop();
    }
    setAudioContext(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        if (this.audioContext === t2) return;
        const i2 = yield this.trackChangeLock.lock();
        try {
          if (this.audioContext = t2, !this.processor || ma()) return;
          if (!t2) return this.log.debug("stopping audio processor, audio context has been removed", this.logContext), void (yield this.internalStopProcessor());
          this.log.debug("restarting audio processor on new audio context", this.logContext), yield this.processor.restart({ kind: this.kind, track: this._mediaStreamTrack, audioContext: t2, localTrack: this }), this.processor.processedTrack && (yield null === (n2 = this.sender) || void 0 === n2 ? void 0 : n2.replaceTrack(this.processor.processedTrack), this.observeProcessedTrack(this.processor.processedTrack)), this.emit(e.TrackEvent.TrackProcessorUpdate, this.processor);
        } finally {
          i2();
        }
      }));
    }
    getSenderStats() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!(null === (e2 = this.sender) || void 0 === e2 ? void 0 : e2.getStats)) return;
        const t2 = yield this.sender.getStats();
        let n2;
        return t2.forEach(((e3) => {
          if ("outbound-rtp" === e3.type) {
            n2 = { type: "audio", streamId: e3.id, packetsSent: e3.packetsSent, bytesSent: e3.bytesSent, timestamp: e3.timestamp };
            const i2 = t2.get(e3.remoteId);
            i2 && (n2.packetsLost = i2.packetsLost, n2.jitter = i2.jitter, n2.roundTripTime = i2.roundTripTime);
          }
        })), n2;
      }));
    }
    checkForSilence() {
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield Ds(this);
        return t2 && (this.isMuted || this.log.debug("silence detected on local audio track", this.logContext), this.emit(e.TrackEvent.AudioSilenceDetected)), t2;
      }));
    }
  }
  const Rl = Object.values(ws), Pl = Object.values(Rs), Il = Object.values(Ps), _l = [ws.h180, ws.h360], Ml = [Rs.h180, Rs.h360], Dl = ["q", "h", "f"];
  function Ol(e2, t2, n2, i2) {
    var r2, o2;
    let s2 = null == i2 ? void 0 : i2.videoEncoding;
    e2 && (s2 = null == i2 ? void 0 : i2.screenShareEncoding);
    const a2 = null == i2 ? void 0 : i2.simulcast, c2 = null == i2 ? void 0 : i2.scalabilityMode, d2 = null == i2 ? void 0 : i2.videoCodec, l2 = ta(d2, i2);
    if (!s2 && !a2 && !c2 || !t2 || !n2) return [{}];
    s2 || (s2 = (function(e3, t3, n3, i3) {
      const r3 = (function(e4, t4, n4) {
        if (e4) return Il;
        const i4 = t4 > n4 ? t4 / n4 : n4 / t4;
        if (Math.abs(i4 - 16 / 9) < Math.abs(i4 - 4 / 3)) return Rl;
        return Pl;
      })(e3, t3, n3);
      let o3 = r3[0].encoding;
      const s3 = Math.max(t3, n3);
      for (let a3 = 0; a3 < r3.length; a3 += 1) {
        const e4 = r3[a3];
        if (o3 = e4.encoding, e4.width >= s3) break;
      }
      if (i3) switch (i3) {
        case "av1":
        case "h265":
          o3 = Object.assign({}, o3), o3.maxBitrate = 0.7 * o3.maxBitrate;
          break;
        case "vp9":
          o3 = Object.assign({}, o3), o3.maxBitrate = 0.85 * o3.maxBitrate;
      }
      return o3;
    })(e2, t2, n2, d2), ar.debug("using video encoding", s2));
    const u2 = s2.maxFramerate, h2 = new fs(t2, n2, s2.maxBitrate, s2.maxFramerate, s2.priority);
    if (c2 && $s(d2) && !l2) {
      const e3 = new Ul(c2), t3 = [];
      if (e3.spatial > 3) throw new Error("unsupported scalabilityMode: ".concat(c2));
      const n3 = Fo();
      if (na()) {
        const i3 = "h" == e3.suffix ? 2 : 3, r3 = (function(e4) {
          return e4 || (e4 = Fo()), "Safari" === (null == e4 ? void 0 : e4.name) && ba(e4.version, "18.3") > 0 || "iOS" === (null == e4 ? void 0 : e4.os) && !!(null == e4 ? void 0 : e4.osVersion) && ba(e4.osVersion, "18.3") > 0;
        })(n3);
        for (let n4 = 0; n4 < e3.spatial; n4 += 1) t3.push({ rid: Dl[2 - n4], maxBitrate: s2.maxBitrate / Math.pow(i3, n4), maxFramerate: h2.encoding.maxFramerate, scaleResolutionDownBy: r3 ? Math.pow(2, n4) : void 0 });
        t3[0].scalabilityMode = c2;
      } else t3.push({ maxBitrate: s2.maxBitrate, maxFramerate: h2.encoding.maxFramerate, scalabilityMode: c2 });
      return h2.encoding.priority && (t3[0].priority = h2.encoding.priority, t3[0].networkPriority = h2.encoding.priority), ar.debug("using svc encoding", { encodings: t3 }), t3;
    }
    if (!a2) return [s2];
    const p2 = (e3) => (l2 && e3.forEach(((e4) => {
      e4.scalabilityMode = c2;
    })), e3);
    let m2, g2;
    if (m2 = e2 ? null !== (r2 = xl(null == i2 ? void 0 : i2.screenShareSimulcastLayers)) && void 0 !== r2 ? r2 : Ll(e2, h2) : null !== (o2 = xl(null == i2 ? void 0 : i2.videoSimulcastLayers)) && void 0 !== o2 ? o2 : Ll(e2, h2), m2.length > 0) {
      const e3 = m2[0];
      if (m2.length > 1) g2 = j(m2, 2)[1];
      const i3 = Math.max(t2, n2);
      if (i3 >= 960 && g2) return p2(Nl(t2, n2, [e3, g2, h2], u2));
      if (i3 >= 480) return p2(Nl(t2, n2, [e3, h2], u2));
    }
    return p2(Nl(t2, n2, [h2]));
  }
  function Al(e2, t2, n2) {
    var i2, r2, o2, s2;
    if (!n2.backupCodec || true === n2.backupCodec || n2.backupCodec.codec === n2.videoCodec) return;
    t2 !== n2.backupCodec.codec && ar.warn("requested a different codec than specified as backup", { serverRequested: t2, backup: n2.backupCodec.codec }), n2.videoCodec = t2, n2.videoEncoding = n2.backupCodec.encoding;
    const a2 = e2.mediaStreamTrack.getSettings(), c2 = null !== (i2 = a2.width) && void 0 !== i2 ? i2 : null === (r2 = e2.dimensions) || void 0 === r2 ? void 0 : r2.width, d2 = null !== (o2 = a2.height) && void 0 !== o2 ? o2 : null === (s2 = e2.dimensions) || void 0 === s2 ? void 0 : s2.height;
    e2.source === Ws.Source.ScreenShare && n2.simulcast && (n2.simulcast = false);
    return Ol(e2.source === Ws.Source.ScreenShare, c2, d2, n2);
  }
  function Ll(e2, t2) {
    if (e2) return [{ scaleResolutionDownBy: 2, fps: (n2 = t2).encoding.maxFramerate }].map(((e3) => {
      var t3, i3;
      return new fs(Math.floor(n2.width / e3.scaleResolutionDownBy), Math.floor(n2.height / e3.scaleResolutionDownBy), Math.max(15e4, Math.floor(n2.encoding.maxBitrate / (Math.pow(e3.scaleResolutionDownBy, 2) * ((null !== (t3 = n2.encoding.maxFramerate) && void 0 !== t3 ? t3 : 30) / (null !== (i3 = e3.fps) && void 0 !== i3 ? i3 : 30))))), e3.fps, n2.encoding.priority);
    }));
    var n2;
    const i2 = t2.width, r2 = t2.height, o2 = i2 > r2 ? i2 / r2 : r2 / i2;
    return Math.abs(o2 - 16 / 9) < Math.abs(o2 - 4 / 3) ? _l : Ml;
  }
  function Nl(e2, t2, n2, i2) {
    const r2 = [];
    if (n2.forEach(((n3, o2) => {
      if (o2 >= Dl.length) return;
      const s2 = Math.min(e2, t2), a2 = { rid: Dl[o2], scaleResolutionDownBy: Math.max(1, s2 / Math.min(n3.width, n3.height)), maxBitrate: n3.encoding.maxBitrate }, c2 = i2 && n3.encoding.maxFramerate ? Math.min(i2, n3.encoding.maxFramerate) : n3.encoding.maxFramerate;
      c2 && (a2.maxFramerate = c2);
      const d2 = Fo(), l2 = "Firefox" === (null == d2 ? void 0 : d2.name) && "iOS" !== d2.os || 0 === o2;
      n3.encoding.priority && l2 && (a2.priority = n3.encoding.priority, a2.networkPriority = n3.encoding.priority), r2.push(a2);
    })), ma() && "ios" === ka()) {
      let e3;
      r2.forEach(((t4) => {
        e3 ? t4.maxFramerate && t4.maxFramerate > e3 && (e3 = t4.maxFramerate) : e3 = t4.maxFramerate;
      }));
      let t3 = true;
      r2.forEach(((n3) => {
        var i3;
        n3.maxFramerate != e3 && (t3 && (t3 = false, ar.info("Simulcast on iOS React-Native requires all encodings to share the same framerate.")), ar.info('Setting framerate of encoding "'.concat(null !== (i3 = n3.rid) && void 0 !== i3 ? i3 : "", '" to ').concat(e3)), n3.maxFramerate = e3);
      }));
    }
    return r2;
  }
  function xl(e2) {
    if (e2) return e2.slice().sort(((e3, t2) => {
      const n2 = e3.encoding, i2 = t2.encoding;
      return n2.maxBitrate > i2.maxBitrate ? 1 : n2.maxBitrate < i2.maxBitrate ? -1 : n2.maxBitrate === i2.maxBitrate && n2.maxFramerate && i2.maxFramerate ? n2.maxFramerate > i2.maxFramerate ? 1 : -1 : 0;
    }));
  }
  class Ul {
    constructor(e2) {
      const t2 = e2.match(/^L(\d)T(\d)(h|_KEY|_KEY_SHIFT){0,1}$/);
      if (!t2) throw new Error("invalid scalability mode");
      if (this.spatial = parseInt(t2[1]), this.temporal = parseInt(t2[2]), t2.length > 3) switch (t2[3]) {
        case "h":
        case "_KEY":
        case "_KEY_SHIFT":
          this.suffix = t2[3];
      }
    }
    toString() {
      var e2;
      return "L".concat(this.spatial, "T").concat(this.temporal).concat(null !== (e2 = this.suffix) && void 0 !== e2 ? e2 : "");
    }
  }
  class Fl extends Cl {
    get sender() {
      return this._sender;
    }
    set sender(e2) {
      this._sender = e2, this.degradationPreference && this.setDegradationPreference(this.degradationPreference);
    }
    constructor(t2, i2) {
      let o2 = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], s2 = arguments.length > 3 ? arguments[3] : void 0;
      super(t2, Ws.Kind.Video, i2, o2, s2), this.simulcastCodecs = /* @__PURE__ */ new Map(), this.degradationPreference = "balanced", this.isCpuConstrained = false, this.optimizeForPerformance = false, this.monitorSender = () => kr(this, void 0, void 0, (function* () {
        if (!this.sender) return void (this._currentBitrate = 0);
        let t3;
        try {
          t3 = yield this.getSenderStats();
        } catch (n2) {
          return void this.log.error("could not get video sender stats", Object.assign(Object.assign({}, this.logContext), { error: n2 }));
        }
        const i3 = new Map(t3.map(((e2) => [e2.rid, e2]))), r2 = t3.some(((e2) => "cpu" === e2.qualityLimitationReason));
        if (r2 !== this.isCpuConstrained && (this.isCpuConstrained = r2, this.isCpuConstrained && this.emit(e.TrackEvent.CpuConstrained)), this.prevStats) {
          let e2 = 0;
          i3.forEach(((t4, n2) => {
            var i4;
            const r3 = null === (i4 = this.prevStats) || void 0 === i4 ? void 0 : i4.get(n2);
            e2 += Pc(t4, r3);
          })), this._currentBitrate = e2;
        }
        this.prevStats = i3;
      })), this.senderLock = new r();
    }
    get isSimulcast() {
      return !!(this.sender && this.sender.getParameters().encodings.length > 1);
    }
    startMonitor(e2) {
      var t2;
      if (this.signalClient = e2, !pa()) return;
      const n2 = null === (t2 = this.sender) || void 0 === t2 ? void 0 : t2.getParameters();
      n2 && (this.encodings = n2.encodings), this.monitorInterval || (this.monitorInterval = setInterval((() => {
        this.monitorSender();
      }), Rc));
    }
    stop() {
      this._mediaStreamTrack.getConstraints(), this.simulcastCodecs.forEach(((e2) => {
        e2.mediaStreamTrack.stop();
      })), super.stop();
    }
    pauseUpstream() {
      const e2 = Object.create(null, { pauseUpstream: { get: () => super.pauseUpstream } });
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2, r2, o2;
        yield e2.pauseUpstream.call(this);
        try {
          for (var s2, a2 = true, c2 = Sr(this.simulcastCodecs.values()); !(t2 = (s2 = yield c2.next()).done); a2 = true) {
            r2 = s2.value, a2 = false;
            const e3 = r2;
            yield null === (o2 = e3.sender) || void 0 === o2 ? void 0 : o2.replaceTrack(null);
          }
        } catch (d2) {
          n2 = { error: d2 };
        } finally {
          try {
            a2 || t2 || !(i2 = c2.return) || (yield i2.call(c2));
          } finally {
            if (n2) throw n2.error;
          }
        }
      }));
    }
    resumeUpstream() {
      const e2 = Object.create(null, { resumeUpstream: { get: () => super.resumeUpstream } });
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2, r2, o2;
        yield e2.resumeUpstream.call(this);
        try {
          for (var s2, a2 = true, c2 = Sr(this.simulcastCodecs.values()); !(t2 = (s2 = yield c2.next()).done); a2 = true) {
            r2 = s2.value, a2 = false;
            const e3 = r2;
            yield null === (o2 = e3.sender) || void 0 === o2 ? void 0 : o2.replaceTrack(e3.mediaStreamTrack);
          }
        } catch (d2) {
          n2 = { error: d2 };
        } finally {
          try {
            a2 || t2 || !(i2 = c2.return) || (yield i2.call(c2));
          } finally {
            if (n2) throw n2.error;
          }
        }
      }));
    }
    mute() {
      const e2 = Object.create(null, { mute: { get: () => super.mute } });
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.log.debug("Track already muted", this.logContext), this) : (this.source !== Ws.Source.Camera || this.isUserProvided || (this.log.debug("stopping camera track", this.logContext), this._mediaStreamTrack.stop()), yield e2.mute.call(this), this);
        } finally {
          t2();
        }
      }));
    }
    unmute() {
      const e2 = Object.create(null, { unmute: { get: () => super.unmute } });
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.muteLock.lock();
        try {
          return this.isMuted ? (this.source !== Ws.Source.Camera || this.isUserProvided || (this.log.debug("reacquiring camera track", this.logContext), yield this.restart(void 0, true)), yield e2.unmute.call(this), this) : (this.log.debug("Track already unmuted", this.logContext), this);
        } finally {
          t2();
        }
      }));
    }
    setTrackMuted(e2) {
      super.setTrackMuted(e2);
      for (const t2 of this.simulcastCodecs.values()) t2.mediaStreamTrack.enabled = !e2;
    }
    getSenderStats() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!(null === (e2 = this.sender) || void 0 === e2 ? void 0 : e2.getStats)) return [];
        const t2 = [], n2 = yield this.sender.getStats();
        return n2.forEach(((e3) => {
          var i2;
          if ("outbound-rtp" === e3.type) {
            const r2 = { type: "video", streamId: e3.id, frameHeight: e3.frameHeight, frameWidth: e3.frameWidth, framesPerSecond: e3.framesPerSecond, framesSent: e3.framesSent, firCount: e3.firCount, pliCount: e3.pliCount, nackCount: e3.nackCount, packetsSent: e3.packetsSent, bytesSent: e3.bytesSent, qualityLimitationReason: e3.qualityLimitationReason, qualityLimitationDurations: e3.qualityLimitationDurations, qualityLimitationResolutionChanges: e3.qualityLimitationResolutionChanges, rid: null !== (i2 = e3.rid) && void 0 !== i2 ? i2 : e3.id, retransmittedPacketsSent: e3.retransmittedPacketsSent, targetBitrate: e3.targetBitrate, timestamp: e3.timestamp }, o2 = n2.get(e3.remoteId);
            o2 && (r2.jitter = o2.jitter, r2.packetsLost = o2.packetsLost, r2.roundTripTime = o2.roundTripTime), t2.push(r2);
          }
        })), t2.sort(((e3, t3) => {
          var n3, i2;
          return (null !== (n3 = t3.frameWidth) && void 0 !== n3 ? n3 : 0) - (null !== (i2 = e3.frameWidth) && void 0 !== i2 ? i2 : 0);
        })), t2;
      }));
    }
    isSvcPublish(e2) {
      return $s(e2) && !ta(e2, this.publishOptions);
    }
    setPublishingQuality(t2) {
      const n2 = [];
      for (let i2 = e.VideoQuality.LOW; i2 <= e.VideoQuality.HIGH; i2 += 1) n2.push(new Pi({ quality: i2, enabled: i2 <= t2 }));
      this.log.debug("setting publishing quality. max quality ".concat(t2), this.logContext), this.setPublishingLayers(this.isSvcPublish(this.codec), n2);
    }
    restartTrack(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2, r2, o2;
        let s2;
        if (e2) {
          const t3 = Ms({ video: e2 });
          "boolean" != typeof t3.video && (s2 = t3.video);
        }
        yield this.restart(s2), this.isCpuConstrained = false;
        try {
          for (var a2, c2 = true, d2 = Sr(this.simulcastCodecs.values()); !(t2 = (a2 = yield d2.next()).done); c2 = true) {
            r2 = a2.value, c2 = false;
            const e3 = r2;
            e3.sender && "closed" !== (null === (o2 = e3.sender.transport) || void 0 === o2 ? void 0 : o2.state) && (e3.mediaStreamTrack = this.mediaStreamTrack.clone(), yield e3.sender.replaceTrack(e3.mediaStreamTrack));
          }
        } catch (l2) {
          n2 = { error: l2 };
        } finally {
          try {
            c2 || t2 || !(i2 = d2.return) || (yield i2.call(d2));
          } finally {
            if (n2) throw n2.error;
          }
        }
        yield this.onSenderTrackSwapped();
      }));
    }
    onSenderTrackSwapped() {
      return kr(this, void 0, void 0, (function* () {
        yield this.refreshSenderEncodings();
      }));
    }
    refreshSenderEncodings() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        if (!this.sender || !this.publishOptions || this.optimizeForPerformance) return;
        const t2 = yield this.senderLock.lock();
        try {
          let t3;
          try {
            t3 = yield this.waitForDimensions();
          } catch (n2) {
            return void this.log.warn("could not determine new track dimensions, skipping encoding recompute", Object.assign(Object.assign({}, this.logContext), { error: n2 }));
          }
          if (this.lastEncodedDimensions && this.lastEncodedDimensions.width === t3.width && this.lastEncodedDimensions.height === t3.height) return;
          const r2 = Ol(this.source === Ws.Source.ScreenShare, t3.width, t3.height, Object.assign({}, this.publishOptions));
          yield this.applyEncodingsToSender(this.sender, r2), this.encodings = r2, this.lastEncodedDimensions = t3;
          for (const n2 of this.simulcastCodecs) {
            var i2 = j(n2, 2);
            const t4 = i2[0], r3 = i2[1];
            if (!r3.sender || "closed" === (null === (e2 = r3.sender.transport) || void 0 === e2 ? void 0 : e2.state)) continue;
            if (!Ts(t4)) continue;
            const o2 = Al(this, t4, Object.assign({}, this.publishOptions));
            o2 && (yield this.applyEncodingsToSender(r3.sender, o2), r3.encodings = o2);
          }
        } catch (n2) {
          this.log.warn("failed to apply recomputed encodings", Object.assign(Object.assign({}, this.logContext), { error: n2 }));
        } finally {
          t2();
        }
      }));
    }
    applyEncodingsToSender(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = e2.getParameters();
        n2.encodings && n2.encodings.length === t2.length && (n2.encodings.forEach(((e3, n3) => {
          if (false === e3.active) return;
          const i2 = t2[n3];
          void 0 !== i2.scaleResolutionDownBy && (e3.scaleResolutionDownBy = i2.scaleResolutionDownBy), void 0 !== i2.maxBitrate && (e3.maxBitrate = i2.maxBitrate), void 0 !== i2.maxFramerate && (e3.maxFramerate = i2.maxFramerate), void 0 !== i2.priority && (e3.priority = i2.priority, e3.networkPriority = i2.priority);
        })), this.log.debug("updating sender encodings after track restart", Object.assign(Object.assign({}, this.logContext), { encodings: n2.encodings })), yield e2.setParameters(n2));
      }));
    }
    setProcessor(e2) {
      const t2 = Object.create(null, { setProcessor: { get: () => super.setProcessor } });
      return kr(this, arguments, void 0, (function(e3) {
        var n2 = this;
        let i2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (function* () {
          var r2, o2, s2, a2, c2, d2;
          if (yield t2.setProcessor.call(n2, e3, i2), null === (c2 = n2.processor) || void 0 === c2 ? void 0 : c2.processedTrack) try {
            for (var l2, u2 = true, h2 = Sr(n2.simulcastCodecs.values()); !(r2 = (l2 = yield h2.next()).done); u2 = true) {
              a2 = l2.value, u2 = false;
              const e4 = a2;
              yield null === (d2 = e4.sender) || void 0 === d2 ? void 0 : d2.replaceTrack(n2.processor.processedTrack);
            }
          } catch (p2) {
            o2 = { error: p2 };
          } finally {
            try {
              u2 || r2 || !(s2 = h2.return) || (yield s2.call(h2));
            } finally {
              if (o2) throw o2.error;
            }
          }
        })();
      }));
    }
    setDegradationPreference(e2) {
      return kr(this, void 0, void 0, (function* () {
        this.degradationPreference = e2, yield this.applyDegradationPreference(this.sender);
        for (const e3 of this.simulcastCodecs.values()) yield this.applyDegradationPreference(e3.sender);
      }));
    }
    applyDegradationPreference(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (e2) try {
          this.log.debug("setting degradationPreference to ".concat(this.degradationPreference), this.logContext);
          const t2 = e2.getParameters();
          t2.degradationPreference = this.degradationPreference, yield e2.setParameters(t2);
        } catch (n2) {
          this.log.warn("failed to set degradationPreference", Object.assign({ error: n2 }, this.logContext));
        }
      }));
    }
    addSimulcastTrack(e2, t2) {
      if (this.simulcastCodecs.has(e2)) return void this.log.error("".concat(e2, " already added, skipping adding simulcast codec"), this.logContext);
      const n2 = { codec: e2, mediaStreamTrack: this.mediaStreamTrack.clone(), sender: void 0, encodings: t2 };
      return this.simulcastCodecs.set(e2, n2), n2;
    }
    setSimulcastTrackSender(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = this.simulcastCodecs.get(e2);
        n2 && (n2.sender = t2, yield this.applyDegradationPreference(t2), setTimeout((() => {
          this.refreshSubscribedCodecs();
        }), 5e3));
      }));
    }
    refreshSubscribedCodecs() {
      return kr(this, void 0, void 0, (function* () {
        if (this.subscribedCodecs) return this.setPublishingCodecs(this.subscribedCodecs).catch(((e2) => this.log.warn("failed to refresh codec for track", Object.assign(Object.assign({}, this.logContext), { error: e2 }))));
      }));
    }
    setPublishingCodecs(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2, r2, o2, s2, a2;
        if (this.log.debug("setting publishing codecs", Object.assign(Object.assign({}, this.logContext), { codecs: e2, currentCodec: this.codec })), !this.codec && e2.length > 0) return yield this.setPublishingLayers(this.isSvcPublish(e2[0].codec), e2[0].qualities), [];
        this.subscribedCodecs = e2;
        const c2 = [];
        try {
          for (t2 = true, n2 = Sr(e2); !(r2 = (i2 = yield n2.next()).done); t2 = true) {
            a2 = i2.value, t2 = false;
            const e3 = a2;
            if (this.codec && this.codec !== e3.codec) {
              const t3 = this.simulcastCodecs.get(e3.codec);
              if (this.log.debug("try setPublishingCodec for ".concat(e3.codec), Object.assign(Object.assign({}, this.logContext), { simulcastCodecInfo: t3 })), t3 && t3.sender) t3.encodings && (this.log.debug("try setPublishingLayersForSender ".concat(e3.codec), this.logContext), yield jl(t3.sender, t3.encodings, e3.qualities, this.senderLock, this.isSvcPublish(e3.codec), this.log, this.logContext));
              else for (const n3 of e3.qualities) if (n3.enabled) {
                c2.push(e3.codec);
                break;
              }
            } else yield this.setPublishingLayers(this.isSvcPublish(e3.codec), e3.qualities);
          }
        } catch (d2) {
          o2 = { error: d2 };
        } finally {
          try {
            t2 || r2 || !(s2 = n2.return) || (yield s2.call(n2));
          } finally {
            if (o2) throw o2.error;
          }
        }
        return c2;
      }));
    }
    setPublishingLayers(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        this.optimizeForPerformance ? this.log.info("skipping setPublishingLayers due to optimized publishing performance", Object.assign(Object.assign({}, this.logContext), { qualities: t2 })) : (this.log.debug("setting publishing layers", Object.assign(Object.assign({}, this.logContext), { qualities: t2 })), this.sender && this.encodings && (yield jl(this.sender, this.encodings, t2, this.senderLock, e2, this.log, this.logContext)));
      }));
    }
    prioritizePerformance() {
      return kr(this, void 0, void 0, (function* () {
        if (!this.sender) throw new Error("sender not found");
        const e2 = yield this.senderLock.lock();
        try {
          this.optimizeForPerformance = true;
          const e3 = this.sender.getParameters();
          e3.encodings = e3.encodings.map(((e4, t2) => {
            var n2;
            return Object.assign(Object.assign({}, e4), { active: 0 === t2, scaleResolutionDownBy: Math.max(1, Math.ceil((null !== (n2 = this.mediaStreamTrack.getSettings().height) && void 0 !== n2 ? n2 : 360) / 360)), scalabilityMode: 0 === t2 && $s(this.codec) ? "L1T3" : void 0, maxFramerate: 0 === t2 ? 15 : 0, maxBitrate: 0 === t2 ? e4.maxBitrate : 0 });
          })), this.log.debug("setting performance optimised encodings", Object.assign(Object.assign({}, this.logContext), { encodings: e3.encodings })), this.encodings = e3.encodings, yield this.sender.setParameters(e3);
        } catch (n2) {
          this.log.error("failed to set performance optimised encodings", Object.assign(Object.assign({}, this.logContext), { error: n2 })), this.optimizeForPerformance = false;
        } finally {
          e2();
        }
      }));
    }
    handleAppVisibilityChanged() {
      const e2 = Object.create(null, { handleAppVisibilityChanged: { get: () => super.handleAppVisibilityChanged } });
      return kr(this, void 0, void 0, (function* () {
        yield e2.handleAppVisibilityChanged.call(this), ha() && this.isInBackground && this.source === Ws.Source.Camera && (this._mediaStreamTrack.enabled = false);
      }));
    }
  }
  function jl(e2, t2, n2, i2, r2, o2, s2) {
    return kr(this, void 0, void 0, (function* () {
      const a2 = yield i2.lock();
      o2.debug("setPublishingLayersForSender", Object.assign(Object.assign({}, s2), { sender: e2, qualities: n2, senderEncodings: t2 }));
      try {
        const i3 = e2.getParameters(), a3 = i3.encodings;
        if (!a3) return;
        if (a3.length !== t2.length) return void o2.warn("cannot set publishing layers, encodings mismatch", Object.assign(Object.assign({}, s2), { encodings: a3, senderEncodings: t2 }));
        let c2 = false;
        if (false) ;
        else {
          if (r2) {
            n2.some(((e3) => e3.enabled)) && n2.forEach(((e3) => e3.enabled = true));
          }
          a3.forEach(((e3, i4) => {
            var r3;
            let a4 = null !== (r3 = e3.rid) && void 0 !== r3 ? r3 : "";
            "" === a4 && (a4 = "q");
            const d2 = Bl(a4), l2 = n2.find(((e4) => e4.quality === d2));
            l2 && e3.active !== l2.enabled && (c2 = true, e3.active = l2.enabled, o2.debug("setting layer ".concat(l2.quality, " to ").concat(e3.active ? "enabled" : "disabled"), s2), oa() && (l2.enabled ? (e3.scaleResolutionDownBy = t2[i4].scaleResolutionDownBy, e3.maxBitrate = t2[i4].maxBitrate, e3.maxFrameRate = t2[i4].maxFrameRate) : (e3.scaleResolutionDownBy = 4, e3.maxBitrate = 10, e3.maxFrameRate = 2)));
          }));
        }
        c2 && (i3.encodings = a3, o2.debug("setting encodings", Object.assign(Object.assign({}, s2), { encodings: i3.encodings })), yield e2.setParameters(i3));
      } finally {
        a2();
      }
    }));
  }
  function Bl(t2) {
    switch (t2) {
      case "f":
      default:
        return e.VideoQuality.HIGH;
      case "h":
        return e.VideoQuality.MEDIUM;
      case "q":
        return e.VideoQuality.LOW;
    }
  }
  function ql(t2, n2, i2, r2) {
    if (!i2) return [new Dt({ quality: e.VideoQuality.HIGH, width: t2, height: n2, bitrate: 0, ssrc: 0 })];
    if (r2) {
      const r3 = i2[0].scalabilityMode, o2 = new Ul(r3), s2 = [], a2 = "h" == o2.suffix ? 1.5 : 2, c2 = "h" == o2.suffix ? 2 : 3;
      for (let d2 = 0; d2 < o2.spatial; d2 += 1) s2.push(new Dt({ quality: Math.min(e.VideoQuality.HIGH, o2.spatial - 1) - d2, width: Math.ceil(t2 / Math.pow(a2, d2)), height: Math.ceil(n2 / Math.pow(a2, d2)), bitrate: i2[0].maxBitrate ? Math.ceil(i2[0].maxBitrate / Math.pow(c2, d2)) : 0, ssrc: 0 }));
      return s2;
    }
    return i2.map(((e2) => {
      var i3, r3, o2;
      const s2 = null !== (i3 = e2.scaleResolutionDownBy) && void 0 !== i3 ? i3 : 1;
      let a2 = Bl(null !== (r3 = e2.rid) && void 0 !== r3 ? r3 : "");
      return new Dt({ quality: a2, width: Math.ceil(t2 / s2), height: Math.ceil(n2 / s2), bitrate: null !== (o2 = e2.maxBitrate) && void 0 !== o2 ? o2 : 0, ssrc: 0 });
    }));
  }
  const Vl = "leave-reconnect";
  var Wl;
  !(function(e2) {
    e2[e2.New = 0] = "New", e2[e2.Connected = 1] = "Connected", e2[e2.Disconnected = 2] = "Disconnected", e2[e2.Reconnecting = 3] = "Reconnecting", e2[e2.Closed = 4] = "Closed";
  })(Wl || (Wl = {}));
  class Hl extends wr.EventEmitter {
    get isClosed() {
      return this._isClosed;
    }
    get isNewlyCreated() {
      return this._isNewlyCreated;
    }
    get pendingReconnect() {
      return !!this.reconnectTimeout;
    }
    get serverVersion() {
      var e2, t2, n2;
      return (null === (t2 = null === (e2 = this.latestJoinResponse) || void 0 === e2 ? void 0 : e2.serverInfo) || void 0 === t2 ? void 0 : t2.version) || (null === (n2 = this.latestJoinResponse) || void 0 === n2 ? void 0 : n2.serverVersion) || void 0;
    }
    get reliableChannel() {
      return this.dataChannels.reliable;
    }
    get lossyChannel() {
      return this.dataChannels.lossy;
    }
    get dataTrackChannel() {
      return this.dataChannels.dataTrack;
    }
    constructor(t2) {
      var i2;
      super(), this.options = t2, this.rtcConfig = {}, this.peerConnectionTimeout = sl.peerConnectionTimeout, this.fullReconnectOnNext = false, this.latestRemoteOfferId = 0, this.subscriberPrimary = false, this.pcState = Wl.New, this._isClosed = true, this._isNewlyCreated = true, this.pendingTrackResolvers = {}, this.reconnectAttempts = 0, this.reconnectStart = 0, this.attemptingReconnect = false, this.joinAttempts = 0, this.maxJoinAttempts = 1, this.shouldFailNext = false, this.shouldFailOnV1Path = false, this.log = ar, this.reliableReceivedState = new Rd(3e4), this.midToTrackId = {}, this.isWaitingForNetworkReconnect = false, this.pendingNegotiationAborts = /* @__PURE__ */ new Set(), this.handleDataChannel = (e2) => kr(this, [e2], void 0, (function(e3) {
        var t3 = this;
        let n2 = e3.channel;
        return (function* () {
          n2 && t3.dataChannels.adoptSubscriberChannel(n2) && t3.log.debug("on data channel ".concat(n2.id, ", ").concat(n2.label));
        })();
      })), this.handleDataMessage = (t3) => kr(this, void 0, void 0, (function* () {
        var n2, i3, r2, o3;
        const s2 = yield this.dataProcessLock.lock();
        try {
          const s3 = yield this.decodeDataMessage(t3);
          if (!s3) return;
          const c2 = At.fromBinary(s3);
          if (c2.sequence > 0 && "" !== c2.participantSid) {
            const e2 = this.reliableReceivedState.get(c2.participantSid);
            if (e2 && c2.sequence <= e2) return;
            this.reliableReceivedState.set(c2.participantSid, c2.sequence);
          }
          if ("speaker" === (null === (n2 = c2.value) || void 0 === n2 ? void 0 : n2.case)) this.emit(e.EngineEvent.ActiveSpeakersUpdate, c2.value.value.speakers);
          else if ("encryptedPacket" === (null === (i3 = c2.value) || void 0 === i3 ? void 0 : i3.case)) {
            if (!this.e2eeManager) return void this.log.error("Received encrypted packet but E2EE not set up");
            let t4;
            try {
              t4 = yield this.e2eeManager.handleEncryptedData(c2.value.value.encryptedValue, c2.value.value.iv, c2.participantIdentity, c2.value.value.keyIndex);
            } catch (a2) {
              return void this.log.debug("failed to decrypt data packet", { error: a2, participantIdentity: c2.participantIdentity });
            }
            const n3 = xt.fromBinary(t4.payload), i4 = new At({ value: n3.value, participantIdentity: c2.participantIdentity, participantSid: c2.participantSid });
            "user" === (null === (r2 = i4.value) || void 0 === r2 ? void 0 : r2.case) && Kl(i4, i4.value.value), this.emit(e.EngineEvent.DataPacketReceived, i4, c2.value.value.encryptionType);
          } else "user" === (null === (o3 = c2.value) || void 0 === o3 ? void 0 : o3.case) && Kl(c2, c2.value.value), this.emit(e.EngineEvent.DataPacketReceived, c2, yt.NONE);
        } finally {
          s2();
        }
      })), this.handleDataTrackMessage = (e2) => kr(this, void 0, void 0, (function* () {
        const t3 = yield this.decodeDataMessage(e2);
        t3 && this.emit("dataTrackPacketReceived", t3);
      })), this.handleDataError = (e2) => {
        if (this._isClosed) return;
        const t3 = 0 === e2.currentTarget.maxRetransmits ? "lossy" : "reliable";
        if ("undefined" != typeof RTCErrorEvent && e2 instanceof RTCErrorEvent && e2.error) {
          const n2 = e2.error;
          this.log.error("DataChannel error on ".concat(t3, ": ").concat(n2.message), { error: n2, errorDetail: n2.errorDetail, sctpCauseCode: n2.sctpCauseCode });
        } else this.log.error("Unknown DataChannel error on ".concat(t3), { event: e2 });
      }, this.handleDataChannelClose = (e2) => () => {
        var t3;
        this._isClosed || "connected" !== (null === (t3 = this.pcManager) || void 0 === t3 ? void 0 : t3.publisher.getConnectionState()) || this.log.error("publisher data channel '".concat(cl[e2], "' closed unexpectedly"), this.logContext);
      }, this.handleDisconnect = (t3, n2) => {
        if (this._isClosed) return;
        this.log.warn("".concat(t3, " disconnected")), 0 === this.reconnectAttempts && (this.reconnectStart = Date.now());
        const i3 = (t4) => {
          this.log.warn("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(t4, "ms. giving up")), this.emit(e.EngineEvent.Disconnected), this.close("gave up reconnecting after ".concat(this.reconnectAttempts, " attempts, ").concat(t4, "ms"));
        }, r2 = Date.now() - this.reconnectStart;
        let o3 = this.getNextRetryDelay({ elapsedMs: r2, retryCount: this.reconnectAttempts });
        null !== o3 && (t3 !== Vl || (o3 = this.getNextRetryDelay({ elapsedMs: r2, retryCount: 0 }), null !== o3)) ? (this.log.debug("reconnecting in ".concat(o3, "ms")), this.clearReconnectTimeout(), this.token && this.emit(e.EngineEvent.TokenRefreshed, this.token), this.reconnectTimeout = ls.setTimeout((() => this.attemptReconnect(n2).finally((() => this.reconnectTimeout = void 0))), o3)) : i3(r2);
      }, this.waitForRestarted = () => new Promise(((t3, n2) => {
        this.pcState === Wl.Connected && t3();
        const i3 = () => {
          this.off(e.EngineEvent.Disconnected, r2), t3();
        }, r2 = () => {
          this.off(e.EngineEvent.Restarted, i3), n2();
        };
        this.once(e.EngineEvent.Restarted, i3), this.once(e.EngineEvent.Disconnected, r2);
      })), this.onRtpMapAvailable = (t3) => {
        const n2 = /* @__PURE__ */ new Map();
        t3.forEach(((e2) => {
          const t4 = e2.codec.toLowerCase();
          Na(t4) && n2.set(e2.payload, t4);
        })), this.emit(e.EngineEvent.RTPVideoMapUpdate, n2);
      }, this.handleBrowserOnLine = () => kr(this, void 0, void 0, (function* () {
        if (!this.url) return;
        (yield fetch(Fa(this.url), { method: "HEAD" }).then(((e2) => e2.ok)).catch((() => false))) && (this.log.info("detected network reconnected"), (this.client.currentState === Sd.RECONNECTING || this.isWaitingForNetworkReconnect && this.client.currentState === Sd.CONNECTED) && (this.clearReconnectTimeout(), this.attemptReconnect(ct.RR_SIGNAL_DISCONNECTED), this.isWaitingForNetworkReconnect = false));
      })), this.handleBrowserOffline = () => kr(this, void 0, void 0, (function* () {
        if (this.url) try {
          yield Promise.race([fetch(Fa(this.url), { method: "HEAD" }), Js(4e3).then((() => Promise.reject()))]);
        } catch (n2) {
          false === window.navigator.onLine && (this.log.info("detected network interruption"), this.isWaitingForNetworkReconnect = true);
        }
      })), this.log = dr(null !== (i2 = t2.loggerName) && void 0 !== i2 ? i2 : e.LoggerNames.Engine, (() => this.logContext)), this.loggerOptions = { loggerName: t2.loggerName, loggerContextCb: () => this.logContext }, this.client = new Ed(void 0, this.loggerOptions), this.client.signalLatency = this.options.expSignalLatency, this.reconnectPolicy = this.options.reconnectPolicy, this.closingLock = new r(), this.dataProcessLock = new r(), this.dataChannels = new bl({ isEngineClosed: () => this.isClosed, isReconnecting: () => this.attemptingReconnect, onDataMessage: (e2) => this.handleDataMessage(e2), onDataTrackMessage: (e2) => this.handleDataTrackMessage(e2), onDataError: (e2) => this.handleDataError(e2), onChannelClose: (e2) => this.handleDataChannelClose(e2)(), onBufferStatusChanged: (t3, n2) => this.emit(e.EngineEvent.DCBufferStatusChanged, n2, t3) }), this.client.onParticipantUpdate = (t3) => this.emit(e.EngineEvent.ParticipantUpdate, t3), this.client.onConnectionQuality = (t3) => {
        this.handleLocalConnectionQuality(t3), this.emit(e.EngineEvent.ConnectionQualityUpdate, t3);
      }, this.client.onRoomUpdate = (t3) => this.emit(e.EngineEvent.RoomUpdate, t3), this.client.onSubscriptionError = (t3) => this.emit(e.EngineEvent.SubscriptionError, t3), this.client.onSubscriptionPermissionUpdate = (t3) => this.emit(e.EngineEvent.SubscriptionPermissionUpdate, t3), this.client.onSpeakersChanged = (t3) => this.emit(e.EngineEvent.SpeakersChanged, t3), this.client.onStreamStateUpdate = (t3) => this.emit(e.EngineEvent.StreamStateChanged, t3), this.client.onRequestResponse = (t3) => this.emit(e.EngineEvent.SignalRequestResponse, t3), this.client.onParticipantUpdate = (t3) => this.emit(e.EngineEvent.ParticipantUpdate, t3), this.client.onJoined = (t3) => this.emit(e.EngineEvent.Joined, t3);
      const o2 = () => {
        for (const e2 of Array.from(this.pendingNegotiationAborts)) e2();
      };
      this.on(e.EngineEvent.Closing, o2), this.on(e.EngineEvent.Restarting, o2);
    }
    get logContext() {
      var e2, t2, n2, i2, r2, o2;
      return { room: null === (t2 = null === (e2 = this.latestJoinResponse) || void 0 === e2 ? void 0 : e2.room) || void 0 === t2 ? void 0 : t2.name, roomID: null === (i2 = null === (n2 = this.latestJoinResponse) || void 0 === n2 ? void 0 : n2.room) || void 0 === i2 ? void 0 : i2.sid, participant: null === (o2 = null === (r2 = this.latestJoinResponse) || void 0 === r2 ? void 0 : r2.participant) || void 0 === o2 ? void 0 : o2.identity, participantID: this.participantSid };
    }
    join(t2, i2, r2, o2) {
      return kr(this, arguments, void 0, (function(t3, i3, r3, o3) {
        var s2 = this;
        let a2 = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
        return (function* () {
          var c2, d2, l2, u2;
          s2._isNewlyCreated = false, s2.url = t3, s2.token = i3, s2.signalOpts = r3, s2.maxJoinAttempts = r3.maxRetries;
          try {
            s2.joinAttempts += 1, s2.joinStartedAt = performance.now(), s2.setupSignalClientCallbacks();
            const n2 = !a2 && Za() && !oa();
            let h2;
            if (n2) {
              s2.pcManager || (yield s2.configure(), s2.applyInitialPublisherLayout());
              const e2 = yield null === (c2 = s2.pcManager) || void 0 === c2 ? void 0 : c2.publisher.createInitialOffer();
              e2 && (h2 = wd(e2.offer, e2.offerId));
            }
            if (null == o3 ? void 0 : o3.aborted) throw Zo.cancelled("Connection aborted");
            if (!a2 && s2.shouldFailOnV1Path) throw s2.shouldFailOnV1Path = false, Zo.serviceNotFound("Simulated v1 path failure", "v0-rtc");
            const p2 = yield s2.client.join(t3, i3, r3, o3, a2, h2);
            if (null == o3 ? void 0 : o3.aborted) throw s2.log.info("join cancelled after the signal join response"), Zo.cancelled("Connection aborted");
            if (s2._isClosed = false, s2.latestJoinResponse = p2, s2.participantSid = null === (d2 = p2.participant) || void 0 === d2 ? void 0 : d2.sid, s2.subscriberPrimary = p2.subscriberPrimary, n2) null === (l2 = s2.pcManager) || void 0 === l2 || l2.updateConfiguration(s2.makeRTCConfiguration(p2));
            else {
              if (!s2.pcManager) {
                if (yield s2.configure(p2, !a2), null == o3 ? void 0 : o3.aborted) throw s2.log.info("join cancelled after configuring peer connections"), Zo.cancelled("Connection aborted");
                a2 || s2.applyInitialPublisherLayout();
              }
              s2.subscriberPrimary && !p2.fastPublish || s2.negotiate().catch(((e2) => {
                s2.log.error(e2);
              }));
            }
            void 0 !== s2.joinStartedAt && (null === (u2 = s2.pcManager) || void 0 === u2 || u2.publisher.setConnectionStartedAt(s2.joinStartedAt)), s2.registerOnLineListener(), s2.clientConfiguration = p2.clientConfiguration, s2.emit(e.EngineEvent.SignalConnected, p2);
            let m2 = p2.serverInfo;
            return m2 || (m2 = { version: p2.serverVersion, region: p2.serverRegion }), s2.log.info("connected to Livekit Server ".concat(Object.entries(m2).map(((e2) => {
              let t4 = j(e2, 2), n3 = t4[0], i4 = t4[1];
              return "".concat(n3, ": ").concat(i4);
            })).join(", "))), { joinResponse: p2, serverInfo: m2 };
          } catch (n2) {
            if (n2 instanceof Zo) {
              if (n2.reason === e.ConnectionErrorReason.ServerUnreachable) {
                if (s2.log.warn("Couldn't connect to server, attempt ".concat(s2.joinAttempts, " of ").concat(s2.maxJoinAttempts)), s2.joinAttempts < s2.maxJoinAttempts) return s2.join(t3, i3, r3, o3, a2);
              } else if (n2.reason === e.ConnectionErrorReason.ServiceNotFound) return s2.log.warn("Initial connection failed: ".concat(n2.message, " \u2013 Retrying")), s2.pcManager && (s2.pcManager.onStateChange = void 0, yield s2.cleanupPeerConnections()), s2.join(t3, i3, r3, o3, true);
            }
            throw n2;
          }
        })();
      }));
    }
    close(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        null === (n2 = this.reconnectAbortController) || void 0 === n2 || n2.abort(), this.reconnectAbortController = void 0;
        const i2 = yield this.closingLock.lock();
        if (this.isClosed) i2();
        else try {
          this._isClosed = true, this.joinAttempts = 0, this.joinStartedAt = void 0, this.emit(e.EngineEvent.Closing), this.removeAllListeners(), this.deregisterOnLineListener(), this.clearPendingReconnect(), this.clearLostQualityTimeout(), this.cleanupLossyDataStats(), yield this.cleanupPeerConnections(), yield this.cleanupClient(t2);
        } finally {
          i2();
        }
      }));
    }
    cleanupPeerConnections() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        this.dataChannels.teardown(), yield null === (e2 = this.pcManager) || void 0 === e2 ? void 0 : e2.close(), this.pcManager = void 0, this.transportConnectingSince = void 0, this.reliableReceivedState.clear();
      }));
    }
    cleanupLossyDataStats() {
      this.lossyChannel.stopThresholdTuning();
    }
    cleanupClient(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.client.close(true, e2), this.client.resetCallbacks();
        for (const e3 of Object.keys(this.pendingTrackResolvers)) this.pendingTrackResolvers[e3].reject();
        this.pendingTrackResolvers = {};
      }));
    }
    addTrack(e2) {
      if (this.pendingTrackResolvers[e2.cid]) throw new ts("a track with the same ID has already been published");
      return new Promise(((t2, n2) => {
        const i2 = ls.setTimeout((() => {
          delete this.pendingTrackResolvers[e2.cid], n2(Zo.timeout("publication of local track timed out, no response from server"));
        }), 1e4);
        this.pendingTrackResolvers[e2.cid] = { resolve: (e3) => {
          ls.clearTimeout(i2), t2(e3);
        }, reject: () => {
          ls.clearTimeout(i2), n2(new Error("Cancelled publication by calling unpublish"));
        } }, this.client.sendAddTrack(e2);
      }));
    }
    removeTrack(e2) {
      if (e2.track && this.pendingTrackResolvers[e2.track.id]) {
        const t2 = this.pendingTrackResolvers[e2.track.id].reject;
        t2 && t2(), delete this.pendingTrackResolvers[e2.track.id];
      }
      try {
        return this.pcManager.removeTrack(e2), true;
      } catch (n2) {
        this.log.warn("failed to remove track", { error: n2 });
      }
      return false;
    }
    updateMuteStatus(e2, t2) {
      this.client.sendMuteTrack(e2, t2);
    }
    get dataSubscriberReadyState() {
      var e2;
      return null === (e2 = this.dataChannelForKind(cl.RELIABLE, true)) || void 0 === e2 ? void 0 : e2.readyState;
    }
    getConnectedServerAddress() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        return null === (e2 = this.pcManager) || void 0 === e2 ? void 0 : e2.getConnectedAddress();
      }));
    }
    setRegionStrategy(e2) {
      this.regionStrategy = e2;
    }
    configure(t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        var i2;
        if (!this.pcManager || this.pcManager.currentState === al.NEW) {
          if (t2) {
            this.participantSid = null === (i2 = t2.participant) || void 0 === i2 ? void 0 : i2.sid;
            const e2 = this.makeRTCConfiguration(t2);
            this.pcManager = new dl(n2 ? "publisher-only" : t2.subscriberPrimary ? "subscriber-primary" : "publisher-primary", this.loggerOptions, e2);
          } else {
            const e2 = this.makeRTCConfiguration();
            this.pcManager = new dl("publisher-only", this.loggerOptions, e2);
          }
          this.emit(e.EngineEvent.TransportsCreated, this.pcManager.publisher, this.pcManager.subscriber), this.pcManager.onIceCandidate = (e2, t3) => {
            this.client.sendIceCandidate(e2, t3);
          }, this.pcManager.onPublisherOffer = (e2, t3) => {
            this.client.sendOffer(e2, t3);
          }, this.pcManager.onDataChannel = this.handleDataChannel, this.pcManager.onStateChange = (t3, n3, i3) => kr(this, void 0, void 0, (function* () {
            var r2;
            if (this.log.debug("primary PC state changed ".concat(t3)), t3 === al.CONNECTING ? this.transportConnectingSince = Date.now() : this.transportConnectingSince = void 0, ["closed", "disconnected", "failed"].includes(n3) && (this.publisherConnectionPromise = void 0), t3 === al.CONNECTED) {
              if (void 0 !== this.joinStartedAt) {
                const e2 = Math.round(performance.now() - this.joinStartedAt);
                this.joinStartedAt = void 0, this.log.info("connection setup took ".concat(e2, " ms")), null === (r2 = this.pcManager) || void 0 === r2 || r2.publisher.setConnectionSetupTime(e2);
              }
              const t4 = this.pcState === Wl.New;
              this.pcState = Wl.Connected, t4 && this.emit(e.EngineEvent.Connected, this.latestJoinResponse);
            } else t3 === al.FAILED && (this.pcState !== Wl.Connected && this.pcState !== Wl.Reconnecting || (this.pcState = Wl.Disconnected, this.handleDisconnect("peerconnection failed", "failed" === i3 ? ct.RR_SUBSCRIBER_FAILED : ct.RR_PUBLISHER_FAILED)));
            const o2 = this.client.isDisconnected || this.client.currentState === Sd.RECONNECTING, s2 = [al.FAILED, al.CLOSING, al.CLOSED].includes(t3);
            o2 && s2 && !this._isClosed && this.emit(e.EngineEvent.Offline);
          })), this.pcManager.onTrack = (t3) => {
            0 !== t3.streams.length && this.emit(e.EngineEvent.MediaTrackAdded, t3.track, t3.streams[0], t3.receiver);
          };
        }
      }));
    }
    setupSignalClientCallbacks() {
      this.client.onAnswer = (t2, n2, i2) => kr(this, void 0, void 0, (function* () {
        this.pcManager && (this.log.debug("received server answer", { RTCSdpType: t2.type, sdp: t2.sdp, midToTrackId: i2 }), "publisher-only" === this.pcManager.mode && (this.midToTrackId = i2), yield this.pcManager.setPublisherAnswer(t2, n2), this.emit(e.EngineEvent.RequestSubscribedCodecRefresh));
      })), this.client.onTrickle = (e2, t2) => {
        this.pcManager && (this.log.debug("got ICE candidate from peer", { candidate: e2, target: t2 }), this.pcManager.addIceCandidate(e2, t2));
      }, this.client.onOffer = (e2, t2, n2) => kr(this, void 0, void 0, (function* () {
        if (this.latestRemoteOfferId = t2, !this.pcManager) return;
        this.midToTrackId = n2;
        const i2 = yield this.pcManager.createSubscriberAnswerFromOffer(e2, t2);
        i2 && this.client.sendAnswer(i2, t2);
      })), this.client.onLocalTrackPublished = (e2) => {
        var t2;
        if (this.log.debug("received trackPublishedResponse", { cid: e2.cid, track: null === (t2 = e2.track) || void 0 === t2 ? void 0 : t2.sid }), !this.pendingTrackResolvers[e2.cid]) return void this.log.error("missing track resolver for ".concat(e2.cid), { cid: e2.cid });
        const n2 = this.pendingTrackResolvers[e2.cid].resolve;
        delete this.pendingTrackResolvers[e2.cid], n2(e2.track);
      }, this.client.onLocalTrackUnpublished = (t2) => {
        this.emit(e.EngineEvent.LocalTrackUnpublished, t2);
      }, this.client.onLocalTrackSubscribed = (t2) => {
        this.emit(e.EngineEvent.LocalTrackSubscribed, t2);
      }, this.client.onTokenRefresh = (t2) => {
        this.token = t2, this.emit(e.EngineEvent.TokenRefreshed, t2);
      }, this.client.onRemoteMuteChanged = (t2, n2) => {
        this.emit(e.EngineEvent.RemoteMute, t2, n2);
      }, this.client.onSubscribedQualityUpdate = (t2) => {
        this.emit(e.EngineEvent.SubscribedQualityUpdate, t2);
      }, this.client.onRoomMoved = (t2) => {
        var n2;
        this.participantSid = null === (n2 = t2.participant) || void 0 === n2 ? void 0 : n2.sid, this.latestJoinResponse && (this.latestJoinResponse.room = t2.room), this.emit(e.EngineEvent.RoomMoved, t2);
      }, this.client.onMediaSectionsRequirement = (e2) => {
        this.addMediaSections(e2.numAudios, e2.numVideos), this.negotiate().catch(((e3) => {
          this.log.error(e3);
        }));
      }, this.client.onPublishDataTrackResponse = (t2) => {
        this.emit(e.EngineEvent.PublishDataTrackResponse, t2);
      }, this.client.onUnPublishDataTrackResponse = (t2) => {
        this.emit(e.EngineEvent.UnPublishDataTrackResponse, t2);
      }, this.client.onDataTrackSubscriberHandles = (t2) => {
        this.emit(e.EngineEvent.DataTrackSubscriberHandles, t2);
      }, this.client.onClose = () => {
        this.handleDisconnect("signal", ct.RR_SIGNAL_DISCONNECTED);
      }, this.client.onLeave = (t2) => {
        var n2;
        switch (this.log.info("client leave request received (action=".concat(null == t2 ? void 0 : t2.action, ")"), { reason: null == t2 ? void 0 : t2.reason }), t2.regions && (this.log.debug("updating regions"), this.emit(e.EngineEvent.ServerRegionsReported, t2.regions)), t2.action) {
          case fi.DISCONNECT:
            this.emit(e.EngineEvent.Disconnected, null == t2 ? void 0 : t2.reason), this.close("server leave: ".concat(null !== (n2 = at[t2.reason]) && void 0 !== n2 ? n2 : t2.reason));
            break;
          case fi.RECONNECT:
            this.fullReconnectOnNext = true, this.handleDisconnect(Vl);
            break;
          case fi.RESUME:
            this.handleDisconnect(Vl);
        }
      };
    }
    makeRTCConfiguration(e2) {
      var t2;
      const n2 = Object.assign({}, this.rtcConfig);
      if (((null === (t2 = this.signalOpts) || void 0 === t2 ? void 0 : t2.e2eeEnabled) || this.frameMetadataWorker && !Sc()) && mc() && (this.log.debug("E2EE - setting up transports with insertable streams"), n2.encodedInsertableStreams = true), n2.sdpSemantics = "unified-plan", n2.continualGatheringPolicy = "gather_continually", !e2) return n2;
      if (e2.iceServers && !n2.iceServers) {
        const t3 = [];
        e2.iceServers.forEach(((e3) => {
          const n3 = { urls: e3.urls };
          e3.username && (n3.username = e3.username), e3.credential && (n3.credential = e3.credential), t3.push(n3);
        })), n2.iceServers = t3;
      }
      return e2.clientConfiguration && e2.clientConfiguration.forceRelay === st.ENABLED && (n2.iceTransportPolicy = "relay"), n2;
    }
    applyInitialPublisherLayout() {
      this.createDataChannels(), ma() || this.addMediaSections(3, 3);
    }
    addMediaSections(e2, t2) {
      var n2, i2, r2;
      const o2 = { direction: "recvonly" };
      for (let a2 = 0; a2 < e2; a2++) null === (n2 = this.pcManager) || void 0 === n2 || n2.addPublisherTransceiverOfKind("audio", o2);
      const s2 = "publisher-only" === (null === (i2 = this.pcManager) || void 0 === i2 ? void 0 : i2.mode);
      for (let a2 = 0; a2 < t2; a2++) {
        const e3 = null === (r2 = this.pcManager) || void 0 === r2 ? void 0 : r2.addPublisherTransceiverOfKind("video", o2);
        if (s2 && e3) {
          const t3 = ea(e3);
          this.log.debug("dependency descriptor negotiated for received video", { negotiated: t3 });
        }
      }
    }
    createDataChannels() {
      this.pcManager && (this.dataChannels.hasPublisherChannels && (this.publisherConnectionPromise = void 0), this.dataChannels.createPublisherChannels(this.pcManager));
    }
    decodeDataMessage(e2) {
      return kr(this, void 0, void 0, (function* () {
        return e2.data instanceof ArrayBuffer ? new Uint8Array(e2.data) : e2.data instanceof Blob ? new Uint8Array(yield e2.data.arrayBuffer()) : void this.log.error("unsupported data type", { data: e2.data });
      }));
    }
    createSender(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        let i2;
        if (Qs()) i2 = yield this.createTransceiverRTCRtpSender(e2, t2, n2);
        else {
          if (!Ys()) throw new is("Required webRTC APIs not supported on this device");
          this.log.warn("using add-track fallback"), i2 = yield this.createRTCRtpSender(e2.mediaStreamTrack);
        }
        return this.setupFrameMetadataSender(i2, t2), i2;
      }));
    }
    createSimulcastSender(e2, t2, n2, i2) {
      return kr(this, void 0, void 0, (function* () {
        let r2;
        if (Qs()) r2 = yield this.createSimulcastTransceiverSender(e2, t2, n2, i2);
        else {
          if (!Ys()) throw new is("Cannot stream on this device");
          this.log.debug("using add-track fallback"), r2 = yield this.createRTCRtpSender(e2.mediaStreamTrack);
        }
        return r2 && this.setupFrameMetadataSender(r2, n2), r2;
      }));
    }
    get frameMetadataWorker() {
      var e2, t2;
      return null === (t2 = null !== (e2 = this.options.frameMetadata) && void 0 !== e2 ? e2 : this.options.packetTrailer) || void 0 === t2 ? void 0 : t2.worker;
    }
    setupFrameMetadataSender(e2) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      var n2, i2, r2;
      const o2 = this.frameMetadataWorker;
      if (!o2 || (null === (n2 = this.signalOpts) || void 0 === n2 ? void 0 : n2.e2eeEnabled)) return;
      const s2 = null !== (i2 = t2.frameMetadata) && void 0 !== i2 ? i2 : t2.packetTrailer, a2 = Cc(s2);
      if (Sc()) return void (a2 && (e2.transform = new RTCRtpScriptTransform(o2, { kind: "encode", packetTrailer: s2 })));
      if (!Ec(null !== (r2 = this.options.frameMetadata) && void 0 !== r2 ? r2 : this.options.packetTrailer) || !("createEncodedStreams" in e2)) return void (a2 && this.log.warn("frame metadata transform not supported; skipping write", this.logContext));
      const c2 = e2.createEncodedStreams(), d2 = c2.readable, l2 = c2.writable;
      a2 ? o2.postMessage({ kind: "encode", data: { readableStream: d2, writableStream: l2, packetTrailer: s2 } }, [d2, l2]) : d2.pipeTo(l2);
    }
    createTransceiverRTCRtpSender(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.pcManager) throw new is("publisher is closed");
        const i2 = [];
        e2.mediaStream && i2.push(e2.mediaStream), Ha(e2) && (e2.codec = t2.videoCodec);
        const r2 = { direction: "sendonly", streams: i2 };
        n2 && (r2.sendEncodings = n2);
        return (yield this.pcManager.addPublisherTransceiver(e2.mediaStreamTrack, r2)).sender;
      }));
    }
    createSimulcastTransceiverSender(e2, t2, n2, i2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.pcManager) throw new is("publisher is closed");
        const r2 = { direction: "sendonly" };
        i2 && (r2.sendEncodings = i2);
        const o2 = yield this.pcManager.addPublisherTransceiver(t2.mediaStreamTrack, r2);
        if (n2.videoCodec) return yield e2.setSimulcastTrackSender(n2.videoCodec, o2.sender), o2.sender;
      }));
    }
    createRTCRtpSender(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.pcManager) throw new is("publisher is closed");
        return this.pcManager.addPublisherTrack(e2);
      }));
    }
    handleLocalConnectionQuality(e2) {
      if (!this.participantSid) return;
      const t2 = e2.updates.find(((e3) => e3.participantSid === this.participantSid));
      t2 && (t2.quality === ot.LOST ? this.scheduleLostQualityReconnect() : this.clearLostQualityTimeout());
    }
    scheduleLostQualityReconnect() {
      this.lostQualityTimeout || (this.lostQualityTimeout = ls.setTimeout((() => {
        this.lostQualityTimeout = void 0, this._isClosed || this.pcState !== Wl.Connected || this.attemptingReconnect || this.hasActivePublisherSenders() && (this.log.warn("local connection quality lost while publishing, triggering full reconnect", this.logContext), this.fullReconnectOnNext = true, this.handleDisconnect("connection quality lost", ct.RR_PUBLISHER_FAILED));
      }), 1e4));
    }
    clearLostQualityTimeout() {
      this.lostQualityTimeout && (ls.clearTimeout(this.lostQualityTimeout), this.lostQualityTimeout = void 0);
    }
    hasActivePublisherSenders() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.pcManager) || void 0 === e2 ? void 0 : e2.publisher.getSenders().some(((e3) => !!e3.track && "live" === e3.track.readyState))) && void 0 !== t2 && t2;
    }
    reconnect() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ct.RR_UNKNOWN;
      this.fullReconnectOnNext = true, this.handleDisconnect("reconcile", e2);
    }
    attemptReconnect(t2) {
      return kr(this, void 0, void 0, (function* () {
        var i2, r2, o2;
        if (this._isClosed) return;
        if (this.attemptingReconnect) return void this.log.warn("already attempting reconnect, returning early");
        this.clearLostQualityTimeout(), (null === (i2 = this.clientConfiguration) || void 0 === i2 ? void 0 : i2.resumeConnection) !== st.DISABLED && (null !== (o2 = null === (r2 = this.pcManager) || void 0 === r2 ? void 0 : r2.currentState) && void 0 !== o2 ? o2 : al.NEW) !== al.NEW || (this.fullReconnectOnNext = true);
        const s2 = this.fullReconnectOnNext;
        this.fullReconnectOnNext = false;
        let a2 = false;
        const c2 = new AbortController();
        this.reconnectAbortController = c2;
        try {
          if (this.attemptingReconnect = true, s2 ? yield this.restartConnection(c2.signal) : yield this.resumeConnection(t2), c2.signal.aborted) return void this.log.info("reconnect attempt cancelled, not marking it as succeeded");
          this.clearPendingReconnect(), a2 = true;
        } catch (n2) {
          if (c2.signal.aborted) return void this.log.info("reconnect attempt cancelled, not retrying", { error: n2 });
          this.reconnectAttempts += 1;
          let i3 = true;
          n2 instanceof is ? (this.log.debug("received unrecoverable error", { error: n2 }), i3 = false) : !s2 && n2 instanceof ds || (this.fullReconnectOnNext = true), i3 ? this.handleDisconnect("reconnect", ct.RR_UNKNOWN) : (this.log.info("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(Date.now() - this.reconnectStart, "ms. giving up")), this.emit(e.EngineEvent.Disconnected), yield this.close("gave up reconnecting after ".concat(this.reconnectAttempts, " attempts, ").concat(Date.now() - this.reconnectStart, "ms")));
        } finally {
          this.reconnectAbortController === c2 && (this.reconnectAbortController = void 0), this.attemptingReconnect = false, a2 && this.fullReconnectOnNext && !this._isClosed && (this.log.debug("full reconnect requested during in-progress attempt, dispatching"), this.handleDisconnect("reconnect"));
        }
      }));
    }
    getNextRetryDelay(e2) {
      try {
        return this.reconnectPolicy.nextRetryDelayInMs(e2);
      } catch (n2) {
        this.log.warn("encountered error in reconnect policy", { error: n2 });
      }
      return null;
    }
    restartConnection(t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        var r2, o2, s2;
        try {
          if (t2.aborted) return void this.log.info("full reconnect cancelled before starting", { regionUrl: i2 });
          if (!this.url || !this.token) throw new is("could not reconnect, url or token not saved");
          if (this.log.info("reconnecting, attempt: ".concat(this.reconnectAttempts)), this.emit(e.EngineEvent.Restarting), this.client.isDisconnected || (yield this.client.sendLeave()), yield this.cleanupPeerConnections(), yield this.cleanupClient(), t2.aborted) return void this.log.info("full reconnect cancelled after cleaning up the previous session", { regionUrl: i2 });
          let o3;
          try {
            if (!this.signalOpts) throw this.log.warn("attempted connection restart, without signal options present"), new ds();
            o3 = (yield this.join(null != i2 ? i2 : this.url, this.token, this.signalOpts, t2, !this.options.singlePeerConnection)).joinResponse;
          } catch (n2) {
            if (n2 instanceof Zo && n2.reason === e.ConnectionErrorReason.NotAllowed) throw new is("could not reconnect, token might be expired");
            throw new ds();
          }
          if (t2.aborted) return void this.log.info("full reconnect cancelled after the signal join response", { regionUrl: i2 });
          if (this.shouldFailNext) throw this.shouldFailNext = false, new Error("simulated failure");
          if (this.client.setReconnected(), this.emit(e.EngineEvent.SignalRestarted, o3), yield this.waitForPCReconnected(), t2.aborted) return void this.log.info("full reconnect cancelled after peer connections reconnected", { regionUrl: i2 });
          if (this.client.currentState !== Sd.CONNECTED) throw new ds("Signal connection got severed during reconnect");
          null === (r2 = this.regionStrategy) || void 0 === r2 || r2.resetAttempts(), this.emit(e.EngineEvent.Restarted);
        } catch (a2) {
          if (t2.aborted) return void this.log.info("full reconnect cancelled after a failed attempt", { regionUrl: i2 });
          const e2 = yield null === (o2 = this.regionStrategy) || void 0 === o2 ? void 0 : o2.getNextUrl(t2);
          if (t2.aborted) return void this.log.info("full reconnect cancelled during region selection", { regionUrl: i2 });
          if (e2) return void (yield this.restartConnection(t2, e2));
          throw null === (s2 = this.regionStrategy) || void 0 === s2 || s2.resetAttempts(), a2;
        }
      }));
    }
    resumeConnection(t2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.url || !this.token) throw new is("could not reconnect, url or token not saved");
        if (!this.pcManager) throw new is("publisher and subscriber connections unset");
        let n2;
        this.log.info("resuming signal connection, attempt ".concat(this.reconnectAttempts)), this.emit(e.EngineEvent.Resuming);
        try {
          this.setupSignalClientCallbacks(), n2 = yield this.client.reconnect(this.url, this.token, this.participantSid, t2);
        } catch (r2) {
          let t3 = "";
          if (r2 instanceof Error && (t3 = r2.message, this.log.error(r2.message, { error: r2 })), r2 instanceof Zo && r2.reason === e.ConnectionErrorReason.NotAllowed) throw new is("could not reconnect, token might be expired");
          if (r2 instanceof Zo && r2.reason === e.ConnectionErrorReason.LeaveRequest) throw r2;
          throw new ds(t3);
        }
        if (this.emit(e.EngineEvent.SignalResumed), n2) {
          const e2 = this.makeRTCConfiguration(n2);
          this.pcManager.updateConfiguration(e2), this.latestJoinResponse && (this.latestJoinResponse.serverInfo = n2.serverInfo);
        } else this.log.warn("Did not receive reconnect response");
        if (this.shouldFailNext) throw this.shouldFailNext = false, new Error("simulated failure");
        if (yield this.pcManager.triggerIceRestart(), yield this.waitForPCReconnected(), this.client.currentState !== Sd.CONNECTED) throw new ds("Signal connection got severed during reconnect");
        this.client.setReconnected();
        const i2 = this.dataChannelForKind(cl.RELIABLE);
        "open" === (null == i2 ? void 0 : i2.readyState) && null === i2.id && this.createDataChannels(), (null == n2 ? void 0 : n2.lastMessageSeq) && this.resendReliableMessagesForResume(n2.lastMessageSeq).catch(((e2) => {
          this.log.warn("failed to resend reliable messages after resume", Object.assign(Object.assign({}, this.logContext), { error: e2 }));
        })), this.emit(e.EngineEvent.Resumed);
      }));
    }
    waitForPCInitialConnection(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.pcManager) throw new is("PC manager is closed");
        yield this.pcManager.ensurePCTransportConnection(t2, e2);
      }));
    }
    waitForPCReconnected() {
      return kr(this, void 0, void 0, (function* () {
        this.pcState = Wl.Reconnecting, this.log.debug("waiting for peer connection to reconnect");
        try {
          if (yield Js(2e3), !this.pcManager) throw new is("PC manager is closed");
          yield this.pcManager.ensurePCTransportConnection(void 0, this.peerConnectionTimeout), this.pcState = Wl.Connected;
        } catch (n2) {
          throw this.pcState = Wl.Disconnected, Zo.internal("could not establish PC connection, ".concat(n2.message));
        }
      }));
    }
    publishRpcAck(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = new At({ destinationIdentities: [e2], kind: Lt.RELIABLE, value: { case: "rpcAck", value: new Kt({ requestId: t2 }) } });
        yield this.sendDataPacket(n2, cl.RELIABLE);
      }));
    }
    sendDataPacket(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2;
        if (yield this.ensurePublisherConnected(t2), this.e2eeManager && this.e2eeManager.isDataChannelEncryptionEnabled) {
          const t3 = kc(e2);
          if (t3) {
            const n3 = yield this.e2eeManager.encryptData(t3.toBinary());
            e2.value = { case: "encryptedPacket", value: new Nt({ encryptedValue: n3.payload, iv: n3.iv, keyIndex: n3.keyIndex }) };
          }
        }
        t2 === cl.RELIABLE && (e2.sequence = this.reliableChannel.nextSequence());
        const r2 = e2.toBinary(), o2 = Math.min(null !== (i2 = null === (n2 = this.pcManager) || void 0 === n2 ? void 0 : n2.getMaxPublisherMessageSize()) && void 0 !== i2 ? i2 : 64e3, 64e3);
        if (void 0 !== o2 && 0 !== o2 && r2.byteLength > o2) throw new os("cannot publish data packet larger than ".concat(o2, " bytes (got ").concat(r2.byteLength, ")"));
        t2 === cl.RELIABLE ? yield this.reliableChannel.send(r2, e2.sequence) : yield this.lossyChannel.send(r2);
      }));
    }
    sendDataTrackFrame(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.ensurePublisherConnected(cl.DATA_TRACK_LOSSY), yield this.dataTrackChannel.send(e2);
      }));
    }
    resendReliableMessagesForResume(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.ensurePublisherConnected(cl.RELIABLE), yield this.reliableChannel.replay(e2);
      }));
    }
    flowControlFor(e2) {
      return this.dataChannels.channelFor(e2);
    }
    waitForBufferHeadroom(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.dataChannelForKind(e2);
        if (!t2) throw new is("DataChannel not found, kind: ".concat(e2));
        return this.flowControlFor(e2).waitForHeadroomWithLock(t2);
      }));
    }
    ensureDataTransportConnected(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.subscriberPrimary;
        return (function* () {
          var i2;
          if (!t2.pcManager) throw new is("PC manager is closed");
          const r2 = n2 ? t2.pcManager.subscriber : t2.pcManager.publisher, o2 = n2 ? "Subscriber" : "Publisher";
          if (!r2) throw Zo.internal("".concat(o2, " connection not set"));
          let s2 = false;
          n2 || t2.dataChannelForKind(e3, n2) || (t2.createDataChannels(), s2 = true), s2 || n2 || t2.pcManager.publisher.isICEConnected || "checking" === t2.pcManager.publisher.getICEConnectionState() || (s2 = true), s2 && t2.negotiate().catch(((e4) => {
            t2.log.error(e4);
          }));
          const a2 = t2.dataChannelForKind(e3, n2);
          if ("open" === (null == a2 ? void 0 : a2.readyState)) return;
          const c2 = (/* @__PURE__ */ new Date()).getTime() + t2.peerConnectionTimeout;
          for (; (/* @__PURE__ */ new Date()).getTime() < c2; ) {
            if (r2.isICEConnected && "open" === (null === (i2 = t2.dataChannelForKind(e3, n2)) || void 0 === i2 ? void 0 : i2.readyState)) return;
            yield Js(50);
          }
          throw Zo.internal("could not establish ".concat(o2, " connection, state: ").concat(r2.getICEConnectionState()));
        })();
      }));
    }
    ensurePublisherConnected(e2) {
      return kr(this, void 0, void 0, (function* () {
        this.publisherConnectionPromise || (this.publisherConnectionPromise = this.ensureDataTransportConnected(e2, false)), yield this.publisherConnectionPromise;
      }));
    }
    verifyTransport() {
      if (!this.pcManager) return false;
      const e2 = this.pcManager.currentState;
      return !![al.CONNECTING, al.CONNECTED].includes(e2) && (!(!this.client.ws || this.client.ws.readyState === WebSocket.CLOSED) && (!(e2 === al.CONNECTING && void 0 !== this.transportConnectingSince && Date.now() - this.transportConnectingSince > this.peerConnectionTimeout) || (this.log.warn("transport stuck in connecting state", this.logContext), false)));
    }
    negotiate() {
      return kr(this, void 0, void 0, (function* () {
        return new No(((e2, t2) => kr(this, void 0, void 0, (function* () {
          if (!this.pcManager) return void t2(new rs("PC manager is closed"));
          this.pcManager.requirePublisher(), 0 != this.pcManager.publisher.getTransceivers().length || this.dataChannels.hasPublisherChannels || this.createDataChannels();
          const i2 = new AbortController(), r2 = () => {
            i2.abort(), this.log.debug("engine disconnected while negotiation was ongoing"), e2();
          };
          this.isClosed && t2(new rs("cannot negotiate on closed engine")), this.pendingNegotiationAborts.add(r2), this.pcManager.publisher.off(Gd, this.onRtpMapAvailable), this.pcManager.publisher.once(Gd, this.onRtpMapAvailable);
          try {
            yield this.pcManager.negotiate(i2), e2();
          } catch (n2) {
            if (i2.signal.aborted) return void e2();
            n2 instanceof rs && (this.fullReconnectOnNext = true), this.handleDisconnect("negotiation", ct.RR_UNKNOWN), n2 instanceof Error ? t2(n2) : t2(new Error(String(n2)));
          } finally {
            this.pendingNegotiationAborts.delete(r2);
          }
        }))));
      }));
    }
    dataChannelForKind(e2, t2) {
      return this.dataChannels.getHandle(e2, t2);
    }
    sendSyncState(e2, t2, n2) {
      var i2, r2, o2, s2;
      if (!this.pcManager) return void this.log.warn("sync state cannot be sent without peer connection setup");
      const a2 = this.pcManager.publisher.getLocalDescription(), c2 = this.pcManager.publisher.getRemoteDescription(), d2 = null === (i2 = this.pcManager.subscriber) || void 0 === i2 ? void 0 : i2.getRemoteDescription(), l2 = null === (r2 = this.pcManager.subscriber) || void 0 === r2 ? void 0 : r2.getLocalDescription(), u2 = null === (s2 = null === (o2 = this.signalOpts) || void 0 === o2 ? void 0 : o2.autoSubscribe) || void 0 === s2 || s2, h2 = new Array(), p2 = new Array();
      e2.forEach(((e3) => {
        e3.isDesired !== u2 && h2.push(e3.trackSid), e3.isEnabled || p2.push(e3.trackSid);
      })), this.client.sendSyncState(new Ni({ answer: "publisher-only" === this.pcManager.mode ? c2 ? wd({ sdp: c2.sdp, type: c2.type }) : void 0 : l2 ? wd({ sdp: l2.sdp, type: l2.type }) : void 0, offer: "publisher-only" === this.pcManager.mode ? a2 ? wd({ sdp: a2.sdp, type: a2.type }) : void 0 : d2 ? wd({ sdp: d2.sdp, type: d2.type }) : void 0, subscription: new si({ trackSids: h2, subscribe: !u2, participantTracks: [] }), publishTracks: Us(t2), dataChannels: this.dataChannelsInfo(), trackSidsDisabled: p2, datachannelReceiveStates: this.reliableReceivedState.map(((e3, t3) => new xi({ publisherSid: t3, lastSeq: e3 }))), publishDataTracks: n2.map(((e3) => new Gn({ info: Yc.toProtobuf(e3) }))) }));
    }
    failNext() {
      this.shouldFailNext = true;
    }
    failNextV1Path() {
      this.shouldFailOnV1Path = true;
    }
    dataChannelsInfo() {
      const e2 = [], t2 = (t3, n2) => {
        void 0 !== (null == t3 ? void 0 : t3.id) && null !== t3.id && e2.push(new Ui({ label: t3.label, id: t3.id, target: n2 }));
      };
      return t2(this.dataChannelForKind(cl.LOSSY), jn.PUBLISHER), t2(this.dataChannelForKind(cl.RELIABLE), jn.PUBLISHER), t2(this.dataChannelForKind(cl.LOSSY, true), jn.SUBSCRIBER), t2(this.dataChannelForKind(cl.RELIABLE, true), jn.SUBSCRIBER), e2;
    }
    clearReconnectTimeout() {
      this.reconnectTimeout && ls.clearTimeout(this.reconnectTimeout);
    }
    clearPendingReconnect() {
      this.clearReconnectTimeout(), this.reconnectAttempts = 0;
    }
    registerOnLineListener() {
      pa() && (window.addEventListener("online", this.handleBrowserOnLine), window.addEventListener("offline", this.handleBrowserOffline));
    }
    deregisterOnLineListener() {
      pa() && (window.removeEventListener("online", this.handleBrowserOnLine), window.removeEventListener("offline", this.handleBrowserOffline));
    }
    getTrackIdForReceiver(e2) {
      var t2;
      const n2 = null === (t2 = this.pcManager) || void 0 === t2 ? void 0 : t2.getMidForReceiver(e2);
      if (n2) {
        const e3 = Object.entries(this.midToTrackId).find(((e4) => j(e4, 1)[0] === n2));
        if (e3) return e3[1];
      }
    }
  }
  function Kl(e2, t2) {
    const n2 = e2.participantIdentity ? e2.participantIdentity : t2.participantIdentity;
    e2.participantIdentity = n2, t2.participantIdentity = n2;
    const i2 = 0 !== e2.destinationIdentities.length ? e2.destinationIdentities : t2.destinationIdentities;
    e2.destinationIdentities = i2, t2.destinationIdentities = i2;
  }
  const zl = dr(e.LoggerNames.Region), Gl = 5e3;
  class Jl {
    static fetchRegionSettings(e2, t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        const r2 = yield Jl.fetchLock.lock();
        try {
          const n2 = yield fetch("".concat((function(e3) {
            return "".concat(e3.protocol.replace("ws", "http"), "//").concat(e3.host, "/settings");
          })(e2), "/regions"), { headers: { authorization: "Bearer ".concat(t2) }, signal: i2 });
          if (n2.ok) {
            const e3 = (function(e4) {
              var t4;
              const n3 = e4.get("Cache-Control");
              if (n3) {
                const e5 = null === (t4 = n3.match(/(?:^|[,\s])max-age=(\d+)/)) || void 0 === t4 ? void 0 : t4[1];
                if (e5) return parseInt(e5, 10);
              }
            })(n2.headers), t3 = e3 ? 1e3 * e3 : Gl;
            return { regionSettings: yield n2.json(), updatedAtInMs: Date.now(), maxAgeInMs: t3 };
          }
          throw 401 === n2.status ? Zo.notAllowed("Could not fetch region settings: ".concat(n2.statusText), n2.status) : Zo.internal("Could not fetch region settings: ".concat(n2.statusText));
        } catch (n2) {
          throw n2 instanceof Zo ? n2 : (null == i2 ? void 0 : i2.aborted) ? Zo.cancelled("Region fetching was aborted") : Zo.serverUnreachable("Could not fetch region settings, ".concat(n2 instanceof Error ? "".concat(n2.name, ": ").concat(n2.message) : n2));
        } finally {
          r2();
        }
      }));
    }
    static scheduleRefetch(t2, n2, i2) {
      return kr(this, void 0, void 0, (function* () {
        const r2 = Jl.settingsTimeouts.get(t2.hostname);
        clearTimeout(r2), Jl.settingsTimeouts.set(t2.hostname, setTimeout((() => kr(this, void 0, void 0, (function* () {
          try {
            const e2 = yield Jl.fetchRegionSettings(t2, n2);
            Jl.updateCachedRegionSettings(t2, n2, e2);
          } catch (r3) {
            if (r3 instanceof Zo && r3.reason === e.ConnectionErrorReason.NotAllowed) return void zl.debug("token is not valid, cancelling auto region refresh");
            zl.debug("auto refetching of region settings failed", { error: r3 }), Jl.scheduleRefetch(t2, n2, i2);
          }
        }))), i2));
      }));
    }
    static updateCachedRegionSettings(e2, t2, n2) {
      Jl.cache.set(e2.hostname, n2), Jl.scheduleRefetch(e2, t2, n2.maxAgeInMs);
    }
    static stopRefetch(e2) {
      const t2 = Jl.settingsTimeouts.get(e2);
      t2 && (clearTimeout(t2), Jl.settingsTimeouts.delete(e2));
    }
    static scheduleCleanup(e2) {
      let t2 = Jl.connectionTrackers.get(e2);
      t2 && (t2.cleanupTimeout && clearTimeout(t2.cleanupTimeout), t2.cleanupTimeout = setTimeout((() => {
        const t3 = Jl.connectionTrackers.get(e2);
        t3 && 0 === t3.connectionCount && (zl.debug("stopping region refetch after disconnect delay", { hostname: e2 }), Jl.stopRefetch(e2)), t3 && (t3.cleanupTimeout = void 0);
      }), 3e4));
    }
    static cancelCleanup(e2) {
      const t2 = Jl.connectionTrackers.get(e2);
      (null == t2 ? void 0 : t2.cleanupTimeout) && (clearTimeout(t2.cleanupTimeout), t2.cleanupTimeout = void 0);
    }
    notifyConnected() {
      const e2 = this.serverUrl.hostname;
      let t2 = Jl.connectionTrackers.get(e2);
      t2 || (t2 = { connectionCount: 0 }, Jl.connectionTrackers.set(e2, t2)), t2.connectionCount++, Jl.cancelCleanup(e2);
    }
    notifyDisconnected() {
      const e2 = this.serverUrl.hostname, t2 = Jl.connectionTrackers.get(e2);
      t2 && (t2.connectionCount = Math.max(0, t2.connectionCount - 1), 0 === t2.connectionCount && Jl.scheduleCleanup(e2));
    }
    constructor(e2, t2) {
      this.attemptedRegions = [], this.serverUrl = new URL(e2), this.token = t2;
    }
    updateToken(e2) {
      var t2;
      this.token = e2;
      const n2 = this.getServerUrl(), i2 = Jl.cache.get(n2.hostname);
      Jl.scheduleRefetch(this.serverUrl, this.token, null !== (t2 = null == i2 ? void 0 : i2.maxAgeInMs) && void 0 !== t2 ? t2 : Gl);
    }
    isCloud() {
      return ga(this.serverUrl);
    }
    getServerUrl() {
      return this.serverUrl;
    }
    fetchRegionSettings(e2) {
      return kr(this, void 0, void 0, (function* () {
        return Jl.fetchRegionSettings(this.serverUrl, this.token, e2);
      }));
    }
    getNextBestRegionUrl(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.isCloud()) throw Error("region availability is only supported for LiveKit Cloud domains");
        let t2 = Jl.cache.get(this.serverUrl.hostname);
        (!t2 || Date.now() - t2.updatedAtInMs > t2.maxAgeInMs) && (t2 = yield this.fetchRegionSettings(e2), Jl.updateCachedRegionSettings(this.serverUrl, this.token, t2));
        const n2 = t2.regionSettings.regions.filter(((e3) => !this.attemptedRegions.find(((t3) => t3.url === e3.url))));
        if (n2.length > 0) {
          const e3 = n2[0];
          return this.attemptedRegions.push(e3), zl.info("switching to region: ".concat(e3.region), { region: e3.region }), e3.url;
        }
        return null;
      }));
    }
    resetAttempts() {
      this.attemptedRegions = [];
    }
    setServerReportedRegions(e2) {
      Jl.updateCachedRegionSettings(this.serverUrl, this.token, e2);
    }
  }
  function Ql() {
    return new CompressionStream("deflate-raw");
  }
  function Yl() {
    return new DecompressionStream("deflate-raw");
  }
  function Xl(e2, t2) {
    return kr(this, void 0, void 0, (function* () {
      const n2 = new DecompressionStream("deflate-raw"), i2 = n2.writable.getWriter();
      return i2.write(e2).catch((() => {
      })), i2.close().catch((() => {
      })), Zl(n2.readable, t2);
    }));
  }
  function Zl(t2, n2) {
    return kr(this, void 0, void 0, (function* () {
      const i2 = t2.getReader(), r2 = [];
      let o2 = 0;
      for (; ; ) {
        const t3 = yield i2.read(), s3 = t3.done, a3 = t3.value;
        if (s3) break;
        if (r2.push(a3), o2 += a3.byteLength, "number" == typeof n2 && o2 > n2) throw yield i2.cancel(), new cs("Decompressed payload exceeds the maximum payload size of ".concat(n2, " bytes"), e.DataStreamErrorReason.PayloadTooLarge);
      }
      const s2 = new Uint8Array(o2);
      let a2 = 0;
      for (const e2 of r2) s2.set(e2, a2), a2 += e2.byteLength;
      return s2;
    }));
  }
  Jl.cache = /* @__PURE__ */ new Map(), Jl.settingsTimeouts = /* @__PURE__ */ new Map(), Jl.connectionTrackers = /* @__PURE__ */ new Map(), Jl.fetchLock = new r();
  const $l = 15e3;
  class eu {
    get info() {
      return this._info;
    }
    validateBytesReceived() {
      let t2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if ("number" == typeof this.totalByteSize && 0 !== this.totalByteSize) {
        if (t2 && this.bytesReceived < this.totalByteSize) throw new cs("Not enough chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, only received ").concat(this.bytesReceived, " bytes"), e.DataStreamErrorReason.Incomplete);
        if (this.bytesReceived > this.totalByteSize) throw new cs("Extra chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, received ").concat(this.bytesReceived, " bytes"), e.DataStreamErrorReason.LengthExceeded);
      }
    }
    constructor(e2, t2, n2) {
      this.reader = t2, this.totalByteSize = n2, this._info = e2, this.bytesReceived = 0;
    }
    handleChunkReceived(e2) {
      var t2;
      this.bytesReceived += e2.content.byteLength, this.validateBytesReceived();
      const n2 = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
      null === (t2 = this.onProgress) || void 0 === t2 || t2.call(this, n2);
    }
  }
  class tu extends eu {
    [Symbol.asyncIterator]() {
      const e2 = this.reader.getReader();
      e2.closed.catch((() => {
      }));
      const t2 = () => {
        e2.releaseLock(), this.signal = void 0;
      };
      return { next: () => kr(this, void 0, void 0, (function* () {
        var n2;
        try {
          const t3 = this.signal;
          if (null == t3 ? void 0 : t3.aborted) throw t3.reason;
          const i2 = yield new Promise(((n3, i3) => {
            if (t3) {
              const r2 = () => i3(t3.reason);
              t3.addEventListener("abort", r2, { once: true }), e2.read().then(n3, i3).finally((() => {
                t3.removeEventListener("abort", r2);
              }));
            } else e2.read().then(n3, i3);
          }));
          return i2.done ? (this.validateBytesReceived(true), "number" == typeof this.totalByteSize && (null === (n2 = this.onProgress) || void 0 === n2 || n2.call(this, 1)), { done: true, value: void 0 }) : (this.handleChunkReceived(i2.value), { done: false, value: i2.value.content });
        } catch (i2) {
          throw t2(), i2;
        }
      })), return() {
        return kr(this, void 0, void 0, (function* () {
          return t2(), { done: true, value: void 0 };
        }));
      } };
    }
    withAbortSignal(e2) {
      return this.signal = e2, this;
    }
    readAll() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (function* () {
          var n2, i2, r2, o2;
          let s2 = /* @__PURE__ */ new Set();
          const a2 = t2.signal ? e2.withAbortSignal(t2.signal) : e2;
          try {
            for (var c2, d2 = true, l2 = Sr(a2); !(n2 = (c2 = yield l2.next()).done); d2 = true) {
              o2 = c2.value, d2 = false;
              const e3 = o2;
              s2.add(e3);
            }
          } catch (u2) {
            i2 = { error: u2 };
          } finally {
            try {
              d2 || n2 || !(r2 = l2.return) || (yield r2.call(l2));
            } finally {
              if (i2) throw i2.error;
            }
          }
          return Array.from(s2);
        })();
      }));
    }
  }
  class nu extends eu {
    [Symbol.asyncIterator]() {
      const t2 = this.reader.getReader();
      t2.closed.catch((() => {
      }));
      const n2 = new TextDecoder("utf-8"), i2 = this.signal, r2 = () => {
        t2.releaseLock(), this.signal = void 0;
      };
      return { next: () => kr(this, void 0, void 0, (function* () {
        var o2;
        try {
          if (null == i2 ? void 0 : i2.aborted) throw i2.reason;
          const r3 = yield new Promise(((e2, n3) => {
            if (i2) {
              const r4 = () => n3(i2.reason);
              i2.addEventListener("abort", r4, { once: true }), t2.read().then(e2, n3).finally((() => {
                i2.removeEventListener("abort", r4);
              }));
            } else t2.read().then(e2, n3);
          }));
          if (r3.done) return this.validateBytesReceived(true), "number" == typeof this.totalByteSize && (null === (o2 = this.onProgress) || void 0 === o2 || o2.call(this, 1)), { done: true, value: void 0 };
          {
            let t3;
            this.handleChunkReceived(r3.value);
            try {
              t3 = n2.decode(r3.value.content);
            } catch (s2) {
              throw new cs("Cannot decode datastream chunk ".concat(r3.value.chunkIndex, " as text: ").concat(s2), e.DataStreamErrorReason.DecodeFailed);
            }
            return { done: false, value: t3 };
          }
        } catch (s2) {
          throw r2(), s2;
        }
      })), return() {
        return kr(this, void 0, void 0, (function* () {
          return r2(), { done: true, value: void 0 };
        }));
      } };
    }
    withAbortSignal(e2) {
      return this.signal = e2, this;
    }
    readAll() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (function* () {
          var n2, i2, r2, o2;
          let s2 = "";
          const a2 = t2.signal ? e2.withAbortSignal(t2.signal) : e2;
          try {
            for (var c2, d2 = true, l2 = Sr(a2); !(n2 = (c2 = yield l2.next()).done); d2 = true) {
              o2 = c2.value, d2 = false;
              s2 += o2;
            }
          } catch (u2) {
            i2 = { error: u2 };
          } finally {
            try {
              d2 || n2 || !(r2 = l2.return) || (yield r2.call(l2));
            } finally {
              if (i2) throw i2.error;
            }
          }
          return s2;
        })();
      }));
    }
  }
  class iu {
    constructor() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5e9;
      this.log = ar, this.byteStreamControllers = /* @__PURE__ */ new Map(), this.textStreamControllers = /* @__PURE__ */ new Map(), this.byteStreamHandlers = /* @__PURE__ */ new Map(), this.textStreamHandlers = /* @__PURE__ */ new Map(), this.isConnected = false, this.bufferedPackets = [], this.maxPayloadByteLength = e2;
    }
    setConnected(e2) {
      this.isConnected = e2, e2 && this.flushBufferedPackets();
    }
    flushBufferedPackets() {
      const e2 = this.bufferedPackets;
      this.bufferedPackets = [];
      for (const t2 of e2) {
        const e3 = t2.packet, n2 = t2.encryptionType;
        this.handleDataStreamPacket(e3, n2);
      }
    }
    registerTextStreamHandler(t2, n2) {
      if (this.textStreamHandlers.has(t2)) throw new cs('A text stream handler for topic "'.concat(t2, '" has already been set.'), e.DataStreamErrorReason.HandlerAlreadyRegistered);
      this.textStreamHandlers.set(t2, n2);
    }
    unregisterTextStreamHandler(e2) {
      this.textStreamHandlers.delete(e2);
    }
    registerByteStreamHandler(t2, n2) {
      if (this.byteStreamHandlers.has(t2)) throw new cs('A byte stream handler for topic "'.concat(t2, '" has already been set.'), e.DataStreamErrorReason.HandlerAlreadyRegistered);
      this.byteStreamHandlers.set(t2, n2);
    }
    unregisterByteStreamHandler(e2) {
      this.byteStreamHandlers.delete(e2);
    }
    clearControllers() {
      const t2 = new cs("Room disconnected in the middle of receiving data", e.DataStreamErrorReason.AbnormalEnd);
      for (const e2 of this.byteStreamControllers.values()) {
        e2.controller.error(t2);
      }
      for (const e2 of this.textStreamControllers.values()) {
        e2.controller.error(t2);
      }
      this.byteStreamControllers.clear(), this.textStreamControllers.clear(), this.bufferedPackets = [];
    }
    validateParticipantHasNoActiveDataStreams(t2) {
      const n2 = Array.from(this.textStreamControllers.entries()).filter(((e2) => e2[1].sendingParticipantIdentity === t2)), i2 = Array.from(this.byteStreamControllers.entries()).filter(((e2) => e2[1].sendingParticipantIdentity === t2));
      if (n2.length > 0 || i2.length > 0) {
        const s2 = new cs("Participant ".concat(t2, " unexpectedly disconnected in the middle of sending data"), e.DataStreamErrorReason.AbnormalEnd);
        for (const e2 of i2) {
          var r2 = j(e2, 2);
          const t3 = r2[0];
          r2[1].controller.error(s2), this.byteStreamControllers.delete(t3);
        }
        for (const e2 of n2) {
          var o2 = j(e2, 2);
          const t3 = o2[0];
          o2[1].controller.error(s2), this.textStreamControllers.delete(t3);
        }
      }
    }
    handleDataStreamPacket(e2, t2) {
      if (this.isConnected) switch (e2.value.case) {
        case "streamHeader":
          return this.handleStreamHeader(e2.value.value, e2.participantIdentity, t2);
        case "streamChunk":
          return this.handleStreamChunk(e2.value.value, t2);
        case "streamTrailer":
          return this.handleStreamTrailer(e2.value.value, t2);
        default:
          throw new Error('DataPacket of value "'.concat(e2.value.case, '" is not data stream related!'));
      }
      else this.bufferedPackets.push({ packet: e2, encryptionType: t2 });
    }
    handleStreamHeader(t2, n2, i2) {
      var r2;
      switch (t2.contentHeader.case) {
        case "byteHeader": {
          const o2 = this.byteStreamHandlers.get(t2.topic);
          if (!o2) return void this.log.debug("ignoring incoming byte stream due to no handler for topic", t2.topic);
          let s2;
          const a2 = { id: t2.streamId, name: null !== (r2 = t2.contentHeader.value.name) && void 0 !== r2 ? r2 : "unknown", mimeType: t2.mimeType, size: t2.totalLength ? Number(t2.totalLength) : void 0, topic: t2.topic, timestamp: Ba(t2.timestamp), attributes: t2.attributes, encryptionType: i2 };
          let c2;
          switch (t2.compression) {
            case sn.DEFLATE_RAW:
              if (!ec()) return void ar.warn("Data stream ".concat(t2.streamId, " received with deflate-raw compression, but this browser does not support deflate-raw decompression. Dropping..."));
              c2 = true;
              break;
            case sn.NONE:
              c2 = false;
              break;
            default:
              return void ar.warn("Data stream ".concat(t2.streamId, " received with unknown compression type ").concat(t2.compression, ", dropping..."));
          }
          const d2 = t2.inlineContent;
          if (void 0 !== d2) return void o2(new tu(a2, ru(t2.streamId, c2 ? Xl(d2, this.maxPayloadByteLength) : d2), Ba(t2.totalLength)), { identity: n2 });
          const l2 = new ReadableStream({ start: (i3) => {
            if (s2 = i3, this.byteStreamControllers.has(t2.streamId)) throw new cs("A data stream read is already in progress for a stream with id ".concat(t2.streamId, "."), e.DataStreamErrorReason.AlreadyOpened);
            this.byteStreamControllers.set(t2.streamId, { info: a2, controller: s2, startTime: Date.now(), sendingParticipantIdentity: n2 });
          } });
          return void o2(new tu(a2, c2 ? (function(e2, t3, n3) {
            return e2.pipeThrough(ou(t3)).pipeThrough(su()).pipeThrough(Yl()).pipeThrough(au(t3, n3)).pipeThrough((function(e3) {
              let t4 = 0;
              return new TransformStream({ transform: (n4, i3) => {
                n4.byteLength > 0 && (i3.enqueue(new ln({ streamId: e3, chunkIndex: qa(t4), content: n4 })), t4 += 1);
              } });
            })(t3));
          })(l2, t2.streamId, this.maxPayloadByteLength) : l2.pipeThrough(ou(t2.streamId)), Ba(t2.totalLength)), { identity: n2 });
        }
        case "textHeader": {
          const r3 = this.textStreamHandlers.get(t2.topic);
          if (!r3) return void this.log.debug("ignoring incoming text stream due to no handler for topic", t2.topic);
          let o2;
          const s2 = { id: t2.streamId, mimeType: t2.mimeType, size: t2.totalLength ? Number(t2.totalLength) : void 0, topic: t2.topic, timestamp: Number(t2.timestamp), attributes: t2.attributes, encryptionType: i2, attachedStreamIds: t2.contentHeader.value.attachedStreamIds };
          let a2;
          switch (t2.compression) {
            case sn.DEFLATE_RAW:
              if (!ec()) return void ar.warn("Data stream ".concat(t2.streamId, " received with deflate-raw compression, but this browser does not support deflate-raw decompression. Dropping..."));
              a2 = true;
              break;
            case sn.NONE:
              a2 = false;
              break;
            default:
              return void ar.warn("Data stream ".concat(t2.streamId, " received with unknown compression type ").concat(t2.compression, ", dropping..."));
          }
          const c2 = t2.inlineContent;
          if (void 0 !== c2) {
            const e2 = a2 ? Xl(c2, this.maxPayloadByteLength) : c2;
            return void r3(new nu(s2, ru(t2.streamId, e2), Ba(t2.totalLength)), { identity: n2 });
          }
          const d2 = new ReadableStream({ start: (i3) => {
            if (o2 = i3, this.textStreamControllers.has(t2.streamId)) throw new cs("A data stream read is already in progress for a stream with id ".concat(t2.streamId, "."), e.DataStreamErrorReason.AlreadyOpened);
            this.textStreamControllers.set(t2.streamId, { info: s2, controller: o2, startTime: Date.now(), sendingParticipantIdentity: n2 });
          } });
          return void r3(new nu(s2, a2 ? (function(t3, n3, i3) {
            return t3.pipeThrough(ou(n3)).pipeThrough(su()).pipeThrough(Yl()).pipeThrough(au(n3, i3)).pipeThrough((function(t4) {
              const n4 = new TextDecoder("utf-8"), i4 = new TextEncoder();
              let r4 = 0;
              const o3 = (i5) => {
                try {
                  return i5 ? n4.decode(i5, { stream: true }) : n4.decode();
                } catch (r5) {
                  throw new cs("Cannot decode compressed data stream ".concat(t4, " as text: ").concat(r5), e.DataStreamErrorReason.DecodeFailed);
                }
              };
              return new TransformStream({ transform: (e2, n5) => {
                const s3 = o3(e2);
                s3.length > 0 && (n5.enqueue(new ln({ streamId: t4, chunkIndex: qa(r4), content: i4.encode(s3) })), r4 += 1);
              }, flush: (e2) => {
                const n5 = o3();
                n5.length > 0 && (e2.enqueue(new ln({ streamId: t4, chunkIndex: qa(r4), content: i4.encode(n5) })), r4 += 1);
              } });
            })(n3));
          })(d2, t2.streamId, this.maxPayloadByteLength) : d2.pipeThrough(ou(t2.streamId)), Ba(t2.totalLength)), { identity: n2 });
        }
      }
    }
    handleStreamChunk(t2, n2) {
      const i2 = this.byteStreamControllers.get(t2.streamId);
      i2 && (i2.info.encryptionType !== n2 ? (i2.controller.error(new cs("Encryption type mismatch for stream ".concat(t2.streamId, ". Expected ").concat(n2, ", got ").concat(i2.info.encryptionType), e.DataStreamErrorReason.EncryptionTypeMismatch)), this.byteStreamControllers.delete(t2.streamId)) : i2.controller.enqueue(t2));
      const r2 = this.textStreamControllers.get(t2.streamId);
      r2 && (r2.info.encryptionType !== n2 ? (r2.controller.error(new cs("Encryption type mismatch for stream ".concat(t2.streamId, ". Expected ").concat(n2, ", got ").concat(r2.info.encryptionType), e.DataStreamErrorReason.EncryptionTypeMismatch)), this.textStreamControllers.delete(t2.streamId)) : r2.controller.enqueue(t2));
    }
    handleStreamTrailer(t2, n2) {
      const i2 = this.textStreamControllers.get(t2.streamId);
      i2 && (i2.info.encryptionType !== n2 ? i2.controller.error(new cs("Encryption type mismatch for stream ".concat(t2.streamId, ". Expected ").concat(n2, ", got ").concat(i2.info.encryptionType), e.DataStreamErrorReason.EncryptionTypeMismatch)) : (i2.info.attributes = Object.assign(Object.assign({}, i2.info.attributes), t2.attributes), t2.reason ? i2.controller.error(new cs("Data stream ".concat(t2.streamId, " closed abnormally: ").concat(t2.reason), e.DataStreamErrorReason.AbnormalEnd)) : i2.controller.close()), this.textStreamControllers.delete(t2.streamId));
      const r2 = this.byteStreamControllers.get(t2.streamId);
      r2 && (r2.info.encryptionType !== n2 ? r2.controller.error(new cs("Encryption type mismatch for stream ".concat(t2.streamId, ". Expected ").concat(n2, ", got ").concat(r2.info.encryptionType), e.DataStreamErrorReason.EncryptionTypeMismatch)) : (r2.info.attributes = Object.assign(Object.assign({}, r2.info.attributes), t2.attributes), t2.reason ? r2.controller.error(new cs("Data stream ".concat(t2.streamId, " closed abnormally: ").concat(t2.reason), e.DataStreamErrorReason.AbnormalEnd)) : r2.controller.close()), this.byteStreamControllers.delete(t2.streamId));
    }
  }
  function ru(e2, t2) {
    return new ReadableStream({ start: (n2) => kr(this, void 0, void 0, (function* () {
      const i2 = yield t2;
      n2.enqueue(new ln({ streamId: e2, chunkIndex: BigInt(0), content: i2 })), n2.close();
    })) });
  }
  function ou(t2) {
    let n2 = -1;
    return new TransformStream({ transform: (i2, r2) => {
      const o2 = Ba(i2.chunkIndex);
      if (o2 <= n2) ar.warn("ignoring duplicate chunk ".concat(o2, " ").concat(i2.version > 0 ? "(version ".concat(i2.version, ")") : "", " for data stream ").concat(t2, " (last processed: ").concat(n2, ")"));
      else {
        if (o2 > n2 + 1) throw new cs("Missing chunk(s) ".concat(n2 + 1, "..").concat(o2 - 1, " for data stream ").concat(t2, " - cannot reassemble payload"), e.DataStreamErrorReason.Incomplete);
        n2 = o2, 0 !== i2.content.length && r2.enqueue(i2);
      }
    } });
  }
  function su() {
    return new TransformStream({ transform: (e2, t2) => {
      t2.enqueue(e2.content);
    } });
  }
  function au(t2, n2) {
    let i2 = 0;
    return new TransformStream({ transform: (r2, o2) => {
      if (i2 += r2.byteLength, i2 > n2) throw new cs("Data stream ".concat(t2, " exceeds the maximum payload size of ").concat(n2, " bytes"), e.DataStreamErrorReason.PayloadTooLarge);
      o2.enqueue(r2);
    } });
  }
  class cu {
    constructor(e2, t2, n2) {
      this.writableStream = e2, this.defaultWriter = e2.getWriter(), this.onClose = n2, this.info = t2;
    }
    write(e2) {
      return this.defaultWriter.write(e2);
    }
    close() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        yield this.defaultWriter.close(), this.defaultWriter.releaseLock(), null === (e2 = this.onClose) || void 0 === e2 || e2.call(this);
      }));
    }
  }
  class du extends cu {
  }
  class lu extends cu {
  }
  function uu(e2, t2, n2) {
    var i2;
    return new dn({ streamId: e2.id, mimeType: e2.mimeType, topic: e2.topic, timestamp: qa(e2.timestamp), totalLength: qa(e2.size), attributes: e2.attributes, compression: null !== (i2 = null == n2 ? void 0 : n2.compression) && void 0 !== i2 ? i2 : sn.NONE, inlineContent: null == n2 ? void 0 : n2.inlineContent, contentHeader: { case: "textHeader", value: new an({ version: null == t2 ? void 0 : t2.version, attachedStreamIds: e2.attachedStreamIds, replyToStreamId: null == t2 ? void 0 : t2.replyToStreamId, operationType: "update" === (null == t2 ? void 0 : t2.type) ? on.UPDATE : on.CREATE }) } });
  }
  function hu(e2, t2) {
    var n2;
    return new dn({ streamId: e2.id, mimeType: e2.mimeType, topic: e2.topic, timestamp: qa(e2.timestamp), totalLength: qa(e2.size), attributes: e2.attributes, compression: null !== (n2 = null == t2 ? void 0 : t2.compression) && void 0 !== n2 ? n2 : sn.NONE, inlineContent: null == t2 ? void 0 : t2.inlineContent, contentHeader: { case: "byteHeader", value: new cn({ name: e2.name }) } });
  }
  function pu(e2, t2) {
    return new At({ destinationIdentities: t2, value: { case: "streamHeader", value: e2 } });
  }
  const mu = new TextEncoder();
  class gu {
    constructor(e2, t2, n2, i2, r2) {
      this.engine = e2, this.log = t2, this.getRemoteParticipantClientProtocol = n2, this.getRemoteParticipantCapabilities = i2, this.getAllRemoteParticipantIdentities = r2;
    }
    setupEngine(e2) {
      this.engine = e2;
    }
    sendText(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2, o2, s2;
        const a2 = crypto.randomUUID(), c2 = mu.encode(e2), d2 = c2.byteLength, l2 = null === (n2 = null == t2 ? void 0 : t2.compress) || void 0 === n2 || n2;
        let u2 = { id: a2, mimeType: "text/plain", timestamp: Date.now(), topic: null !== (i2 = null == t2 ? void 0 : t2.topic) && void 0 !== i2 ? i2 : "", size: d2, attributes: null == t2 ? void 0 : t2.attributes, encryptionType: (null === (r2 = this.engine.e2eeManager) || void 0 === r2 ? void 0 : r2.isDataChannelEncryptionEnabled) ? yt.GCM : yt.NONE };
        let h2 = l2 && ec() && this.allRecipientsSupportV2(null == t2 ? void 0 : t2.destinationIdentities) && this.allRecipientsSupportCompression(null == t2 ? void 0 : t2.destinationIdentities) ? vu.fromStream(Xa(c2).pipeThrough(Ql())) : null;
        if ((!(null == t2 ? void 0 : t2.attachments) || 0 === t2.attachments.length) && this.allRecipientsSupportV2(null == t2 ? void 0 : t2.destinationIdentities)) {
          let e3 = c2, n3 = sn.NONE;
          if (h2) {
            const t3 = yield h2.collect();
            t3.byteLength < c2.byteLength && (e3 = t3, n3 = sn.DEFLATE_RAW);
          }
          const i3 = pu(uu(u2, void 0, { compression: n3, inlineContent: e3 }), null == t2 ? void 0 : t2.destinationIdentities);
          if (i3.toBinary().byteLength <= $l) return yield this.engine.sendDataPacket(i3, cl.RELIABLE), null === (o2 = null == t2 ? void 0 : t2.onProgress) || void 0 === o2 || o2.call(t2, 1), u2;
        }
        const p2 = null === (s2 = null == t2 ? void 0 : t2.attachments) || void 0 === s2 ? void 0 : s2.map((() => crypto.randomUUID())), m2 = p2 ? p2.length + 1 : 1, g2 = new Array(m2).fill(0), v2 = (e3, n3) => {
          var i3;
          g2[n3] = e3, null === (i3 = null == t2 ? void 0 : t2.onProgress) || void 0 === i3 || i3.call(t2, g2.reduce(((e4, t3) => e4 + t3), 0) / m2);
        };
        if (h2) {
          u2.attachedStreamIds = p2;
          const e3 = pu(uu(u2, void 0, { compression: sn.DEFLATE_RAW }), null == t2 ? void 0 : t2.destinationIdentities);
          yield this.sendChunkedByteStream(e3, a2, null == t2 ? void 0 : t2.destinationIdentities, h2.stream().pipeThrough(fu(c2.length, ((e4) => v2(e4, 0))))), 0 === c2.length && v2(1, 0);
        } else {
          const n3 = yield this.streamText({ streamId: a2, totalSize: d2, destinationIdentities: null == t2 ? void 0 : t2.destinationIdentities, topic: null == t2 ? void 0 : t2.topic, attachedStreamIds: p2, attributes: null == t2 ? void 0 : t2.attributes });
          yield n3.write(e2), v2(1, 0), yield n3.close(), u2 = n3.info;
        }
        return (null == t2 ? void 0 : t2.attachments) && p2 && (yield Promise.all(t2.attachments.map(((e3, n3) => kr(this, void 0, void 0, (function* () {
          return this._sendFile(p2[n3], e3, { topic: t2.topic, mimeType: e3.type, destinationIdentities: t2.destinationIdentities, compress: t2.compress, onProgress: (e4) => {
            v2(e4, n3 + 1);
          } });
        })))))), u2;
      }));
    }
    sendBytes(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2, o2, s2, a2, c2;
        const d2 = crypto.randomUUID(), l2 = null == t2 ? void 0 : t2.destinationIdentities, u2 = null === (n2 = null == t2 ? void 0 : t2.compress) || void 0 === n2 || n2, h2 = { id: d2, name: null !== (i2 = null == t2 ? void 0 : t2.name) && void 0 !== i2 ? i2 : "unknown", mimeType: null !== (r2 = null == t2 ? void 0 : t2.mimeType) && void 0 !== r2 ? r2 : "application/octet-stream", timestamp: Date.now(), topic: null !== (o2 = null == t2 ? void 0 : t2.topic) && void 0 !== o2 ? o2 : "", size: e2.byteLength, attributes: null == t2 ? void 0 : t2.attributes, encryptionType: (null === (s2 = this.engine.e2eeManager) || void 0 === s2 ? void 0 : s2.isDataChannelEncryptionEnabled) ? yt.GCM : yt.NONE }, p2 = fu(e2.length, null == t2 ? void 0 : t2.onProgress);
        let m2 = u2 && ec() && this.allRecipientsSupportV2(l2) && this.allRecipientsSupportCompression(l2) ? vu.fromStream(Xa(e2).pipeThrough(p2).pipeThrough(Ql())) : null;
        if (this.allRecipientsSupportV2(l2)) {
          let n3 = e2, i3 = sn.NONE;
          if (m2) {
            const t3 = yield m2.collect();
            t3.byteLength < e2.byteLength && (n3 = t3, i3 = sn.DEFLATE_RAW);
          }
          const r3 = pu(hu(h2, { compression: i3, inlineContent: n3 }), l2);
          if (r3.toBinary().byteLength <= $l) return yield this.engine.sendDataPacket(r3, cl.RELIABLE), null === (a2 = null == t2 ? void 0 : t2.onProgress) || void 0 === a2 || a2.call(t2, 1), h2;
        }
        const g2 = pu(hu(h2, { compression: m2 ? sn.DEFLATE_RAW : sn.NONE }), l2), v2 = m2 ? m2.stream() : Xa(e2).pipeThrough(p2);
        return yield this.sendChunkedByteStream(g2, d2, l2, v2), 0 === e2.length && (null === (c2 = null == t2 ? void 0 : t2.onProgress) || void 0 === c2 || c2.call(t2, 1)), h2;
      }));
    }
    allRecipientsSupportV2(e2) {
      return (e2 && e2.length > 0 ? e2 : this.getAllRemoteParticipantIdentities()).every(((e3) => this.getRemoteParticipantClientProtocol(e3) >= 2));
    }
    allRecipientsSupportCompression(e2) {
      return (e2 && e2.length > 0 ? e2 : this.getAllRemoteParticipantIdentities()).every(((e3) => this.getRemoteParticipantCapabilities(e3).includes($t.CAP_COMPRESSION_DEFLATE_RAW)));
    }
    sendChunkedByteStream(e2, t2, n2, i2) {
      return kr(this, void 0, void 0, (function* () {
        var r2, o2, s2, a2;
        const c2 = this.engine;
        yield ku(c2, e2);
        let d2 = 0;
        try {
          for (var l2, u2 = true, h2 = Sr((function(e3, t3) {
            return Tr(this, arguments, (function* () {
              const n3 = e3.getReader();
              let i3 = new Uint8Array(0);
              try {
                for (; ; ) {
                  const e4 = yield br(n3.read()), r3 = e4.done, o3 = e4.value;
                  if (r3) break;
                  if (0 === o3.byteLength) continue;
                  const s3 = new Uint8Array(i3.byteLength + o3.byteLength);
                  for (s3.set(i3), s3.set(o3, i3.byteLength), i3 = s3; i3.byteLength >= t3; ) yield yield br(i3.slice(0, t3)), i3 = i3.slice(t3);
                }
                i3.byteLength > 0 && (yield yield br(i3));
              } finally {
                n3.releaseLock();
              }
            }));
          })(i2, $l)); !(r2 = (l2 = yield h2.next()).done); u2 = true) {
            a2 = l2.value, u2 = false;
            const e3 = new At({ destinationIdentities: n2, value: { case: "streamChunk", value: new ln({ content: a2, streamId: t2, chunkIndex: qa(d2) }) } });
            yield c2.sendDataPacket(e3, cl.RELIABLE), d2 += 1;
          }
        } catch (p2) {
          o2 = { error: p2 };
        } finally {
          try {
            u2 || r2 || !(s2 = h2.return) || (yield s2.call(h2));
          } finally {
            if (o2) throw o2.error;
          }
        }
        yield yu(t2, n2, c2);
      }));
    }
    streamText(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2;
        const o2 = null !== (n2 = null == t2 ? void 0 : t2.streamId) && void 0 !== n2 ? n2 : crypto.randomUUID(), s2 = null == t2 ? void 0 : t2.destinationIdentities, a2 = { id: o2, mimeType: "text/plain", timestamp: Date.now(), topic: null !== (i2 = null == t2 ? void 0 : t2.topic) && void 0 !== i2 ? i2 : "", size: null == t2 ? void 0 : t2.totalSize, attributes: null == t2 ? void 0 : t2.attributes, encryptionType: (null === (r2 = this.engine.e2eeManager) || void 0 === r2 ? void 0 : r2.isDataChannelEncryptionEnabled) ? yt.GCM : yt.NONE, attachedStreamIds: null == t2 ? void 0 : t2.attachedStreamIds }, c2 = pu(uu(a2, t2), s2);
        yield ku(this.engine, c2);
        let d2 = 0;
        const l2 = this.engine, u2 = new WritableStream({ write(e2) {
          return kr(this, void 0, void 0, (function* () {
            for (const t3 of (function(e3, t4) {
              const n3 = [];
              let i3 = new TextEncoder().encode(e3);
              for (; i3.length > t4; ) {
                let e4 = t4;
                for (; e4 > 0; ) {
                  const t5 = i3[e4];
                  if (void 0 !== t5 && 128 != (192 & t5)) break;
                  e4--;
                }
                n3.push(i3.slice(0, e4)), i3 = i3.slice(e4);
              }
              return i3.length > 0 && n3.push(i3), n3;
            })(e2, $l)) {
              const e3 = new ln({ content: t3, streamId: o2, chunkIndex: qa(d2) }), n3 = new At({ destinationIdentities: s2, value: { case: "streamChunk", value: e3 } });
              yield l2.sendDataPacket(n3, cl.RELIABLE), d2 += 1;
            }
          }));
        }, close() {
          return kr(this, void 0, void 0, (function* () {
            yield yu(o2, s2, l2);
          }));
        }, abort(e2) {
          console.log("Sink error:", e2);
        } });
        let h2 = () => kr(this, void 0, void 0, (function* () {
          yield p2.close();
        }));
        l2.once(e.EngineEvent.Closing, h2);
        const p2 = new du(u2, a2, (() => this.engine.off(e.EngineEvent.Closing, h2)));
        return p2;
      }));
    }
    sendFile(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = crypto.randomUUID();
        return yield this._sendFile(n2, e2, t2), { id: n2 };
      }));
    }
    _sendFile(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        var i2, r2, o2, s2, a2;
        const c2 = null == n2 ? void 0 : n2.destinationIdentities, d2 = (null === (i2 = null == n2 ? void 0 : n2.compress) || void 0 === i2 || i2) && ec() && this.allRecipientsSupportV2(c2) && this.allRecipientsSupportCompression(c2), l2 = { id: e2, name: t2.name, mimeType: null !== (r2 = null == n2 ? void 0 : n2.mimeType) && void 0 !== r2 ? r2 : t2.type, topic: null !== (o2 = null == n2 ? void 0 : n2.topic) && void 0 !== o2 ? o2 : "", timestamp: Date.now(), size: t2.size, encryptionType: (null === (s2 = this.engine.e2eeManager) || void 0 === s2 ? void 0 : s2.isDataChannelEncryptionEnabled) ? yt.GCM : yt.NONE }, u2 = pu(hu(l2, { compression: d2 ? sn.DEFLATE_RAW : sn.NONE }), c2), h2 = t2.stream().pipeThrough(fu(t2.size, null == n2 ? void 0 : n2.onProgress)), p2 = d2 ? h2.pipeThrough(Ql()) : h2;
        return yield this.sendChunkedByteStream(u2, e2, c2, p2), 0 === t2.size && (null === (a2 = null == n2 ? void 0 : n2.onProgress) || void 0 === a2 || a2.call(n2, 1)), l2;
      }));
    }
    streamBytes(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2, o2, s2;
        const a2 = null !== (t2 = null == e2 ? void 0 : e2.streamId) && void 0 !== t2 ? t2 : crypto.randomUUID(), c2 = null == e2 ? void 0 : e2.destinationIdentities, d2 = { id: a2, mimeType: null !== (n2 = null == e2 ? void 0 : e2.mimeType) && void 0 !== n2 ? n2 : "application/octet-stream", topic: null !== (i2 = null == e2 ? void 0 : e2.topic) && void 0 !== i2 ? i2 : "", timestamp: Date.now(), attributes: null == e2 ? void 0 : e2.attributes, size: null == e2 ? void 0 : e2.totalSize, name: null !== (o2 = null == e2 ? void 0 : e2.name) && void 0 !== o2 ? o2 : "unknown", encryptionType: (null === (s2 = this.engine.e2eeManager) || void 0 === s2 ? void 0 : s2.isDataChannelEncryptionEnabled) ? yt.GCM : yt.NONE }, l2 = pu(hu(d2), c2);
        yield ku(this.engine, l2);
        let u2 = 0;
        const h2 = new r(), p2 = this.engine, m2 = this.log, g2 = new WritableStream({ write(e3) {
          return kr(this, void 0, void 0, (function* () {
            const t3 = yield h2.lock();
            let n3 = 0;
            try {
              for (; n3 < e3.byteLength; ) {
                const t4 = e3.slice(n3, n3 + $l), i3 = new At({ destinationIdentities: c2, value: { case: "streamChunk", value: new ln({ content: t4, streamId: a2, chunkIndex: qa(u2) }) } });
                yield p2.sendDataPacket(i3, cl.RELIABLE), u2 += 1, n3 += t4.byteLength;
              }
            } finally {
              t3();
            }
          }));
        }, close() {
          return kr(this, void 0, void 0, (function* () {
            yield yu(a2, c2, p2);
          }));
        }, abort(e3) {
          m2.error("Sink error:", e3);
        } });
        return new lu(g2, d2);
      }));
    }
  }
  class vu {
    constructor(e2) {
      this.state = e2;
    }
    static fromStream(e2) {
      return new vu({ type: "stream", stream: e2 });
    }
    collect() {
      return kr(this, void 0, void 0, (function* () {
        switch (this.state.type) {
          case "stream":
            const e2 = yield Zl(this.state.stream);
            return this.state = { type: "collected", bytes: e2 }, e2;
          case "collected":
            return this.state.bytes;
        }
      }));
    }
    stream() {
      switch (this.state.type) {
        case "stream":
          return this.state.stream;
        case "collected":
          return Xa(this.state.bytes);
      }
    }
  }
  function fu(e2, t2) {
    let n2 = 0;
    return new TransformStream({ transform(i2, r2) {
      n2 += i2.byteLength, t2 && "number" == typeof e2 && e2 > 0 && t2(Math.min(n2 / e2, 1)), r2.enqueue(i2);
    } });
  }
  function ku(t2, n2) {
    return kr(this, void 0, void 0, (function* () {
      if (n2.toBinary().byteLength > $l) throw new cs("data stream header exceeds the ".concat($l, "-byte limit; reduce attribute size"), e.DataStreamErrorReason.HeaderTooLarge);
      yield t2.sendDataPacket(n2, cl.RELIABLE);
    }));
  }
  function yu(e2, t2, n2) {
    return kr(this, void 0, void 0, (function* () {
      const i2 = new At({ destinationIdentities: t2, value: { case: "streamTrailer", value: new un({ streamId: e2 }) } });
      yield n2.sendDataPacket(i2, cl.RELIABLE);
    }));
  }
  var bu, Tu, Su;
  !(function(e2) {
    e2[e2.TooShort = 0] = "TooShort", e2[e2.HeaderOverrun = 1] = "HeaderOverrun", e2[e2.MissingExtWords = 2] = "MissingExtWords", e2[e2.UnsupportedVersion = 3] = "UnsupportedVersion", e2[e2.InvalidHandle = 4] = "InvalidHandle", e2[e2.MalformedExt = 5] = "MalformedExt";
  })(bu || (bu = {}));
  class Eu extends Ho {
    constructor(e2, t2, n2) {
      super(19, e2, n2), this.name = "DataTrackDeserializeError", this.reason = t2, this.reasonName = bu[t2];
    }
    static tooShort() {
      return new Eu("Too short to contain a valid header", bu.TooShort);
    }
    static headerOverrun() {
      return new Eu("Header exceeds total packet length", bu.HeaderOverrun);
    }
    static missingExtWords() {
      return new Eu("Extension word indicator is missing", bu.MissingExtWords);
    }
    static unsupportedVersion(e2) {
      return new Eu("Unsupported version ".concat(e2), bu.UnsupportedVersion);
    }
    static invalidHandle(e2) {
      return new Eu("invalid track handle: ".concat(e2.message), bu.InvalidHandle, { cause: e2 });
    }
    static malformedExt(e2) {
      return new Eu("Extension with tag ".concat(e2, " is malformed"), bu.MalformedExt);
    }
  }
  !(function(e2) {
    e2[e2.TooSmallForHeader = 0] = "TooSmallForHeader", e2[e2.TooSmallForPayload = 1] = "TooSmallForPayload";
  })(Tu || (Tu = {}));
  class Cu extends Ho {
    constructor(e2, t2, n2) {
      super(19, e2, n2), this.name = "DataTrackSerializeError", this.reason = t2, this.reasonName = Tu[t2];
    }
    static tooSmallForHeader() {
      return new Cu("Buffer cannot fit header", Tu.TooSmallForHeader);
    }
    static tooSmallForPayload() {
      return new Cu("Buffer cannot fit payload", Tu.TooSmallForPayload);
    }
  }
  class wu {
    toBinary() {
      const e2 = this.toBinaryLengthBytes(), t2 = new ArrayBuffer(e2), n2 = new DataView(t2), i2 = this.toBinaryInto(n2);
      if (e2 !== i2) throw new Error("".concat(this.constructor.name, ".toBinary: written bytes (").concat(i2, " bytes) not equal to allocated array buffer length (").concat(e2, " bytes)."));
      return new Uint8Array(t2);
    }
  }
  !(function(e2) {
    e2[e2.UserTimestamp = 2] = "UserTimestamp", e2[e2.E2ee = 1] = "E2ee";
  })(Su || (Su = {}));
  class Ru extends wu {
  }
  class Pu extends Ru {
    constructor(e2) {
      super(), this.timestamp = e2;
    }
    toBinaryLengthBytes() {
      return 2 + Pu.lengthBytes;
    }
    toBinaryInto(e2) {
      let t2 = 0;
      e2.setUint8(t2, Pu.tag), t2 += 1, e2.setUint8(t2, Pu.lengthBytes), t2 += 1, e2.setBigUint64(t2, this.timestamp), t2 += 8;
      const n2 = this.toBinaryLengthBytes();
      if (t2 !== n2) throw new Error("DataTrackUserTimestampExtension.toBinaryInto: Wrote ".concat(t2, " bytes but expected length was ").concat(n2, " bytes"));
      return t2;
    }
    toJSON() {
      return { tag: Pu.tag, lengthBytes: Pu.lengthBytes, timestamp: this.timestamp };
    }
  }
  Pu.tag = Su.UserTimestamp, Pu.lengthBytes = 8;
  class Iu extends Ru {
    constructor(e2, t2) {
      super(), this.keyIndex = e2, this.iv = t2;
    }
    toBinaryLengthBytes() {
      return 2 + Iu.lengthBytes;
    }
    toBinaryInto(e2) {
      let t2 = 0;
      e2.setUint8(t2, Iu.tag), t2 += 1, e2.setUint8(t2, Iu.lengthBytes), t2 += 1, e2.setUint8(t2, this.keyIndex), t2 += 1;
      for (let i2 = 0; i2 < this.iv.length; i2 += 1) e2.setUint8(t2, this.iv[i2]), t2 += 1;
      const n2 = this.toBinaryLengthBytes();
      if (t2 !== n2) throw new Error("DataTrackE2eeExtension.toBinaryInto: Wrote ".concat(t2, " bytes but expected length was ").concat(n2, " bytes"));
      return t2;
    }
    toJSON() {
      return { tag: Iu.tag, lengthBytes: Iu.lengthBytes, keyIndex: this.keyIndex, iv: this.iv };
    }
  }
  Iu.tag = Su.E2ee, Iu.lengthBytes = 13;
  class _u extends wu {
    constructor() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      super(), this.userTimestamp = e2.userTimestamp, this.e2ee = e2.e2ee;
    }
    toBinaryLengthBytes() {
      let e2 = 0;
      return this.userTimestamp && (e2 += this.userTimestamp.toBinaryLengthBytes()), this.e2ee && (e2 += this.e2ee.toBinaryLengthBytes()), e2;
    }
    toBinaryInto(e2) {
      let t2 = 0;
      if (this.e2ee) {
        t2 += this.e2ee.toBinaryInto(e2);
      }
      if (this.userTimestamp) {
        t2 += this.userTimestamp.toBinaryInto(new DataView(e2.buffer, e2.byteOffset + t2));
      }
      const n2 = this.toBinaryLengthBytes();
      if (t2 !== n2) throw new Error("DataTrackExtensions.toBinaryInto: Wrote ".concat(t2, " bytes but expected length was ").concat(n2, " bytes"));
      return t2;
    }
    static fromBinary(e2) {
      const t2 = Kc(e2);
      let n2, i2, r2 = 0;
      for (; t2.byteLength - r2 >= 2; ) {
        const e3 = t2.getUint8(r2);
        r2 += 1;
        const o2 = t2.getUint8(r2);
        if (r2 += 1, 0 !== e3) switch (e3) {
          case Su.UserTimestamp:
            if (t2.byteLength - r2 < Pu.lengthBytes) throw Eu.malformedExt(e3);
            n2 = new Pu(t2.getBigUint64(r2)), r2 += o2;
            break;
          case Su.E2ee:
            if (t2.byteLength - r2 < Iu.lengthBytes) throw Eu.malformedExt(e3);
            const s2 = t2.getUint8(r2), a2 = new Uint8Array(12);
            for (let e4 = 0; e4 < a2.length; e4 += 1) {
              let n3 = r2;
              n3 += 1, n3 += 1 * e4, a2[e4] = t2.getUint8(n3);
            }
            i2 = new Iu(s2, a2), r2 += o2;
            break;
          default:
            if (t2.byteLength - r2 < o2) throw Eu.malformedExt(e3);
            r2 += o2;
        }
      }
      return [new _u({ userTimestamp: n2, e2ee: i2 }), t2.byteLength];
    }
    toJSON() {
      var e2, t2, n2, i2;
      return { userTimestamp: null !== (t2 = null === (e2 = this.userTimestamp) || void 0 === e2 ? void 0 : e2.toJSON()) && void 0 !== t2 ? t2 : null, e2ee: null !== (i2 = null === (n2 = this.e2ee) || void 0 === n2 ? void 0 : n2.toJSON()) && void 0 !== i2 ? i2 : null };
    }
  }
  const Mu = { from: (e2) => ({ payload: e2.payload, extensions: new _u({ userTimestamp: e2.userTimestamp ? new Pu(e2.userTimestamp) : void 0 }) }), lossyIntoFrame(e2) {
    var t2;
    return { payload: e2.payload, userTimestamp: null === (t2 = e2.extensions.userTimestamp) || void 0 === t2 ? void 0 : t2.timestamp };
  } }, Du = /* @__PURE__ */ Symbol.for("lk.track"), Ou = /* @__PURE__ */ Symbol.for("lk.data-track");
  class Au {
    constructor(e2, t2, n2) {
      this.trackSymbol = Du, this.isLocal = false, this.typeSymbol = Ou, this.info = e2, this.manager = t2, this.publisherIdentity = n2.publisherIdentity;
    }
    subscribe(e2) {
      try {
        const t2 = j(this.manager.openSubscriptionStream(this.info.sid, null == e2 ? void 0 : e2.signal, null == e2 ? void 0 : e2.bufferSize), 2), n2 = t2[0];
        return t2[1].catch((() => {
        })), n2;
      } catch (t2) {
        throw t2;
      }
    }
    setPipelineOptions(e2) {
      this.manager.setPipelineOptions(this.info.sid, e2);
    }
  }
  class Lu extends wu {
    constructor(e2) {
      var t2;
      super(), this.marker = e2.marker, this.trackHandle = e2.trackHandle, this.sequence = e2.sequence, this.frameNumber = e2.frameNumber, this.timestamp = e2.timestamp, this.extensions = null !== (t2 = e2.extensions) && void 0 !== t2 ? t2 : new _u();
    }
    extensionsMetrics() {
      const e2 = this.extensions.toBinaryLengthBytes(), t2 = Math.ceil((2 + e2) / 4);
      return { lengthBytes: e2, lengthWords: t2, paddingLengthBytes: 4 * t2 - 2 - e2 };
    }
    toBinaryLengthBytes() {
      const e2 = this.extensionsMetrics(), t2 = e2.lengthBytes, n2 = e2.paddingLengthBytes;
      let i2 = 12;
      return t2 > 0 && (i2 += 2 + t2 + n2), i2;
    }
    toBinaryInto(e2) {
      if (e2.byteLength < this.toBinaryLengthBytes()) throw Cu.tooSmallForHeader();
      let t2, n2 = 0;
      switch (this.marker) {
        case Nu.Inter:
          t2 = 0;
          break;
        case Nu.Final:
          t2 = 1;
          break;
        case Nu.Start:
          t2 = 2;
          break;
        case Nu.Single:
          t2 = 3;
      }
      n2 |= t2 << 3;
      const i2 = this.extensionsMetrics(), r2 = i2.lengthBytes, o2 = i2.lengthWords, s2 = i2.paddingLengthBytes;
      r2 > 0 && (n2 |= 4);
      let a2 = 0;
      if (e2.setUint8(a2, n2), a2 += 1, e2.setUint8(a2, 0), a2 += 1, e2.setUint16(a2, this.trackHandle), a2 += 2, e2.setUint16(a2, this.sequence.value), a2 += 2, e2.setUint16(a2, this.frameNumber.value), a2 += 2, e2.setUint32(a2, this.timestamp.asTicks()), a2 += 4, r2 > 0) {
        const t3 = o2 - 1;
        e2.setUint16(a2, t3), a2 += 2;
        a2 += this.extensions.toBinaryInto(new DataView(e2.buffer, e2.byteOffset + a2));
        for (let n3 = 0; n3 < s2; n3 += 1) e2.setUint8(a2, 0), a2 += 1;
      }
      const c2 = this.toBinaryLengthBytes();
      if (a2 !== c2) throw new Error("DataTrackPacketHeader.toBinaryInto: Wrote ".concat(a2, " bytes but expected length was ").concat(c2, " bytes"));
      return c2;
    }
    static fromBinary(e2) {
      const t2 = Kc(e2);
      if (t2.byteLength < 12) throw Eu.tooShort();
      let i2 = 0;
      const r2 = t2.getUint8(i2);
      i2 += 1;
      const o2 = r2 >> 5 & 7;
      if (o2 > 0) throw Eu.unsupportedVersion(o2);
      let s2;
      switch (r2 >> 3 & 3) {
        case 2:
          s2 = Nu.Start;
          break;
        case 1:
          s2 = Nu.Final;
          break;
        case 3:
          s2 = Nu.Single;
          break;
        default:
          s2 = Nu.Inter;
      }
      const a2 = (r2 >> 2 & 1) > 0;
      let c2;
      i2 += 1;
      try {
        c2 = Jc.fromNumber(t2.getUint16(i2));
      } catch (n2) {
        throw n2 instanceof Gc && (n2.isReason(zc.Reserved) || n2.isReason(zc.TooLarge)) ? Eu.invalidHandle(n2) : n2;
      }
      i2 += 2;
      const d2 = Vc.u16(t2.getUint16(i2));
      i2 += 2;
      const l2 = Vc.u16(t2.getUint16(i2));
      i2 += 2;
      const u2 = Wc.fromRtpTicks(t2.getUint32(i2));
      i2 += 4;
      let h2 = new _u();
      if (a2) {
        if (t2.byteLength - i2 < 2) throw Eu.missingExtWords();
        let e3 = t2.getUint16(i2);
        i2 += 2;
        let n2 = 4 * (e3 + 1) - 2;
        if (i2 + n2 > t2.byteLength) throw Eu.headerOverrun();
        let r3 = new DataView(t2.buffer, t2.byteOffset + i2, n2);
        const o3 = j(_u.fromBinary(r3), 2);
        h2 = o3[0], i2 += o3[1];
      }
      return [new Lu({ marker: s2, trackHandle: c2, sequence: d2, frameNumber: l2, timestamp: u2, extensions: h2 }), i2];
    }
    toJSON() {
      return { marker: this.marker, trackHandle: this.trackHandle, sequence: this.sequence.value, frameNumber: this.frameNumber.value, timestamp: this.timestamp.asTicks(), extensions: this.extensions.toJSON() };
    }
  }
  var Nu;
  !(function(e2) {
    e2[e2.Start = 0] = "Start", e2[e2.Inter = 1] = "Inter", e2[e2.Final = 2] = "Final", e2[e2.Single = 3] = "Single";
  })(Nu || (Nu = {}));
  class xu extends wu {
    constructor(e2, t2) {
      super(), this.header = e2, this.payload = t2;
    }
    toBinaryLengthBytes() {
      return this.header.toBinaryLengthBytes() + this.payload.byteLength;
    }
    toBinaryInto(e2) {
      let t2 = 0;
      if (t2 += this.header.toBinaryInto(e2), e2.byteLength - t2 < this.payload.byteLength) throw Cu.tooSmallForPayload();
      for (let i2 = 0; i2 < this.payload.length; i2 += 1) e2.setUint8(t2, this.payload[i2]), t2 += 1;
      const n2 = this.toBinaryLengthBytes();
      if (t2 !== n2) throw new Error("DataTrackPacket.toBinaryInto: Wrote ".concat(t2, " bytes but expected length was ").concat(n2, " bytes"));
      return n2;
    }
    static fromBinary(e2) {
      const t2 = Kc(e2), n2 = j(Lu.fromBinary(t2), 2), i2 = n2[0], r2 = n2[1], o2 = t2.buffer.slice(t2.byteOffset + r2, t2.byteOffset + t2.byteLength);
      return [new xu(i2, new Uint8Array(o2)), t2.byteLength];
    }
    toJSON() {
      return { header: this.header.toJSON(), payload: this.payload };
    }
  }
  const Uu = dr(e.LoggerNames.DataTracks);
  class Fu extends Ho {
    constructor(e2, t2, n2, i2) {
      super(19, "Frame ".concat(n2, " dropped: ").concat(e2), i2), this.name = "DataTrackDepacketizerDropError", this.reason = t2, this.reasonName = ju[t2], this.frameNumber = n2;
    }
    static interrupted(e2, t2) {
      return new Fu("Interrupted by the start of a new frame ".concat(t2), ju.Interrupted, e2);
    }
    static unknownFrame(e2) {
      return new Fu("Initial packet was never received.", ju.UnknownFrame, e2);
    }
    static bufferFull(e2) {
      return new Fu("Reorder buffer is full.", ju.BufferFull, e2);
    }
    static incomplete(e2, t2, n2) {
      return new Fu("Not all packets received before final packet. Received ".concat(t2, " packets, expected ").concat(n2, " packets."), ju.Incomplete, e2);
    }
  }
  var ju, Bu;
  !(function(e2) {
    e2[e2.Interrupted = 0] = "Interrupted", e2[e2.UnknownFrame = 1] = "UnknownFrame", e2[e2.BufferFull = 2] = "BufferFull", e2[e2.Incomplete = 3] = "Incomplete";
  })(ju || (ju = {}));
  class qu {
    constructor() {
      this.partials = /* @__PURE__ */ new Map();
    }
    push(e2, t2) {
      switch (e2.header.marker) {
        case Nu.Single:
          return this.frameFromSingle(e2, t2);
        case Nu.Start:
          return this.beginPartial(e2, t2);
        case Nu.Inter:
        case Nu.Final:
          return this.pushToPartial(e2);
      }
    }
    reset() {
      this.partials.clear();
    }
    peekOldestPartialFrameNumber() {
      const e2 = this.partials.keys().next();
      return e2.done ? null : e2.value;
    }
    frameFromSingle(e2, t2) {
      var n2;
      if (e2.header.marker !== Nu.Single) throw new Error("Depacketizer.frameFromSingle: packet.header.marker was not FrameMarker.Single, found ".concat(e2.header.marker, "."));
      const i2 = null !== (n2 = null == t2 ? void 0 : t2.maxPartialFrames) && void 0 !== n2 ? n2 : 1;
      if (this.partials.size >= i2) {
        const n3 = this.peekOldestPartialFrameNumber();
        if ("number" != typeof n3) throw new Error("Depacketizer.frameFromSingle: no oldest frame number found, but partials.size is ".concat(this.partials.size, "."));
        if (this.partials.delete(n3), null == t2 ? void 0 : t2.throwOnInterruption) throw Fu.interrupted(n3, e2.header.frameNumber.value);
        Uu.warn("Data track frame ".concat(n3, " was interrupted by single-packet frame ").concat(e2.header.frameNumber.value, ", dropping."));
      }
      return { payload: e2.payload, extensions: e2.header.extensions };
    }
    beginPartial(e2, t2) {
      var n2;
      if (e2.header.marker !== Nu.Start) throw new Error("Depacketizer.beginPartial: packet.header.marker was not FrameMarker.Start, found ".concat(e2.header.marker, "."));
      const i2 = e2.header.sequence, r2 = e2.header.frameNumber.value, o2 = { startSequence: i2, extensions: e2.header.extensions, payloads: /* @__PURE__ */ new Map([[i2.value, e2.payload]]) }, s2 = null !== (n2 = null == t2 ? void 0 : t2.maxPartialFrames) && void 0 !== n2 ? n2 : 1;
      for (; this.partials.size >= s2; ) {
        const e3 = this.peekOldestPartialFrameNumber();
        if ("number" != typeof e3) break;
        if (this.partials.delete(e3), null == t2 ? void 0 : t2.throwOnInterruption) throw Fu.interrupted(e3, r2);
        Uu.warn("Data track partials full (max ".concat(s2, "), evicted oldest frame ").concat(e3, " to make room for new frame ").concat(r2, "."));
      }
      return this.partials.set(r2, o2), null;
    }
    pushToPartial(e2) {
      if (e2.header.marker !== Nu.Inter && e2.header.marker !== Nu.Final) throw new Error("Depacketizer.pushToPartial: packet.header.marker was not FrameMarker.Inter or FrameMarker.Final, found ".concat(e2.header.marker, "."));
      const t2 = e2.header.frameNumber.value, n2 = this.partials.get(t2);
      if (!n2) throw this.partials.delete(t2), Fu.unknownFrame(t2);
      if (n2.payloads.size >= qu.MAX_BUFFER_PACKETS) throw this.partials.delete(t2), Fu.bufferFull(t2);
      return n2.payloads.has(e2.header.sequence.value) && Uu.warn("Data track frame ".concat(t2, " received duplicate packet for sequence ").concat(e2.header.sequence.value, ", so replacing with newly received packet.")), n2.payloads.set(e2.header.sequence.value, e2.payload), e2.header.marker === Nu.Final ? this.finalize(t2, n2, e2.header.sequence.value) : null;
    }
    finalize(e2, t2, n2) {
      const i2 = t2.payloads.size;
      let r2 = 0;
      for (const c2 of t2.payloads.values()) r2 += c2.length;
      const o2 = new Uint8Array(r2);
      let s2 = t2.startSequence.clone(), a2 = 0;
      for (; ; ) {
        const i3 = t2.payloads.get(s2.value);
        if (!i3) break;
        t2.payloads.delete(s2.value);
        const r3 = o2.length - a2;
        if (i3.length > r3) throw new Error("Depacketizer.finalize: Expected at least ".concat(i3.length, " more bytes left in the payload buffer, only got ").concat(r3, " bytes."));
        if (o2.set(i3, a2), a2 += i3.length, s2.value == n2) return this.partials.delete(e2), { payload: o2, extensions: t2.extensions };
        s2.increment();
      }
      throw this.partials.delete(e2), Fu.incomplete(e2, i2, n2 - t2.startSequence.value + 1);
    }
  }
  qu.MAX_BUFFER_PACKETS = 128, (function(e2) {
    e2[e2.Unpublished = 0] = "Unpublished", e2[e2.Timeout = 1] = "Timeout", e2[e2.Disconnected = 2] = "Disconnected", e2[e2.Cancelled = 4] = "Cancelled";
  })(Bu || (Bu = {}));
  class Vu extends Ho {
    constructor(e2, t2, n2) {
      super(22, e2, n2), this.name = "DataTrackSubscribeError", this.reason = t2, this.reasonName = Bu[t2];
    }
    static unpublished() {
      return new Vu("The track has been unpublished and is no longer available", Bu.Unpublished);
    }
    static timeout() {
      return new Vu("Request to subscribe to data track timed-out", Bu.Timeout);
    }
    static disconnected() {
      return new Vu("Cannot subscribe to data track when disconnected", Bu.Disconnected);
    }
    static cancelled() {
      return new Vu("Subscription to data track cancelled by caller", Bu.Cancelled);
    }
  }
  const Wu = dr(e.LoggerNames.DataTracks);
  class Hu {
    constructor(e2) {
      var t2, n2;
      const i2 = null !== e2.e2eeManager;
      if (e2.info.usesE2ee !== i2) throw new Error("IncomingDataTrackPipeline: DataTrackInfo.usesE2ee must match presence of decryptionProvider");
      const r2 = new qu();
      this.publisherIdentity = e2.publisherIdentity, this.e2eeManager = null !== (t2 = e2.e2eeManager) && void 0 !== t2 ? t2 : null, this.depacketizer = r2, this.options = null !== (n2 = e2.pipelineOptions) && void 0 !== n2 ? n2 : {};
    }
    updateE2eeManager(e2) {
      this.e2eeManager = e2;
    }
    setOptions(e2) {
      this.options = e2;
    }
    processPacket(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.depacketize(e2);
        if (!t2) return null;
        const n2 = yield this.decryptIfNeeded(t2);
        return n2 || null;
      }));
    }
    depacketize(e2) {
      let t2;
      try {
        t2 = this.depacketizer.push(e2, { throwOnInterruption: false, maxPartialFrames: this.options.maxPartialFrames });
      } catch (n2) {
        return Wu.warn("Data frame depacketize error: ".concat(n2)), null;
      }
      return t2;
    }
    decryptIfNeeded(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2;
        const i2 = this.e2eeManager;
        if (!i2) return e2;
        const r2 = null !== (n2 = null === (t2 = e2.extensions) || void 0 === t2 ? void 0 : t2.e2ee) && void 0 !== n2 ? n2 : null;
        if (!r2) return Wu.error("Missing E2EE meta"), null;
        let o2;
        try {
          o2 = yield i2.handleEncryptedData(e2.payload, r2.iv, this.publisherIdentity, r2.keyIndex);
        } catch (s2) {
          return Wu.error("Error decrypting packet: ".concat(s2)), null;
        }
        return e2.payload = o2.payload, e2;
      }));
    }
  }
  const Ku = dr(e.LoggerNames.DataTracks);
  class zu extends wr.EventEmitter {
    constructor(e2) {
      var t2;
      super(), this.descriptors = /* @__PURE__ */ new Map(), this.subscriptionHandles = /* @__PURE__ */ new Map(), this.e2eeManager = null !== (t2 = null == e2 ? void 0 : e2.e2eeManager) && void 0 !== t2 ? t2 : null;
    }
    updateE2eeManager(e2) {
      this.e2eeManager = e2;
      for (const t2 of this.descriptors.values()) "active" === t2.subscription.type && t2.subscription.pipeline.updateE2eeManager(e2);
    }
    setPipelineOptions(e2, t2) {
      const n2 = this.descriptors.get(e2);
      n2 ? (n2.pipelineOptions = t2, "active" === n2.subscription.type && n2.subscription.pipeline.setOptions(t2)) : Ku.warn("Unknown track ".concat(e2, ", cannot set pipeline options."));
    }
    openSubscriptionStream(e2, t2) {
      let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 16, i2 = null;
      const r2 = new La(), o2 = this.descriptors.get(e2), s2 = () => {
        null == t2 || t2.removeEventListener("abort", c2);
      }, a2 = () => {
        s2(), i2 ? o2 && this.descriptors.get(o2.info.sid) === o2 ? "active" === o2.subscription.type ? (o2.subscription.streamControllers.delete(i2), 0 === o2.subscription.streamControllers.size && this.unSubscribeRequest(o2.info.sid)) : Ku.warn("Subscription for track ".concat(e2, " is not active, skipping cancel...")) : Ku.warn("Unknown track ".concat(e2, ", skipping cancel...")) : Ku.warn("ReadableStream subscribed to ".concat(e2, " was not started."));
      }, c2 = () => {
        var e3;
        i2 && ("active" === (null == o2 ? void 0 : o2.subscription.type) && o2.subscription.streamControllers.delete(i2), i2.error(Vu.cancelled()), null === (e3 = r2.reject) || void 0 === e3 || e3.call(r2, Vu.cancelled()), a2());
      }, d2 = new ReadableStream({ start: (n3) => {
        i2 = n3, this.subscribeRequest(e2, t2).then((() => kr(this, void 0, void 0, (function* () {
          var i3, a3, d3;
          if (!o2 || this.descriptors.get(o2.info.sid) !== o2) {
            Ku.error("Unknown track ".concat(e2));
            const t3 = Vu.disconnected();
            return n3.error(t3), void (null === (i3 = r2.reject) || void 0 === i3 || i3.call(r2, t3));
          }
          if ("active" !== o2.subscription.type) {
            Ku.error("Subscription for track ".concat(e2, " is not active"));
            const t3 = Vu.disconnected();
            return n3.error(t3), void (null === (a3 = r2.reject) || void 0 === a3 || a3.call(r2, t3));
          }
          (null == t2 ? void 0 : t2.aborted) ? c2() : (null == t2 || t2.addEventListener("abort", c2), o2.subscription.streamControllers.set(n3, s2), null === (d3 = r2.resolve) || void 0 === d3 || d3.call(r2));
        })))).catch(((e3) => {
          var t3;
          n3.error(e3), null === (t3 = r2.reject) || void 0 === t3 || t3.call(r2, e3);
        }));
      }, cancel: () => {
        a2();
      } }, new CountQueuingStrategy({ highWaterMark: n2 }));
      return [d2, r2.promise];
    }
    subscribeRequest(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = this.descriptors.get(e2);
        if (!n2) throw new Error("Cannot subscribe to unknown track");
        const i2 = (t3, n3, i3) => kr(this, void 0, void 0, (function* () {
          if ("active" === t3.subscription.type) return;
          if ("pending" !== t3.subscription.type) throw new Error("Descriptor for track ".concat(e2, " is not pending, found ").concat(t3.subscription.type));
          const r2 = $c([n3, i3].filter(((e3) => void 0 !== e3))), o2 = new La();
          t3.subscription.completionFuture.promise.then((() => {
            var e3;
            return null === (e3 = o2.resolve) || void 0 === e3 ? void 0 : e3.call(o2);
          })).catch(((e3) => {
            var t4;
            return null === (t4 = o2.reject) || void 0 === t4 ? void 0 : t4.call(o2, e3);
          }));
          const s2 = () => {
            var e3;
            "pending" === t3.subscription.type && (t3.subscription.pendingRequestCount -= 1, (null == i3 ? void 0 : i3.aborted) || t3.subscription.pendingRequestCount <= 0 ? t3.subscription.cancel() : null === (e3 = o2.reject) || void 0 === e3 || e3.call(o2, Vu.cancelled()));
          };
          r2.aborted && s2(), r2.addEventListener("abort", s2), yield o2.promise, r2.removeEventListener("abort", s2);
        }));
        switch (n2.subscription.type) {
          case "none": {
            n2.subscription = { type: "pending", completionFuture: new La(), pendingRequestCount: 1, cancel: () => {
              var e3, t3;
              const i3 = n2.subscription;
              n2.subscription = { type: "none" }, this.emit("sfuUpdateSubscription", { sid: n2.info.sid, subscribe: false }), "pending" === i3.type && (null === (t3 = (e3 = i3.completionFuture).reject) || void 0 === t3 || t3.call(e3, r2.aborted ? Vu.timeout() : Vu.cancelled()));
            } }, this.emit("sfuUpdateSubscription", { sid: e2, subscribe: true });
            const r2 = ed(1e4);
            return void (yield i2(n2, t2, r2));
          }
          case "pending":
            return n2.subscription.pendingRequestCount += 1, void (yield i2(n2, t2));
          case "active":
            return;
        }
      }));
    }
    querySubscribed() {
      return kr(this, void 0, void 0, (function* () {
        return Array.from(this.descriptors.values()).filter(((e2) => "active" === e2.subscription.type)).map(((e2) => [e2.info, e2.publisherIdentity]));
      }));
    }
    unSubscribeRequest(e2) {
      var t2;
      const n2 = this.descriptors.get(e2);
      if (!n2) throw new Error("Cannot subscribe to unknown track");
      if ("active" !== n2.subscription.type) return void Ku.warn("Unexpected descriptor state in unSubscribeRequest, expected active, found ".concat(null === (t2 = n2.subscription) || void 0 === t2 ? void 0 : t2.type));
      this.closeStreamControllers(n2.subscription.streamControllers, e2);
      const i2 = n2.subscription;
      n2.subscription = { type: "none" }, this.subscriptionHandles.delete(i2.subcriptionHandle), this.emit("sfuUpdateSubscription", { sid: e2, subscribe: false });
    }
    closeStreamControllers(e2, t2) {
      for (const r2 of e2) {
        var n2 = j(r2, 2);
        const e3 = n2[0];
        (0, n2[1])();
        try {
          e3.close();
        } catch (i2) {
          Ku.warn("Failed to close readable stream for track ".concat(t2, ": ").concat(i2));
        }
      }
    }
    receiveSfuPublicationUpdates(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (0 === e2.size) return;
        const t2 = /* @__PURE__ */ new Map();
        for (const r2 of e2.entries()) {
          var n2 = j(r2, 2);
          const e3 = n2[0], i3 = n2[1], o2 = /* @__PURE__ */ new Set();
          for (const t3 of i3) o2.add(t3.sid), this.descriptors.has(t3.sid) || this.handleSidReassigned(e3, t3) || (yield this.handleTrackPublished(e3, t3));
          t2.set(e3, o2);
        }
        for (const e3 of t2.entries()) {
          var i2 = j(e3, 2);
          const t3 = i2[0], n3 = i2[1];
          let r2 = Array.from(this.descriptors.entries()).filter(((e4) => {
            let n4 = j(e4, 2);
            return n4[0], n4[1].publisherIdentity === t3;
          })).map(((e4) => j(e4, 1)[0])).filter(((e4) => !n3.has(e4)));
          for (const e4 of r2) this.handleTrackUnpublished(e4);
        }
      }));
    }
    queryPublications() {
      return kr(this, void 0, void 0, (function* () {
        return Array.from(this.descriptors.values()).map(((e2) => e2.info));
      }));
    }
    handleTrackPublished(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.descriptors.has(t2.sid)) return void Ku.error("Existing descriptor for track ".concat(t2.sid));
        let n2 = { info: t2, publisherIdentity: e2, subscription: { type: "none" }, pipelineOptions: {} };
        this.descriptors.set(n2.info.sid, n2);
        const i2 = new Au(n2.info, this, { publisherIdentity: e2 });
        this.emit("trackPublished", { track: i2 });
      }));
    }
    handleSidReassigned(e2, t2) {
      const n2 = Array.from(this.descriptors.entries()).find(((n3) => {
        let i3 = j(n3, 2);
        i3[0];
        let r3 = i3[1];
        return r3.publisherIdentity === e2 && r3.info.pubHandle === t2.pubHandle;
      }));
      if (!n2) return false;
      const i2 = j(n2, 2), r2 = i2[0], o2 = i2[1], s2 = o2.info, a2 = s2.name, c2 = s2.usesE2ee;
      if (a2 !== t2.name || c2 !== t2.usesE2ee) return Ku.warn("Info mismatch for ".concat(r2, ", treating as new publication")), false;
      const d2 = t2.sid;
      if (Ku.debug("SID reassigned: ".concat(r2, " -> ").concat(d2)), !this.descriptors.delete(r2)) return false;
      switch (o2.info.sid = d2, o2.subscription.type) {
        case "none":
          break;
        case "pending":
        case "active":
          this.emit("sfuUpdateSubscription", { sid: d2, subscribe: true });
      }
      return "active" === o2.subscription.type && this.subscriptionHandles.set(o2.subscription.subcriptionHandle, d2), this.descriptors.set(d2, o2), true;
    }
    handleTrackUnpublished(e2) {
      const t2 = this.descriptors.get(e2);
      t2 ? (this.descriptors.delete(e2), "active" === t2.subscription.type && (this.closeStreamControllers(t2.subscription.streamControllers, e2), this.subscriptionHandles.delete(t2.subscription.subcriptionHandle)), this.emit("trackUnpublished", { sid: e2, publisherIdentity: t2.publisherIdentity })) : Ku.error("Unknown track ".concat(e2));
    }
    receivedSfuSubscriberHandles(e2) {
      for (const n2 of e2.entries()) {
        var t2 = j(n2, 2);
        const e3 = t2[0], i2 = t2[1];
        this.registerSubscriberHandle(e3, i2);
      }
    }
    registerSubscriberHandle(e2, t2) {
      var n2, i2;
      const r2 = this.descriptors.get(t2);
      if (r2) switch (r2.subscription.type) {
        case "none":
          return void Ku.warn("No subscription for ".concat(t2));
        case "active":
          return this.subscriptionHandles.delete(r2.subscription.subcriptionHandle), r2.subscription.subcriptionHandle = e2, void this.subscriptionHandles.set(e2, t2);
        case "pending": {
          Ku.debug("data track subscription activated", { sid: t2, handle: e2 });
          const o2 = new Hu({ info: r2.info, publisherIdentity: r2.publisherIdentity, e2eeManager: this.e2eeManager, pipelineOptions: r2.pipelineOptions }), s2 = r2.subscription;
          r2.subscription = { type: "active", subcriptionHandle: e2, pipeline: o2, streamControllers: /* @__PURE__ */ new Map() }, this.subscriptionHandles.set(e2, t2), null === (i2 = (n2 = s2.completionFuture).resolve) || void 0 === i2 || i2.call(n2);
        }
      }
      else Ku.error("Unknown track ".concat(t2));
    }
    packetReceived(e2) {
      return kr(this, void 0, void 0, (function* () {
        let t2;
        try {
          t2 = j(xu.fromBinary(e2), 1)[0];
        } catch (o2) {
          return void Ku.error("Failed to deserialize packet: ".concat(o2));
        }
        const n2 = this.subscriptionHandles.get(t2.header.trackHandle);
        if (!n2) return void Ku.warn("Unknown subscriber handle ".concat(t2.header.trackHandle));
        const i2 = this.descriptors.get(n2);
        if (!i2) return void Ku.error("Missing descriptor for track ".concat(n2));
        if ("active" !== i2.subscription.type) return void Ku.warn("Received packet for track ".concat(n2, " without active subscription"));
        const r2 = yield i2.subscription.pipeline.processPacket(t2);
        if (r2) for (const e3 of i2.subscription.streamControllers.keys()) {
          if (null !== e3.desiredSize && e3.desiredSize <= 0) {
            Ku.warn("Cannot send frame to subscribers: readable stream is full (desiredSize is ".concat(e3.desiredSize, "). To increase this threshold, set a higher 'options.highWaterMark' when calling .subscribe()."));
            continue;
          }
          const t3 = Mu.lossyIntoFrame(r2);
          e3.enqueue(t3);
        }
      }));
    }
    resendSubscriptionUpdates() {
      for (const t2 of this.descriptors) {
        var e2 = j(t2, 2);
        const n2 = e2[0];
        "none" !== e2[1].subscription.type && this.emit("sfuUpdateSubscription", { sid: n2, subscribe: true });
      }
    }
    handleRemoteParticipantDisconnected(e2) {
      var t2, n2;
      for (const i2 of this.descriptors.values()) if (i2.publisherIdentity === e2) switch (i2.subscription.type) {
        case "none":
          break;
        case "pending":
          null === (n2 = (t2 = i2.subscription.completionFuture).reject) || void 0 === n2 || n2.call(t2, Vu.disconnected());
          break;
        case "active":
          this.unSubscribeRequest(i2.info.sid);
      }
    }
    reset() {
      var e2, t2;
      for (const n2 of this.descriptors.values()) this.emit("trackUnpublished", { sid: n2.info.sid, publisherIdentity: n2.publisherIdentity }), "pending" === n2.subscription.type && (null === (t2 = (e2 = n2.subscription.completionFuture).reject) || void 0 === t2 || t2.call(e2, Vu.disconnected())), "active" === n2.subscription.type && this.closeStreamControllers(n2.subscription.streamControllers, n2.info.sid);
      this.descriptors.clear(), this.subscriptionHandles.clear();
    }
  }
  class Gu extends Ho {
    constructor(e2, t2, n2) {
      super(19, e2, n2), this.name = "DataTrackPacketizerError", this.reason = t2, this.reasonName = Ju[t2];
    }
    static mtuTooShort() {
      return new Gu("MTU is too short to send frame", Ju.MtuTooShort);
    }
  }
  var Ju, Qu, Yu, Xu;
  !(function(e2) {
    e2[e2.MtuTooShort = 0] = "MtuTooShort";
  })(Ju || (Ju = {}));
  class Zu {
    constructor(e2, t2) {
      this.sequence = Vc.u16(0), this.frameNumber = Vc.u16(0), this.clock = Hc.rtpStartingNow(Wc.rtpRandom()), this.handle = e2, this.mtuSizeBytes = t2;
    }
    static computeFrameMarker(e2, t2) {
      return t2 <= 1 ? Nu.Single : 0 === e2 ? Nu.Start : e2 === t2 - 1 ? Nu.Final : Nu.Inter;
    }
    *packetize(e2, t2) {
      var n2;
      const i2 = this.frameNumber.getThenIncrement(), r2 = { marker: Nu.Inter, trackHandle: this.handle, sequence: Vc.u16(0), frameNumber: i2, timestamp: null !== (n2 = null == t2 ? void 0 : t2.now) && void 0 !== n2 ? n2 : this.clock.now(), extensions: e2.extensions }, o2 = new Lu(r2).toBinaryLengthBytes();
      if (o2 >= this.mtuSizeBytes) throw Gu.mtuTooShort();
      const s2 = this.mtuSizeBytes - o2, a2 = Math.ceil(e2.payload.byteLength / s2);
      for (let d2 = 0, l2 = 0; l2 < e2.payload.byteLength; d2 = (c2 = [d2 + 1, l2 + s2])[0], l2 = c2[1], c2) {
        var c2;
        const t3 = this.sequence.getThenIncrement(), n3 = new Lu(Object.assign(Object.assign({}, r2), { marker: Zu.computeFrameMarker(d2, a2), sequence: t3 })), i3 = Math.min(s2, e2.payload.byteLength - l2), o3 = new Uint8Array(e2.payload.buffer, e2.payload.byteOffset + l2, i3);
        yield new xu(n3, o3);
      }
    }
  }
  !(function(e2) {
    e2[e2.NotAllowed = 0] = "NotAllowed", e2[e2.DuplicateName = 1] = "DuplicateName", e2[e2.Timeout = 2] = "Timeout", e2[e2.LimitReached = 3] = "LimitReached", e2[e2.Disconnected = 4] = "Disconnected", e2[e2.Cancelled = 5] = "Cancelled", e2[e2.InvalidName = 6] = "InvalidName", e2[e2.Unknown = 7] = "Unknown";
  })(Qu || (Qu = {}));
  class $u extends Ho {
    constructor(e2, t2, n2) {
      super(21, e2, n2), this.name = "DataTrackPublishError", this.reason = t2, this.reasonName = Qu[t2], this.rawMessage = null == n2 ? void 0 : n2.rawMessage;
    }
    static notAllowed(e2) {
      return new $u("Data track publishing unauthorized", Qu.NotAllowed, { rawMessage: e2 });
    }
    static duplicateName(e2) {
      return new $u("Track name already taken", Qu.DuplicateName, { rawMessage: e2 });
    }
    static invalidName(e2) {
      return new $u("Track name is invalid", Qu.InvalidName, { rawMessage: e2 });
    }
    static timeout() {
      return new $u("Publish data track timed-out. Does the LiveKit server support data tracks?", Qu.Timeout);
    }
    static limitReached(e2) {
      return new $u("Data track publication limit reached", Qu.LimitReached, { rawMessage: e2 });
    }
    static unknown(e2, t2) {
      return new $u("Received RequestResponse for publishDataTrack, but reason was unrecognised (".concat(e2, ", ").concat(t2, ")"), Qu.Unknown);
    }
    static disconnected() {
      return new $u("Room disconnected", Qu.Disconnected);
    }
    static cancelled() {
      return new $u("Publish data track cancelled by caller", Qu.Cancelled);
    }
  }
  !(function(e2) {
    e2[e2.TrackUnpublished = 0] = "TrackUnpublished", e2[e2.Dropped = 1] = "Dropped";
  })(Yu || (Yu = {}));
  class eh extends Ho {
    constructor(e2, t2, n2) {
      super(22, e2, n2), this.name = "DataTrackPushFrameError", this.reason = t2, this.reasonName = Yu[t2];
    }
    static trackUnpublished() {
      return new eh("Track is no longer published", Yu.TrackUnpublished);
    }
    static dropped(e2) {
      return new eh("Frame was dropped", Yu.Dropped, { cause: e2 });
    }
  }
  !(function(e2) {
    e2[e2.Packetizer = 0] = "Packetizer", e2[e2.Encryption = 1] = "Encryption";
  })(Xu || (Xu = {}));
  class th extends Ho {
    constructor(e2, t2, n2) {
      super(21, e2, n2), this.name = "DataTrackOutgoingPipelineError", this.reason = t2, this.reasonName = Xu[t2];
    }
    static packetizer(e2) {
      return new th("Error packetizing frame", Xu.Packetizer, { cause: e2 });
    }
    static encryption(e2) {
      return new th("Error encrypting frame", Xu.Encryption, { cause: e2 });
    }
  }
  class nh {
    constructor(t2, n2) {
      this.trackSymbol = Du, this.isLocal = true, this.typeSymbol = Ou, this.handle = null, this.log = ar, this.flushedFuture = new La(), this.isFlushed = true, this.handleManagerReset = () => {
        var e2, t3;
        null === (t3 = (e2 = this.flushedFuture).resolve) || void 0 === t3 || t3.call(e2), this.manager.off("packetsFlushedChange", this.handleManagerPacketsFlushedChange), this.manager.off("reset", this.handleManagerReset);
      }, this.handleManagerPacketsFlushedChange = (e2) => {
        var t3, n3;
        this.isFlushed = e2.isFlushed, e2.isFlushed && (null === (n3 = (t3 = this.flushedFuture).resolve) || void 0 === n3 || n3.call(t3), this.flushedFuture = new La());
      }, this.options = t2, this.manager = n2, this.log = dr(e.LoggerNames.DataTracks), this.manager.on("packetsFlushedChange", this.handleManagerPacketsFlushedChange), this.manager.on("reset", this.handleManagerReset);
    }
    static withExplicitHandle(e2, t2, n2) {
      const i2 = new nh(e2, t2);
      return i2.handle = n2, i2;
    }
    get info() {
      const e2 = this.descriptor;
      return "active" === (null == e2 ? void 0 : e2.type) ? e2.info : void 0;
    }
    get descriptor() {
      return this.handle ? this.manager.getDescriptor(this.handle) : null;
    }
    publish(e2) {
      return kr(this, void 0, void 0, (function* () {
        try {
          this.handle = yield this.manager.publishRequest(this.options, e2);
        } catch (t2) {
          throw t2;
        }
      }));
    }
    isPublished() {
      var e2;
      return "active" === (null === (e2 = this.descriptor) || void 0 === e2 ? void 0 : e2.type) && "unpublished" !== this.descriptor.publishState;
    }
    tryPush(e2) {
      if (!this.handle) throw eh.trackUnpublished();
      const t2 = Mu.from(e2);
      try {
        return this.manager.tryProcessAndSend(this.handle, t2);
      } catch (n2) {
        throw n2;
      }
    }
    flush() {
      return kr(this, void 0, void 0, (function* () {
        if (!this.isFlushed) return this.flushedFuture.promise;
      }));
    }
    unpublish() {
      return kr(this, void 0, void 0, (function* () {
        if (this.handle) try {
          yield this.manager.unpublishRequest(this.handle);
        } catch (e2) {
          throw e2;
        }
        else ar.warn('Data track "'.concat(this.options.name, '" is not published, so unpublishing has no effect.'));
      }));
    }
  }
  class ih {
    constructor(e2) {
      this.e2eeManager = e2.e2eeManager, this.packetizer = new Zu(e2.info.pubHandle, ih.TRANSPORT_MTU_BYTES);
    }
    updateE2eeManager(e2) {
      this.e2eeManager = e2;
    }
    processFrame(e2) {
      return Tr(this, arguments, (function* () {
        const t2 = yield br(this.encryptIfNeeded(e2));
        try {
          yield br(yield* __yieldStar((function(e3) {
            var t3, n2;
            return t3 = {}, i2("next"), i2("throw", (function(e4) {
              throw e4;
            })), i2("return"), t3[Symbol.iterator] = function() {
              return this;
            }, t3;
            function i2(i3, r2) {
              t3[i3] = e3[i3] ? function(t4) {
                return (n2 = !n2) ? { value: br(e3[i3](t4)), done: false } : r2 ? r2(t4) : t4;
              } : r2;
            }
          })(Sr(this.packetizer.packetize(t2)))));
        } catch (n2) {
          if (n2 instanceof Gu) throw th.packetizer(n2);
          throw n2;
        }
      }));
    }
    encryptIfNeeded(e2) {
      return kr(this, void 0, void 0, (function* () {
        if (!this.e2eeManager) return e2;
        let t2;
        try {
          t2 = yield this.e2eeManager.encryptData(e2.payload);
        } catch (n2) {
          throw th.encryption(n2);
        }
        return e2.payload = t2.payload, e2.extensions.e2ee = new Iu(t2.keyIndex, t2.iv), e2;
      }));
    }
  }
  ih.TRANSPORT_MTU_BYTES = 16e3;
  const rh = dr(e.LoggerNames.DataTracks), oh = { pending: () => ({ type: "pending", completionFuture: new La() }), active: (e2, t2) => ({ type: "active", info: e2, publishState: "published", pipeline: new ih({ info: e2, e2eeManager: t2 }), unpublishingFuture: new La() }) };
  class sh extends wr.EventEmitter {
    constructor(e2) {
      var t2;
      super(), this.handleAllocator = new Qc(), this.descriptors = /* @__PURE__ */ new Map(), this.inFlightPacketCounter = /* @__PURE__ */ new Map(), this.e2eeManager = null !== (t2 = null == e2 ? void 0 : e2.e2eeManager) && void 0 !== t2 ? t2 : null;
    }
    static withDescriptors(e2) {
      const t2 = new sh();
      return t2.descriptors = e2, t2;
    }
    updateE2eeManager(e2) {
      this.e2eeManager = e2;
      for (const t2 of this.descriptors.values()) "active" === t2.type && t2.pipeline.updateE2eeManager(e2);
    }
    getDescriptor(e2) {
      var t2;
      return null !== (t2 = this.descriptors.get(e2)) && void 0 !== t2 ? t2 : null;
    }
    tryProcessAndSend(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2, o2, s2;
        const a2 = this.getDescriptor(e2);
        if ("active" !== (null == a2 ? void 0 : a2.type)) throw eh.trackUnpublished();
        if ("unpublished" === a2.publishState) throw eh.trackUnpublished();
        if ("republishing" === a2.publishState) throw eh.dropped("Data track republishing");
        try {
          try {
            for (var c2, d2 = true, l2 = Sr(a2.pipeline.processFrame(t2)); !(n2 = (c2 = yield l2.next()).done); d2 = true) {
              o2 = c2.value, d2 = false;
              const t3 = o2, n3 = null !== (s2 = this.inFlightPacketCounter.get(e2)) && void 0 !== s2 ? s2 : 0;
              this.inFlightPacketCounter.set(e2, n3 + 1), 0 === n3 && this.emit("packetsFlushedChange", { handle: e2, isFlushed: false }), this.emit("packetAvailable", { handle: e2, bytes: t3.toBinary() });
            }
          } catch (u2) {
            i2 = { error: u2 };
          } finally {
            try {
              d2 || n2 || !(r2 = l2.return) || (yield r2.call(l2));
            } finally {
              if (i2) throw i2.error;
            }
          }
        } catch (h2) {
          throw eh.dropped(h2);
        }
      }));
    }
    handlePacketSendComplete(e2) {
      var t2;
      let n2 = (null !== (t2 = this.inFlightPacketCounter.get(e2)) && void 0 !== t2 ? t2 : 0) - 1;
      n2 < 0 && (rh.warn("OutgoingDataTrackManager.handlePacketSendComplete: inFlightPacketCounter was decremented below 0 (got ".concat(this.inFlightPacketCounter, " - resetting to 0. Were more packets send than were emitted?")), n2 = 0), this.inFlightPacketCounter.set(e2, n2), 0 === n2 && this.emit("packetsFlushedChange", { handle: e2, isFlushed: true });
    }
    publishRequest(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = this.handleAllocator.get();
        if (!n2) throw $u.limitReached();
        const i2 = ed(1e4), r2 = t2 ? $c([t2, i2]) : i2;
        if (this.descriptors.has(n2)) throw new Error("Descriptor for handle already exists");
        const o2 = oh.pending();
        this.descriptors.set(n2, o2);
        const s2 = () => {
          var e3, t3;
          const r3 = this.descriptors.get(n2);
          r3 ? (this.descriptors.delete(n2), this.emit("sfuUnpublishRequest", { handle: n2 }), "pending" === r3.type && (null === (t3 = (e3 = r3.completionFuture).reject) || void 0 === t3 || t3.call(e3, i2.aborted ? $u.timeout() : $u.cancelled()))) : rh.warn("No descriptor for ".concat(n2));
        };
        return r2.aborted ? (s2(), o2.completionFuture.promise.then((() => n2))) : (r2.addEventListener("abort", s2), this.emit("sfuPublishRequest", { handle: n2, name: e2.name, usesE2ee: null !== this.e2eeManager }), yield o2.completionFuture.promise, r2.removeEventListener("abort", s2), this.emit("trackPublished", { track: nh.withExplicitHandle(e2, this, n2) }), n2);
      }));
    }
    queryPublished() {
      return Array.from(this.descriptors.values()).filter(((e2) => "active" === e2.type)).map(((e2) => e2.info));
    }
    unpublishRequest(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.descriptors.get(e2);
        t2 ? "active" === t2.type ? (this.emit("sfuUnpublishRequest", { handle: e2 }), yield t2.unpublishingFuture.promise, this.inFlightPacketCounter.delete(e2), this.emit("trackUnpublished", { sid: t2.info.sid })) : rh.warn("Track ".concat(e2, " not active")) : rh.warn("No descriptor for ".concat(e2));
      }));
    }
    receivedSfuPublishResponse(e2, t2) {
      var n2, i2, r2, o2;
      const s2 = this.descriptors.get(e2);
      if (s2) switch (this.descriptors.delete(e2), s2.type) {
        case "pending":
          if ("ok" === t2.type) {
            const r3 = t2.data;
            rh.debug("SFU accepted publish request for handle ".concat(e2), { sid: r3.sid });
            const o3 = r3.usesE2ee ? this.e2eeManager : null;
            this.descriptors.set(r3.pubHandle, oh.active(r3, o3)), null === (i2 = (n2 = s2.completionFuture).resolve) || void 0 === i2 || i2.call(n2);
          } else rh.debug("SFU rejected publish request for handle ".concat(e2), { error: t2.error }), null === (o2 = (r2 = s2.completionFuture).reject) || void 0 === o2 || o2.call(r2, t2.error);
          return;
        case "active":
          if ("republishing" !== s2.publishState) return void rh.warn("Track ".concat(e2, " already active"));
          if ("error" === t2.type) return void rh.warn("Republish failed for track ".concat(e2));
          rh.debug("Track ".concat(e2, " republished")), s2.info.sid = t2.data.sid, s2.publishState = "published", this.descriptors.set(s2.info.pubHandle, s2);
      }
      else rh.warn("No descriptor for ".concat(e2));
    }
    receivedSfuUnpublishResponse(e2) {
      var t2, n2;
      const i2 = this.descriptors.get(e2);
      i2 ? (this.descriptors.delete(e2), "active" === i2.type ? (i2.publishState = "unpublished", null === (n2 = (t2 = i2.unpublishingFuture).resolve) || void 0 === n2 || n2.call(t2)) : rh.warn("Track ".concat(e2, " not active"))) : rh.warn("No descriptor for ".concat(e2));
    }
    sfuWillRepublishTracks() {
      var e2, t2;
      for (const i2 of this.descriptors.entries()) {
        var n2 = j(i2, 2);
        const r2 = n2[0], o2 = n2[1];
        switch (o2.type) {
          case "pending":
            this.descriptors.delete(r2), null === (t2 = (e2 = o2.completionFuture).reject) || void 0 === t2 || t2.call(e2, $u.disconnected());
            break;
          case "active":
            o2.publishState = "republishing", this.emit("sfuPublishRequest", { handle: o2.info.pubHandle, name: o2.info.name, usesE2ee: o2.info.usesE2ee });
        }
      }
    }
    reset() {
      return kr(this, void 0, void 0, (function* () {
        var e2, t2, n2, i2;
        this.handleAllocator.reset();
        for (const r2 of this.descriptors.values()) switch (r2.type) {
          case "pending":
            null === (t2 = (e2 = r2.completionFuture).reject) || void 0 === t2 || t2.call(e2, $u.disconnected());
            break;
          case "active":
            null === (i2 = (n2 = r2.unpublishingFuture).resolve) || void 0 === i2 || i2.call(n2), yield this.unpublishRequest(r2.info.pubHandle);
        }
        this.descriptors.clear(), this.inFlightPacketCounter.clear(), this.emit("reset");
      }));
    }
  }
  class ah extends Error {
    constructor(e2, t2, n2, i2) {
      super(t2), this.code = e2, this.message = hh(t2, ah.MAX_MESSAGE_BYTES), this.data = n2 ? hh(n2, ah.MAX_DATA_BYTES) : void 0, void 0 !== (null == i2 ? void 0 : i2.cause) && (this.cause = null == i2 ? void 0 : i2.cause);
    }
    static fromProto(e2) {
      return new ah(e2.code, e2.message, e2.data);
    }
    toProto() {
      return new Gt({ code: this.code, message: this.message, data: this.data });
    }
    static builtIn(e2, t2, n2) {
      return new ah(ah.ErrorCode[e2], ah.ErrorMessage[e2], t2, n2);
    }
  }
  ah.MAX_MESSAGE_BYTES = 256, ah.MAX_DATA_BYTES = 15360, ah.ErrorCode = { APPLICATION_ERROR: 1500, CONNECTION_TIMEOUT: 1501, RESPONSE_TIMEOUT: 1502, RECIPIENT_DISCONNECTED: 1503, RESPONSE_PAYLOAD_TOO_LARGE: 1504, SEND_FAILED: 1505, UNSUPPORTED_METHOD: 1400, RECIPIENT_NOT_FOUND: 1401, REQUEST_PAYLOAD_TOO_LARGE: 1402, UNSUPPORTED_SERVER: 1403, UNSUPPORTED_VERSION: 1404 }, ah.ErrorMessage = { APPLICATION_ERROR: "Application error in method handler", CONNECTION_TIMEOUT: "Connection timeout", RESPONSE_TIMEOUT: "Response timeout", RECIPIENT_DISCONNECTED: "Recipient disconnected", RESPONSE_PAYLOAD_TOO_LARGE: "Response payload too large", SEND_FAILED: "Failed to send", UNSUPPORTED_METHOD: "Method not supported at destination", RECIPIENT_NOT_FOUND: "Recipient not found", REQUEST_PAYLOAD_TOO_LARGE: "Request payload too large", UNSUPPORTED_SERVER: "RPC not supported by server", UNSUPPORTED_VERSION: "Unsupported RPC version" };
  const ch = "lk.rpc_request", dh = "lk.rpc_response";
  var lh;
  !(function(e2) {
    e2.RPC_REQUEST_ID = "lk.rpc_request_id", e2.RPC_REQUEST_METHOD = "lk.rpc_request_method", e2.RPC_REQUEST_RESPONSE_TIMEOUT_MS = "lk.rpc_request_response_timeout_ms", e2.RPC_REQUEST_VERSION = "lk.rpc_request_version";
  })(lh || (lh = {}));
  function uh(e2) {
    return new TextEncoder().encode(e2).length;
  }
  function hh(e2, t2) {
    if (uh(e2) <= t2) return e2;
    let n2 = 0, i2 = e2.length;
    const r2 = new TextEncoder();
    for (; n2 < i2; ) {
      const o3 = Math.floor((n2 + i2 + 1) / 2);
      r2.encode(e2.slice(0, o3)).length <= t2 ? n2 = o3 : i2 = o3 - 1;
    }
    const o2 = n2 > 0 ? e2.charCodeAt(n2 - 1) : 0;
    return o2 >= 55296 && o2 <= 56319 && (n2 -= 1), e2.slice(0, n2);
  }
  class ph extends wr.EventEmitter {
    constructor(e2, t2, n2, i2) {
      super(), this.pendingAcks = /* @__PURE__ */ new Map(), this.pendingResponses = /* @__PURE__ */ new Map(), this.log = e2, this.outgoingDataStreamManager = t2, this.getRemoteParticipantClientProtocol = n2, this.getServerVersion = i2;
    }
    performRpc(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let i2 = e3.destinationIdentity, r2 = e3.method, o2 = e3.payload, s2 = e3.responseTimeout, a2 = void 0 === s2 ? 15e3 : s2;
        return (function* () {
          const e4 = t2.getRemoteParticipantClientProtocol(i2);
          if (uh(o2) > 15360 && e4 < 1) throw ah.builtIn("REQUEST_PAYLOAD_TOO_LARGE");
          const s3 = t2.getServerVersion();
          if (s3 && ba(s3, "1.8.0") < 0) throw ah.builtIn("UNSUPPORTED_SERVER");
          const c2 = Math.max(a2, 8e3), d2 = crypto.randomUUID(), l2 = new La();
          let u2 = null;
          const h2 = setTimeout((() => {
            var e5;
            t2.pendingAcks.delete(d2), null === (e5 = l2.reject) || void 0 === e5 || e5.call(l2, ah.builtIn("CONNECTION_TIMEOUT")), t2.pendingResponses.delete(d2), null !== u2 && clearTimeout(u2);
          }), 7e3);
          t2.pendingAcks.set(d2, { resolve: () => {
            clearTimeout(h2);
          }, participantIdentity: i2 }), t2.pendingResponses.set(d2, { completionFuture: l2, participantIdentity: i2 });
          const p2 = l2.promise.finally((() => {
            null !== u2 && clearTimeout(u2), t2.pendingAcks.has(d2) && (t2.log.warn("RPC response received before ack", d2), t2.pendingAcks.delete(d2), clearTimeout(h2));
          }));
          p2.catch((() => {
          }));
          try {
            yield t2.publishRpcRequest(i2, d2, r2, o2, c2, e4);
          } catch (n2) {
            throw clearTimeout(h2), t2.pendingAcks.delete(d2), t2.pendingResponses.delete(d2), n2;
          }
          return t2.pendingResponses.has(d2) && (u2 = setTimeout((() => {
            var e5;
            t2.pendingResponses.delete(d2), null === (e5 = l2.reject) || void 0 === e5 || e5.call(l2, ah.builtIn("RESPONSE_TIMEOUT"));
          }), a2)), [d2, p2];
        })();
      }));
    }
    publishRpcRequest(e2, t2, n2, i2, r2, o2) {
      return kr(this, void 0, void 0, (function* () {
        o2 >= 1 ? yield this.outgoingDataStreamManager.sendText(i2, { topic: ch, destinationIdentities: [e2], attributes: { [lh.RPC_REQUEST_ID]: t2, [lh.RPC_REQUEST_METHOD]: n2, [lh.RPC_REQUEST_RESPONSE_TIMEOUT_MS]: "".concat(r2), [lh.RPC_REQUEST_VERSION]: "".concat(2) } }) : this.emit("sendDataPacket", { packet: new At({ destinationIdentities: [e2], kind: Lt.RELIABLE, value: { case: "rpcRequest", value: new Ht({ id: t2, method: n2, payload: i2, responseTimeoutMs: r2, version: 1 }) } }) });
      }));
    }
    handleIncomingDataStream(e2, t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        const r2 = i2[lh.RPC_REQUEST_ID];
        if (!r2) return void this.log.warn("RPC data stream malformed: ".concat(lh.RPC_REQUEST_ID, " not set."));
        const o2 = this.pendingResponses.get(r2);
        if (o2 && o2.participantIdentity !== t2) return void this.log.warn("RPC response stream for ".concat(r2, " arrived from unexpected sender ").concat(t2, ", expected ").concat(o2.participantIdentity, ". Ignoring."));
        let s2;
        try {
          s2 = yield e2.readAll();
        } catch (n2) {
          return this.log.warn("Error reading RPC response payload: ".concat(n2)), void this.handleIncomingRpcResponseFailure(r2, ah.builtIn("APPLICATION_ERROR", "Error reading RPC response payload", { cause: n2 }));
        }
        this.handleIncomingRpcResponseSuccess(r2, s2);
      }));
    }
    handleIncomingRpcResponseSuccess(e2, t2) {
      var n2, i2;
      const r2 = this.pendingResponses.get(e2);
      r2 ? (null === (i2 = (n2 = r2.completionFuture).resolve) || void 0 === i2 || i2.call(n2, t2), this.pendingResponses.delete(e2)) : this.log.error("Response received for unexpected RPC request", e2);
    }
    handleIncomingRpcResponseFailure(e2, t2) {
      var n2, i2;
      const r2 = this.pendingResponses.get(e2);
      r2 ? (null === (i2 = (n2 = r2.completionFuture).reject) || void 0 === i2 || i2.call(n2, t2), this.pendingResponses.delete(e2)) : this.log.error("Response received for unexpected RPC request", e2);
    }
    handleIncomingRpcAck(e2) {
      const t2 = this.pendingAcks.get(e2);
      t2 ? (t2.resolve(), this.pendingAcks.delete(e2)) : this.log.error("Ack received for unexpected RPC request: ".concat(e2));
    }
    handleParticipantDisconnected(e2) {
      var t2;
      for (const o2 of this.pendingAcks) {
        var n2 = j(o2, 2);
        const t3 = n2[0];
        n2[1].participantIdentity === e2 && this.pendingAcks.delete(t3);
      }
      for (const o2 of this.pendingResponses) {
        var i2 = j(o2, 2);
        const n3 = i2[0];
        var r2 = i2[1];
        const s2 = r2.participantIdentity, a2 = r2.completionFuture;
        s2 === e2 && (null === (t2 = a2.reject) || void 0 === t2 || t2.call(a2, ah.builtIn("RECIPIENT_DISCONNECTED")), this.pendingResponses.delete(n3));
      }
    }
  }
  class mh extends wr.EventEmitter {
    constructor(e2, t2, n2) {
      super(), this.rpcHandlers = /* @__PURE__ */ new Map(), this.log = e2, this.outgoingDataStreamManager = t2, this.getRemoteParticipantClientProtocol = n2;
    }
    registerRpcMethod(e2, t2) {
      if (this.rpcHandlers.has(e2)) throw Error("RPC handler already registered for method ".concat(e2, ", unregisterRpcMethod before trying to register again"));
      this.rpcHandlers.set(e2, t2);
    }
    unregisterRpcMethod(e2) {
      this.rpcHandlers.delete(e2);
    }
    handleIncomingRpcRequest(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2;
        if (this.publishRpcAck(e2, t2.id), 1 !== t2.version) return void this.publishRpcResponsePacket(e2, t2.id, null, ah.builtIn("UNSUPPORTED_VERSION"));
        const i2 = this.rpcHandlers.get(t2.method);
        if (!i2) return void this.publishRpcResponsePacket(e2, t2.id, null, ah.builtIn("UNSUPPORTED_METHOD"));
        let r2;
        try {
          r2 = yield i2({ requestId: t2.id, callerIdentity: e2, payload: t2.payload, responseTimeout: t2.responseTimeoutMs });
        } catch (o2) {
          let i3;
          return o2 instanceof ah ? i3 = o2 : (this.log.warn("Uncaught error returned by RPC handler for ".concat(t2.method, ". Returning APPLICATION_ERROR instead."), o2), i3 = ah.builtIn("APPLICATION_ERROR", "Uncaught error: ".concat(null !== (n2 = null == o2 ? void 0 : o2.message) && void 0 !== n2 ? n2 : o2), { cause: o2 })), void this.publishRpcResponsePacket(e2, t2.id, null, i3);
        }
        yield this.publishRpcResponse(e2, t2.id, null != r2 ? r2 : "");
      }));
    }
    handleIncomingDataStream(e2, t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        const r2 = i2[lh.RPC_REQUEST_ID], o2 = i2[lh.RPC_REQUEST_METHOD], s2 = parseInt(i2[lh.RPC_REQUEST_RESPONSE_TIMEOUT_MS], 10), a2 = parseInt(i2[lh.RPC_REQUEST_VERSION], 10);
        if (!r2 || !o2 || Number.isNaN(s2) || Number.isNaN(a2)) return this.log.warn("RPC data stream malformed: ".concat(lh.RPC_REQUEST_ID, " / ").concat(lh.RPC_REQUEST_METHOD, " / ").concat(lh.RPC_REQUEST_RESPONSE_TIMEOUT_MS, " / ").concat(lh.RPC_REQUEST_VERSION, " not set.")), void this.publishRpcResponsePacket(t2, r2, null, ah.builtIn("APPLICATION_ERROR", "RPC data stream malformed"));
        if (this.publishRpcAck(t2, r2), 2 !== a2) return void this.publishRpcResponsePacket(t2, r2, null, ah.builtIn("UNSUPPORTED_VERSION"));
        let c2;
        try {
          c2 = yield e2.readAll();
        } catch (n2) {
          return this.log.warn("Error reading RPC request payload: ".concat(n2)), void this.publishRpcResponsePacket(t2, r2, null, ah.builtIn("APPLICATION_ERROR", "Error reading RPC request payload", { cause: n2 }));
        }
        const d2 = this.rpcHandlers.get(o2);
        if (!d2) return void this.publishRpcResponsePacket(t2, r2, null, ah.builtIn("UNSUPPORTED_METHOD"));
        let l2;
        try {
          l2 = yield d2({ requestId: r2, callerIdentity: t2, payload: c2, responseTimeout: s2 });
        } catch (u2) {
          let e3;
          return u2 instanceof ah ? e3 = u2 : (this.log.warn("Uncaught error returned by RPC handler for ".concat(o2, ". Returning APPLICATION_ERROR instead."), u2), e3 = ah.builtIn("APPLICATION_ERROR")), void this.publishRpcResponsePacket(t2, r2, null, e3);
        }
        yield this.publishRpcResponse(t2, r2, null != l2 ? l2 : "");
      }));
    }
    publishRpcAck(e2, t2) {
      this.emit("sendDataPacket", { packet: new At({ destinationIdentities: [e2], kind: Lt.RELIABLE, value: { case: "rpcAck", value: new Kt({ requestId: t2 }) } }) });
    }
    publishRpcResponsePacket(e2, t2, n2, i2) {
      this.emit("sendDataPacket", { packet: new At({ destinationIdentities: [e2], kind: Lt.RELIABLE, value: { case: "rpcResponse", value: new zt({ requestId: t2, value: i2 ? { case: "error", value: i2.toProto() } : { case: "payload", value: null != n2 ? n2 : "" } }) } }) });
    }
    publishRpcResponse(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.getRemoteParticipantClientProtocol(e2) >= 1) return void (yield this.outgoingDataStreamManager.sendText(n2, { topic: dh, destinationIdentities: [e2], attributes: { [lh.RPC_REQUEST_ID]: t2 } }));
        if (uh(n2) > 15360) return this.log.warn("RPC Response payload too large for request ".concat(t2, ". To send larger responses, consider updating the sending client.")), void this.publishRpcResponsePacket(e2, t2, null, ah.builtIn("RESPONSE_PAYLOAD_TOO_LARGE"));
        this.publishRpcResponsePacket(e2, t2, n2, null);
      }));
    }
  }
  class gh extends Ic {
    constructor(e2, t2, n2, i2, r2, o2) {
      super(e2, t2, Ws.Kind.Audio, n2, o2), this.connectedNodes = [], this.monitorReceiver = () => kr(this, void 0, void 0, (function* () {
        if (!this.receiver) return void (this._currentBitrate = 0);
        const e3 = yield this.getReceiverStats();
        e3 && this.prevStats && this.receiver && (this._currentBitrate = Pc(e3, this.prevStats)), this.prevStats = e3;
      })), this.audioContext = i2, this.webAudioPluginNodes = [], r2 && (this.sinkId = r2.deviceId);
    }
    setVolume(e2) {
      var t2;
      if (this.audioContext) null === (t2 = this.gainNode) || void 0 === t2 || t2.gain.setTargetAtTime(e2, 0, 0.1);
      else for (const n2 of this.attachedElements) n2.volume = e2;
      ma() && this._mediaStreamTrack._setVolume(e2), this.elementVolume = e2;
    }
    getVolume() {
      if (void 0 !== this.elementVolume) return this.elementVolume;
      if (ma()) return 1;
      let e2 = 0;
      return this.attachedElements.forEach(((t2) => {
        t2.volume > e2 && (e2 = t2.volume);
      })), e2;
    }
    setSinkId(e2) {
      return kr(this, void 0, void 0, (function* () {
        this.sinkId = e2, yield Promise.all(this.attachedElements.map(((t2) => {
          if (ia(t2)) return t2.setSinkId(e2);
        })));
      }));
    }
    attach(e2) {
      const t2 = !this.sourceNode;
      return e2 ? super.attach(e2) : e2 = super.attach(), this.sinkId && ia(e2) && e2.setSinkId(this.sinkId).catch(((e3) => {
        this.log.error("Failed to set sink id on remote audio track", e3, this.logContext);
      })), this.audioContext && (e2.volume = 0, e2.muted = true, t2 && (this.log.debug("using audio context mapping", this.logContext), this.connectWebAudio(this.audioContext, e2))), void 0 !== this.elementVolume && this.setVolume(this.elementVolume), e2;
    }
    detach(e2) {
      let t2;
      return e2 ? (t2 = super.detach(e2), this.audioContext && (this.attachedElements.length > 0 ? this.connectWebAudio(this.audioContext, this.attachedElements[0]) : this.disconnectWebAudio())) : (t2 = super.detach(), this.disconnectWebAudio()), t2;
    }
    setAudioContext(e2) {
      var t2;
      if (this.audioContext !== e2) if (this.audioContext = e2, e2) {
        for (const e3 of this.attachedElements) e3.volume = 0, e3.muted = true;
        this.attachedElements.length > 0 && this.connectWebAudio(e2, this.attachedElements[0]);
      } else {
        this.disconnectWebAudio();
        for (const e3 of this.attachedElements) e3.muted = false, e3.volume = null !== (t2 = this.elementVolume) && void 0 !== t2 ? t2 : 1;
      }
    }
    setWebAudioPlugins(e2) {
      this.webAudioPluginNodes = e2, this.attachedElements.length > 0 && this.audioContext && this.connectWebAudio(this.audioContext, this.attachedElements[0]);
    }
    connectWebAudio(t2, n2) {
      this.disconnectWebAudio(), this.sourceNode = t2.createMediaStreamSource(n2.srcObject);
      let i2 = this.sourceNode;
      this.connectedNodes = [this.sourceNode], this.webAudioPluginNodes.forEach(((e2) => {
        i2.connect(e2), i2 = e2, this.connectedNodes.push(e2);
      })), this.gainNode = t2.createGain(), i2.connect(this.gainNode), this.connectedNodes.push(this.gainNode), this.gainNode.connect(t2.destination), void 0 !== this.elementVolume && this.gainNode.gain.setTargetAtTime(this.elementVolume, 0, 0.1), "running" !== t2.state && t2.resume().then((() => {
        "running" !== t2.state && this.emit(e.TrackEvent.AudioPlaybackFailed, new Error("Audio Context couldn't be started automatically"));
      })).catch(((t3) => {
        this.emit(e.TrackEvent.AudioPlaybackFailed, t3);
      }));
    }
    disconnectWebAudio() {
      var e2, t2;
      for (let i2 = 0; i2 < this.connectedNodes.length - 1; i2 += 1) try {
        this.connectedNodes[i2].disconnect(this.connectedNodes[i2 + 1]);
      } catch (n2) {
      }
      this.connectedNodes = [], null === (e2 = this.gainNode) || void 0 === e2 || e2.disconnect(), null === (t2 = this.sourceNode) || void 0 === t2 || t2.disconnect(), this.gainNode = void 0, this.sourceNode = void 0;
    }
    getReceiverStats() {
      return kr(this, void 0, void 0, (function* () {
        if (!this.receiver || !this.receiver.getStats) return;
        let e2;
        return (yield this.receiver.getStats()).forEach(((t2) => {
          "inbound-rtp" === t2.type && (e2 = { type: "audio", streamId: t2.id, timestamp: t2.timestamp, jitter: t2.jitter, bytesReceived: t2.bytesReceived, concealedSamples: t2.concealedSamples, concealmentEvents: t2.concealmentEvents, silentConcealedSamples: t2.silentConcealedSamples, silentConcealmentEvents: t2.silentConcealmentEvents, totalAudioEnergy: t2.totalAudioEnergy, totalSamplesDuration: t2.totalSamplesDuration });
        })), e2;
      }));
    }
  }
  class vh extends wr.EventEmitter {
    constructor(t2, n2, i2, r2) {
      var o2;
      super(), this.metadataMuted = false, this.encryption = yt.NONE, this.log = ar, this.handleMuted = () => {
        this.emit(e.TrackEvent.Muted);
      }, this.handleUnmuted = () => {
        this.emit(e.TrackEvent.Unmuted);
      }, this.log = dr(null !== (o2 = null == r2 ? void 0 : r2.loggerName) && void 0 !== o2 ? o2 : e.LoggerNames.Publication), this.loggerContextCb = this.loggerContextCb, this.setMaxListeners(100), this.kind = t2, this.trackSid = n2, this.trackName = i2, this.source = Ws.Source.Unknown;
    }
    setTrack(t2) {
      this.track && (this.track.off(e.TrackEvent.Muted, this.handleMuted), this.track.off(e.TrackEvent.Unmuted, this.handleUnmuted)), this.track = t2, t2 && (t2.on(e.TrackEvent.Muted, this.handleMuted), t2.on(e.TrackEvent.Unmuted, this.handleUnmuted));
    }
    get logContext() {
      var e2;
      return Object.assign(Object.assign({}, null === (e2 = this.loggerContextCb) || void 0 === e2 ? void 0 : e2.call(this)), Fs(this));
    }
    get isMuted() {
      return this.metadataMuted;
    }
    get isEnabled() {
      return true;
    }
    get isSubscribed() {
      return void 0 !== this.track;
    }
    get isEncrypted() {
      return this.encryption !== yt.NONE;
    }
    get audioTrack() {
      if (Wa(this.track)) return this.track;
    }
    get videoTrack() {
      if (Ha(this.track)) return this.track;
    }
    updateInfo(e2) {
      this.trackSid = e2.sid, this.trackName = e2.name, this.source = Ws.sourceFromProto(e2.source), this.mimeType = e2.mimeType, this.kind === Ws.Kind.Video && e2.width > 0 && (this.dimensions = { width: e2.width, height: e2.height }, this.simulcasted = e2.simulcast), this.encryption = e2.encryption, this.trackInfo = e2, this.log.debug("update publication info", Object.assign(Object.assign({}, this.logContext), { info: e2 }));
    }
  }
  !(function(e2) {
    var t2, n2;
    (t2 = e2.SubscriptionStatus || (e2.SubscriptionStatus = {})).Desired = "desired", t2.Subscribed = "subscribed", t2.Unsubscribed = "unsubscribed", (n2 = e2.PermissionStatus || (e2.PermissionStatus = {})).Allowed = "allowed", n2.NotAllowed = "not_allowed";
  })(vh || (vh = {}));
  class fh extends vh {
    get isUpstreamPaused() {
      var e2;
      return null === (e2 = this.track) || void 0 === e2 ? void 0 : e2.isUpstreamPaused;
    }
    constructor(t2, n2, i2, r2) {
      super(t2, n2.sid, n2.name, r2), this.track = void 0, this.handleTrackEnded = () => {
        this.emit(e.TrackEvent.Ended);
      }, this.handleCpuConstrained = () => {
        this.track && Ha(this.track) && this.emit(e.TrackEvent.CpuConstrained, this.track);
      }, this.updateInfo(n2), this.setTrack(i2);
    }
    setTrack(t2) {
      this.track && (this.track.off(e.TrackEvent.Ended, this.handleTrackEnded), this.track.off(e.TrackEvent.CpuConstrained, this.handleCpuConstrained)), super.setTrack(t2), t2 && (t2.on(e.TrackEvent.Ended, this.handleTrackEnded), t2.on(e.TrackEvent.CpuConstrained, this.handleCpuConstrained));
    }
    get isMuted() {
      return this.track ? this.track.isMuted : super.isMuted;
    }
    get audioTrack() {
      return super.audioTrack;
    }
    get videoTrack() {
      return super.videoTrack;
    }
    get isLocal() {
      return true;
    }
    mute() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        return null === (e2 = this.track) || void 0 === e2 ? void 0 : e2.mute();
      }));
    }
    unmute() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        return null === (e2 = this.track) || void 0 === e2 ? void 0 : e2.unmute();
      }));
    }
    pauseUpstream() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        yield null === (e2 = this.track) || void 0 === e2 ? void 0 : e2.pauseUpstream();
      }));
    }
    resumeUpstream() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        yield null === (e2 = this.track) || void 0 === e2 ? void 0 : e2.resumeUpstream();
      }));
    }
    getTrackFeatures() {
      var e2;
      if (Wa(this.track)) {
        const t2 = this.track.getSourceTrackSettings(), n2 = /* @__PURE__ */ new Set();
        return t2.autoGainControl && n2.add(lt.TF_AUTO_GAIN_CONTROL), t2.echoCancellation && n2.add(lt.TF_ECHO_CANCELLATION), t2.noiseSuppression && n2.add(lt.TF_NOISE_SUPPRESSION), t2.channelCount && t2.channelCount > 1 && n2.add(lt.TF_STEREO), (null === (e2 = this.options) || void 0 === e2 ? void 0 : e2.dtx) || n2.add(lt.TF_NO_DTX), this.track.enhancedNoiseCancellation && n2.add(lt.TF_ENHANCED_NOISE_CANCELLATION), Array.from(n2.values());
      }
      return [];
    }
  }
  function kh(e2, t2) {
    return kr(this, void 0, void 0, (function* () {
      null != e2 || (e2 = {});
      let i2 = false;
      const r2 = js(e2), o2 = r2.audioProcessor, s2 = r2.videoProcessor, a2 = r2.optionsWithoutProcessor;
      let c2 = a2.audio, d2 = a2.video;
      if (o2 && "object" == typeof a2.audio && (a2.audio.processor = o2), s2 && "object" == typeof a2.video && (a2.video.processor = s2), e2.audio && "object" == typeof a2.audio && "string" == typeof a2.audio.deviceId) {
        const e3 = a2.audio.deviceId;
        a2.audio.deviceId = { exact: e3 }, i2 = true, c2 = Object.assign(Object.assign({}, a2.audio), { deviceId: { ideal: e3 } });
      }
      if (a2.video && "object" == typeof a2.video && "string" == typeof a2.video.deviceId) {
        const e3 = a2.video.deviceId;
        a2.video.deviceId = { exact: e3 }, i2 = true, d2 = Object.assign(Object.assign({}, a2.video), { deviceId: { ideal: e3 } });
      }
      true === a2.audio ? a2.audio = { deviceId: "default" } : "object" == typeof a2.audio && null !== a2.audio && (a2.audio = Object.assign(Object.assign({}, a2.audio), { deviceId: a2.audio.deviceId || "default" })), true === a2.video ? a2.video = { deviceId: "default" } : "object" != typeof a2.video || a2.video.deviceId || (a2.video.deviceId = "default");
      const l2 = Ms(Is(a2, il, rl)), u2 = navigator.mediaDevices.getUserMedia(l2);
      a2.audio && (jc.userMediaPromiseMap.set("audioinput", u2), u2.catch((() => jc.userMediaPromiseMap.delete("audioinput")))), a2.video && (jc.userMediaPromiseMap.set("videoinput", u2), u2.catch((() => jc.userMediaPromiseMap.delete("videoinput"))));
      try {
        const e3 = yield u2;
        return yield Promise.all(e3.getTracks().map(((n2) => kr(this, void 0, void 0, (function* () {
          let i3;
          const r3 = "audio" === n2.kind ? l2.audio : l2.video;
          "boolean" != typeof r3 && (i3 = r3);
          const a3 = n2.getSettings().deviceId;
          (null == i3 ? void 0 : i3.deviceId) && xa(i3.deviceId) !== a3 ? i3.deviceId = a3 : i3 || (i3 = { deviceId: a3 });
          const c3 = (function(e4, t3, n3) {
            switch (e4.kind) {
              case "audio":
                return new wl(e4, t3, false, void 0, n3);
              case "video":
                return new Fl(e4, t3, false, n3);
              default:
                throw new ts("unsupported track type: ".concat(e4.kind));
            }
          })(n2, i3, t2);
          return c3.kind === Ws.Kind.Video ? c3.source = Ws.Source.Camera : c3.kind === Ws.Kind.Audio && (c3.source = Ws.Source.Microphone), c3.mediaStream = e3, Wa(c3) && o2 ? yield c3.setProcessor(o2) : Ha(c3) && s2 && (yield c3.setProcessor(s2)), c3;
        })))));
      } catch (n2) {
        if (!i2) throw n2;
        return kh(Object.assign(Object.assign({}, e2), { audio: c2, video: d2 }), t2);
      }
    }));
  }
  function yh(e2) {
    return kr(this, void 0, void 0, (function* () {
      return (yield kh({ audio: false, video: null == e2 || e2 }))[0];
    }));
  }
  function bh(e2) {
    return kr(this, void 0, void 0, (function* () {
      return (yield kh({ audio: null == e2 || e2, video: false }))[0];
    }));
  }
  var Th, Sh;
  e.ConnectionQuality = void 0, (Th = e.ConnectionQuality || (e.ConnectionQuality = {})).Excellent = "excellent", Th.Good = "good", Th.Poor = "poor", Th.Lost = "lost", Th.Unknown = "unknown";
  class Eh extends wr.EventEmitter {
    get logContext() {
      var e2, t2;
      return Object.assign({}, null === (t2 = null === (e2 = this.loggerOptions) || void 0 === e2 ? void 0 : e2.loggerContextCb) || void 0 === t2 ? void 0 : t2.call(e2));
    }
    get isEncrypted() {
      return this.trackPublications.size > 0 && Array.from(this.trackPublications.values()).every(((e2) => e2.isEncrypted));
    }
    get isAgent() {
      var e2;
      return (null === (e2 = this.permissions) || void 0 === e2 ? void 0 : e2.agent) || this.kind === ft.AGENT;
    }
    get isActive() {
      var e2;
      return (null === (e2 = this.participantInfo) || void 0 === e2 ? void 0 : e2.state) === vt.ACTIVE;
    }
    get kind() {
      return this._kind;
    }
    get attributes() {
      return Object.freeze(Object.assign({}, this._attributes));
    }
    constructor(t2, n2, i2, r2, o2, s2) {
      let a2 = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : ft.STANDARD;
      var c2;
      super(), this.audioLevel = 0, this.isSpeaking = false, this._connectionQuality = e.ConnectionQuality.Unknown, this.log = ar, this.loggerOptions = s2, this.log = dr(null !== (c2 = null == s2 ? void 0 : s2.loggerName) && void 0 !== c2 ? c2 : e.LoggerNames.Participant, (() => this.logContext)), this.setMaxListeners(100), this.sid = t2, this.identity = n2, this.name = i2, this.metadata = r2, this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.trackPublications = /* @__PURE__ */ new Map(), this._kind = a2, this._attributes = null != o2 ? o2 : {};
    }
    getTrackPublications() {
      return Array.from(this.trackPublications.values());
    }
    getTrackPublication(e2) {
      for (const t2 of this.trackPublications) {
        const n2 = j(t2, 2)[1];
        if (n2.source === e2) return n2;
      }
    }
    getTrackPublicationByName(e2) {
      for (const t2 of this.trackPublications) {
        const n2 = j(t2, 2)[1];
        if (n2.trackName === e2) return n2;
      }
    }
    waitUntilActive() {
      return this.isActive ? Promise.resolve() : (this.activeFuture || (this.activeFuture = new La(), this.once(e.ParticipantEvent.Active, (() => {
        var e2, t2;
        null === (t2 = null === (e2 = this.activeFuture) || void 0 === e2 ? void 0 : e2.resolve) || void 0 === t2 || t2.call(e2), this.activeFuture = void 0;
      }))), this.activeFuture.promise);
    }
    get connectionQuality() {
      return this._connectionQuality;
    }
    get isCameraEnabled() {
      var e2;
      const t2 = this.getTrackPublication(Ws.Source.Camera);
      return !(null === (e2 = null == t2 ? void 0 : t2.isMuted) || void 0 === e2 || e2);
    }
    get isMicrophoneEnabled() {
      var e2;
      const t2 = this.getTrackPublication(Ws.Source.Microphone);
      return !(null === (e2 = null == t2 ? void 0 : t2.isMuted) || void 0 === e2 || e2);
    }
    get isScreenShareEnabled() {
      return !!this.getTrackPublication(Ws.Source.ScreenShare);
    }
    get isLocal() {
      return false;
    }
    get joinedAt() {
      return this.participantInfo ? new Date(1e3 * Number.parseInt(this.participantInfo.joinedAt.toString())) : /* @__PURE__ */ new Date();
    }
    updateInfo(t2) {
      var n2;
      return !(this.participantInfo && this.participantInfo.sid === t2.sid && this.participantInfo.version > t2.version) && (this.identity = t2.identity, this.sid = t2.sid, this._setName(t2.name), this._setMetadata(t2.metadata), this._setAttributes(t2.attributes), t2.state === vt.ACTIVE && (null === (n2 = this.participantInfo) || void 0 === n2 ? void 0 : n2.state) !== vt.ACTIVE && this.emit(e.ParticipantEvent.Active), t2.permission && this.setPermissions(t2.permission), this.participantInfo = t2, true);
    }
    _setMetadata(t2) {
      const n2 = this.metadata !== t2, i2 = this.metadata;
      this.metadata = t2, n2 && this.emit(e.ParticipantEvent.ParticipantMetadataChanged, i2);
    }
    _setName(t2) {
      const n2 = this.name !== t2;
      this.name = t2, n2 && this.emit(e.ParticipantEvent.ParticipantNameChanged, t2);
    }
    _setAttributes(t2) {
      const n2 = (function(e2, t3) {
        var n3;
        void 0 === e2 && (e2 = {}), void 0 === t3 && (t3 = {});
        const i2 = [...Object.keys(t3), ...Object.keys(e2)], r2 = {};
        for (const o2 of i2) e2[o2] !== t3[o2] && (r2[o2] = null !== (n3 = t3[o2]) && void 0 !== n3 ? n3 : "");
        return r2;
      })(this.attributes, t2);
      this._attributes = t2, Object.keys(n2).length > 0 && this.emit(e.ParticipantEvent.AttributesChanged, n2);
    }
    setPermissions(t2) {
      var n2, i2, r2, o2, s2, a2;
      const c2 = this.permissions, d2 = t2.canPublish !== (null === (n2 = this.permissions) || void 0 === n2 ? void 0 : n2.canPublish) || t2.canSubscribe !== (null === (i2 = this.permissions) || void 0 === i2 ? void 0 : i2.canSubscribe) || t2.canPublishData !== (null === (r2 = this.permissions) || void 0 === r2 ? void 0 : r2.canPublishData) || t2.hidden !== (null === (o2 = this.permissions) || void 0 === o2 ? void 0 : o2.hidden) || t2.recorder !== (null === (s2 = this.permissions) || void 0 === s2 ? void 0 : s2.recorder) || t2.canPublishSources.length !== this.permissions.canPublishSources.length || t2.canPublishSources.some(((e2, t3) => {
        var n3;
        return e2 !== (null === (n3 = this.permissions) || void 0 === n3 ? void 0 : n3.canPublishSources[t3]);
      })) || t2.canSubscribeMetrics !== (null === (a2 = this.permissions) || void 0 === a2 ? void 0 : a2.canSubscribeMetrics);
      return this.permissions = t2, d2 && this.emit(e.ParticipantEvent.ParticipantPermissionsChanged, c2), d2;
    }
    setIsSpeaking(t2) {
      t2 !== this.isSpeaking && (this.isSpeaking = t2, t2 && (this.lastSpokeAt = /* @__PURE__ */ new Date()), this.emit(e.ParticipantEvent.IsSpeakingChanged, t2));
    }
    setConnectionQuality(t2) {
      const n2 = this._connectionQuality;
      this._connectionQuality = (function(t3) {
        switch (t3) {
          case ot.EXCELLENT:
            return e.ConnectionQuality.Excellent;
          case ot.GOOD:
            return e.ConnectionQuality.Good;
          case ot.POOR:
            return e.ConnectionQuality.Poor;
          case ot.LOST:
            return e.ConnectionQuality.Lost;
          default:
            return e.ConnectionQuality.Unknown;
        }
      })(t2), n2 !== this._connectionQuality && this.emit(e.ParticipantEvent.ConnectionQualityChanged, this._connectionQuality);
    }
    setDisconnected() {
      var e2, t2;
      this.activeFuture && (null === (t2 = (e2 = this.activeFuture).reject) || void 0 === t2 || t2.call(e2, new Error("Participant disconnected")), this.activeFuture = void 0);
    }
    setAudioContext(e2) {
      return kr(this, void 0, void 0, (function* () {
        this.audioContext = e2, yield Promise.all(Array.from(this.audioTrackPublications.values()).map(((e3) => e3.track)).filter(Wa).map(((t2) => t2.setAudioContext(e2))));
      }));
    }
    addTrackPublication(t2) {
      this.log.debug("adding track publication", { trackSid: t2.trackSid, source: t2.source, kind: t2.kind }), t2.on(e.TrackEvent.Muted, (() => {
        this.emit(e.ParticipantEvent.TrackMuted, t2);
      })), t2.on(e.TrackEvent.Unmuted, (() => {
        this.emit(e.ParticipantEvent.TrackUnmuted, t2);
      }));
      const n2 = t2;
      switch (n2.track && (n2.track.sid = t2.trackSid), this.trackPublications.set(t2.trackSid, t2), t2.kind) {
        case Ws.Kind.Audio:
          this.audioTrackPublications.set(t2.trackSid, t2);
          break;
        case Ws.Kind.Video:
          this.videoTrackPublications.set(t2.trackSid, t2);
      }
    }
  }
  class Ch extends Eh {
    constructor(t2, i2, o2, s2, a2, c2, d2, l2) {
      super(t2, i2, void 0, void 0, void 0, { loggerName: s2.loggerName, loggerContextCb: () => this.engine.logContext }), this.pendingPublishing = /* @__PURE__ */ new Set(), this.pendingPublishPromises = /* @__PURE__ */ new Map(), this.participantTrackPermissions = [], this.allParticipantsAllowedToSubscribe = true, this.encryptionType = yt.NONE, this.e2eeStateMutex = new r(), this.enabledPublishVideoCodecs = [], this.handleReconnecting = () => {
        this.reconnectFuture || (this.reconnectFuture = new La());
      }, this.handleReconnected = () => {
        var e2, t3;
        null === (t3 = null === (e2 = this.reconnectFuture) || void 0 === e2 ? void 0 : e2.resolve) || void 0 === t3 || t3.call(e2), this.reconnectFuture = void 0, this.updateTrackSubscriptionPermissions();
      }, this.handleClosing = () => {
        var e2, t3, n2, i3, r2, o3;
        this.reconnectFuture && (this.reconnectFuture.promise.catch(((e3) => this.log.warn(e3.message))), null === (t3 = null === (e2 = this.reconnectFuture) || void 0 === e2 ? void 0 : e2.reject) || void 0 === t3 || t3.call(e2, new Error("Got disconnected during reconnection attempt")), this.reconnectFuture = void 0), this.signalConnectedFuture && (null === (i3 = (n2 = this.signalConnectedFuture).reject) || void 0 === i3 || i3.call(n2, new Error("Got disconnected without signal connected")), this.signalConnectedFuture = void 0), null === (o3 = null === (r2 = this.activeAgentFuture) || void 0 === r2 ? void 0 : r2.reject) || void 0 === o3 || o3.call(r2, new Error("Got disconnected without active agent present")), this.activeAgentFuture = void 0, this.firstActiveAgent = void 0;
      }, this.handleSignalConnected = (e2) => {
        var t3, n2;
        e2.participant && this.updateInfo(e2.participant), this.signalConnectedFuture || (this.signalConnectedFuture = new La()), null === (n2 = (t3 = this.signalConnectedFuture).resolve) || void 0 === n2 || n2.call(t3);
      }, this.handleSignalRequestResponse = (e2) => {
        const t3 = e2.requestId, n2 = e2.reason, i3 = e2.message, r2 = this.pendingSignalRequests.get(t3);
        switch (r2 && (n2 !== Ki.OK && r2.reject(new as(i3, n2)), this.pendingSignalRequests.delete(t3)), e2.request.case) {
          case "publishDataTrack": {
            let t4;
            switch (e2.reason) {
              case Ki.NOT_ALLOWED:
                t4 = $u.notAllowed(e2.message);
                break;
              case Ki.DUPLICATE_NAME:
                t4 = $u.duplicateName(e2.message);
                break;
              case Ki.INVALID_NAME:
                t4 = $u.invalidName(e2.message);
                break;
              case Ki.LIMIT_EXCEEDED:
                t4 = $u.limitReached(e2.message);
                break;
              default:
                t4 = $u.unknown(e2.reason, e2.message);
            }
            this.roomOutgoingDataTrackManager.receivedSfuPublishResponse(e2.request.value.pubHandle, { type: "error", error: t4 });
            break;
          }
        }
      }, this.updateTrackSubscriptionPermissions = () => {
        this.log.debug("updating track subscription permissions", { allParticipantsAllowed: this.allParticipantsAllowedToSubscribe, participantTrackPermissions: this.participantTrackPermissions }), this.engine.client.sendUpdateSubscriptionPermissions(this.allParticipantsAllowedToSubscribe, this.participantTrackPermissions.map(((e2) => (function(e3) {
          var t3, n2, i3;
          if (!e3.participantSid && !e3.participantIdentity) throw new Error("Invalid track permission, must provide at least one of participantIdentity and participantSid");
          return new Di({ participantIdentity: null !== (t3 = e3.participantIdentity) && void 0 !== t3 ? t3 : "", participantSid: null !== (n2 = e3.participantSid) && void 0 !== n2 ? n2 : "", allTracks: null !== (i3 = e3.allowAll) && void 0 !== i3 && i3, trackSids: e3.allowedTrackSids || [] });
        })(e2))));
      }, this.onTrackUnmuted = (e2) => {
        this.onTrackMuted(e2, e2.isUpstreamPaused);
      }, this.onTrackMuted = (e2, t3) => {
        void 0 === t3 && (t3 = true), e2.sid ? this.engine.updateMuteStatus(e2.sid, t3) : this.log.error("could not update mute status for unpublished track", Fs(e2));
      }, this.onTrackUpstreamPaused = (e2) => {
        this.log.debug("upstream paused", Fs(e2)), this.onTrackMuted(e2, true);
      }, this.onTrackUpstreamResumed = (e2) => {
        this.log.debug("upstream resumed", Fs(e2)), this.onTrackMuted(e2, e2.isMuted);
      }, this.onTrackFeatureUpdate = (e2) => {
        const t3 = this.audioTrackPublications.get(e2.sid);
        t3 ? this.engine.client.sendUpdateLocalAudioTrack(t3.trackSid, t3.getTrackFeatures()) : this.log.warn("Could not update local audio track settings, missing publication for track ".concat(e2.sid));
      }, this.onTrackCpuConstrained = (t3, n2) => {
        this.log.debug("track cpu constrained", Fs(n2)), this.emit(e.ParticipantEvent.LocalTrackCpuConstrained, t3, n2);
      }, this.handleSubscribedQualityUpdate = (e2) => kr(this, void 0, void 0, (function* () {
        var t3, n2, i3, r2, o3;
        if (!(null === (o3 = this.roomOptions) || void 0 === o3 ? void 0 : o3.dynacast)) return;
        const s3 = this.videoTrackPublications.get(e2.trackSid);
        if (!s3) return void this.log.warn("received subscribed quality update for unknown track", { trackSid: e2.trackSid });
        if (!s3.videoTrack) return;
        const a3 = yield s3.videoTrack.setPublishingCodecs(e2.subscribedCodecs);
        try {
          for (var c3, d3 = true, l3 = Sr(a3); !(t3 = (c3 = yield l3.next()).done); d3 = true) {
            r2 = c3.value, d3 = false;
            const e3 = r2;
            Ss(e3) && (this.log.debug("publish ".concat(e3, " for ").concat(s3.videoTrack.sid), Fs(s3)), yield this.publishAdditionalCodecForTrack(s3.videoTrack, e3, s3.options));
          }
        } catch (u2) {
          n2 = { error: u2 };
        } finally {
          try {
            d3 || t3 || !(i3 = l3.return) || (yield i3.call(l3));
          } finally {
            if (n2) throw n2.error;
          }
        }
      })), this.handleLocalTrackUnpublished = (e2) => {
        const t3 = this.trackPublications.get(e2.trackSid);
        t3 ? this.unpublishTrack(t3.track) : this.log.warn("received unpublished event for unknown track", { trackSid: e2.trackSid });
      }, this.handleTrackEnded = (e2) => kr(this, void 0, void 0, (function* () {
        if (e2.source === Ws.Source.ScreenShare || e2.source === Ws.Source.ScreenShareAudio) this.log.debug("unpublishing local track due to TrackEnded", Fs(e2)), this.unpublishTrack(e2);
        else if (e2.isUserProvided) yield e2.mute();
        else if (za(e2) || Ka(e2)) try {
          if (pa()) try {
            const t3 = yield null === navigator || void 0 === navigator ? void 0 : navigator.permissions.query({ name: e2.source === Ws.Source.Camera ? "camera" : "microphone" });
            if (t3 && "denied" === t3.state) throw this.log.warn("user has revoked access to ".concat(e2.source), Fs(e2)), t3.onchange = () => {
              "denied" !== t3.state && (e2.isMuted || e2.restartTrack(), t3.onchange = null);
            }, new Error("GetUserMedia Permission denied");
          } catch (n2) {
          }
          e2.isMuted || (this.log.debug("track ended, attempting to use a different device", Fs(e2)), za(e2) ? yield this.restartOnDefaultAudioDevice(e2) : yield e2.restartTrack());
        } catch (n2) {
          this.log.warn("could not restart track, muting instead", Fs(e2)), yield e2.mute();
        }
      })), this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.trackPublications = /* @__PURE__ */ new Map(), this.engine = o2, this.roomOptions = s2, this.setupEngine(o2), this.activeDeviceMap = /* @__PURE__ */ new Map([["audioinput", "default"], ["videoinput", "default"], ["audiooutput", "default"]]), this.pendingSignalRequests = /* @__PURE__ */ new Map(), this.roomOutgoingDataStreamManager = a2, this.roomOutgoingDataTrackManager = c2, this.rpcClientManager = d2, this.rpcServerManager = l2;
    }
    get lastCameraError() {
      return this.cameraError;
    }
    get lastMicrophoneError() {
      return this.microphoneError;
    }
    get isE2EEEnabled() {
      return this.encryptionType !== yt.NONE;
    }
    getTrackPublication(e2) {
      const t2 = super.getTrackPublication(e2);
      if (t2) return t2;
    }
    getTrackPublicationByName(e2) {
      const t2 = super.getTrackPublicationByName(e2);
      if (t2) return t2;
    }
    setupEngine(t2) {
      var n2;
      this.engine = t2, this.engine.on(e.EngineEvent.RemoteMute, ((e2, t3) => {
        const n3 = this.trackPublications.get(e2);
        n3 && n3.track && (t3 ? n3.mute() : n3.unmute());
      })), (null === (n2 = this.signalConnectedFuture) || void 0 === n2 ? void 0 : n2.isResolved) && (this.signalConnectedFuture = void 0), this.engine.on(e.EngineEvent.Connected, this.handleReconnected).on(e.EngineEvent.SignalConnected, this.handleSignalConnected).on(e.EngineEvent.SignalRestarted, this.handleReconnected).on(e.EngineEvent.SignalResumed, this.handleReconnected).on(e.EngineEvent.Restarting, this.handleReconnecting).on(e.EngineEvent.Resuming, this.handleReconnecting).on(e.EngineEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished).on(e.EngineEvent.SubscribedQualityUpdate, this.handleSubscribedQualityUpdate).on(e.EngineEvent.Closing, this.handleClosing).on(e.EngineEvent.SignalRequestResponse, this.handleSignalRequestResponse);
    }
    setMetadata(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.requestMetadataUpdate({ metadata: e2 });
      }));
    }
    setName(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.requestMetadataUpdate({ name: e2 });
      }));
    }
    setAttributes(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.requestMetadataUpdate({ attributes: e2 });
      }));
    }
    requestMetadataUpdate(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let i2 = e3.metadata, r2 = e3.name, o2 = e3.attributes;
        return (function* () {
          return new No(((e4, s2) => kr(t2, void 0, void 0, (function* () {
            var t3, a2;
            try {
              let n2 = false;
              const c2 = yield this.engine.client.sendUpdateLocalMetadata(null !== (t3 = null != i2 ? i2 : this.metadata) && void 0 !== t3 ? t3 : "", null !== (a2 = null != r2 ? r2 : this.name) && void 0 !== a2 ? a2 : "", o2), d2 = performance.now();
              for (this.pendingSignalRequests.set(c2, { resolve: e4, reject: (e5) => {
                s2(e5), n2 = true;
              }, values: { name: r2, metadata: i2, attributes: o2 } }); performance.now() - d2 < 5e3 && !n2; ) {
                if ((!r2 || this.name === r2) && (!i2 || this.metadata === i2) && (!o2 || Object.entries(o2).every(((e5) => {
                  let t4 = j(e5, 2), n3 = t4[0], i3 = t4[1];
                  return this.attributes[n3] === i3 || "" === i3 && !this.attributes[n3];
                })))) return this.pendingSignalRequests.delete(c2), void e4();
                yield Js(50);
              }
              s2(new as("Request to update local metadata timed out", "TimeoutError"));
            } catch (n2) {
              n2 instanceof Error ? s2(n2) : s2(new Error(String(n2)));
            }
          }))));
        })();
      }));
    }
    setCameraEnabled(e2, t2, n2) {
      return this.setTrackEnabled(Ws.Source.Camera, e2, t2, n2);
    }
    setMicrophoneEnabled(e2, t2, n2) {
      return this.setTrackEnabled(Ws.Source.Microphone, e2, t2, n2);
    }
    setScreenShareEnabled(e2, t2, n2) {
      return this.setTrackEnabled(Ws.Source.ScreenShare, e2, t2, n2);
    }
    setE2EEEnabled(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.e2eeStateMutex.lock();
        try {
          if (this.encryptionType = e2 ? yt.GCM : yt.NONE, yield Promise.all(this.pendingPublishPromises.values()), 0 === this.trackPublications.size || Array.from(this.trackPublications.values()).every(((t3) => t3.isEncrypted === e2))) return;
          yield this.republishAllTracks(void 0, false);
        } finally {
          t2();
        }
      }));
    }
    setTrackEnabled(t2, i2, r2, o2) {
      return kr(this, void 0, void 0, (function* () {
        var s2, a2;
        this.log.debug("setTrackEnabled", { source: t2, enabled: i2 }), this.republishPromise && (yield this.republishPromise);
        let c2 = this.getTrackPublication(t2);
        if (i2) if (c2) yield c2.unmute();
        else {
          let i3;
          if (this.pendingPublishing.has(t2)) {
            const e2 = yield this.waitForPendingPublicationOfSource(t2);
            return e2 || this.log.info("waiting for pending publication promise timed out", { source: t2 }), yield null == e2 ? void 0 : e2.unmute(), e2;
          }
          this.pendingPublishing.add(t2);
          try {
            switch (t2) {
              case Ws.Source.Camera:
                i3 = yield this.createTracks({ video: null === (s2 = r2) || void 0 === s2 || s2 });
                break;
              case Ws.Source.Microphone:
                i3 = yield this.createTracks({ audio: null === (a2 = r2) || void 0 === a2 || a2 });
                break;
              case Ws.Source.ScreenShare:
                i3 = yield this.createScreenTracks(Object.assign({}, r2));
                break;
              default:
                throw new ts(t2);
            }
          } catch (n2) {
            throw null == i3 || i3.forEach(((e2) => {
              e2.stop();
            })), n2 instanceof Error && this.emit(e.ParticipantEvent.MediaDevicesError, n2, Ls(t2)), this.pendingPublishing.delete(t2), n2;
          }
          for (const e2 of i3) {
            const n2 = Object.assign(Object.assign({}, this.roomOptions.publishDefaults), r2);
            t2 === Ws.Source.Microphone && Wa(e2) && n2.preConnectBuffer && (this.log.info("starting preconnect buffer for microphone"), e2.startPreConnectBuffer());
          }
          try {
            const e2 = [];
            for (const t3 of i3) this.log.info("publishing track", Fs(t3)), e2.push(this.publishTrack(t3, o2));
            c2 = j(yield Promise.all(e2), 1)[0];
          } catch (n2) {
            throw null == i3 || i3.forEach(((e2) => {
              e2.stop();
            })), n2;
          } finally {
            this.pendingPublishing.delete(t2);
          }
        }
        else if (!(null == c2 ? void 0 : c2.track) && this.pendingPublishing.has(t2) && (c2 = yield this.waitForPendingPublicationOfSource(t2), c2 || this.log.info("waiting for pending publication promise timed out", { source: t2 })), c2 && c2.track) if (t2 === Ws.Source.ScreenShare) {
          const e2 = [this.unpublishTrack(c2.track)], t3 = this.getTrackPublication(Ws.Source.ScreenShareAudio);
          t3 && t3.track && e2.push(this.unpublishTrack(t3.track)), c2 = j(yield Promise.all(e2), 1)[0];
        } else yield c2.mute();
        return c2;
      }));
    }
    enableCameraAndMicrophone() {
      return kr(this, void 0, void 0, (function* () {
        if (!this.pendingPublishing.has(Ws.Source.Camera) && !this.pendingPublishing.has(Ws.Source.Microphone)) {
          this.pendingPublishing.add(Ws.Source.Camera), this.pendingPublishing.add(Ws.Source.Microphone);
          try {
            const e2 = yield this.createTracks({ audio: true, video: true });
            yield Promise.all(e2.map(((e3) => this.publishTrack(e3))));
          } finally {
            this.pendingPublishing.delete(Ws.Source.Camera), this.pendingPublishing.delete(Ws.Source.Microphone);
          }
        }
      }));
    }
    createTracks(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2;
        null != t2 || (t2 = {});
        const r2 = Is(t2, null === (n2 = this.roomOptions) || void 0 === n2 ? void 0 : n2.audioCaptureDefaults, null === (i2 = this.roomOptions) || void 0 === i2 ? void 0 : i2.videoCaptureDefaults);
        try {
          const t3 = yield kh(r2, { loggerName: this.roomOptions.loggerName, loggerContextCb: () => this.logContext });
          return yield Promise.all(t3.map(((t4) => kr(this, void 0, void 0, (function* () {
            return Wa(t4) && (this.microphoneError = void 0, yield t4.setAudioContext(this.audioContext), t4.source = Ws.Source.Microphone, this.emit(e.ParticipantEvent.AudioStreamAcquired)), Ha(t4) && (this.cameraError = void 0, t4.source = Ws.Source.Camera), t4;
          })))));
        } catch (o2) {
          throw o2 instanceof Error && (t2.audio && (this.microphoneError = o2), t2.video && (this.cameraError = o2)), o2;
        }
      }));
    }
    createScreenTracks(t2) {
      return kr(this, void 0, void 0, (function* () {
        if (void 0 === t2 && (t2 = {}), void 0 === navigator.mediaDevices.getDisplayMedia) throw new es("getDisplayMedia not supported");
        void 0 !== t2.resolution || ua() || (t2.resolution = Ps.h1080fps30.resolution);
        const n2 = Ns(t2), i2 = yield navigator.mediaDevices.getDisplayMedia(n2), r2 = i2.getVideoTracks();
        if (0 === r2.length) throw new ts("no video track found");
        const o2 = new Fl(r2[0], void 0, false, { loggerName: this.roomOptions.loggerName, loggerContextCb: () => this.logContext });
        o2.source = Ws.Source.ScreenShare, t2.contentHint && (o2.mediaStreamTrack.contentHint = t2.contentHint);
        const s2 = [o2];
        if (i2.getAudioTracks().length > 0) {
          this.emit(e.ParticipantEvent.AudioStreamAcquired);
          const t3 = new wl(i2.getAudioTracks()[0], void 0, false, this.audioContext, { loggerName: this.roomOptions.loggerName, loggerContextCb: () => this.logContext });
          t3.source = Ws.Source.ScreenShareAudio, s2.push(t3);
        }
        return s2;
      }));
    }
    publishTrack(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        return this.publishOrRepublishTrack(e2, t2);
      }));
    }
    waitForNextEngineRestart() {
      let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 15e3;
      return new Promise(((n2, i2) => {
        const r2 = () => {
          clearTimeout(a2), this.engine.off(e.EngineEvent.Restarted, o2), this.engine.off(e.EngineEvent.Closing, s2);
        }, o2 = () => {
          r2(), n2();
        }, s2 = () => {
          r2(), i2(new Error("engine closed before restart completed"));
        }, a2 = setTimeout((() => {
          r2(), i2(new Error("timed out waiting for engine restart"));
        }), t2);
        this.engine.once(e.EngineEvent.Restarted, o2), this.engine.once(e.EngineEvent.Closing, s2);
      }));
    }
    publishOrRepublishTrack(e2, t2) {
      return kr(this, arguments, void 0, (function(e3, t3) {
        var i2 = this;
        let r2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], o2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        return (function* () {
          var s2, a2, c2, d2;
          let l2, u2;
          if (za(e3) && (yield e3.setAudioContext(i2.audioContext)), yield null === (s2 = i2.reconnectFuture) || void 0 === s2 ? void 0 : s2.promise, i2.republishPromise && !r2 && (yield i2.republishPromise), Va(e3) && i2.pendingPublishPromises.has(e3) && (yield i2.pendingPublishPromises.get(e3)), e3 instanceof MediaStreamTrack) l2 = e3.getConstraints();
          else {
            let t4;
            switch (l2 = e3.constraints, e3.source) {
              case Ws.Source.Microphone:
                t4 = "audioinput";
                break;
              case Ws.Source.Camera:
                t4 = "videoinput";
            }
            t4 && i2.activeDeviceMap.has(t4) && (l2 = Object.assign(Object.assign({}, l2), { deviceId: i2.activeDeviceMap.get(t4) }));
          }
          if (e3 instanceof MediaStreamTrack) switch (e3.kind) {
            case "audio":
              e3 = new wl(e3, l2, true, i2.audioContext, { loggerName: i2.roomOptions.loggerName, loggerContextCb: () => i2.logContext });
              break;
            case "video":
              e3 = new Fl(e3, l2, true, { loggerName: i2.roomOptions.loggerName, loggerContextCb: () => i2.logContext });
              break;
            default:
              throw new ts("unsupported MediaStreamTrack kind ".concat(e3.kind));
          }
          else e3.updateLoggerOptions({ loggerName: i2.roomOptions.loggerName, loggerContextCb: () => i2.logContext });
          if (i2.trackPublications.forEach(((t4) => {
            t4.track && t4.track === e3 && (u2 = t4);
          })), u2) return i2.log.warn("track has already been published, skipping", Fs(u2)), u2;
          const h2 = Object.assign(Object.assign({}, i2.roomOptions.publishDefaults), t3), p2 = "channelCount" in e3.mediaStreamTrack.getSettings() && 2 === e3.mediaStreamTrack.getSettings().channelCount || 2 === e3.mediaStreamTrack.getConstraints().channelCount, m2 = null !== (a2 = h2.forceStereo) && void 0 !== a2 ? a2 : p2;
          m2 && (void 0 === h2.dtx && i2.log.debug("Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.", Fs(e3)), void 0 === h2.red && i2.log.debug("Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work."), null !== (c2 = h2.dtx) && void 0 !== c2 || (h2.dtx = false), null !== (d2 = h2.red) && void 0 !== d2 || (h2.red = false)), !(function() {
            const e4 = Fo(), t4 = "17.2";
            if (e4) return "Safari" !== e4.name && "iOS" !== e4.os || !!("iOS" === e4.os && e4.osVersion && ba(e4.osVersion, t4) >= 0) || "Safari" === e4.name && ba(e4.version, t4) >= 0;
          })() && i2.roomOptions.e2ee && (i2.log.info("End-to-end encryption is set up, simulcast publishing will be disabled on Safari versions and iOS browsers running iOS < v17.2"), h2.simulcast = false), h2.source && (e3.source = h2.source);
          const g2 = new Promise(((t4, r3) => kr(i2, void 0, void 0, (function* () {
            try {
              if (this.engine.client.currentState !== Sd.CONNECTED) {
                this.log.debug("deferring track publication until signal is connected", { track: Fs(e3) });
                let n2 = false;
                const i3 = setTimeout((() => {
                  n2 = true, e3.stop(), r3(new ss("publishing rejected as engine not connected within timeout", 408));
                }), 15e3);
                if (yield this.waitUntilEngineConnected(), clearTimeout(i3), n2) return;
                const o3 = yield this.publish(e3, h2, m2);
                t4(o3);
              } else try {
                const n2 = yield this.publish(e3, h2, m2);
                t4(n2);
              } catch (n2) {
                r3(n2);
              }
            } catch (n2) {
              r3(n2);
            }
          }))));
          i2.pendingPublishPromises.set(e3, g2);
          try {
            return yield g2;
          } catch (n2) {
            if (!o2 && n2 instanceof rs) return i2.log.warn("negotiation due to track publish failed, retrying after reconnect", { error: n2 }), i2.pendingPublishPromises.delete(e3), yield i2.waitForNextEngineRestart(), yield i2.publishOrRepublishTrack(e3, t3, r2, true);
            throw n2;
          } finally {
            i2.pendingPublishPromises.delete(e3);
          }
        })();
      }));
    }
    waitUntilEngineConnected() {
      return this.signalConnectedFuture || (this.signalConnectedFuture = new La()), this.signalConnectedFuture.promise;
    }
    hasPermissionsToPublish(e2) {
      if (!this.permissions) return this.log.warn("no permissions present for publishing track", Fs(e2)), false;
      const t2 = this.permissions, n2 = t2.canPublish, i2 = t2.canPublishSources;
      return !(!n2 || 0 !== i2.length && !i2.map(((e3) => (function(e4) {
        switch (e4) {
          case it.CAMERA:
            return Ws.Source.Camera;
          case it.MICROPHONE:
            return Ws.Source.Microphone;
          case it.SCREEN_SHARE:
            return Ws.Source.ScreenShare;
          case it.SCREEN_SHARE_AUDIO:
            return Ws.Source.ScreenShareAudio;
          default:
            return Ws.Source.Unknown;
        }
      })(e3))).includes(e2.source)) || (this.log.warn("insufficient permissions to publish", Fs(e2)), false);
    }
    publish(t2, i2, r2) {
      return kr(this, void 0, void 0, (function* () {
        var o2, s2, a2, c2, d2, l2, u2, h2, p2, m2, g2;
        if (!this.hasPermissionsToPublish(t2)) throw new ss("failed to publish track, insufficient permissions", 403);
        Array.from(this.trackPublications.values()).find(((e2) => Va(t2) && e2.source === t2.source)) && t2.source !== Ws.Source.Unknown && this.log.info("publishing a second track with the same source: ".concat(t2.source), Fs(t2)), i2.stopMicTrackOnMute && Wa(t2) && (t2.stopOnMute = true), t2.source === Ws.Source.ScreenShare && oa() && (i2.simulcast = false), "av1" !== i2.videoCodec || Xs() || (i2.videoCodec = void 0), "vp9" !== i2.videoCodec || Zs() || (i2.videoCodec = void 0), void 0 === i2.videoCodec && (i2.videoCodec = tl), this.enabledPublishVideoCodecs.length > 0 && (this.enabledPublishVideoCodecs.some(((e2) => i2.videoCodec === xs(e2.mime))) || (i2.videoCodec = xs(this.enabledPublishVideoCodecs[0].mime)));
        const v2 = i2.videoCodec;
        t2.on(e.TrackEvent.Muted, this.onTrackMuted), t2.on(e.TrackEvent.Unmuted, this.onTrackUnmuted), t2.on(e.TrackEvent.Ended, this.handleTrackEnded), t2.on(e.TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused), t2.on(e.TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed), t2.on(e.TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
        const f2 = [], k2 = !(null === (o2 = i2.dtx) || void 0 === o2 || o2), y2 = t2.getSourceTrackSettings();
        y2.autoGainControl && f2.push(lt.TF_AUTO_GAIN_CONTROL), y2.echoCancellation && f2.push(lt.TF_ECHO_CANCELLATION), y2.noiseSuppression && f2.push(lt.TF_NOISE_SUPPRESSION), y2.channelCount && y2.channelCount > 1 && f2.push(lt.TF_STEREO), k2 && f2.push(lt.TF_NO_DTX), za(t2) && t2.hasPreConnectBuffer && f2.push(lt.TF_PRECONNECT_BUFFER);
        const b2 = this.normalizeRequestedFrameMetadataOptions(t2, i2), T2 = new Kn({ cid: t2.mediaStreamTrack.id, name: i2.name, type: Ws.kindToProto(t2.kind), muted: t2.isMuted, source: Ws.sourceToProto(t2.source), disableDtx: k2, encryption: this.encryptionType, stereo: r2, disableRed: this.isE2EEEnabled || !(null === (s2 = i2.red) || void 0 === s2 || s2), stream: null == i2 ? void 0 : i2.stream, backupCodecPolicy: null == i2 ? void 0 : i2.backupCodecPolicy, audioFeatures: f2, packetTrailerFeatures: b2 });
        let S2;
        if (t2.kind === Ws.Kind.Video) {
          let e2;
          try {
            e2 = yield t2.waitForDimensions();
          } catch (n2) {
            const r3 = null !== (c2 = null === (a2 = this.roomOptions.videoCaptureDefaults) || void 0 === a2 ? void 0 : a2.resolution) && void 0 !== c2 ? c2 : ws.h720.resolution;
            e2 = { width: r3.width, height: r3.height }, this.log.error("could not determine track dimensions, using defaults", Object.assign(Object.assign({}, Fs(t2)), { dims: e2 }));
          }
          if (T2.width = e2.width, T2.height = e2.height, Ka(t2)) {
            !ta(v2, i2) || !na() && ((E2 = null === (d2 = this.engine) || void 0 === d2 ? void 0 : d2.serverVersion) && ba(E2, "1.13.6") > 0) || (i2.simulcast = false, this.log.info("SVC simulcast is not supported, disabling simulcast.", Fs(t2)));
            const e3 = ta(v2, i2);
            $s(v2) && !e3 && (t2.source === Ws.Source.ScreenShare && (i2.scalabilityMode = "L1T3", "contentHint" in t2.mediaStreamTrack && (t2.mediaStreamTrack.contentHint = "motion", this.log.debug("forcing contentHint to motion for screenshare with SVC codecs", Fs(t2)))), i2.scalabilityMode = null !== (l2 = i2.scalabilityMode) && void 0 !== l2 ? l2 : "L3T3_KEY");
            const n2 = new Hn({ codec: v2, cid: t2.mediaStreamTrack.id });
            e3 && (n2.videoLayerMode = Ot.ONE_SPATIAL_LAYER_PER_STREAM), T2.simulcastCodecs = [n2], true === i2.backupCodec && (i2.backupCodec = { codec: tl }), i2.backupCodec && v2 !== i2.backupCodec.codec && T2.encryption === yt.NONE && (this.roomOptions.dynacast || (this.roomOptions.dynacast = true), T2.simulcastCodecs.push(new Hn({ codec: i2.backupCodec.codec, cid: "" })));
          }
          S2 = Ol(t2.source === Ws.Source.ScreenShare, T2.width, T2.height, i2), T2.layers = ql(T2.width, T2.height, S2, $s(i2.videoCodec) && !ta(i2.videoCodec, i2));
        } else t2.kind === Ws.Kind.Audio && (S2 = [{ maxBitrate: null === (u2 = i2.audioPreset) || void 0 === u2 ? void 0 : u2.maxBitrate, priority: null !== (p2 = null === (h2 = i2.audioPreset) || void 0 === h2 ? void 0 : h2.priority) && void 0 !== p2 ? p2 : "high", networkPriority: null !== (g2 = null === (m2 = i2.audioPreset) || void 0 === m2 ? void 0 : m2.priority) && void 0 !== g2 ? g2 : "high" }]);
        var E2;
        if (!this.engine || this.engine.isClosed) throw new is("cannot publish track when not connected");
        const C2 = () => kr(this, void 0, void 0, (function* () {
          var n2, r3;
          if (!this.engine.pcManager) throw new is("pcManager is not ready");
          if (t2.sender = yield this.engine.createSender(t2, i2, S2), Ka(t2) && (t2.publishOptions = i2), this.emit(e.ParticipantEvent.LocalSenderCreated, t2.sender, t2), Ka(t2) && (null !== (n2 = i2.degradationPreference) && void 0 !== n2 || (i2.degradationPreference = (function(e2) {
            switch (e2.source) {
              case Ws.Source.Camera:
                return "maintain-framerate";
              case Ws.Source.ScreenShare:
                return "maintain-resolution";
              default:
                return "balanced";
            }
          })(t2)), t2.setDegradationPreference(i2.degradationPreference)), S2) {
            if (oa() && t2.kind === Ws.Kind.Audio) {
              let e2;
              for (const n3 of this.engine.pcManager.publisher.getTransceivers()) if (n3.sender === t2.sender) {
                e2 = n3;
                break;
              }
              e2 && this.engine.pcManager.publisher.setTrackCodecBitrate({ transceiver: e2, codec: "opus", maxbr: (null === (r3 = S2[0]) || void 0 === r3 ? void 0 : r3.maxBitrate) ? S2[0].maxBitrate / 1e3 : 0 });
            } else if (t2.codec && Na(t2.codec)) {
              const e2 = (function(e3, t3, n3) {
                var i3, r4;
                return $s(e3) && !ta(e3, t3) ? null !== (r4 = null === (i3 = n3[0]) || void 0 === i3 ? void 0 : i3.maxBitrate) && void 0 !== r4 ? r4 : 0 : n3.reduce(((e4, t4) => {
                  var n4;
                  return e4 + (null !== (n4 = t4.maxBitrate) && void 0 !== n4 ? n4 : 0);
                }), 0);
              })(t2.codec, i2, S2);
              e2 > 0 && this.engine.pcManager.publisher.setTrackCodecBitrate({ cid: T2.cid, codec: t2.codec, maxbr: e2 / 1e3, isScreenShare: t2.source === Ws.Source.ScreenShare });
            }
          }
          yield this.engine.negotiate();
        }));
        let w2;
        const R2 = new Promise(((e2, i3) => kr(this, void 0, void 0, (function* () {
          var r3;
          try {
            w2 = yield this.engine.addTrack(T2), e2(w2);
          } catch (o3) {
            if (t2.sender && (null === (r3 = this.engine.pcManager) || void 0 === r3 ? void 0 : r3.publisher)) {
              try {
                this.engine.pcManager.publisher.removeTrack(t2.sender);
              } catch (n2) {
                this.log.error(n2);
              }
              yield this.engine.negotiate().catch(((e3) => {
                this.log.error("failed to negotiate after removing track due to failed add track request", Object.assign(Object.assign({}, Fs(t2)), { error: e3 }));
              }));
            }
            i3(o3);
          }
        }))));
        if (this.enabledPublishVideoCodecs.length > 0 && 0 === b2.length) {
          const e2 = yield Promise.all([R2, C2()]);
          w2 = e2[0];
        } else {
          let e2;
          if (w2 = yield R2, w2.codecs.forEach(((t3) => {
            void 0 === e2 && (e2 = t3.mimeType);
          })), e2 && t2.kind === Ws.Kind.Video) {
            const n2 = xs(e2);
            n2 !== v2 && (this.log.debug("falling back to server selected codec", Object.assign(Object.assign({}, Fs(t2)), { codec: n2 })), i2.videoCodec = n2, S2 = Ol(t2.source === Ws.Source.ScreenShare, T2.width, T2.height, i2));
          }
          yield C2();
        }
        const P2 = new fh(t2.kind, w2, t2, { loggerName: this.roomOptions.loggerName, loggerContextCb: () => this.logContext });
        if (P2.on(e.TrackEvent.CpuConstrained, ((e2) => this.onTrackCpuConstrained(e2, P2))), P2.options = i2, t2.sid = w2.sid, Ka(t2) && (t2.publishOptions = i2, T2.width && T2.height && (t2.lastEncodedDimensions = { width: T2.width, height: T2.height })), this.log.debug("publishing ".concat(t2.kind, " with encodings"), { encodings: S2, trackInfo: w2 }), Ka(t2) ? t2.startMonitor(this.engine.client) : za(t2) && t2.startMonitor(), this.addTrackPublication(P2), this.emit(e.ParticipantEvent.LocalTrackPublished, P2), za(t2) && w2.audioFeatures.includes(lt.TF_PRECONNECT_BUFFER)) {
          const i3 = t2.getPreConnectBuffer(), r3 = t2.getPreConnectBufferMimeType();
          if (this.on(e.ParticipantEvent.LocalTrackSubscribed, ((e2) => {
            if (e2.trackSid === w2.sid) {
              if (!t2.hasPreConnectBuffer) return void this.log.warn("subscribe event came to late, buffer already closed");
              this.log.debug("finished recording preconnect buffer", Fs(t2)), t2.stopPreConnectBuffer();
            }
          })), i3) {
            const e2 = new Promise(((e3, o3) => kr(this, void 0, void 0, (function* () {
              var s3, a3, c3, d3, l3, u3;
              try {
                this.log.debug("waiting for agent", Fs(t2));
                const n2 = setTimeout((() => {
                  o3(new Error("agent not active within 10 seconds"));
                }), 1e4), v3 = yield this.waitUntilActiveAgentPresent();
                clearTimeout(n2), this.log.debug("sending preconnect buffer", Fs(t2));
                const f3 = yield this.streamBytes({ name: "preconnect-buffer", mimeType: r3, topic: "lk.agent.pre-connect-audio-buffer", destinationIdentities: [v3.identity], attributes: { trackId: P2.trackSid, sampleRate: String(null !== (l3 = y2.sampleRate) && void 0 !== l3 ? l3 : "48000"), channels: String(null !== (u3 = y2.channelCount) && void 0 !== u3 ? u3 : "1") } });
                try {
                  for (var h3, p3 = true, m3 = Sr(i3); !(s3 = (h3 = yield m3.next()).done); p3 = true) {
                    d3 = h3.value, p3 = false;
                    const e4 = d3;
                    yield f3.write(e4);
                  }
                } catch (g3) {
                  a3 = { error: g3 };
                } finally {
                  try {
                    p3 || s3 || !(c3 = m3.return) || (yield c3.call(m3));
                  } finally {
                    if (a3) throw a3.error;
                  }
                }
                yield f3.close(), e3();
              } catch (n2) {
                o3(n2);
              }
            }))));
            e2.then((() => {
              this.log.debug("preconnect buffer sent successfully", Fs(t2));
            })).catch(((e3) => {
              this.log.error("error sending preconnect buffer", Object.assign(Object.assign({}, Fs(t2)), { error: e3 }));
            }));
          }
        }
        return P2;
      }));
    }
    canPublishFrameMetadata() {
      var e2;
      return !!(this.roomOptions.e2ee || this.roomOptions.encryption || Ec(null !== (e2 = this.roomOptions.frameMetadata) && void 0 !== e2 ? e2 : this.roomOptions.packetTrailer));
    }
    normalizeRequestedFrameMetadataOptions(e2, t2) {
      var n2;
      const i2 = null !== (n2 = t2.frameMetadata) && void 0 !== n2 ? n2 : t2.packetTrailer;
      if (e2.kind !== Ws.Kind.Video || !Cc(i2)) return t2.frameMetadata = void 0, t2.packetTrailer = void 0, [];
      if (!this.canPublishFrameMetadata()) return this.log.warn("frame metadata transform not supported; not advertising features", Object.assign(Object.assign({}, this.logContext), Fs(e2))), t2.frameMetadata = void 0, t2.packetTrailer = void 0, [];
      const r2 = (function(e3) {
        const t3 = [];
        return (null == e3 ? void 0 : e3.timestamp) && t3.push(ut.PTF_USER_TIMESTAMP), (null == e3 ? void 0 : e3.frameId) && t3.push(ut.PTF_FRAME_ID), t3;
      })(i2), o2 = (function(e3) {
        if (!e3 || 0 === e3.length) return;
        const t3 = {};
        return e3.includes(ut.PTF_USER_TIMESTAMP) && (t3.timestamp = true), e3.includes(ut.PTF_FRAME_ID) && (t3.frameId = true), t3.timestamp || t3.frameId ? t3 : void 0;
      })(r2);
      return t2.frameMetadata = o2, t2.packetTrailer = o2, r2;
    }
    get isLocal() {
      return true;
    }
    publishAdditionalCodecForTrack(e2, t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        var i2;
        if (this.encryptionType !== yt.NONE) return;
        let r2;
        if (this.trackPublications.forEach(((t3) => {
          t3.track && t3.track === e2 && (r2 = t3);
        })), !r2) throw new ts("track is not published");
        if (!Ka(e2)) throw new ts("track is not a video track");
        const o2 = Object.assign(Object.assign({}, null === (i2 = this.roomOptions) || void 0 === i2 ? void 0 : i2.publishDefaults), n2), s2 = Al(e2, t2, o2);
        if (!s2) return void this.log.info("backup codec has been disabled, ignoring request to add additional codec for track", Fs(e2));
        const a2 = e2.addSimulcastTrack(t2, s2);
        if (!a2) return;
        const c2 = this.normalizeRequestedFrameMetadataOptions(e2, o2), d2 = e2.mediaStreamTrack.getSettings(), l2 = d2.width, u2 = d2.height, h2 = l2 && u2 ? { width: l2, height: u2 } : void 0;
        h2 || this.log.warn("could not determine track dimensions, publishing backup codec without layers", Fs(e2));
        const p2 = h2 ? ql(h2.width, h2.height, s2) : [], m2 = new Kn({ cid: a2.mediaStreamTrack.id, type: Ws.kindToProto(e2.kind), muted: e2.isMuted, source: Ws.sourceToProto(e2.source), sid: e2.sid, width: null == h2 ? void 0 : h2.width, height: null == h2 ? void 0 : h2.height, packetTrailerFeatures: c2, layers: p2, simulcastCodecs: [{ codec: o2.videoCodec, cid: a2.mediaStreamTrack.id, layers: p2 }] });
        if (!this.engine || this.engine.isClosed) throw new is("cannot publish track when not connected");
        const g2 = (yield Promise.all([this.engine.addTrack(m2), (() => kr(this, void 0, void 0, (function* () {
          yield this.engine.createSimulcastSender(e2, a2, o2, s2), yield this.engine.negotiate();
        })))()]))[0];
        this.log.debug("published ".concat(t2, " for track ").concat(e2.sid), { encodings: s2, trackInfo: g2 });
      }));
    }
    unpublishTrack(t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        var r2, o2;
        if (Va(t2)) {
          const e2 = this.pendingPublishPromises.get(t2);
          e2 && (this.log.debug("awaiting publish promise before attempting to unpublish", Fs(t2)), yield e2);
        }
        const s2 = this.getPublicationForTrack(t2), a2 = s2 ? Fs(s2) : void 0;
        if (this.log.info("unpublishing track", a2), !s2 || !s2.track) return void this.log.warn("track was not unpublished because no publication was found", a2);
        (t2 = s2.track).off(e.TrackEvent.Muted, this.onTrackMuted), t2.off(e.TrackEvent.Unmuted, this.onTrackUnmuted), t2.off(e.TrackEvent.Ended, this.handleTrackEnded), t2.off(e.TrackEvent.UpstreamPaused, this.onTrackUpstreamPaused), t2.off(e.TrackEvent.UpstreamResumed, this.onTrackUpstreamResumed), t2.off(e.TrackEvent.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate), void 0 === i2 && (i2 = null === (o2 = null === (r2 = this.roomOptions) || void 0 === r2 ? void 0 : r2.stopLocalTrackOnUnpublish) || void 0 === o2 || o2), i2 ? t2.stop() : t2.stopMonitor();
        let c2 = false;
        const d2 = t2.sender;
        if (t2.sender = void 0, this.engine.pcManager && this.engine.pcManager.currentState < al.FAILED && d2) try {
          for (const e2 of this.engine.pcManager.publisher.getTransceivers()) e2.sender === d2 && (e2.direction = "inactive", c2 = true);
          try {
            c2 = this.engine.removeTrack(d2);
          } catch (n2) {
            this.log.warn(n2), c2 = true;
          }
          if (Ka(t2)) {
            for (const e2 of t2.simulcastCodecs) {
              const t3 = j(e2, 2)[1];
              if (t3.sender) {
                try {
                  c2 = this.engine.removeTrack(t3.sender);
                } catch (n2) {
                  this.log.warn(n2), c2 = true;
                }
                t3.sender = void 0;
              }
            }
            t2.simulcastCodecs.clear();
          }
        } catch (n2) {
          this.log.warn("failed to unpublish track", Object.assign(Object.assign({}, a2), { error: n2 }));
        }
        switch (this.trackPublications.delete(s2.trackSid), s2.kind) {
          case Ws.Kind.Audio:
            this.audioTrackPublications.delete(s2.trackSid);
            break;
          case Ws.Kind.Video:
            this.videoTrackPublications.delete(s2.trackSid);
        }
        return this.emit(e.ParticipantEvent.LocalTrackUnpublished, s2), s2.setTrack(void 0), c2 && (yield this.engine.negotiate()), s2;
      }));
    }
    unpublishTracks(e2) {
      return kr(this, void 0, void 0, (function* () {
        return (yield Promise.all(e2.map(((e3) => this.unpublishTrack(e3))))).filter(((e3) => !!e3));
      }));
    }
    republishAllTracks(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let n2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (function* () {
          t2.republishPromise && (yield t2.republishPromise), t2.republishPromise = new No(((i2, r2) => kr(t2, void 0, void 0, (function* () {
            try {
              const t3 = [];
              this.trackPublications.forEach(((n3) => {
                n3.track && (e3 && (n3.options = Object.assign(Object.assign({}, n3.options), e3)), t3.push(n3));
              })), yield Promise.all(t3.map(((e4) => kr(this, void 0, void 0, (function* () {
                const t4 = e4.track;
                yield this.unpublishTrack(t4, false), !n2 || t4.isMuted || t4.source === Ws.Source.ScreenShare || t4.source === Ws.Source.ScreenShareAudio || !za(t4) && !Ka(t4) || t4.isUserProvided || (this.log.debug("restarting existing track", { track: e4.trackSid }), yield t4.restartTrack()), yield this.publishOrRepublishTrack(t4, e4.options, true);
              }))))), i2();
            } catch (t3) {
              t3 instanceof Error ? r2(t3) : r2(new Error(String(t3)));
            } finally {
              this.republishPromise = void 0;
            }
          })))), yield t2.republishPromise;
        })();
      }));
    }
    publishData(e2) {
      return kr(this, arguments, void 0, (function(e3) {
        var t2 = this;
        let n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return (function* () {
          const i2 = n2.reliable ? cl.RELIABLE : cl.LOSSY, r2 = n2.reliable ? Lt.RELIABLE : Lt.LOSSY, o2 = n2.destinationIdentities, s2 = n2.topic;
          let a2 = new jt({ participantIdentity: t2.identity, payload: e3, destinationIdentities: o2, topic: s2 });
          const c2 = new At({ kind: r2, value: { case: "user", value: a2 } });
          yield t2.engine.sendDataPacket(c2, i2);
        })();
      }));
    }
    publishDtmf(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = new At({ kind: Lt.RELIABLE, value: { case: "sipDtmf", value: new Bt({ code: e2, digit: t2 }) } });
        yield this.engine.sendDataPacket(n2, cl.RELIABLE);
      }));
    }
    sendChatMessage(t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        const i2 = { id: crypto.randomUUID(), message: t2, timestamp: Date.now(), attachedFiles: null == n2 ? void 0 : n2.attachments }, r2 = new At({ value: { case: "chatMessage", value: new Wt(Object.assign(Object.assign({}, i2), { timestamp: R.parse(i2.timestamp) })) } });
        return yield this.engine.sendDataPacket(r2, cl.RELIABLE), this.emit(e.ParticipantEvent.ChatMessage, i2), i2;
      }));
    }
    editChatMessage(t2, n2) {
      return kr(this, void 0, void 0, (function* () {
        const i2 = Object.assign(Object.assign({}, n2), { message: t2, editTimestamp: Date.now() }), r2 = new At({ value: { case: "chatMessage", value: new Wt(Object.assign(Object.assign({}, i2), { timestamp: R.parse(i2.timestamp), editTimestamp: R.parse(i2.editTimestamp) })) } });
        return yield this.engine.sendDataPacket(r2, cl.RELIABLE), this.emit(e.ParticipantEvent.ChatMessage, i2), i2;
      }));
    }
    sendText(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        return this.roomOutgoingDataStreamManager.sendText(e2, t2);
      }));
    }
    streamText(e2) {
      return kr(this, void 0, void 0, (function* () {
        return this.roomOutgoingDataStreamManager.streamText(e2);
      }));
    }
    sendFile(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        return this.roomOutgoingDataStreamManager.sendFile(e2, t2);
      }));
    }
    sendBytes(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        return this.roomOutgoingDataStreamManager.sendBytes(e2, t2);
      }));
    }
    streamBytes(e2) {
      return kr(this, void 0, void 0, (function* () {
        return this.roomOutgoingDataStreamManager.streamBytes(e2);
      }));
    }
    performRpc(e2) {
      return this.rpcClientManager.performRpc(e2).then(((e3) => {
        let t2 = j(e3, 2);
        return t2[0], t2[1];
      }));
    }
    registerRpcMethod(e2, t2) {
      this.rpcServerManager.registerRpcMethod(e2, t2);
    }
    unregisterRpcMethod(e2) {
      this.rpcServerManager.unregisterRpcMethod(e2);
    }
    setTrackSubscriptionPermissions(e2) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
      this.participantTrackPermissions = t2, this.allParticipantsAllowedToSubscribe = e2, this.engine.client.isDisconnected || this.updateTrackSubscriptionPermissions();
    }
    setEnabledPublishCodecs(e2) {
      this.enabledPublishVideoCodecs = e2.filter(((e3) => "video" === e3.mime.split("/")[0].toLowerCase()));
    }
    updateInfo(e2) {
      return !!super.updateInfo(e2) && (e2.tracks.forEach(((e3) => {
        var t2, n2;
        const i2 = this.trackPublications.get(e3.sid);
        if (i2) {
          const r2 = i2.isMuted || null !== (n2 = null === (t2 = i2.track) || void 0 === t2 ? void 0 : t2.isUpstreamPaused) && void 0 !== n2 && n2;
          r2 !== e3.muted && (this.log.debug("updating server mute state after reconcile", Object.assign(Object.assign({}, Fs(i2)), { mutedOnServer: r2 })), this.engine.client.sendMuteTrack(e3.sid, r2));
        }
      })), true);
    }
    setActiveAgent(e2) {
      var t2, n2, i2, r2;
      this.firstActiveAgent = e2, e2 && !this.firstActiveAgent && (this.firstActiveAgent = e2), e2 ? null === (n2 = null === (t2 = this.activeAgentFuture) || void 0 === t2 ? void 0 : t2.resolve) || void 0 === n2 || n2.call(t2, e2) : null === (r2 = null === (i2 = this.activeAgentFuture) || void 0 === i2 ? void 0 : i2.reject) || void 0 === r2 || r2.call(i2, new Error("Agent disconnected")), this.activeAgentFuture = void 0;
    }
    waitUntilActiveAgentPresent() {
      return this.firstActiveAgent ? Promise.resolve(this.firstActiveAgent) : (this.activeAgentFuture || (this.activeAgentFuture = new La()), this.activeAgentFuture.promise);
    }
    restartOnDefaultAudioDevice(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, i2;
        try {
          sa() ? yield e2.setDeviceId({ exact: "default" }) : yield e2.restartTrack();
        } catch (n2) {
          if (!(function(e3) {
            return "object" == typeof e3 && null !== e3 && Ua.has(e3);
          })(n2) || (function(e3) {
            return "object" == typeof e3 && null !== e3 && "name" in e3 && ("NotAllowedError" === e3.name || "SecurityError" === e3.name || "PermissionDeniedError" === e3.name || "PermissionDismissedError" === e3.name);
          })(n2) || e2.isStopped) throw n2;
          this.log.debug("could not reacquire the audio device, retrying with an enumerated device", Fs(e2));
          const o2 = yield jc.getInstance().getDevices("audioinput", false);
          yield e2.setDeviceId(null !== (i2 = null === (t2 = null == o2 ? void 0 : o2[0]) || void 0 === t2 ? void 0 : t2.deviceId) && void 0 !== i2 ? i2 : "default");
        }
      }));
    }
    getPublicationForTrack(e2) {
      let t2;
      return this.trackPublications.forEach(((n2) => {
        const i2 = n2.track;
        i2 && (e2 instanceof MediaStreamTrack ? (za(i2) || Ka(i2)) && i2.mediaStreamTrack === e2 && (t2 = n2) : e2 === i2 && (t2 = n2));
      })), t2;
    }
    waitForPendingPublicationOfSource(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = Date.now();
        for (; Date.now() < t2 + 1e4; ) {
          const t3 = Array.from(this.pendingPublishPromises.entries()).find(((t4) => j(t4, 1)[0].source === e2));
          if (t3) return t3[1];
          yield Js(20);
        }
      }));
    }
    publishDataTrack(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = new nh(e2, this.roomOutgoingDataTrackManager);
        return yield t2.publish(), t2;
      }));
    }
  }
  class wh extends DOMException {
    constructor(e2, t2) {
      super(e2, "AbortError"), this.reason = t2;
    }
  }
  class Rh extends Map {
    constructor() {
      super(...arguments), this.pending = /* @__PURE__ */ new Map();
    }
    set(e2, t2) {
      var n2, i2;
      super.set(e2, t2);
      const r2 = null === (n2 = this.pending) || void 0 === n2 ? void 0 : n2.get(e2);
      if (r2) {
        for (const e3 of r2) e3.isResolved || null === (i2 = e3.resolve) || void 0 === i2 || i2.call(e3, t2);
        this.pending.delete(e2);
      }
      return this;
    }
    get [Symbol.toStringTag]() {
      return "DeferrableMap";
    }
    getDeferred(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = this.get(e2);
        if (void 0 !== n2) return n2;
        if (null == t2 ? void 0 : t2.aborted) throw new wh("The operation was aborted.", t2.reason);
        const i2 = new La(void 0, (() => {
          const t3 = this.pending.get(e2);
          if (!t3) return;
          const n3 = t3.indexOf(i2);
          -1 !== n3 && t3.splice(n3, 1), 0 === t3.length && this.pending.delete(e2);
        })), r2 = this.pending.get(e2);
        if (r2 ? r2.push(i2) : this.pending.set(e2, [i2]), t2) {
          const e3 = () => {
            var e4;
            i2.isResolved || null === (e4 = i2.reject) || void 0 === e4 || e4.call(i2, new wh("The operation was aborted.", t2.reason));
          };
          t2.addEventListener("abort", e3, { once: true }), i2.promise.finally((() => {
            t2.removeEventListener("abort", e3);
          }));
        }
        return i2.promise;
      }));
    }
  }
  class Ph extends vh {
    constructor(t2, n2, i2, r2) {
      super(t2, n2.sid, n2.name, r2), this.track = void 0, this.allowed = true, this.requestedDisabled = void 0, this.visible = true, this.handleEnded = (t3) => {
        this.setTrack(void 0), this.emit(e.TrackEvent.Ended, t3);
      }, this.handleVisibilityChange = (e2) => {
        this.log.debug("adaptivestream video visibility ".concat(this.trackSid, ", visible=").concat(e2), this.logContext), this.visible = e2, this.emitTrackUpdate();
      }, this.handleVideoDimensionsChange = (e2) => {
        this.log.debug("adaptivestream video dimensions ".concat(e2.width, "x").concat(e2.height), this.logContext), this.videoDimensionsAdaptiveStream = e2, this.emitTrackUpdate();
      }, this.subscribed = i2, this.updateInfo(n2);
    }
    setSubscribed(t2) {
      const n2 = this.subscriptionStatus, i2 = this.permissionStatus;
      this.subscribed = t2, t2 && (this.allowed = true);
      const r2 = new si({ trackSids: [this.trackSid], subscribe: this.subscribed, participantTracks: [new Jt({ participantSid: "", trackSids: [this.trackSid] })] });
      this.emit(e.TrackEvent.UpdateSubscription, r2), this.emitSubscriptionUpdateIfChanged(n2), this.emitPermissionUpdateIfChanged(i2);
    }
    get subscriptionStatus() {
      return false === this.subscribed ? vh.SubscriptionStatus.Unsubscribed : super.isSubscribed ? vh.SubscriptionStatus.Subscribed : vh.SubscriptionStatus.Desired;
    }
    get permissionStatus() {
      return this.allowed ? vh.PermissionStatus.Allowed : vh.PermissionStatus.NotAllowed;
    }
    get isSubscribed() {
      return false !== this.subscribed && super.isSubscribed;
    }
    get isDesired() {
      return false !== this.subscribed;
    }
    get isEnabled() {
      return void 0 !== this.requestedDisabled ? !this.requestedDisabled : !this.isAdaptiveStream || this.visible;
    }
    get isLocal() {
      return false;
    }
    setEnabled(e2) {
      this.isManualOperationAllowed() && this.requestedDisabled !== !e2 && (this.requestedDisabled = !e2, this.emitTrackUpdate());
    }
    setVideoQuality(e2) {
      this.isManualOperationAllowed() && this.requestedMaxQuality !== e2 && (this.requestedMaxQuality = e2, this.requestedVideoDimensions = void 0, this.emitTrackUpdate());
    }
    setVideoDimensions(e2) {
      var t2, n2;
      this.isManualOperationAllowed() && ((null === (t2 = this.requestedVideoDimensions) || void 0 === t2 ? void 0 : t2.width) === e2.width && (null === (n2 = this.requestedVideoDimensions) || void 0 === n2 ? void 0 : n2.height) === e2.height || (Qa(this.track) && (this.requestedVideoDimensions = e2), this.requestedMaxQuality = void 0, this.emitTrackUpdate()));
    }
    setVideoFPS(e2) {
      this.isManualOperationAllowed() && Qa(this.track) && this.fps !== e2 && (this.fps = e2, this.emitTrackUpdate());
    }
    get videoQuality() {
      var t2;
      return null !== (t2 = this.requestedMaxQuality) && void 0 !== t2 ? t2 : e.VideoQuality.HIGH;
    }
    setTrack(t2) {
      const n2 = this.subscriptionStatus, i2 = this.permissionStatus, r2 = this.track;
      r2 !== t2 && (r2 && (r2.off(e.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange), r2.off(e.TrackEvent.VisibilityChanged, this.handleVisibilityChange), r2.off(e.TrackEvent.Ended, this.handleEnded), r2.detach(), r2.stopMonitor(), this.emit(e.TrackEvent.Unsubscribed, r2)), super.setTrack(t2), t2 && (t2.sid = this.trackSid, t2.on(e.TrackEvent.VideoDimensionsChanged, this.handleVideoDimensionsChange), t2.on(e.TrackEvent.VisibilityChanged, this.handleVisibilityChange), t2.on(e.TrackEvent.Ended, this.handleEnded), this.emit(e.TrackEvent.Subscribed, t2)), this.emitPermissionUpdateIfChanged(i2), this.emitSubscriptionUpdateIfChanged(n2));
    }
    setAllowed(e2) {
      const t2 = this.subscriptionStatus, n2 = this.permissionStatus;
      this.allowed = e2, this.emitPermissionUpdateIfChanged(n2), this.emitSubscriptionUpdateIfChanged(t2);
    }
    setSubscriptionError(t2) {
      this.emit(e.TrackEvent.SubscriptionFailed, t2);
    }
    updateInfo(t2) {
      super.updateInfo(t2);
      const n2 = this.metadataMuted;
      this.metadataMuted = t2.muted, this.track ? this.track.setMuted(t2.muted) : n2 !== t2.muted && this.emit(t2.muted ? e.TrackEvent.Muted : e.TrackEvent.Unmuted);
    }
    emitSubscriptionUpdateIfChanged(t2) {
      const n2 = this.subscriptionStatus;
      t2 !== n2 && this.emit(e.TrackEvent.SubscriptionStatusChanged, n2, t2);
    }
    emitPermissionUpdateIfChanged(t2) {
      this.permissionStatus !== t2 && this.emit(e.TrackEvent.SubscriptionPermissionChanged, this.permissionStatus, t2);
    }
    isManualOperationAllowed() {
      return !!this.isDesired || (this.log.warn("cannot update track settings when not subscribed", this.logContext), false);
    }
    get isAdaptiveStream() {
      return Qa(this.track) && this.track.isAdaptiveStream;
    }
    emitTrackUpdate() {
      const t2 = new pi({ trackSids: [this.trackSid], disabled: !this.isEnabled, fps: this.fps });
      if (this.kind === Ws.Kind.Video) {
        let n2 = this.requestedVideoDimensions;
        if (void 0 !== this.videoDimensionsAdaptiveStream) if (n2) {
          Bs(this.videoDimensionsAdaptiveStream, n2) && (this.log.debug("using adaptive stream dimensions instead of requested", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), n2 = this.videoDimensionsAdaptiveStream);
        } else if (void 0 !== this.requestedMaxQuality && this.trackInfo) {
          const e2 = (function(e3, t3) {
            var n3;
            return null === (n3 = e3.layers) || void 0 === n3 ? void 0 : n3.find(((e4) => e4.quality === t3));
          })(this.trackInfo, this.requestedMaxQuality);
          e2 && Bs(this.videoDimensionsAdaptiveStream, e2) && (this.log.debug("using adaptive stream dimensions instead of max quality layer", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), n2 = this.videoDimensionsAdaptiveStream);
        } else this.log.debug("using adaptive stream dimensions", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), n2 = this.videoDimensionsAdaptiveStream;
        n2 ? (t2.width = Math.ceil(n2.width), t2.height = Math.ceil(n2.height)) : void 0 !== this.requestedMaxQuality ? (this.log.debug("using requested max quality", Object.assign(Object.assign({}, this.logContext), { quality: this.requestedMaxQuality })), t2.quality = this.requestedMaxQuality) : (this.log.debug("using default quality", Object.assign(Object.assign({}, this.logContext), { quality: e.VideoQuality.HIGH })), t2.quality = e.VideoQuality.HIGH);
      }
      this.emit(e.TrackEvent.UpdateSettings, t2);
    }
  }
  class Ih extends Eh {
    static fromParticipantInfo(e2, t2, n2, i2) {
      return new Ih(e2, t2.sid, t2.identity, t2.name, t2.metadata, t2.attributes, n2, t2.kind, t2.dataTracks.map(((e3) => {
        const n3 = Yc.from(e3);
        return new Au(n3, i2, { publisherIdentity: t2.identity });
      })), t2.clientProtocol, t2.capabilities);
    }
    get logContext() {
      return Object.assign(Object.assign({}, super.logContext), { remoteParticipantID: this.sid, remoteParticipant: this.identity });
    }
    constructor(e2, t2, n2, i2, r2, o2, s2) {
      let a2 = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : ft.STANDARD, c2 = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : [], d2 = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 0, l2 = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : [];
      super(t2, n2 || "", i2, r2, o2, s2, a2), this.signalClient = e2, this.trackPublications = /* @__PURE__ */ new Map(), this.audioTrackPublications = /* @__PURE__ */ new Map(), this.videoTrackPublications = /* @__PURE__ */ new Map(), this.dataTracks = new Rh(c2.map(((e3) => [e3.info.name, e3]))), this.volumeMap = /* @__PURE__ */ new Map(), this.clientProtocol = d2, this.capabilities = l2;
    }
    addTrackPublication(t2) {
      super.addTrackPublication(t2), t2.on(e.TrackEvent.UpdateSettings, ((e2) => {
        this.log.debug("send update settings", Object.assign(Object.assign(Object.assign({}, this.logContext), Fs(t2)), { settings: e2 })), this.signalClient.sendUpdateTrackSettings(e2);
      })), t2.on(e.TrackEvent.UpdateSubscription, ((e2) => {
        e2.participantTracks.forEach(((e3) => {
          e3.participantSid = this.sid;
        })), this.signalClient.sendUpdateSubscription(e2);
      })), t2.on(e.TrackEvent.SubscriptionPermissionChanged, ((n2) => {
        this.emit(e.ParticipantEvent.TrackSubscriptionPermissionChanged, t2, n2);
      })), t2.on(e.TrackEvent.SubscriptionStatusChanged, ((n2) => {
        this.emit(e.ParticipantEvent.TrackSubscriptionStatusChanged, t2, n2);
      })), t2.on(e.TrackEvent.Subscribed, ((n2) => {
        this.emit(e.ParticipantEvent.TrackSubscribed, n2, t2);
      })), t2.on(e.TrackEvent.Unsubscribed, ((n2) => {
        this.emit(e.ParticipantEvent.TrackUnsubscribed, n2, t2);
      })), t2.on(e.TrackEvent.SubscriptionFailed, ((n2) => {
        this.emit(e.ParticipantEvent.TrackSubscriptionFailed, t2.trackSid, n2);
      }));
    }
    getTrackPublication(e2) {
      const t2 = super.getTrackPublication(e2);
      if (t2) return t2;
    }
    getTrackPublicationByName(e2) {
      const t2 = super.getTrackPublicationByName(e2);
      if (t2) return t2;
    }
    setVolume(e2) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Ws.Source.Microphone;
      this.volumeMap.set(t2, e2);
      const n2 = this.getTrackPublication(t2);
      n2 && n2.track && n2.track.setVolume(e2);
    }
    getVolume() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Ws.Source.Microphone;
      const t2 = this.getTrackPublication(e2);
      return t2 && t2.track ? t2.track.getVolume() : this.volumeMap.get(e2);
    }
    addSubscribedMediaTrack(t2, n2, i2, r2, o2, s2) {
      let a2 = this.getTrackPublicationBySid(n2);
      if (a2 || n2.startsWith("TR") || this.trackPublications.forEach(((e2) => {
        a2 || t2.kind !== e2.kind.toString() || (a2 = e2);
      })), !a2) return 0 === s2 ? (this.log.error("could not find published track", Object.assign(Object.assign({}, this.logContext), { trackSid: n2 })), void this.emit(e.ParticipantEvent.TrackSubscriptionFailed, n2)) : (void 0 === s2 && (s2 = 20), void setTimeout((() => {
        this.addSubscribedMediaTrack(t2, n2, i2, r2, o2, s2 - 1);
      }), 150));
      if ("ended" === t2.readyState) return this.log.error("unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()", Object.assign(Object.assign({}, this.logContext), Fs(a2))), void this.emit(e.ParticipantEvent.TrackSubscriptionFailed, n2);
      let c2;
      return c2 = "video" === t2.kind ? new _c(t2, n2, r2, o2) : new gh(t2, n2, r2, this.audioContext, this.audioOutput), c2.source = a2.source, c2.isMuted = a2.isMuted, c2.setMediaStream(i2), c2.start(), a2.setTrack(c2), this.volumeMap.has(a2.source) && Ga(c2) && Wa(c2) && c2.setVolume(this.volumeMap.get(a2.source)), a2;
    }
    get hasMetadata() {
      return !!this.participantInfo;
    }
    getTrackPublicationBySid(e2) {
      return this.trackPublications.get(e2);
    }
    updateInfo(t2) {
      if (!super.updateInfo(t2)) return false;
      const n2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Map();
      return t2.tracks.forEach(((e2) => {
        var t3, r2;
        let o2 = this.getTrackPublicationBySid(e2.sid);
        if (o2) o2.updateInfo(e2);
        else {
          const n3 = Ws.kindFromProto(e2.type);
          if (!n3) return;
          o2 = new Ph(n3, e2, null === (t3 = this.signalClient.connectOptions) || void 0 === t3 ? void 0 : t3.autoSubscribe, { loggerContextCb: () => this.logContext, loggerName: null === (r2 = this.loggerOptions) || void 0 === r2 ? void 0 : r2.loggerName }), o2.updateInfo(e2), i2.set(e2.sid, o2);
          const s2 = Array.from(this.trackPublications.values()).find(((e3) => e3.source === (null == o2 ? void 0 : o2.source)));
          s2 && o2.source !== Ws.Source.Unknown && this.log.debug("received a second track publication for ".concat(this.identity, " with the same source: ").concat(o2.source), Object.assign(Object.assign({}, this.logContext), { oldTrack: Fs(s2), newTrack: Fs(o2) })), this.addTrackPublication(o2);
        }
        n2.set(e2.sid, o2);
      })), this.trackPublications.forEach(((e2) => {
        n2.has(e2.trackSid) || (this.log.trace("detected removed track on remote participant, unpublishing", Object.assign(Object.assign({}, this.logContext), Fs(e2))), this.unpublishTrack(e2.trackSid, true));
      })), i2.forEach(((t3) => {
        this.emit(e.ParticipantEvent.TrackPublished, t3);
      })), true;
    }
    unpublishTrack(t2, n2) {
      const i2 = this.trackPublications.get(t2);
      if (!i2) return;
      const r2 = i2.track;
      switch (r2 && (r2.stop(), i2.setTrack(void 0)), this.trackPublications.delete(t2), i2.kind) {
        case Ws.Kind.Audio:
          this.audioTrackPublications.delete(t2);
          break;
        case Ws.Kind.Video:
          this.videoTrackPublications.delete(t2);
      }
      n2 && this.emit(e.ParticipantEvent.TrackUnpublished, i2);
    }
    setAudioOutput(e2) {
      return kr(this, void 0, void 0, (function* () {
        this.audioOutput = e2;
        const t2 = [];
        this.audioTrackPublications.forEach(((n2) => {
          var i2;
          Wa(n2.track) && Ga(n2.track) && t2.push(n2.track.setSinkId(null !== (i2 = e2.deviceId) && void 0 !== i2 ? i2 : "default"));
        })), yield Promise.all(t2);
      }));
    }
    addRemoteDataTrack(e2) {
      this.dataTracks.set(e2.info.name, e2);
    }
    removeRemoteDataTrack(e2) {
      for (const n2 of this.dataTracks.entries()) {
        var t2 = j(n2, 2);
        const i2 = t2[0];
        e2 === t2[1].info.sid && this.dataTracks.delete(i2);
      }
    }
    emit(e2) {
      for (var t2 = arguments.length, n2 = new Array(t2 > 1 ? t2 - 1 : 0), i2 = 1; i2 < t2; i2++) n2[i2 - 1] = arguments[i2];
      return this.log.trace("participant event", Object.assign(Object.assign({}, this.logContext), { event: e2, args: n2 })), super.emit(e2, ...n2);
    }
  }
  e.ConnectionState = void 0, (Sh = e.ConnectionState || (e.ConnectionState = {})).Disconnected = "disconnected", Sh.Connecting = "connecting", Sh.Connected = "connected", Sh.Reconnecting = "reconnecting", Sh.SignalReconnecting = "signalReconnecting";
  let _h;
  class Mh extends wr.EventEmitter {
    get hasE2EESetup() {
      return void 0 !== this.e2eeManager;
    }
    constructor(t2) {
      var i2, o2, s2, a2, c2, d2, l2, u2;
      if (super(), i2 = this, this.state = e.ConnectionState.Disconnected, this.activeSpeakers = [], this.isE2EEEnabled = false, this.audioEnabled = true, this.ownsAudioContext = false, this.audioContextReleased = false, this.audioContextMutex = new r(), this.acquiredEmptyAudioTracks = /* @__PURE__ */ new Set(), this.e2eeStateMutex = new r(), this.isVideoPlaybackBlocked = false, this.log = ar, this.statsLog = ar, this.bufferedEvents = [], this.isResuming = false, this.pendingTrackAddedCallbacks = /* @__PURE__ */ new Map(), this.connect = (t3, n2, i3) => kr(this, void 0, void 0, (function* () {
        var r2;
        if (!ra()) throw ma() ? Error("WebRTC isn't detected, have you called registerGlobals?") : Error("LiveKit doesn't seem to be supported on this browser. Try to update your browser and make sure no browser extensions are disabling webRTC.");
        const o3 = yield this.disconnectLock.lock();
        if (this.state === e.ConnectionState.Connected) return this.log.info("already connected to room ".concat(this.name)), o3(), Promise.resolve();
        if (this.connectFuture) return o3(), this.connectFuture.promise;
        this.setAndEmitConnectionState(e.ConnectionState.Connecting), (null === (r2 = this.regionUrlProvider) || void 0 === r2 ? void 0 : r2.getServerUrl().toString()) !== ic(t3) && (this.regionUrl = void 0, this.regionUrlProvider = void 0), ga(new URL(t3)) && (void 0 === this.regionUrlProvider ? this.regionUrlProvider = new Jl(t3, n2) : this.regionUrlProvider.updateToken(n2), this.regionUrlProvider.fetchRegionSettings().then(((e2) => {
          var t4;
          null === (t4 = this.regionUrlProvider) || void 0 === t4 || t4.setServerReportedRegions(e2);
        })).catch(((e2) => {
          this.log.warn("could not fetch region settings", { error: e2 });
        })));
        const s3 = (r3, a4, c3) => kr(this, void 0, void 0, (function* () {
          var d3, l3;
          this.abortController && this.abortController.abort();
          const u3 = new AbortController();
          this.abortController = u3, null == o3 || o3();
          try {
            if (yield Uc.getInstance().getBackOffPromise(t3), u3.signal.aborted) throw Zo.cancelled("Connection attempt aborted");
            yield this.attemptConnection(null != c3 ? c3 : t3, n2, i3, u3), this.abortController = void 0, r3();
          } catch (h2) {
            if (this.regionUrlProvider && h2 instanceof Zo && $o(h2)) {
              let n3 = null;
              try {
                this.log.debug("Fetching next region"), n3 = yield this.regionUrlProvider.getNextBestRegionUrl(null === (d3 = this.abortController) || void 0 === d3 ? void 0 : d3.signal);
              } catch (p2) {
                if (p2 instanceof Zo && (401 === p2.status || p2.reason === e.ConnectionErrorReason.Cancelled)) return this.handleDisconnect(this.options.stopLocalTrackOnUnpublish), void a4(p2);
              }
              [e.ConnectionErrorReason.InternalError, e.ConnectionErrorReason.ServerUnreachable, e.ConnectionErrorReason.Timeout].includes(h2.reason) && (this.log.debug("Adding failed connection attempt to back off"), Uc.getInstance().addFailedConnectionAttempt(t3)), n3 && !(null === (l3 = this.abortController) || void 0 === l3 ? void 0 : l3.signal.aborted) ? (this.log.info("Initial connection failed with ConnectionError: ".concat(h2.message, ". Retrying with another region: ").concat(n3)), this.recreateEngine(true), yield s3(r3, a4, n3)) : (this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, ja(h2)), a4(h2));
            } else {
              let e2 = at.UNKNOWN_REASON;
              h2 instanceof Zo && (e2 = ja(h2)), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, e2), a4(h2);
            }
          }
        })), a3 = this.regionUrl;
        return this.regionUrl = void 0, this.connectFuture = new La(((e2, t4) => {
          s3(e2, t4, a3);
        }), (() => {
          this.clearConnectionFutures();
        })), this.connectFuture.promise;
      })), this.connectSignal = (e2, t3, n2, i3, r2, o3) => kr(this, void 0, void 0, (function* () {
        const s3 = yield n2.join(e2, t3, { autoSubscribe: i3.autoSubscribe, adaptiveStream: "object" == typeof r2.adaptiveStream || r2.adaptiveStream, disableIceLite: i3.disableIceLite, subscriberAllowPause: i3.subscriberAllowPause, clientInfoCapabilities: this.getClientInfoCapabilities(r2), maxRetries: i3.maxRetries, e2eeEnabled: !!this.e2eeManager, websocketTimeout: i3.websocketTimeout }, o3.signal, !r2.singlePeerConnection), a3 = s3.joinResponse, c3 = s3.serverInfo;
        if (this.serverInfo = c3, !c3.version) throw new ns("unknown server version");
        return "0.15.1" === c3.version && this.options.dynacast && (this.log.debug("disabling dynacast due to server version"), r2.dynacast = false), a3;
      })), this.applyJoinResponse = (e2) => {
        const t3 = e2.participant;
        if (this.localParticipant.sid = t3.sid, this.localParticipant.identity = t3.identity, this.localParticipant.setEnabledPublishCodecs(e2.enabledPublishCodecs), this.e2eeManager) try {
          this.e2eeManager.setSifTrailer(e2.sifTrailer);
        } catch (n2) {
          this.log.error(n2 instanceof Error ? n2.message : "Could not set SifTrailer", { error: n2 });
        }
        this.handleParticipantUpdates([t3, ...e2.otherParticipants]), e2.room && this.handleRoomUpdate(e2.room);
      }, this.attemptConnection = (t3, i3, r2, o3) => kr(this, void 0, void 0, (function* () {
        var s3, a3;
        this.state === e.ConnectionState.Reconnecting || this.isResuming || (null === (s3 = this.engine) || void 0 === s3 ? void 0 : s3.pendingReconnect) ? (this.log.info("Reconnection attempt replaced by new connection attempt"), this.recreateEngine(true)) : this.maybeCreateEngine(), (null === (a3 = this.regionUrlProvider) || void 0 === a3 ? void 0 : a3.isCloud()) && this.engine.setRegionStrategy(this.createRegionStrategy()), this.acquireAudioContext(true).catch(((e2) => this.log.warn("Could not acquire audio context", Object.assign(Object.assign({}, this.logContext), { error: e2 })))), this.connOptions = Object.assign(Object.assign({}, sl), r2), this.connOptions.rtcConfig && (this.engine.rtcConfig = this.connOptions.rtcConfig), this.connOptions.peerConnectionTimeout && (this.engine.peerConnectionTimeout = this.connOptions.peerConnectionTimeout);
        try {
          const n2 = yield this.connectSignal(t3, i3, this.engine, this.connOptions, this.options, o3);
          this.applyJoinResponse(n2), this.setupLocalParticipantEvents(), this.emit(e.RoomEvent.SignalConnected);
        } catch (c3) {
          yield this.engine.close(), this.recreateEngine();
          const e2 = o3.signal.aborted ? Zo.cancelled("Signal connection aborted") : Zo.serverUnreachable("could not establish signal connection");
          throw c3 instanceof Error && (e2.message = "".concat(e2.message, ": ").concat(c3.message)), c3 instanceof Zo && (e2.reason = c3.reason, e2.status = c3.status), this.log.debug("error trying to establish signal connection", { error: c3 }), e2;
        }
        if (o3.signal.aborted) throw yield this.engine.close(), this.recreateEngine(), Zo.cancelled("Connection attempt aborted");
        try {
          yield this.engine.waitForPCInitialConnection(this.connOptions.peerConnectionTimeout, o3);
        } catch (n2) {
          throw yield this.engine.close(), this.recreateEngine(), n2;
        }
        pa() && this.options.disconnectOnPageLeave && (window.addEventListener("pagehide", this.onPageLeave), window.addEventListener("beforeunload", this.onPageLeave)), pa() && window.addEventListener("freeze", this.onPageLeave), this.setAndEmitConnectionState(e.ConnectionState.Connected), this.emit(e.RoomEvent.Connected), Uc.getInstance().resetFailedConnectionAttempts(t3), this.registerConnectionReconcile(), this.regionUrlProvider && this.regionUrlProvider.notifyConnected();
      })), this.disconnect = function() {
        for (var t3 = arguments.length, n2 = new Array(t3), r2 = 0; r2 < t3; r2++) n2[r2] = arguments[r2];
        return kr(i2, [...n2], void 0, (function() {
          var t4 = this;
          let n3 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          return (function* () {
            var i3, r3, o3;
            const s3 = yield t4.disconnectLock.lock();
            try {
              if (t4.state === e.ConnectionState.Disconnected) return void t4.log.debug("already disconnected");
              if (t4.log.info("disconnect from room"), t4.state === e.ConnectionState.Connecting || t4.state === e.ConnectionState.Reconnecting || t4.isResuming) {
                const e2 = "Abort connection attempt due to user initiated disconnect";
                t4.log.warn(e2), null === (i3 = t4.abortController) || void 0 === i3 || i3.abort(e2), null === (o3 = null === (r3 = t4.connectFuture) || void 0 === r3 ? void 0 : r3.reject) || void 0 === o3 || o3.call(r3, Zo.cancelled("Client initiated disconnect")), t4.connectFuture = void 0;
              }
              t4.engine && (t4.engine.client.isDisconnected || (yield t4.engine.client.sendLeave()), yield t4.engine.close()), t4.handleDisconnect(n3, at.CLIENT_INITIATED), t4.engine = void 0;
            } finally {
              s3();
            }
          })();
        }));
      }, this.onPageLeave = () => kr(this, void 0, void 0, (function* () {
        this.log.info("Page leave detected, disconnecting"), yield this.disconnect();
      })), this.startAudio = () => kr(this, void 0, void 0, (function* () {
        const e2 = [], t3 = Fo();
        t3 && "iOS" === t3.os && !this.audioContextReleased && e2.push(this.acquireDummyAudioElement()), this.remoteParticipants.forEach(((t4) => {
          t4.audioTrackPublications.forEach(((t5) => {
            t5.track && t5.track.attachedElements.forEach(((t6) => {
              e2.push(t6);
            }));
          }));
        }));
        try {
          yield Promise.all([...this.audioContextReleased ? [] : [this.acquireAudioContext()], ...e2.map(((e3) => (this.options.webAudioMix || (e3.muted = false), e3.play())))]), this.handleAudioPlaybackStarted();
        } catch (n2) {
          throw this.handleAudioPlaybackFailed(n2), n2;
        }
      })), this.startVideo = () => kr(this, void 0, void 0, (function* () {
        const e2 = [];
        for (const t3 of this.remoteParticipants.values()) t3.videoTrackPublications.forEach(((t4) => {
          var n2;
          null === (n2 = t4.track) || void 0 === n2 || n2.attachedElements.forEach(((t5) => {
            e2.includes(t5) || e2.push(t5);
          }));
        }));
        yield Promise.all(e2.map(((e3) => e3.play()))).then((() => {
          this.handleVideoPlaybackStarted();
        })).catch(((e3) => {
          "NotAllowedError" === e3.name ? this.handleVideoPlaybackFailed() : this.log.warn("Resuming video playback failed, make sure you call `startVideo` directly in a user gesture handler");
        }));
      })), this.handleRestarting = () => {
        this.clearConnectionReconcile(), this.isResuming = false;
        for (const e2 of this.remoteParticipants.values()) this.handleParticipantDisconnected(e2.identity, e2);
        this.setAndEmitConnectionState(e.ConnectionState.Reconnecting) && this.emit(e.RoomEvent.Reconnecting);
      }, this.handleRestarted = () => {
        this.outgoingDataTrackManager.sfuWillRepublishTracks(), this.incomingDataTrackManager.resendSubscriptionUpdates();
      }, this.handleSignalRestarted = (t3) => kr(this, void 0, void 0, (function* () {
        this.log.debug("signal reconnected to server, region ".concat(t3.serverRegion), { region: t3.serverRegion }), this.bufferedEvents = [], this.applyJoinResponse(t3);
        try {
          yield this.localParticipant.republishAllTracks(void 0, true);
        } catch (n2) {
          this.log.error("error trying to re-publish tracks after reconnection", { error: n2 });
        }
        try {
          yield this.engine.waitForRestarted(), this.log.debug("fully reconnected to server", { region: t3.serverRegion });
        } catch (o3) {
          return;
        }
        this.setAndEmitConnectionState(e.ConnectionState.Connected), this.emit(e.RoomEvent.Reconnected), this.registerConnectionReconcile(), this.emitBufferedEvents();
      })), this.handleParticipantUpdates = (e2) => {
        var t3;
        for (const i3 of e2) {
          if (i3.identity === this.localParticipant.identity) {
            this.localParticipant.updateInfo(i3);
            continue;
          }
          "" === i3.identity && (i3.identity = null !== (t3 = this.sidToIdentity.get(i3.sid)) && void 0 !== t3 ? t3 : "");
          let e3 = this.remoteParticipants.get(i3.identity);
          i3.state === vt.DISCONNECTED ? this.handleParticipantDisconnected(i3.identity, e3, i3.disconnectReason === at.UNKNOWN_REASON ? void 0 : i3.disconnectReason) : this.getOrCreateParticipant(i3.identity, i3);
        }
        const n2 = new Map(e2.filter(((e3) => e3.identity !== this.localParticipant.identity)).map(((e3) => [e3.identity, e3.dataTracks.map(((e4) => Yc.from(e4)))])));
        this.incomingDataTrackManager.receiveSfuPublicationUpdates(n2);
      }, this.handleActiveSpeakersUpdate = (t3) => {
        const n2 = [], i3 = {};
        t3.forEach(((e2) => {
          if (i3[e2.sid] = true, e2.sid === this.localParticipant.sid) this.localParticipant.audioLevel = e2.level, this.localParticipant.setIsSpeaking(true), n2.push(this.localParticipant);
          else {
            const t4 = this.getRemoteParticipantBySid(e2.sid);
            t4 && (t4.audioLevel = e2.level, t4.setIsSpeaking(true), n2.push(t4));
          }
        })), i3[this.localParticipant.sid] || (this.localParticipant.audioLevel = 0, this.localParticipant.setIsSpeaking(false)), this.remoteParticipants.forEach(((e2) => {
          i3[e2.sid] || (e2.audioLevel = 0, e2.setIsSpeaking(false));
        })), this.activeSpeakers = n2, this.emitWhenConnected(e.RoomEvent.ActiveSpeakersChanged, n2);
      }, this.handleSpeakersChanged = (t3) => {
        const n2 = /* @__PURE__ */ new Map();
        this.activeSpeakers.forEach(((e2) => {
          const t4 = this.remoteParticipants.get(e2.identity);
          t4 && t4.sid !== e2.sid || n2.set(e2.sid, e2);
        })), t3.forEach(((e2) => {
          let t4 = this.getRemoteParticipantBySid(e2.sid);
          e2.sid === this.localParticipant.sid && (t4 = this.localParticipant), t4 && (t4.audioLevel = e2.level, t4.setIsSpeaking(e2.active), e2.active ? n2.set(e2.sid, t4) : n2.delete(e2.sid));
        }));
        const i3 = Array.from(n2.values());
        i3.sort(((e2, t4) => t4.audioLevel - e2.audioLevel)), this.activeSpeakers = i3, this.emitWhenConnected(e.RoomEvent.ActiveSpeakersChanged, i3);
      }, this.handleStreamStateUpdate = (t3) => {
        t3.streamStates.forEach(((t4) => {
          const n2 = this.getRemoteParticipantBySid(t4.participantSid);
          if (!n2) return;
          const i3 = n2.getTrackPublicationBySid(t4.trackSid);
          if (!i3 || !i3.track) return;
          const r2 = Ws.streamStateFromProto(t4.state), o3 = i3.track.streamState;
          i3.track.setStreamState(r2), r2 !== o3 && (n2.emit(e.ParticipantEvent.TrackStreamStateChanged, i3, i3.track.streamState), this.emitWhenConnected(e.RoomEvent.TrackStreamStateChanged, i3, i3.track.streamState, n2));
        }));
      }, this.handleSubscriptionPermissionUpdate = (e2) => {
        const t3 = this.getRemoteParticipantBySid(e2.participantSid);
        if (!t3) return;
        const n2 = t3.getTrackPublicationBySid(e2.trackSid);
        n2 && n2.setAllowed(e2.allowed);
      }, this.handleSubscriptionError = (e2) => {
        this.cancelPendingTrackAdded(e2.trackSid);
        const t3 = Array.from(this.remoteParticipants.values()).find(((t4) => t4.trackPublications.has(e2.trackSid)));
        if (!t3) return;
        const n2 = t3.getTrackPublicationBySid(e2.trackSid);
        n2 && n2.setSubscriptionError(e2.err);
      }, this.handleDataPacket = (e2, t3) => {
        const n2 = this.remoteParticipants.get(e2.participantIdentity);
        if ("user" === e2.value.case) this.handleUserPacket(n2, e2.value.value, e2.kind, t3, e2.participantIdentity);
        else if ("transcription" === e2.value.case) this.handleTranscription(n2, e2.value.value);
        else if ("sipDtmf" === e2.value.case) this.handleSipDtmf(n2, e2.value.value);
        else if ("chatMessage" === e2.value.case) this.handleChatMessage(n2, e2.value.value);
        else if ("metrics" === e2.value.case) this.handleMetrics(e2.value.value, n2);
        else if ("streamHeader" === e2.value.case || "streamChunk" === e2.value.case || "streamTrailer" === e2.value.case) this.handleDataStream(e2, t3);
        else if ("rpcRequest" === e2.value.case) {
          const t4 = e2.value.value;
          this.rpcServerManager.handleIncomingRpcRequest(e2.participantIdentity, t4);
        } else if ("rpcResponse" === e2.value.case) {
          const t4 = e2.value.value;
          switch (t4.value.case) {
            case "payload":
              this.rpcClientManager.handleIncomingRpcResponseSuccess(t4.requestId, t4.value.value);
              break;
            case "error":
              this.rpcClientManager.handleIncomingRpcResponseFailure(t4.requestId, ah.fromProto(t4.value.value));
              break;
            default:
              this.log.warn("Unknown rpcResponse.value.case: ".concat(t4.value.case), this.logContext);
          }
        } else "rpcAck" === e2.value.case && this.rpcClientManager.handleIncomingRpcAck(e2.value.value.requestId);
      }, this.handleUserPacket = (t3, n2, i3, r2, o3) => {
        this.emit(e.RoomEvent.DataReceived, n2.payload, t3, i3, n2.topic, r2, o3), null == t3 || t3.emit(e.ParticipantEvent.DataReceived, n2.payload, i3, r2);
      }, this.handleSipDtmf = (t3, n2) => {
        this.emit(e.RoomEvent.SipDTMFReceived, n2, t3), null == t3 || t3.emit(e.ParticipantEvent.SipDTMFReceived, n2);
      }, this.handleTranscription = (t3, n2) => {
        const i3 = n2.transcribedParticipantIdentity === this.localParticipant.identity ? this.localParticipant : this.getParticipantByIdentity(n2.transcribedParticipantIdentity), r2 = null == i3 ? void 0 : i3.trackPublications.get(n2.trackId), o3 = (function(e2, t4) {
          return e2.segments.map(((e3) => {
            let n3 = e3.id, i4 = e3.text, r3 = e3.language, o4 = e3.startTime, s3 = e3.endTime, a3 = e3.final;
            var c3;
            const d3 = null !== (c3 = t4.get(n3)) && void 0 !== c3 ? c3 : Date.now(), l3 = Date.now();
            return a3 ? t4.delete(n3) : t4.set(n3, d3), { id: n3, text: i4, startTime: Number.parseInt(o4.toString()), endTime: Number.parseInt(s3.toString()), final: a3, language: r3, firstReceivedTime: d3, lastReceivedTime: l3 };
          }));
        })(n2, this.transcriptionReceivedTimes);
        null == r2 || r2.emit(e.TrackEvent.TranscriptionReceived, o3), null == i3 || i3.emit(e.ParticipantEvent.TranscriptionReceived, o3, r2), this.emit(e.RoomEvent.TranscriptionReceived, o3, i3, r2);
      }, this.handleChatMessage = (t3, n2) => {
        const i3 = (function(e2) {
          const t4 = e2.id, n3 = e2.timestamp, i4 = e2.message, r2 = e2.editTimestamp;
          return { id: t4, timestamp: Number.parseInt(n3.toString()), editTimestamp: r2 ? Number.parseInt(r2.toString()) : void 0, message: i4 };
        })(n2);
        this.emit(e.RoomEvent.ChatMessage, i3, t3);
      }, this.handleMetrics = (t3, n2) => {
        this.emit(e.RoomEvent.MetricsReceived, t3, n2);
      }, this.handleDataStream = (e2, t3) => {
        this.incomingDataStreamManager.handleDataStreamPacket(e2, t3);
      }, this.bufferedSegments = /* @__PURE__ */ new Map(), this.handleAudioPlaybackStarted = () => {
        this.canPlaybackAudio || (this.audioEnabled = true, this.emit(e.RoomEvent.AudioPlaybackStatusChanged, true));
      }, this.handleAudioPlaybackFailed = (t3) => {
        this.log.warn("could not playback audio", { error: t3 }), this.canPlaybackAudio && (this.audioEnabled = false, this.emit(e.RoomEvent.AudioPlaybackStatusChanged, false));
      }, this.handleVideoPlaybackStarted = () => {
        this.isVideoPlaybackBlocked && (this.isVideoPlaybackBlocked = false, this.emit(e.RoomEvent.VideoPlaybackStatusChanged, true));
      }, this.handleVideoPlaybackFailed = () => {
        this.isVideoPlaybackBlocked || (this.isVideoPlaybackBlocked = true, this.emit(e.RoomEvent.VideoPlaybackStatusChanged, false));
      }, this.handleDeviceChange = () => kr(this, void 0, void 0, (function* () {
        var t3;
        "iOS" !== (null === (t3 = Fo()) || void 0 === t3 ? void 0 : t3.os) && (yield this.selectDefaultDevices()), this.emit(e.RoomEvent.MediaDevicesChanged);
      })), this.handleRoomUpdate = (t3) => {
        const n2 = this.roomInfo;
        this.roomInfo = t3, n2 && n2.metadata !== t3.metadata && this.emitWhenConnected(e.RoomEvent.RoomMetadataChanged, t3.metadata), (null == n2 ? void 0 : n2.activeRecording) !== t3.activeRecording && this.emitWhenConnected(e.RoomEvent.RecordingStatusChanged, t3.activeRecording);
      }, this.handleConnectionQualityUpdate = (e2) => {
        e2.updates.forEach(((e3) => {
          if (e3.participantSid === this.localParticipant.sid) return void this.localParticipant.setConnectionQuality(e3.quality);
          const t3 = this.getRemoteParticipantBySid(e3.participantSid);
          t3 && t3.setConnectionQuality(e3.quality);
        }));
      }, this.getRemoteParticipantClientProtocol = (e2) => {
        var t3, n2;
        return null !== (n2 = null === (t3 = this.remoteParticipants.get(e2)) || void 0 === t3 ? void 0 : t3.clientProtocol) && void 0 !== n2 ? n2 : 0;
      }, this.getRemoteParticipantCapabilities = (e2) => {
        var t3, n2;
        return null !== (n2 = null === (t3 = this.remoteParticipants.get(e2)) || void 0 === t3 ? void 0 : t3.capabilities) && void 0 !== n2 ? n2 : [];
      }, this.getAllRemoteParticipantIdentities = () => Array.from(this.remoteParticipants.keys()), this.logWebRTCStats = () => kr(this, void 0, void 0, (function* () {
        var e2, t3, n2, i3;
        const r2 = null === (e2 = this.engine) || void 0 === e2 ? void 0 : e2.pcManager;
        if (r2) try {
          const e3 = j(yield Promise.all([r2.publisher.getStats(), null === (t3 = r2.subscriber) || void 0 === t3 ? void 0 : t3.getStats()]), 2), o3 = e3[0], s3 = e3[1], a3 = o3 && vs(o3), c3 = s3 && vs(s3);
          this.statsLog.info("webrtc stats", { publisher: null == a3 ? void 0 : a3.connection, subscriber: null == c3 ? void 0 : c3.connection, inbound: [...null !== (n2 = null == a3 ? void 0 : a3.inbound) && void 0 !== n2 ? n2 : [], ...null !== (i3 = null == c3 ? void 0 : c3.inbound) && void 0 !== i3 ? i3 : []], outbound: null == a3 ? void 0 : a3.outbound });
        } catch (o3) {
          this.statsLog.debug("could not collect webrtc stats", { error: o3 });
        }
      })), this.onLocalParticipantMetadataChanged = (t3) => {
        this.emit(e.RoomEvent.ParticipantMetadataChanged, t3, this.localParticipant);
      }, this.onLocalParticipantNameChanged = (t3) => {
        this.emit(e.RoomEvent.ParticipantNameChanged, t3, this.localParticipant);
      }, this.onLocalAttributesChanged = (t3) => {
        this.emit(e.RoomEvent.ParticipantAttributesChanged, t3, this.localParticipant);
      }, this.onLocalTrackMuted = (t3) => {
        this.emit(e.RoomEvent.TrackMuted, t3, this.localParticipant);
      }, this.onLocalTrackUnmuted = (t3) => {
        this.emit(e.RoomEvent.TrackUnmuted, t3, this.localParticipant);
      }, this.onTrackProcessorUpdate = (e2) => {
        var t3;
        null === (t3 = null == e2 ? void 0 : e2.onPublish) || void 0 === t3 || t3.call(e2, this);
      }, this.onLocalTrackPublished = (t3) => kr(this, void 0, void 0, (function* () {
        var n2, i3, r2, o3, s3, a3;
        if (null === (n2 = t3.track) || void 0 === n2 || n2.on(e.TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate), null === (i3 = t3.track) || void 0 === i3 || i3.on(e.TrackEvent.Restarted, this.onLocalTrackRestarted), null === (s3 = null === (o3 = null === (r2 = t3.track) || void 0 === r2 ? void 0 : r2.getProcessor()) || void 0 === o3 ? void 0 : o3.onPublish) || void 0 === s3 || s3.call(o3, this), this.emit(e.RoomEvent.LocalTrackPublished, t3, this.localParticipant), za(t3.track)) {
          (yield t3.track.checkForSilence()) && this.emit(e.RoomEvent.LocalAudioSilenceDetected, t3);
        }
        const c3 = yield null === (a3 = t3.track) || void 0 === a3 ? void 0 : a3.getDeviceId(false), d3 = Ls(t3.source);
        d3 && c3 && c3 !== this.localParticipant.activeDeviceMap.get(d3) && (this.localParticipant.activeDeviceMap.set(d3, c3), this.emit(e.RoomEvent.ActiveDeviceChanged, d3, c3));
      })), this.onLocalTrackUnpublished = (t3) => {
        var n2, i3;
        null === (n2 = t3.track) || void 0 === n2 || n2.off(e.TrackEvent.TrackProcessorUpdate, this.onTrackProcessorUpdate), null === (i3 = t3.track) || void 0 === i3 || i3.off(e.TrackEvent.Restarted, this.onLocalTrackRestarted), this.emit(e.RoomEvent.LocalTrackUnpublished, t3, this.localParticipant);
      }, this.onLocalTrackRestarted = (t3) => kr(this, void 0, void 0, (function* () {
        const n2 = yield t3.getDeviceId(false), i3 = Ls(t3.source);
        i3 && n2 && n2 !== this.localParticipant.activeDeviceMap.get(i3) && (this.log.debug("local track restarted, setting ".concat(i3, " ").concat(n2, " active")), this.localParticipant.activeDeviceMap.set(i3, n2), this.emit(e.RoomEvent.ActiveDeviceChanged, i3, n2));
      })), this.onLocalConnectionQualityChanged = (t3) => {
        this.emit(e.RoomEvent.ConnectionQualityChanged, t3, this.localParticipant);
      }, this.onMediaDevicesError = (t3, n2) => {
        this.emit(e.RoomEvent.MediaDevicesError, t3, n2);
      }, this.onLocalParticipantPermissionsChanged = (t3) => {
        this.emit(e.RoomEvent.ParticipantPermissionsChanged, t3, this.localParticipant);
      }, this.onLocalChatMessageSent = (t3) => {
        this.emit(e.RoomEvent.ChatMessage, t3, this.localParticipant);
      }, this.setMaxListeners(100), this.remoteParticipants = /* @__PURE__ */ new Map(), this.sidToIdentity = /* @__PURE__ */ new Map(), this.options = Object.assign(Object.assign({}, ol), t2), this.log = dr(null !== (o2 = this.options.loggerName) && void 0 !== o2 ? o2 : e.LoggerNames.Room, (() => this.logContext)), this.statsLog = dr(e.LoggerNames.Stats, (() => this.logContext)), this.transcriptionReceivedTimes = /* @__PURE__ */ new Map(), this.options.audioCaptureDefaults = Object.assign(Object.assign({}, il), null == t2 ? void 0 : t2.audioCaptureDefaults), this.options.videoCaptureDefaults = Object.assign(Object.assign({}, rl), null == t2 ? void 0 : t2.videoCaptureDefaults), this.options.publishDefaults = Object.assign(Object.assign({}, nl), null == t2 ? void 0 : t2.publishDefaults), this.maybeCreateEngine(), this.incomingDataStreamManager = new iu(null === (s2 = this.options.dataStream) || void 0 === s2 ? void 0 : s2.maxPayloadByteLength), this.outgoingDataStreamManager = new gu(this.engine, this.log, this.getRemoteParticipantClientProtocol, this.getRemoteParticipantCapabilities, this.getAllRemoteParticipantIdentities), this.incomingDataTrackManager = new zu({ e2eeManager: this.e2eeManager }), this.incomingDataTrackManager.on("sfuUpdateSubscription", ((e2) => {
        this.engine.client.sendUpdateDataSubscription(e2.sid, e2.subscribe);
      })).on("trackPublished", ((t3) => {
        var n2;
        t3.track.publisherIdentity !== this.localParticipant.identity && (this.emit(e.RoomEvent.DataTrackPublished, t3.track), null === (n2 = this.remoteParticipants.get(t3.track.publisherIdentity)) || void 0 === n2 || n2.addRemoteDataTrack(t3.track));
      })).on("trackUnpublished", ((t3) => {
        var n2;
        t3.publisherIdentity !== this.localParticipant.identity && (this.emit(e.RoomEvent.DataTrackUnpublished, t3.sid), null === (n2 = this.remoteParticipants.get(t3.publisherIdentity)) || void 0 === n2 || n2.removeRemoteDataTrack(t3.sid));
      })), this.outgoingDataTrackManager = new sh({ e2eeManager: this.e2eeManager }), this.outgoingDataTrackManager.on("sfuPublishRequest", ((e2) => {
        this.engine.client.sendPublishDataTrackRequest(e2.handle, e2.name, e2.usesE2ee);
      })).on("sfuUnpublishRequest", ((e2) => {
        this.engine.client.sendUnPublishDataTrackRequest(e2.handle);
      })).on("trackPublished", ((t3) => {
        this.emit(e.RoomEvent.LocalDataTrackPublished, t3.track);
      })).on("trackUnpublished", ((t3) => {
        this.emit(e.RoomEvent.LocalDataTrackUnpublished, t3.sid);
      })).on("packetAvailable", ((e2) => {
        let t3 = e2.handle, n2 = e2.bytes;
        this.engine.sendDataTrackFrame(n2).finally((() => this.outgoingDataTrackManager.handlePacketSendComplete(t3)));
      })), this.registerRpcDataStreamHandler(), this.rpcClientManager = new ph(this.log, this.outgoingDataStreamManager, this.getRemoteParticipantClientProtocol, (() => {
        var e2;
        return null === (e2 = this.engine) || void 0 === e2 ? void 0 : e2.serverVersion;
      })), this.rpcClientManager.on("sendDataPacket", ((e2) => {
        let t3 = e2.packet;
        var n2;
        null === (n2 = this.engine) || void 0 === n2 || n2.sendDataPacket(t3, cl.RELIABLE);
      })), this.rpcServerManager = new mh(this.log, this.outgoingDataStreamManager, this.getRemoteParticipantClientProtocol), this.rpcServerManager.on("sendDataPacket", ((e2) => {
        let t3 = e2.packet;
        var n2;
        null === (n2 = this.engine) || void 0 === n2 || n2.sendDataPacket(t3, cl.RELIABLE);
      })), this.disconnectLock = new r(), this.localParticipant = new Ch("", "", this.engine, this.options, this.outgoingDataStreamManager, this.outgoingDataTrackManager, this.rpcClientManager, this.rpcServerManager), this.setupFrameMetadata(), (this.options.e2ee || this.options.encryption) && this.setupE2EE(), this.engine.e2eeManager = this.e2eeManager, this.incomingDataTrackManager.updateE2eeManager(null !== (a2 = this.e2eeManager) && void 0 !== a2 ? a2 : null), this.outgoingDataTrackManager.updateE2eeManager(null !== (c2 = this.e2eeManager) && void 0 !== c2 ? c2 : null), this.options.videoCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("videoinput", xa(this.options.videoCaptureDefaults.deviceId)), this.options.audioCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("audioinput", xa(this.options.audioCaptureDefaults.deviceId)), (null === (d2 = this.options.audioOutput) || void 0 === d2 ? void 0 : d2.deviceId) && this.switchActiveDevice("audiooutput", xa(this.options.audioOutput.deviceId)).catch(((e2) => this.log.warn("Could not set audio output: ".concat(e2.message)))), pa()) {
        const e2 = new AbortController();
        let t3;
        if (Mh.cleanupRegistry) {
          const n2 = new WeakRef(this);
          t3 = () => {
            const e3 = n2.deref();
            e3 && e3.handleDeviceChange();
          }, Mh.cleanupRegistry.register(this, (() => {
            e2.abort();
          }));
        } else t3 = this.handleDeviceChange;
        null === (u2 = null === (l2 = navigator.mediaDevices) || void 0 === l2 ? void 0 : l2.addEventListener) || void 0 === u2 || u2.call(l2, "devicechange", t3, { signal: e2.signal });
      }
    }
    registerTextStreamHandler(e2, t2) {
      return this.incomingDataStreamManager.registerTextStreamHandler(e2, t2);
    }
    unregisterTextStreamHandler(e2) {
      return this.incomingDataStreamManager.unregisterTextStreamHandler(e2);
    }
    registerByteStreamHandler(e2, t2) {
      return this.incomingDataStreamManager.registerByteStreamHandler(e2, t2);
    }
    unregisterByteStreamHandler(e2) {
      return this.incomingDataStreamManager.unregisterByteStreamHandler(e2);
    }
    registerRpcMethod(e2, t2) {
      this.rpcServerManager.registerRpcMethod(e2, t2);
    }
    unregisterRpcMethod(e2) {
      this.rpcServerManager.unregisterRpcMethod(e2);
    }
    setE2EEEnabled(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = yield this.e2eeStateMutex.lock();
        try {
          if (!this.e2eeManager) throw Error("e2ee not configured, please set e2ee settings within the room options");
          this.isE2EEEnabled !== e2 && (yield this.localParticipant.setE2EEEnabled(e2), "" !== this.localParticipant.identity && this.e2eeManager.setParticipantCryptorEnabled(e2, this.localParticipant.identity));
        } finally {
          t2();
        }
      }));
    }
    setupE2EE() {
      var t2, n2;
      const i2 = !!this.options.encryption, r2 = this.options.encryption || this.options.e2ee;
      r2 && ("e2eeManager" in r2 ? (this.e2eeManager = r2.e2eeManager, this.e2eeManager.isDataChannelEncryptionEnabled = i2) : this.e2eeManager = new Ac(r2, i2), this.e2eeManager.on(e.EncryptionEvent.ParticipantEncryptionStatusChanged, ((t3, n3) => {
        Ya(n3) && (this.isE2EEEnabled = t3), this.emit(e.RoomEvent.ParticipantEncryptionStatusChanged, t3, n3);
      })), this.e2eeManager.on(e.EncryptionEvent.EncryptionError, ((t3, n3) => {
        const i3 = n3 ? this.getParticipantByIdentity(n3) : void 0;
        this.emit(e.RoomEvent.EncryptionError, t3, i3);
      })), null === (t2 = this.e2eeManager) || void 0 === t2 || t2.setup(this), null === (n2 = this.e2eeManager) || void 0 === n2 || n2.setupEngine(this.engine));
    }
    setupFrameMetadata() {
      var e2;
      const t2 = null !== (e2 = this.options.frameMetadata) && void 0 !== e2 ? e2 : this.options.packetTrailer;
      this.frameMetadataManager = new Nc(t2), this.frameMetadataManager.setup(this);
    }
    get logContext() {
      var e2, t2, n2;
      return { room: this.name, roomID: null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.sid, participant: null === (t2 = this.localParticipant) || void 0 === t2 ? void 0 : t2.identity, participantID: null === (n2 = this.localParticipant) || void 0 === n2 ? void 0 : n2.sid };
    }
    get isRecording() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.activeRecording) && void 0 !== t2 && t2;
    }
    getSid() {
      return this.state === e.ConnectionState.Disconnected ? No.resolve("") : this.roomInfo && "" !== this.roomInfo.sid ? No.resolve(this.roomInfo.sid) : new No(((t2, n2) => {
        const i2 = (n3) => {
          "" !== n3.sid && (this.engine.off(e.EngineEvent.RoomUpdate, i2), t2(n3.sid));
        };
        this.engine.on(e.EngineEvent.RoomUpdate, i2), this.once(e.RoomEvent.Disconnected, (() => {
          this.engine.off(e.EngineEvent.RoomUpdate, i2), n2(new is("Room disconnected before room server id was available"));
        }));
      }));
    }
    get name() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.name) && void 0 !== t2 ? t2 : "";
    }
    get metadata() {
      var e2;
      return null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.metadata;
    }
    get numParticipants() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.numParticipants) && void 0 !== t2 ? t2 : 0;
    }
    get numPublishers() {
      var e2, t2;
      return null !== (t2 = null === (e2 = this.roomInfo) || void 0 === e2 ? void 0 : e2.numPublishers) && void 0 !== t2 ? t2 : 0;
    }
    maybeCreateEngine() {
      (!this.engine || !this.engine.isNewlyCreated && this.engine.isClosed) && (this.engine = new Hl(this.options), this.engine.e2eeManager = this.e2eeManager, this.engine.on(e.EngineEvent.ParticipantUpdate, this.handleParticipantUpdates).on(e.EngineEvent.RoomUpdate, this.handleRoomUpdate).on(e.EngineEvent.SpeakersChanged, this.handleSpeakersChanged).on(e.EngineEvent.StreamStateChanged, this.handleStreamStateUpdate).on(e.EngineEvent.ConnectionQualityUpdate, this.handleConnectionQualityUpdate).on(e.EngineEvent.SubscriptionError, this.handleSubscriptionError).on(e.EngineEvent.SubscriptionPermissionUpdate, this.handleSubscriptionPermissionUpdate).on(e.EngineEvent.MediaTrackAdded, ((e2, t2, n2) => {
        this.onTrackAdded(e2, t2, n2);
      })).on(e.EngineEvent.Disconnected, ((e2) => {
        this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, e2);
      })).on(e.EngineEvent.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate).on(e.EngineEvent.DataPacketReceived, this.handleDataPacket).on(e.EngineEvent.Resuming, (() => {
        this.clearConnectionReconcile(), this.isResuming = true, this.log.debug("Resuming signal connection"), this.setAndEmitConnectionState(e.ConnectionState.SignalReconnecting) && this.emit(e.RoomEvent.SignalReconnecting);
      })).on(e.EngineEvent.Resumed, (() => {
        this.registerConnectionReconcile(), this.isResuming = false, this.log.debug("Resumed signal connection"), this.updateSubscriptions(), this.setAndEmitConnectionState(e.ConnectionState.Connected) && this.emit(e.RoomEvent.Reconnected), this.emitBufferedEvents();
      })).on(e.EngineEvent.SignalResumed, (() => {
        (this.state === e.ConnectionState.Reconnecting || this.isResuming) && this.sendSyncState(), this.emitBufferedEvents();
      })).on(e.EngineEvent.Restarting, this.handleRestarting).on(e.EngineEvent.Restarted, this.handleRestarted).on(e.EngineEvent.SignalRestarted, this.handleSignalRestarted).on(e.EngineEvent.Offline, (() => {
        this.setAndEmitConnectionState(e.ConnectionState.Reconnecting) && this.emit(e.RoomEvent.Reconnecting);
      })).on(e.EngineEvent.DCBufferStatusChanged, ((t2, n2) => {
        this.emit(e.RoomEvent.DCBufferStatusChanged, t2, n2);
      })).on(e.EngineEvent.LocalTrackSubscribed, ((e2) => {
        this.handleLocalTrackSubscribed(e2);
      })).on(e.EngineEvent.RoomMoved, ((t2) => {
        this.log.debug("room moved", t2), t2.room && this.handleRoomUpdate(t2.room), this.remoteParticipants.forEach(((e2, t3) => {
          this.handleParticipantDisconnected(t3, e2);
        })), this.emit(e.RoomEvent.Moved, t2.room.name), t2.participant ? this.handleParticipantUpdates([t2.participant, ...t2.otherParticipants]) : this.handleParticipantUpdates(t2.otherParticipants);
      })).on(e.EngineEvent.PublishDataTrackResponse, ((e2) => {
        e2.info ? this.outgoingDataTrackManager.receivedSfuPublishResponse(e2.info.pubHandle, { type: "ok", data: { sid: e2.info.sid, pubHandle: e2.info.pubHandle, name: e2.info.name, usesE2ee: e2.info.encryption !== yt.NONE } }) : this.log.warn("received PublishDataTrackResponse, but event.info was ".concat(e2.info, ", so skipping."));
      })).on(e.EngineEvent.UnPublishDataTrackResponse, ((e2) => {
        e2.info ? this.outgoingDataTrackManager.receivedSfuUnpublishResponse(e2.info.pubHandle) : this.log.warn("received UnPublishDataTrackResponse, but event.info was ".concat(e2.info, ", so skipping."));
      })).on(e.EngineEvent.DataTrackSubscriberHandles, ((e2) => {
        const t2 = new Map(Object.entries(e2.subHandles).map(((e3) => {
          let t3 = j(e3, 2), n2 = t3[0], i2 = t3[1];
          return [parseInt(n2, 10), i2.trackSid];
        })));
        this.incomingDataTrackManager.receivedSfuSubscriberHandles(t2);
      })).on(e.EngineEvent.DataTrackPacketReceived, ((e2) => {
        try {
          this.incomingDataTrackManager.packetReceived(e2);
        } catch (t2) {
          throw t2;
        }
      })).on(e.EngineEvent.Joined, ((e2) => {
        const t2 = new Map(e2.otherParticipants.map(((e3) => [e3.identity, e3.dataTracks.map(((e4) => Yc.from(e4)))])));
        this.incomingDataTrackManager.receiveSfuPublicationUpdates(t2);
      })).on(e.EngineEvent.TokenRefreshed, ((e2) => {
        var t2;
        null === (t2 = this.regionUrlProvider) || void 0 === t2 || t2.updateToken(e2);
      })).on(e.EngineEvent.ServerRegionsReported, ((e2) => {
        var t2;
        null === (t2 = this.regionUrlProvider) || void 0 === t2 || t2.setServerReportedRegions({ regionSettings: e2, updatedAtInMs: Date.now(), maxAgeInMs: Gl });
      })).on(e.EngineEvent.RequestSubscribedCodecRefresh, (() => {
        for (const e2 of this.localParticipant.videoTrackPublications.values()) Ka(e2.track) && e2.track.refreshSubscribedCodecs();
      })), this.localParticipant && this.localParticipant.setupEngine(this.engine), this.e2eeManager && this.e2eeManager.setupEngine(this.engine), this.outgoingDataStreamManager && this.outgoingDataStreamManager.setupEngine(this.engine));
    }
    createRegionStrategy() {
      return { getNextUrl: (e2) => kr(this, void 0, void 0, (function* () {
        return this.regionUrlProvider ? this.regionUrlProvider.getNextBestRegionUrl(e2) : null;
      })), resetAttempts: () => {
        var e2;
        return null === (e2 = this.regionUrlProvider) || void 0 === e2 ? void 0 : e2.resetAttempts();
      } };
    }
    static getLocalDevices(e2) {
      let t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      return jc.getInstance().getDevices(e2, t2);
    }
    prepareConnection(t2, i2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.state === e.ConnectionState.Disconnected) {
          this.log.debug("prepareConnection to ".concat(t2));
          try {
            if (ga(new URL(t2)) && i2) {
              this.regionUrlProvider = new Jl(t2, i2);
              const n2 = yield this.regionUrlProvider.getNextBestRegionUrl();
              n2 && this.state === e.ConnectionState.Disconnected && (this.regionUrl = n2, yield fetch(Fa(n2), { method: "HEAD" }), this.log.debug("prepared connection to ".concat(n2)));
            } else yield fetch(Fa(t2), { method: "HEAD" });
          } catch (n2) {
            this.log.warn("could not prepare connection", { error: n2 });
          }
        }
      }));
    }
    getParticipantByIdentity(e2) {
      return this.localParticipant.identity === e2 ? this.localParticipant : this.remoteParticipants.get(e2);
    }
    clearConnectionFutures() {
      this.connectFuture = void 0;
    }
    simulateScenario(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        let n2, i2 = () => kr(this, void 0, void 0, (function* () {
        }));
        switch (e2) {
          case "signal-reconnect":
            const r2 = "number" == typeof t2 ? t2 : 0;
            yield this.engine.client.handleOnClose("simulate disconnect", void 0, r2);
            break;
          case "fail-on-v1-path":
            this.engine.failNextV1Path();
            break;
          case "speaker":
            n2 = new Fi({ scenario: { case: "speakerUpdate", value: 3 } });
            break;
          case "node-failure":
            n2 = new Fi({ scenario: { case: "nodeFailure", value: true } });
            break;
          case "server-leave":
            n2 = new Fi({ scenario: { case: "serverLeave", value: true } });
            break;
          case "migration":
            n2 = new Fi({ scenario: { case: "migration", value: true } });
            break;
          case "resume-reconnect":
            this.engine.failNext(), yield this.engine.client.handleOnClose("simulate resume-disconnect");
            break;
          case "disconnect-signal-on-resume":
            i2 = () => kr(this, void 0, void 0, (function* () {
              yield this.engine.client.handleOnClose("simulate resume-disconnect");
            })), n2 = new Fi({ scenario: { case: "disconnectSignalOnResume", value: true } });
            break;
          case "disconnect-signal-on-resume-no-messages":
            i2 = () => kr(this, void 0, void 0, (function* () {
              yield this.engine.client.handleOnClose("simulate resume-disconnect");
            })), n2 = new Fi({ scenario: { case: "disconnectSignalOnResumeNoMessages", value: true } });
            break;
          case "full-reconnect":
            this.engine.fullReconnectOnNext = true, yield this.engine.client.handleOnClose("simulate full-reconnect");
            break;
          case "force-tcp":
          case "force-tls":
            n2 = new Fi({ scenario: { case: "switchCandidateProtocol", value: "force-tls" === e2 ? 2 : 1 } }), i2 = () => kr(this, void 0, void 0, (function* () {
              const e3 = this.engine.client.onLeave;
              e3 && e3(new vi({ reason: at.CLIENT_INITIATED, action: fi.RECONNECT }));
            }));
            break;
          case "subscriber-bandwidth":
            if (void 0 === t2 || "number" != typeof t2) throw new Error("subscriber-bandwidth requires a number as argument");
            n2 = new Fi({ scenario: { case: "subscriberBandwidth", value: qa(t2) } });
            break;
          case "leave-full-reconnect":
            n2 = new Fi({ scenario: { case: "leaveRequestFullReconnect", value: true } });
        }
        n2 && (yield this.engine.client.sendSimulateScenario(n2), yield i2());
      }));
    }
    acquireDummyAudioElement() {
      _h || (_h = (function() {
        const e3 = document.createElement("audio");
        e3.id = "livekit-dummy-audio-el", e3.autoplay = true, e3.hidden = true;
        const t3 = Oa();
        t3.enabled = true;
        const n2 = new MediaStream([t3]);
        return e3.srcObject = n2, document.body.append(e3), { element: e3, stream: n2, track: t3, refCount: 0 };
      })());
      const e2 = _h;
      if (this.releaseDummyAudioElement) return e2.element;
      e2.refCount += 1;
      const t2 = () => {
        e2.element.srcObject = document.hidden ? null : e2.stream, document.hidden || (this.log.debug("page visible again, triggering startAudio to resume playback and update playback status"), this.startAudio().catch(((e3) => this.log.warn("Could not restart audio on page becoming visible", Object.assign(Object.assign({}, this.logContext), { error: e3 })))));
      };
      return document.addEventListener("visibilitychange", t2), this.releaseDummyAudioElement = () => {
        this.releaseDummyAudioElement = void 0, document.removeEventListener("visibilitychange", t2), e2.refCount -= 1, e2.refCount > 0 || (e2.element.srcObject = null, e2.element.remove(), _h = void 0, Aa(e2.track).catch(((e3) => this.log.warn("Could not release the dummy audio element track", Object.assign(Object.assign({}, this.logContext), { error: e3 })))));
      }, e2.element;
    }
    acquireEmptyAudioStreamTrack() {
      const e2 = Oa();
      return this.acquiredEmptyAudioTracks.add(e2), e2;
    }
    releaseAcquiredEmptyAudioTrack(e2) {
      this.acquiredEmptyAudioTracks.delete(e2) && Aa(e2).catch(((e3) => this.log.warn("Could not release empty audio stream track", Object.assign(Object.assign({}, this.logContext), { error: e3 }))));
    }
    releaseAcquiredEmptyAudioTracks() {
      for (const e2 of this.acquiredEmptyAudioTracks) this.releaseAcquiredEmptyAudioTrack(e2);
    }
    get canPlaybackAudio() {
      return this.audioEnabled;
    }
    get canPlaybackVideo() {
      return !this.isVideoPlaybackBlocked;
    }
    getActiveDevice(e2) {
      return this.localParticipant.activeDeviceMap.get(e2);
    }
    switchActiveDevice(t2, i2) {
      return kr(this, arguments, void 0, (function(t3, i3) {
        var r2 = this;
        let o2 = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
        return (function* () {
          var s2, a2, c2, d2, l2, u2, h2;
          let p2 = true, m2 = false;
          const g2 = o2 ? { exact: i3 } : i3;
          if ("audioinput" === t3) {
            m2 = 0 === r2.localParticipant.audioTrackPublications.size;
            const e2 = null !== (s2 = r2.getActiveDevice(t3)) && void 0 !== s2 ? s2 : r2.options.audioCaptureDefaults.deviceId;
            r2.options.audioCaptureDefaults.deviceId = g2;
            const i4 = Array.from(r2.localParticipant.audioTrackPublications.values()).filter(((e3) => e3.source === Ws.Source.Microphone));
            try {
              p2 = (yield Promise.all(i4.map(((e3) => {
                var t4;
                return null === (t4 = e3.audioTrack) || void 0 === t4 ? void 0 : t4.setDeviceId(g2);
              })))).every(((e3) => true === e3));
            } catch (n2) {
              throw r2.options.audioCaptureDefaults.deviceId = e2, n2;
            }
            const o3 = i4.some(((e3) => {
              var t4, n2;
              return null !== (n2 = null === (t4 = e3.track) || void 0 === t4 ? void 0 : t4.isMuted) && void 0 !== n2 && n2;
            }));
            p2 && o3 && (m2 = true);
          } else if ("videoinput" === t3) {
            m2 = 0 === r2.localParticipant.videoTrackPublications.size;
            const e2 = null !== (a2 = r2.getActiveDevice(t3)) && void 0 !== a2 ? a2 : r2.options.videoCaptureDefaults.deviceId;
            r2.options.videoCaptureDefaults.deviceId = g2;
            const i4 = Array.from(r2.localParticipant.videoTrackPublications.values()).filter(((e3) => e3.source === Ws.Source.Camera));
            try {
              p2 = (yield Promise.all(i4.map(((e3) => {
                var t4;
                return null === (t4 = e3.videoTrack) || void 0 === t4 ? void 0 : t4.setDeviceId(g2);
              })))).every(((e3) => true === e3));
            } catch (n2) {
              throw r2.options.videoCaptureDefaults.deviceId = e2, n2;
            }
            const o3 = i4.some(((e3) => {
              var t4, n2;
              return null !== (n2 = null === (t4 = e3.track) || void 0 === t4 ? void 0 : t4.isMuted) && void 0 !== n2 && n2;
            }));
            p2 && o3 && (m2 = true);
          } else if ("audiooutput" === t3) {
            if (m2 = true, !ia() && !r2.options.webAudioMix || r2.options.webAudioMix && r2.audioContext && !("setSinkId" in r2.audioContext)) throw new Error("cannot switch audio output, the current browser does not support it");
            r2.options.webAudioMix && (i3 = null !== (c2 = yield jc.getInstance().normalizeDeviceId("audiooutput", i3)) && void 0 !== c2 ? c2 : ""), null !== (d2 = (h2 = r2.options).audioOutput) && void 0 !== d2 || (h2.audioOutput = {});
            const e2 = null !== (l2 = r2.getActiveDevice(t3)) && void 0 !== l2 ? l2 : r2.options.audioOutput.deviceId;
            r2.options.audioOutput.deviceId = i3;
            try {
              r2.options.webAudioMix && (null === (u2 = r2.audioContext) || void 0 === u2 || u2.setSinkId(i3)), yield Promise.all(Array.from(r2.remoteParticipants.values()).map(((e3) => e3.setAudioOutput({ deviceId: i3 }))));
            } catch (n2) {
              throw r2.options.audioOutput.deviceId = e2, n2;
            }
          }
          return m2 && (r2.localParticipant.activeDeviceMap.set(t3, i3), r2.emit(e.RoomEvent.ActiveDeviceChanged, t3, i3)), p2;
        })();
      }));
    }
    setupLocalParticipantEvents() {
      this.localParticipant.on(e.ParticipantEvent.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).on(e.ParticipantEvent.ParticipantNameChanged, this.onLocalParticipantNameChanged).on(e.ParticipantEvent.AttributesChanged, this.onLocalAttributesChanged).on(e.ParticipantEvent.TrackMuted, this.onLocalTrackMuted).on(e.ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted).on(e.ParticipantEvent.LocalTrackPublished, this.onLocalTrackPublished).on(e.ParticipantEvent.LocalTrackUnpublished, this.onLocalTrackUnpublished).on(e.ParticipantEvent.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).on(e.ParticipantEvent.MediaDevicesError, this.onMediaDevicesError).on(e.ParticipantEvent.AudioStreamAcquired, this.startAudio).on(e.ParticipantEvent.ChatMessage, this.onLocalChatMessageSent).on(e.ParticipantEvent.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged);
    }
    recreateEngine(e2) {
      const t2 = this.engine;
      e2 && t2 && !t2.client.isDisconnected ? t2.client.sendLeave().finally((() => t2.close())) : null == t2 || t2.close(), this.engine = void 0, this.isResuming = false, this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.bufferedEvents = [], this.maybeCreateEngine();
    }
    onTrackAdded(t2, n2, i2) {
      var r2, o2;
      if ([e.ConnectionState.Connecting, e.ConnectionState.Reconnecting].includes(this.state)) {
        const o3 = tc(t2, n2);
        this.log.debug("deferring on track for later", { mediaTrackId: t2.id, mediaStreamId: n2.id, tracksInStream: n2.getTracks().map(((e2) => e2.id)) });
        const s3 = () => {
          a3(), this.onTrackAdded(t2, n2, i2);
        }, a3 = () => {
          if (this.off(e.RoomEvent.Reconnected, s3), this.off(e.RoomEvent.Connected, s3), this.off(e.RoomEvent.Disconnected, a3), o3) {
            const e2 = this.pendingTrackAddedCallbacks.get(o3);
            null == e2 || e2.delete(a3), 0 === (null == e2 ? void 0 : e2.size) && this.pendingTrackAddedCallbacks.delete(o3);
          }
        };
        if (this.once(e.RoomEvent.Reconnected, s3), this.once(e.RoomEvent.Connected, s3), this.once(e.RoomEvent.Disconnected, a3), o3) {
          const e2 = null !== (r2 = this.pendingTrackAddedCallbacks.get(o3)) && void 0 !== r2 ? r2 : /* @__PURE__ */ new Set();
          e2.add(a3), this.pendingTrackAddedCallbacks.set(o3, e2);
        }
        return;
      }
      if (this.state === e.ConnectionState.Disconnected) return void this.log.warn("skipping incoming track after Room disconnected");
      if ("ended" === t2.readyState) return void this.log.debug("skipping incoming track as it already ended");
      const s2 = Gs(n2.id), a2 = s2[0], c2 = s2[1];
      let d2 = null !== (o2 = tc(t2, n2)) && void 0 !== o2 ? o2 : t2.id;
      if (a2 === this.localParticipant.sid) return void this.log.warn("tried to create RemoteParticipant for local participant");
      const l2 = Array.from(this.remoteParticipants.values()).find(((e2) => e2.sid === a2));
      if (!l2) return void (a2.startsWith("PA") && this.log.error("Tried to add a track for a participant, that's not present. Sid: ".concat(a2)));
      if (!d2.startsWith("TR")) {
        const e2 = this.engine.getTrackIdForReceiver(i2);
        if (!e2) return void this.log.error("Tried to add a track whose 'sid' could not be found for a participant, that's not present. Sid: ".concat(a2));
        d2 = e2;
      }
      let u2;
      d2.startsWith("TR") || this.log.warn("Tried to add a track whose 'sid' could not be determined for a participant, that's not present. Sid: ".concat(a2, ", streamId: ").concat(c2, ", trackId: ").concat(d2), { remoteParticipantID: a2, streamId: c2, trackId: d2 }), this.options.adaptiveStream && (u2 = "object" == typeof this.options.adaptiveStream ? this.options.adaptiveStream : {});
      const h2 = l2.addSubscribedMediaTrack(t2, d2, n2, i2, u2);
      (null == h2 ? void 0 : h2.isEncrypted) && !this.e2eeManager && this.emit(e.RoomEvent.EncryptionError, new Error("Encrypted ".concat(h2.source, " track received from participant ").concat(l2.sid, ", but room does not have encryption enabled!")));
    }
    cancelPendingTrackAdded(e2) {
      var t2;
      null === (t2 = this.pendingTrackAddedCallbacks.get(e2)) || void 0 === t2 || t2.forEach(((e3) => e3()));
    }
    handleLocalTrackSubscribed(t2) {
      const n2 = () => this.localParticipant.getTrackPublications().find(((e2) => e2.trackSid === t2)), i2 = n2();
      if (i2) return void this.emitLocalTrackSubscribed(i2);
      this.log.debug("deferring LocalTrackSubscribed, publication not yet available", { subscribedSid: t2 });
      let r2;
      const o2 = (e2) => {
        e2.trackSid === t2 && (s2(), this.emitLocalTrackSubscribed(e2));
      }, s2 = () => {
        clearTimeout(r2), this.localParticipant.off(e.ParticipantEvent.LocalTrackPublished, o2), this.off(e.RoomEvent.Disconnected, s2);
      };
      this.localParticipant.on(e.ParticipantEvent.LocalTrackPublished, o2), this.once(e.RoomEvent.Disconnected, s2), r2 = setTimeout((() => {
        s2();
        const e2 = n2();
        e2 ? this.emitLocalTrackSubscribed(e2) : this.log.warn("could not find local track publication for LocalTrackSubscribed event after timeout", { subscribedSid: t2 });
      }), 1e4);
    }
    emitLocalTrackSubscribed(t2) {
      this.localParticipant.emit(e.ParticipantEvent.LocalTrackSubscribed, t2), this.emitWhenConnected(e.RoomEvent.LocalTrackSubscribed, t2, this.localParticipant);
    }
    handleDisconnect() {
      let t2 = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], n2 = arguments.length > 1 ? arguments[1] : void 0;
      var i2, r2, o2;
      if (this.clearConnectionReconcile(), this.isResuming = false, this.bufferedEvents = [], this.transcriptionReceivedTimes.clear(), this.incomingDataStreamManager.clearControllers(), this.incomingDataTrackManager.reset(), this.outgoingDataTrackManager.reset(), this.state !== e.ConnectionState.Disconnected) {
        this.regionUrl = void 0, this.regionUrlProvider && this.regionUrlProvider.notifyDisconnected();
        try {
          const n3 = t2 ? [] : Array.from(this.localParticipant.audioTrackPublications.values()).map(((e2) => e2.track)).filter(za);
          this.remoteParticipants.forEach(((e2) => {
            e2.trackPublications.forEach(((t3) => {
              e2.unpublishTrack(t3.trackSid);
            }));
          })), this.localParticipant.trackPublications.forEach(((e2) => {
            var n4, i3, r3;
            e2.track && this.localParticipant.unpublishTrack(e2.track, t2), t2 ? (null === (n4 = e2.track) || void 0 === n4 || n4.detach(), null === (i3 = e2.track) || void 0 === i3 || i3.stop()) : null === (r3 = e2.track) || void 0 === r3 || r3.stopMonitor();
          })), this.localParticipant.off(e.ParticipantEvent.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).off(e.ParticipantEvent.ParticipantNameChanged, this.onLocalParticipantNameChanged).off(e.ParticipantEvent.AttributesChanged, this.onLocalAttributesChanged).off(e.ParticipantEvent.TrackMuted, this.onLocalTrackMuted).off(e.ParticipantEvent.TrackUnmuted, this.onLocalTrackUnmuted).off(e.ParticipantEvent.LocalTrackPublished, this.onLocalTrackPublished).off(e.ParticipantEvent.LocalTrackUnpublished, this.onLocalTrackUnpublished).off(e.ParticipantEvent.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).off(e.ParticipantEvent.MediaDevicesError, this.onMediaDevicesError).off(e.ParticipantEvent.AudioStreamAcquired, this.startAudio).off(e.ParticipantEvent.ChatMessage, this.onLocalChatMessageSent).off(e.ParticipantEvent.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged), this.localParticipant.trackPublications.clear(), this.localParticipant.videoTrackPublications.clear(), this.localParticipant.audioTrackPublications.clear(), this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.activeSpeakers = [], null === (i2 = this.releaseDummyAudioElement) || void 0 === i2 || i2.call(this), this.releaseAcquiredEmptyAudioTracks(), this.releaseAudioContext(n3).catch(((e2) => this.log.warn("Could not release audio context", Object.assign(Object.assign({}, this.logContext), { error: e2 })))), pa() && (window.removeEventListener("beforeunload", this.onPageLeave), window.removeEventListener("pagehide", this.onPageLeave), window.removeEventListener("freeze", this.onPageLeave), null === (o2 = null === (r2 = navigator.mediaDevices) || void 0 === r2 ? void 0 : r2.removeEventListener) || void 0 === o2 || o2.call(r2, "devicechange", this.handleDeviceChange));
        } finally {
          this.setAndEmitConnectionState(e.ConnectionState.Disconnected), this.emit(e.RoomEvent.Disconnected, n2);
        }
      }
    }
    handleParticipantDisconnected(t2, n2, i2) {
      this.remoteParticipants.delete(t2), n2 && (this.incomingDataStreamManager.validateParticipantHasNoActiveDataStreams(t2), this.incomingDataTrackManager.handleRemoteParticipantDisconnected(t2), n2.trackPublications.forEach(((e2) => {
        n2.unpublishTrack(e2.trackSid, true);
      })), this.emit(e.RoomEvent.ParticipantDisconnected, n2, i2), n2.setDisconnected(), this.rpcClientManager.handleParticipantDisconnected(n2.identity));
    }
    selectDefaultDevices() {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2, i2;
        const r2 = jc.getInstance().previousDevices, o2 = yield jc.getInstance().getDevices(void 0, false), s2 = Fo();
        if ("Chrome" === (null == s2 ? void 0 : s2.name) && "iOS" !== s2.os) for (let c2 of o2) {
          const t3 = r2.find(((e2) => e2.deviceId === c2.deviceId));
          t3 && "" !== t3.label && t3.kind === c2.kind && t3.label !== c2.label && "default" === this.getActiveDevice(c2.kind) && this.emit(e.RoomEvent.ActiveDeviceChanged, c2.kind, c2.deviceId);
        }
        const a2 = ["audiooutput", "audioinput", "videoinput"];
        for (let e2 of a2) {
          const s3 = As(e2), a3 = this.localParticipant.getTrackPublication(s3);
          if (a3 && (null === (t2 = a3.track) || void 0 === t2 ? void 0 : t2.isUserProvided)) continue;
          const c2 = o2.filter(((t3) => t3.kind === e2)), d2 = this.getActiveDevice(e2);
          d2 === (null === (n2 = r2.filter(((t3) => t3.kind === e2))[0]) || void 0 === n2 ? void 0 : n2.deviceId) && c2.length > 0 && (null === (i2 = c2[0]) || void 0 === i2 ? void 0 : i2.deviceId) !== d2 ? yield this.switchActiveDevice(e2, c2[0].deviceId) : "audioinput" === e2 && !da() || "videoinput" === e2 || !(c2.length > 0) || c2.find(((t3) => t3.deviceId === this.getActiveDevice(e2))) || "audiooutput" === e2 && da() || (yield this.switchActiveDevice(e2, c2[0].deviceId));
        }
      }));
    }
    acquireAudioContext() {
      return kr(this, arguments, void 0, (function() {
        var t2 = this;
        let i2 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return (function* () {
          var r2, o2;
          const s2 = yield t2.audioContextMutex.lock();
          try {
            if (t2.audioContextReleased && !i2) return;
            t2.audioContextReleased = false;
            const s3 = "boolean" != typeof t2.options.webAudioMix ? t2.options.webAudioMix.audioContext : void 0;
            if (s3 ? yield t2.setRoomAudioContext(s3, false) : t2.audioContext && "closed" !== t2.audioContext.state || (yield t2.setRoomAudioContext(null !== (r2 = Os()) && void 0 !== r2 ? r2 : void 0, true)), t2.audioContext && "suspended" === t2.audioContext.state) try {
              yield Promise.race([t2.audioContext.resume(), Js(200)]);
            } catch (n2) {
              t2.log.warn("Could not resume audio context", { error: n2 });
            }
            const a2 = "running" === (null === (o2 = t2.audioContext) || void 0 === o2 ? void 0 : o2.state);
            a2 !== t2.canPlaybackAudio && (t2.audioEnabled = a2, t2.emit(e.RoomEvent.AudioPlaybackStatusChanged, a2));
          } finally {
            s2();
          }
        })();
      }));
    }
    setRoomAudioContext(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = !!e2 && t2;
        if (this.audioContext === e2) return void (this.ownsAudioContext = n2);
        const i2 = this.ownsAudioContext ? this.audioContext : void 0;
        this.audioContext = e2, this.ownsAudioContext = n2;
        try {
          this.options.webAudioMix && (yield Promise.all(Array.from(this.remoteParticipants.values()).map(((t3) => t3.setAudioContext(e2))))), yield this.localParticipant.setAudioContext(e2);
        } catch (r2) {
          this.log.warn("Could not move audio tracks to the new audio context", Object.assign(Object.assign({}, this.logContext), { error: r2 }));
        } finally {
          if (i2 && "closed" !== i2.state) try {
            yield i2.close();
          } catch (r2) {
            this.log.warn("Could not close audio context", Object.assign(Object.assign({}, this.logContext), { error: r2 }));
          }
        }
      }));
    }
    releaseAudioContext() {
      return kr(this, arguments, void 0, (function() {
        var e2 = this;
        let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
        return (function* () {
          e2.audioContextReleased = true;
          const n2 = e2.audioContext, i2 = yield e2.audioContextMutex.lock();
          try {
            if (!e2.audioContextReleased || e2.audioContext !== n2) return;
            if (!e2.ownsAudioContext) return;
            try {
              yield Promise.all(t2.map(((e3) => e3.setAudioContext(void 0))));
            } catch (r2) {
              e2.log.warn("Could not detach retained audio tracks from the audio context", Object.assign(Object.assign({}, e2.logContext), { error: r2 }));
            }
            yield e2.setRoomAudioContext(void 0, false);
          } finally {
            i2();
          }
        })();
      }));
    }
    createParticipant(e2, t2) {
      var n2;
      let i2;
      return i2 = t2 ? Ih.fromParticipantInfo(this.engine.client, t2, { loggerContextCb: () => this.logContext, loggerName: this.options.loggerName }, this.incomingDataTrackManager) : new Ih(this.engine.client, "", e2, void 0, void 0, void 0, { loggerContextCb: () => this.logContext, loggerName: this.options.loggerName }), this.options.webAudioMix && i2.setAudioContext(this.audioContext).catch(((e3) => this.log.warn("Could not set audio context", Object.assign(Object.assign({}, this.logContext), { error: e3 })))), (null === (n2 = this.options.audioOutput) || void 0 === n2 ? void 0 : n2.deviceId) && i2.setAudioOutput(this.options.audioOutput).catch(((e3) => this.log.warn("Could not set audio output: ".concat(e3.message)))), i2;
    }
    getOrCreateParticipant(t2, n2) {
      if (this.remoteParticipants.has(t2)) {
        const e2 = this.remoteParticipants.get(t2);
        if (n2) {
          e2.updateInfo(n2) && this.sidToIdentity.set(n2.sid, n2.identity);
        }
        return e2;
      }
      const i2 = this.createParticipant(t2, n2);
      return this.remoteParticipants.set(t2, i2), this.sidToIdentity.set(n2.sid, n2.identity), this.emitWhenConnected(e.RoomEvent.ParticipantConnected, i2), i2.on(e.ParticipantEvent.TrackPublished, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.TrackPublished, t3, i2);
      })).on(e.ParticipantEvent.TrackSubscribed, ((t3, n3) => {
        t3.kind === Ws.Kind.Audio ? (t3.on(e.TrackEvent.AudioPlaybackStarted, this.handleAudioPlaybackStarted), t3.on(e.TrackEvent.AudioPlaybackFailed, this.handleAudioPlaybackFailed)) : t3.kind === Ws.Kind.Video && (t3.on(e.TrackEvent.VideoPlaybackFailed, this.handleVideoPlaybackFailed), t3.on(e.TrackEvent.VideoPlaybackStarted, this.handleVideoPlaybackStarted)), this.emitWhenConnected(e.RoomEvent.TrackSubscribed, t3, n3, i2);
      })).on(e.ParticipantEvent.TrackUnpublished, ((t3) => {
        this.cancelPendingTrackAdded(t3.trackSid), this.emit(e.RoomEvent.TrackUnpublished, t3, i2);
      })).on(e.ParticipantEvent.TrackUnsubscribed, ((t3, n3) => {
        this.emit(e.RoomEvent.TrackUnsubscribed, t3, n3, i2);
      })).on(e.ParticipantEvent.TrackMuted, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.TrackMuted, t3, i2);
      })).on(e.ParticipantEvent.TrackUnmuted, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.TrackUnmuted, t3, i2);
      })).on(e.ParticipantEvent.ParticipantMetadataChanged, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.ParticipantMetadataChanged, t3, i2);
      })).on(e.ParticipantEvent.ParticipantNameChanged, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.ParticipantNameChanged, t3, i2);
      })).on(e.ParticipantEvent.AttributesChanged, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.ParticipantAttributesChanged, t3, i2);
      })).on(e.ParticipantEvent.ConnectionQualityChanged, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.ConnectionQualityChanged, t3, i2);
      })).on(e.ParticipantEvent.ParticipantPermissionsChanged, ((t3) => {
        this.emitWhenConnected(e.RoomEvent.ParticipantPermissionsChanged, t3, i2);
      })).on(e.ParticipantEvent.TrackSubscriptionStatusChanged, ((t3, n3) => {
        this.emitWhenConnected(e.RoomEvent.TrackSubscriptionStatusChanged, t3, n3, i2);
      })).on(e.ParticipantEvent.TrackSubscriptionFailed, ((t3, n3) => {
        this.emit(e.RoomEvent.TrackSubscriptionFailed, t3, i2, n3);
      })).on(e.ParticipantEvent.TrackSubscriptionPermissionChanged, ((t3, n3) => {
        this.emitWhenConnected(e.RoomEvent.TrackSubscriptionPermissionChanged, t3, n3, i2);
      })).on(e.ParticipantEvent.Active, (() => {
        this.emitWhenConnected(e.RoomEvent.ParticipantActive, i2), i2.kind === ft.AGENT && this.localParticipant.setActiveAgent(i2);
      })), n2 && i2.updateInfo(n2), i2;
    }
    sendSyncState() {
      const e2 = Array.from(this.remoteParticipants.values()).reduce(((e3, t3) => (e3.push(...t3.getTrackPublications()), e3)), []), t2 = this.localParticipant.getTrackPublications(), n2 = this.outgoingDataTrackManager.queryPublished();
      this.engine.sendSyncState(e2, t2, n2);
    }
    updateSubscriptions() {
      for (const e2 of this.remoteParticipants.values()) for (const t2 of e2.videoTrackPublications.values()) t2.isSubscribed && Ja(t2) && t2.emitTrackUpdate();
    }
    getRemoteParticipantBySid(e2) {
      const t2 = this.sidToIdentity.get(e2);
      if (t2) return this.remoteParticipants.get(t2);
    }
    getClientInfoCapabilities(e2) {
      var t2;
      const n2 = [];
      return (Ec(null !== (t2 = e2.frameMetadata) && void 0 !== t2 ? t2 : e2.packetTrailer) || this.e2eeManager) && n2.push($t.CAP_PACKET_TRAILER), ec() && n2.push($t.CAP_COMPRESSION_DEFLATE_RAW), n2;
    }
    registerRpcDataStreamHandler() {
      this.incomingDataStreamManager.registerTextStreamHandler(ch, ((e2, t2) => kr(this, [e2, t2], void 0, (function(e3, t3) {
        var n2 = this;
        let i2 = t3.identity;
        return (function* () {
          var t4;
          const r2 = null !== (t4 = e3.info.attributes) && void 0 !== t4 ? t4 : {};
          yield n2.rpcServerManager.handleIncomingDataStream(e3, i2, r2);
        })();
      })))), this.incomingDataStreamManager.registerTextStreamHandler(dh, ((e2, t2) => kr(this, [e2, t2], void 0, (function(e3, t3) {
        var n2 = this;
        let i2 = t3.identity;
        return (function* () {
          var t4;
          const r2 = null !== (t4 = e3.info.attributes) && void 0 !== t4 ? t4 : {};
          yield n2.rpcClientManager.handleIncomingDataStream(e3, i2, r2);
        })();
      }))));
    }
    setStatsLogging(e2) {
      e2 ? this.statsLogInterval || (this.statsLogInterval = ls.setInterval((() => {
        this.logWebRTCStats();
      }), 3e4)) : this.statsLogInterval && (ls.clearInterval(this.statsLogInterval), this.statsLogInterval = void 0);
    }
    registerConnectionReconcile() {
      this.clearConnectionReconcile();
      let e2 = 0;
      this.connectionReconcileInterval = ls.setInterval((() => {
        this.engine && !this.engine.isClosed && this.engine.verifyTransport() ? e2 = 0 : (e2++, this.log.warn("detected connection state mismatch", { numFailures: e2, engine: this.engine ? { closed: this.engine.isClosed, transportsConnectedOrConnecting: this.engine.verifyTransport() } : void 0 }), e2 >= 3 && (this.clearConnectionReconcile(), this.engine && !this.engine.isClosed ? (this.log.warn("detected connection state mismatch, attempting full reconnect"), this.engine.reconnect()) : (this.recreateEngine(), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, at.STATE_MISMATCH))));
      }), 4e3);
    }
    clearConnectionReconcile() {
      this.connectionReconcileInterval && ls.clearInterval(this.connectionReconcileInterval);
    }
    setAndEmitConnectionState(t2) {
      return t2 !== this.state && (this.log.info("connection state changed: ".concat(this.state, " -> ").concat(t2)), this.state = t2, this.incomingDataStreamManager.setConnected(t2 === e.ConnectionState.Connected), this.setStatsLogging(t2 === e.ConnectionState.Connected), this.emit(e.RoomEvent.ConnectionStateChanged, this.state), true);
    }
    emitBufferedEvents() {
      this.bufferedEvents.forEach(((e2) => {
        let t2 = j(e2, 2), n2 = t2[0], i2 = t2[1];
        this.emit(n2, ...i2);
      })), this.bufferedEvents = [];
    }
    emitWhenConnected(t2) {
      for (var n2 = arguments.length, i2 = new Array(n2 > 1 ? n2 - 1 : 0), r2 = 1; r2 < n2; r2++) i2[r2 - 1] = arguments[r2];
      if (this.state === e.ConnectionState.Reconnecting || this.isResuming || !this.engine || this.engine.pendingReconnect) this.bufferedEvents.push([t2, i2]);
      else if (this.state === e.ConnectionState.Connected) return this.emit(t2, ...i2);
      return false;
    }
    simulateParticipants(t2) {
      return kr(this, void 0, void 0, (function* () {
        var n2, i2, r2, o2;
        const s2 = Object.assign({ audio: true, video: true, useRealTracks: false }, t2.publish), a2 = Object.assign({ count: 9, audio: false, video: true, aspectRatios: [1.66, 1.7, 1.3] }, t2.participants);
        if (this.handleDisconnect(), this.roomInfo = new ht({ sid: "RM_SIMULATED", name: "simulated-room", emptyTimeout: 0, maxParticipants: 0, creationTime: R.parse((/* @__PURE__ */ new Date()).getTime()), metadata: "", numParticipants: 1, numPublishers: 1, turnPassword: "", enabledCodecs: [], activeRecording: false }), this.localParticipant.updateInfo(new gt({ identity: "simulated-local", name: "local-name" })), this.setupLocalParticipantEvents(), this.emit(e.RoomEvent.SignalConnected), this.emit(e.RoomEvent.Connected), this.setAndEmitConnectionState(e.ConnectionState.Connected), s2.video) {
          const t3 = new fh(Ws.Kind.Video, new Tt({ source: it.CAMERA, sid: Math.floor(1e4 * Math.random()).toString(), type: nt.AUDIO, name: "video-dummy" }), new Fl(s2.useRealTracks && (null === (n2 = window.navigator.mediaDevices) || void 0 === n2 ? void 0 : n2.getUserMedia) ? (yield window.navigator.mediaDevices.getUserMedia({ video: true })).getVideoTracks()[0] : Ma(160 * (null !== (i2 = a2.aspectRatios[0]) && void 0 !== i2 ? i2 : 1), 160, true, true), void 0, false, { loggerName: this.options.loggerName, loggerContextCb: () => this.logContext }), { loggerName: this.options.loggerName, loggerContextCb: () => this.logContext });
          this.localParticipant.addTrackPublication(t3), this.localParticipant.emit(e.ParticipantEvent.LocalTrackPublished, t3);
        }
        if (s2.audio) {
          const t3 = new fh(Ws.Kind.Audio, new Tt({ source: it.MICROPHONE, sid: Math.floor(1e4 * Math.random()).toString(), type: nt.AUDIO }), new wl(s2.useRealTracks && (null === (r2 = navigator.mediaDevices) || void 0 === r2 ? void 0 : r2.getUserMedia) ? (yield navigator.mediaDevices.getUserMedia({ audio: true })).getAudioTracks()[0] : this.acquireEmptyAudioStreamTrack(), void 0, false, this.audioContext, { loggerName: this.options.loggerName, loggerContextCb: () => this.logContext }), { loggerName: this.options.loggerName, loggerContextCb: () => this.logContext });
          this.localParticipant.addTrackPublication(t3), this.localParticipant.emit(e.ParticipantEvent.LocalTrackPublished, t3);
        }
        for (let e2 = 0; e2 < a2.count - 1; e2 += 1) {
          let t3 = new gt({ sid: Math.floor(1e4 * Math.random()).toString(), identity: "simulated-".concat(e2), state: vt.ACTIVE, tracks: [], joinedAt: R.parse(Date.now()) });
          const n3 = this.getOrCreateParticipant(t3.identity, t3);
          if (a2.video) {
            const i3 = Ma(160 * (null !== (o2 = a2.aspectRatios[e2 % a2.aspectRatios.length]) && void 0 !== o2 ? o2 : 1), 160, false, true), r3 = new Tt({ source: it.CAMERA, sid: Math.floor(1e4 * Math.random()).toString(), type: nt.AUDIO });
            n3.addSubscribedMediaTrack(i3, r3.sid, new MediaStream([i3]), new RTCRtpReceiver()), t3.tracks = [...t3.tracks, r3];
          }
          if (a2.audio) {
            const e3 = this.acquireEmptyAudioStreamTrack(), i3 = new Tt({ source: it.MICROPHONE, sid: Math.floor(1e4 * Math.random()).toString(), type: nt.AUDIO });
            n3.addSubscribedMediaTrack(e3, i3.sid, new MediaStream([e3]), new RTCRtpReceiver()), t3.tracks = [...t3.tracks, i3];
          }
          n3.updateInfo(t3);
        }
      }));
    }
    emit(t2) {
      for (var n2 = arguments.length, i2 = new Array(n2 > 1 ? n2 - 1 : 0), r2 = 1; r2 < n2; r2++) i2[r2 - 1] = arguments[r2];
      if (t2 !== e.RoomEvent.ActiveSpeakersChanged && t2 !== e.RoomEvent.TranscriptionReceived) {
        const n3 = Dh(i2).filter(((e2) => void 0 !== e2));
        t2 !== e.RoomEvent.TrackSubscribed && t2 !== e.RoomEvent.TrackUnsubscribed || this.log.trace("subscribe trace: ".concat(t2), { event: t2, args: n3 }), this.log.debug("room event ".concat(t2), { event: t2, args: n3 });
      }
      return super.emit(t2, ...i2);
    }
  }
  function Dh(e2) {
    return e2.map(((e3) => {
      if (e3) return Array.isArray(e3) ? Dh(e3) : "object" == typeof e3 ? "logContext" in e3 ? e3.logContext : void 0 : e3;
    }));
  }
  Mh.cleanupRegistry = "undefined" != typeof FinalizationRegistry && "undefined" != typeof WeakRef && new FinalizationRegistry(((e2) => {
    e2();
  }));
  var Oh, Ah = Object.freeze({ __proto__: null, Convert: class {
    static toAgentAttributes(e2) {
      return JSON.parse(e2);
    }
    static agentAttributesToJson(e2) {
      return JSON.stringify(e2);
    }
    static toTranscriptionAttributes(e2) {
      return JSON.parse(e2);
    }
    static transcriptionAttributesToJson(e2) {
      return JSON.stringify(e2);
    }
  } });
  e.CheckStatus = void 0, (Oh = e.CheckStatus || (e.CheckStatus = {}))[Oh.IDLE = 0] = "IDLE", Oh[Oh.RUNNING = 1] = "RUNNING", Oh[Oh.SKIPPED = 2] = "SKIPPED", Oh[Oh.SUCCESS = 3] = "SUCCESS", Oh[Oh.FAILED = 4] = "FAILED";
  class Lh extends wr.EventEmitter {
    constructor(t2, n2) {
      let i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      super(), this.status = e.CheckStatus.IDLE, this.logs = [], this.options = {}, this.url = t2, this.token = n2, this.name = this.constructor.name, this.room = new Mh(i2.roomOptions), this.connectOptions = i2.connectOptions, this.options = i2;
    }
    run(t2) {
      return kr(this, void 0, void 0, (function* () {
        if (this.status !== e.CheckStatus.IDLE) throw Error("check is running already");
        this.setStatus(e.CheckStatus.RUNNING);
        try {
          yield this.perform();
        } catch (n2) {
          n2 instanceof Error && (this.options.errorsAsWarnings ? this.appendWarning(n2.message) : this.appendError(n2.message));
        }
        return yield this.disconnect(), yield new Promise(((e2) => setTimeout(e2, 500))), this.status !== e.CheckStatus.SKIPPED && this.setStatus(this.isSuccess() ? e.CheckStatus.SUCCESS : e.CheckStatus.FAILED), t2 && t2(), this.getInfo();
      }));
    }
    isSuccess() {
      return !this.logs.some(((e2) => "error" === e2.level));
    }
    connect(t2) {
      return kr(this, void 0, void 0, (function* () {
        return this.room.state === e.ConnectionState.Connected || (t2 || (t2 = this.url), yield this.room.connect(t2, this.token, this.connectOptions)), this.room;
      }));
    }
    disconnect() {
      return kr(this, void 0, void 0, (function* () {
        this.room && this.room.state !== e.ConnectionState.Disconnected && (yield this.room.disconnect(), yield new Promise(((e2) => setTimeout(e2, 500))));
      }));
    }
    skip() {
      this.setStatus(e.CheckStatus.SKIPPED);
    }
    switchProtocol(t2) {
      return kr(this, void 0, void 0, (function* () {
        let n2 = false, i2 = false;
        if (this.room.on(e.RoomEvent.Reconnecting, (() => {
          n2 = true;
        })), this.room.once(e.RoomEvent.Reconnected, (() => {
          i2 = true;
        })), this.room.simulateScenario("force-".concat(t2)), yield new Promise(((e2) => setTimeout(e2, 1e3))), !n2) return;
        const r2 = Date.now() + 1e4;
        for (; Date.now() < r2; ) {
          if (i2) return;
          yield Js(100);
        }
        throw new Error("Could not reconnect using ".concat(t2, " protocol after 10 seconds"));
      }));
    }
    appendMessage(e2) {
      this.logs.push({ level: "info", message: e2 }), this.emit("update", this.getInfo());
    }
    appendWarning(e2) {
      this.logs.push({ level: "warning", message: e2 }), this.emit("update", this.getInfo());
    }
    appendError(e2) {
      this.logs.push({ level: "error", message: e2 }), this.emit("update", this.getInfo());
    }
    setStatus(e2) {
      this.status = e2, this.emit("update", this.getInfo());
    }
    get engine() {
      var e2;
      return null === (e2 = this.room) || void 0 === e2 ? void 0 : e2.engine;
    }
    getInfo() {
      return { logs: this.logs, name: this.name, status: this.status, description: this.description };
    }
  }
  class Nh extends Lh {
    get description() {
      return "Cloud regions";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        const e2 = new Jl(this.url, this.token);
        if (!e2.isCloud()) return void this.skip();
        const t2 = [], n2 = /* @__PURE__ */ new Set();
        for (let r2 = 0; r2 < 3; r2++) {
          const i3 = yield e2.getNextBestRegionUrl();
          if (!i3) break;
          if (n2.has(i3)) continue;
          n2.add(i3);
          const r3 = yield this.checkCloudRegion(i3);
          this.appendMessage("".concat(r3.region, " RTT: ").concat(r3.rtt, "ms, duration: ").concat(r3.duration, "ms")), t2.push(r3);
        }
        t2.sort(((e3, t3) => 0.5 * (e3.duration - t3.duration) + 0.5 * (e3.rtt - t3.rtt)));
        const i2 = t2[0];
        this.bestStats = i2, this.appendMessage("best Cloud region: ".concat(i2.region));
      }));
    }
    getInfo() {
      const e2 = super.getInfo();
      return e2.data = this.bestStats, e2;
    }
    checkCloudRegion(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2, n2;
        yield this.connect(e2), "tcp" === this.options.protocol && (yield this.switchProtocol("tcp"));
        const i2 = null === (t2 = this.room.serverInfo) || void 0 === t2 ? void 0 : t2.region;
        if (!i2) throw new Error("Region not found");
        const r2 = yield this.room.localParticipant.streamText({ topic: "test" }), o2 = "A".repeat(1e3), s2 = Date.now();
        for (let e3 = 0; e3 < 1e3; e3++) yield r2.write(o2);
        yield r2.close();
        const a2 = Date.now(), c2 = yield null === (n2 = this.room.engine.pcManager) || void 0 === n2 ? void 0 : n2.publisher.getStats(), d2 = { region: i2, rtt: 1e4, duration: a2 - s2 };
        return null == c2 || c2.forEach(((e3) => {
          "candidate-pair" === e3.type && e3.nominated && (d2.rtt = 1e3 * e3.currentRoundTripTime);
        })), yield this.disconnect(), d2;
      }));
    }
  }
  const xh = 1e4;
  class Uh extends Lh {
    get description() {
      return "Connection via UDP vs TCP";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        const e2 = yield this.checkConnectionProtocol("udp"), t2 = yield this.checkConnectionProtocol("tcp");
        this.bestStats = e2, e2.qualityLimitationDurations.bandwidth - t2.qualityLimitationDurations.bandwidth > 0.5 || (e2.packetsLost - t2.packetsLost) / e2.packetsSent > 0.01 ? (this.appendMessage("best connection quality via tcp"), this.bestStats = t2) : this.appendMessage("best connection quality via udp");
        const n2 = this.bestStats;
        this.appendMessage("upstream bitrate: ".concat((n2.bitrateTotal / n2.count / 1e3 / 1e3).toFixed(2), " mbps")), this.appendMessage("RTT: ".concat((n2.rttTotal / n2.count * 1e3).toFixed(2), " ms")), this.appendMessage("jitter: ".concat((n2.jitterTotal / n2.count * 1e3).toFixed(2), " ms")), n2.packetsLost > 0 && this.appendWarning("packets lost: ".concat((n2.packetsLost / n2.packetsSent * 100).toFixed(2), "%")), n2.qualityLimitationDurations.bandwidth > 1 && this.appendWarning("bandwidth limited ".concat((n2.qualityLimitationDurations.bandwidth / 10 * 100).toFixed(2), "%")), n2.qualityLimitationDurations.cpu > 0 && this.appendWarning("cpu limited ".concat((n2.qualityLimitationDurations.cpu / 10 * 100).toFixed(2), "%"));
      }));
    }
    getInfo() {
      const e2 = super.getInfo();
      return e2.data = this.bestStats, e2;
    }
    checkConnectionProtocol(e2) {
      return kr(this, void 0, void 0, (function* () {
        yield this.connect(), "tcp" === e2 ? yield this.switchProtocol("tcp") : yield this.switchProtocol("udp");
        const t2 = document.createElement("canvas");
        t2.width = 1280, t2.height = 720;
        const n2 = t2.getContext("2d");
        if (!n2) throw new Error("Could not get canvas context");
        let i2 = 0;
        const r2 = () => {
          i2 = (i2 + 1) % 360, n2.fillStyle = "hsl(".concat(i2, ", 100%, 50%)"), n2.fillRect(0, 0, t2.width, t2.height), requestAnimationFrame(r2);
        };
        r2();
        const o2 = t2.captureStream(30).getVideoTracks()[0], s2 = (yield this.room.localParticipant.publishTrack(o2, { simulcast: false, degradationPreference: "maintain-resolution", videoEncoding: { maxBitrate: 2e6 } })).track, a2 = { protocol: e2, packetsLost: 0, packetsSent: 0, qualityLimitationDurations: {}, rttTotal: 0, jitterTotal: 0, bitrateTotal: 0, count: 0 }, c2 = setInterval((() => kr(this, void 0, void 0, (function* () {
          const e3 = yield s2.getRTCStatsReport();
          null == e3 || e3.forEach(((e4) => {
            "outbound-rtp" === e4.type ? (a2.packetsSent = e4.packetsSent, a2.qualityLimitationDurations = e4.qualityLimitationDurations, a2.bitrateTotal += e4.targetBitrate, a2.count++) : "remote-inbound-rtp" === e4.type && (a2.packetsLost = e4.packetsLost, a2.rttTotal += e4.roundTripTime, a2.jitterTotal += e4.jitter);
          }));
        }))), 1e3);
        return yield new Promise(((e3) => setTimeout(e3, xh))), clearInterval(c2), o2.stop(), t2.remove(), yield this.disconnect(), a2;
      }));
    }
  }
  class Fh extends Lh {
    get description() {
      return "Can publish audio";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        const t2 = yield this.connect(), n2 = yield bh();
        if (yield Ds(n2, 1e3)) throw new Error("unable to detect audio from microphone");
        this.appendMessage("detected audio from microphone"), t2.localParticipant.publishTrack(n2), yield new Promise(((e3) => setTimeout(e3, 3e3)));
        const i2 = yield null === (e2 = n2.sender) || void 0 === e2 ? void 0 : e2.getStats();
        if (!i2) throw new Error("Could not get RTCStats");
        let r2 = 0;
        if (i2.forEach(((e3) => {
          "outbound-rtp" !== e3.type || "audio" !== e3.kind && (e3.kind || "audio" !== e3.mediaType) || (r2 = e3.packetsSent);
        })), 0 === r2) throw new Error("Could not determine packets are sent");
        this.appendMessage("published ".concat(r2, " audio packets"));
      }));
    }
  }
  class jh extends Lh {
    get description() {
      return "Can publish video";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        var e2;
        const t2 = yield this.connect(), n2 = yield yh();
        yield this.checkForVideo(n2.mediaStreamTrack), t2.localParticipant.publishTrack(n2), yield new Promise(((e3) => setTimeout(e3, 5e3)));
        const i2 = yield null === (e2 = n2.sender) || void 0 === e2 ? void 0 : e2.getStats();
        if (!i2) throw new Error("Could not get RTCStats");
        let r2 = 0;
        if (i2.forEach(((e3) => {
          "outbound-rtp" !== e3.type || "video" !== e3.kind && (e3.kind || "video" !== e3.mediaType) || (r2 += e3.packetsSent);
        })), 0 === r2) throw new Error("Could not determine packets are sent");
        this.appendMessage("published ".concat(r2, " video packets"));
      }));
    }
    checkForVideo(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = new MediaStream();
        t2.addTrack(e2.clone());
        const n2 = document.createElement("video");
        n2.srcObject = t2, n2.muted = true, n2.autoplay = true, n2.playsInline = true, n2.setAttribute("playsinline", "true"), document.body.appendChild(n2), yield new Promise(((t3) => {
          n2.onplay = () => {
            setTimeout((() => {
              var i2, r2, o2, s2;
              const a2 = document.createElement("canvas"), c2 = e2.getSettings(), d2 = null !== (r2 = null !== (i2 = c2.width) && void 0 !== i2 ? i2 : n2.videoWidth) && void 0 !== r2 ? r2 : 1280, l2 = null !== (s2 = null !== (o2 = c2.height) && void 0 !== o2 ? o2 : n2.videoHeight) && void 0 !== s2 ? s2 : 720;
              a2.width = d2, a2.height = l2;
              const u2 = a2.getContext("2d");
              u2.drawImage(n2, 0, 0);
              const h2 = u2.getImageData(0, 0, a2.width, a2.height).data;
              let p2 = true;
              for (let e3 = 0; e3 < h2.length; e3 += 4) if (0 !== h2[e3] || 0 !== h2[e3 + 1] || 0 !== h2[e3 + 2]) {
                p2 = false;
                break;
              }
              p2 ? this.appendError("camera appears to be producing only black frames") : this.appendMessage("received video frames"), t3();
            }), 1e3);
          }, n2.play();
        })), t2.getTracks().forEach(((e3) => e3.stop())), n2.remove();
      }));
    }
  }
  class Bh extends Lh {
    get description() {
      return "Resuming connection after interruption";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        var t2;
        const n2 = yield this.connect();
        let i2, r2 = false, o2 = false;
        const s2 = new Promise(((e2) => {
          setTimeout(e2, 5e3), i2 = e2;
        })), a2 = () => {
          r2 = true;
        };
        n2.on(e.RoomEvent.SignalReconnecting, a2).on(e.RoomEvent.Reconnecting, a2).on(e.RoomEvent.Reconnected, (() => {
          o2 = true, i2(true);
        })), null === (t2 = n2.engine.client.ws) || void 0 === t2 || t2.close();
        const c2 = n2.engine.client.onClose;
        if (c2 && c2(""), yield s2, !r2) throw new Error("Did not attempt to reconnect");
        if (!o2 || n2.state !== e.ConnectionState.Connected) throw this.appendWarning("reconnection is only possible in Redis-based configurations"), new Error("Not able to reconnect");
      }));
    }
  }
  class qh extends Lh {
    get description() {
      return "Can connect via TURN";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        var e2, t2, n2;
        ga(new URL(this.url)) && (this.appendMessage("Using region specific url"), this.url = null !== (e2 = yield new Jl(this.url, this.token).getNextBestRegionUrl()) && void 0 !== e2 ? e2 : this.url);
        const i2 = new Ed(), r2 = yield i2.join(this.url, this.token, { autoSubscribe: true, maxRetries: 0, e2eeEnabled: false, websocketTimeout: 15e3 }, void 0, true);
        let o2 = false, s2 = false, a2 = false;
        for (let c2 of r2.iceServers) for (let e3 of c2.urls) e3.startsWith("turn:") ? (s2 = true, a2 = true) : e3.startsWith("turns:") && (s2 = true, a2 = true, o2 = true), e3.startsWith("stun:") && (a2 = true);
        a2 ? s2 && !o2 && this.appendWarning("TURN is configured server side, but TURN/TLS is unavailable.") : this.appendWarning("No STUN servers configured on server side."), yield i2.close(), (null === (n2 = null === (t2 = this.connectOptions) || void 0 === t2 ? void 0 : t2.rtcConfig) || void 0 === n2 ? void 0 : n2.iceServers) || s2 ? yield this.room.connect(this.url, this.token, { rtcConfig: { iceTransportPolicy: "relay" } }) : (this.appendWarning("No TURN servers configured."), this.skip(), yield new Promise(((e3) => setTimeout(e3, 0))));
      }));
    }
  }
  class Vh extends Lh {
    get description() {
      return "Establishing WebRTC connection";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        let t2 = false, n2 = false;
        this.room.on(e.RoomEvent.SignalConnected, (() => {
          var e2;
          const i2 = this.room.engine.client.onTrickle;
          this.room.engine.client.onTrickle = (e3, r2) => {
            if (e3.candidate) {
              const i3 = new RTCIceCandidate(e3);
              let r3 = "".concat(i3.protocol, " ").concat(i3.address, ":").concat(i3.port, " ").concat(i3.type);
              i3.address && (!(function(e4) {
                const t3 = e4.split(".");
                if (4 === t3.length) {
                  if ("10" === t3[0]) return true;
                  if ("192" === t3[0] && "168" === t3[1]) return true;
                  if ("172" === t3[0]) {
                    const e5 = parseInt(t3[1], 10);
                    if (e5 >= 16 && e5 <= 31) return true;
                  }
                }
                return false;
              })(i3.address) ? "tcp" === i3.protocol && "passive" === i3.tcpType ? (t2 = true, r3 += " (passive)") : "udp" === i3.protocol && (n2 = true) : r3 += " (private)"), this.appendMessage(r3);
            }
            i2 && i2(e3, r2);
          }, (null === (e2 = this.room.engine.pcManager) || void 0 === e2 ? void 0 : e2.subscriber) && (this.room.engine.pcManager.subscriber.onIceCandidateError = (e3) => {
            e3 instanceof RTCPeerConnectionIceErrorEvent && this.appendWarning("error with ICE candidate: ".concat(e3.errorCode, " ").concat(e3.errorText, " ").concat(e3.url));
          });
        }));
        try {
          yield this.connect(), ar.info("now the room is connected");
        } catch (i2) {
          throw this.appendWarning("ports need to be open on firewall in order to connect."), i2;
        }
        t2 || this.appendWarning("Server is not configured for ICE/TCP"), n2 || this.appendWarning("No public IPv4 UDP candidates were found. Your server is likely not configured correctly");
      }));
    }
  }
  class Wh extends Lh {
    get description() {
      return "Connecting to signal connection via WebSocket";
    }
    perform() {
      return kr(this, void 0, void 0, (function* () {
        var e2, t2, i2;
        (this.url.startsWith("ws:") || this.url.startsWith("http:")) && this.appendWarning("Server is insecure, clients may block connections to it");
        let r2, o2 = new Ed();
        try {
          r2 = yield o2.join(this.url, this.token, { autoSubscribe: true, maxRetries: 0, e2eeEnabled: false, websocketTimeout: 15e3 }, void 0, true);
        } catch (n2) {
          if (ga(new URL(this.url))) {
            this.appendMessage("Initial connection failed with error ".concat(n2.message, ". Retrying with region fallback"));
            const t3 = new Jl(this.url, this.token), i3 = yield t3.getNextBestRegionUrl();
            i3 && (r2 = yield o2.join(i3, this.token, { autoSubscribe: true, maxRetries: 0, e2eeEnabled: false, websocketTimeout: 15e3 }, void 0, true), this.appendMessage("Fallback to region worked. To avoid initial connections failing, ensure you're calling room.prepareConnection() ahead of time"));
          }
        }
        r2 ? (this.appendMessage("Connected to server, version ".concat(r2.serverVersion, ".")), (null === (e2 = r2.serverInfo) || void 0 === e2 ? void 0 : e2.edition) === Yt.Cloud && (null === (t2 = r2.serverInfo) || void 0 === t2 ? void 0 : t2.region) && this.appendMessage("LiveKit Cloud: ".concat(null === (i2 = r2.serverInfo) || void 0 === i2 ? void 0 : i2.region))) : this.appendError("Websocket connection could not be established"), yield o2.close();
      }));
    }
  }
  class Hh extends wr.EventEmitter {
    constructor(e2, t2) {
      let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      super(), this.options = {}, this.checkResults = /* @__PURE__ */ new Map(), this.url = e2, this.token = t2, this.options = n2;
    }
    getNextCheckId() {
      const t2 = this.checkResults.size;
      return this.checkResults.set(t2, { logs: [], status: e.CheckStatus.IDLE, name: "", description: "" }), t2;
    }
    updateCheck(e2, t2) {
      this.checkResults.set(e2, t2), this.emit("checkUpdate", e2, t2);
    }
    isSuccess() {
      return Array.from(this.checkResults.values()).every(((t2) => t2.status !== e.CheckStatus.FAILED));
    }
    getResults() {
      return Array.from(this.checkResults.values());
    }
    createAndRunCheck(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.getNextCheckId(), n2 = new e2(this.url, this.token, this.options), i2 = (e3) => {
          this.updateCheck(t2, e3);
        };
        n2.on("update", i2);
        const r2 = yield n2.run();
        return n2.off("update", i2), r2;
      }));
    }
    checkWebsocket() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(Wh);
      }));
    }
    checkWebRTC() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(Vh);
      }));
    }
    checkTURN() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(qh);
      }));
    }
    checkReconnect() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(Bh);
      }));
    }
    checkPublishAudio() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(Fh);
      }));
    }
    checkPublishVideo() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(jh);
      }));
    }
    checkConnectionProtocol() {
      return kr(this, void 0, void 0, (function* () {
        const e2 = yield this.createAndRunCheck(Uh);
        if (e2.data && "protocol" in e2.data) {
          const t2 = e2.data;
          this.options.protocol = t2.protocol;
        }
        return e2;
      }));
    }
    checkCloudRegion() {
      return kr(this, void 0, void 0, (function* () {
        return this.createAndRunCheck(Nh);
      }));
    }
  }
  class Kh {
  }
  class zh {
  }
  new TextEncoder();
  const Gh = new TextDecoder(), Jh = new TextDecoder("utf-8", { fatal: true });
  class Qh extends Error {
    constructor(e2, t2) {
      var n2;
      super(e2, t2), x(this, "code", "ERR_JOSE_GENERIC"), this.name = this.constructor.name, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
    }
  }
  x(Qh, "code", "ERR_JOSE_GENERIC");
  x(class extends Qh {
    constructor(e2, t2) {
      let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", i2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
      super(e2, { cause: { claim: n2, reason: i2, payload: t2 } }), x(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), x(this, "claim", void 0), x(this, "reason", void 0), x(this, "payload", void 0), this.claim = n2, this.reason = i2, this.payload = t2;
    }
  }, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED");
  x(class extends Qh {
    constructor(e2, t2) {
      let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", i2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
      super(e2, { cause: { claim: n2, reason: i2, payload: t2 } }), x(this, "code", "ERR_JWT_EXPIRED"), x(this, "claim", void 0), x(this, "reason", void 0), x(this, "payload", void 0), this.claim = n2, this.reason = i2, this.payload = t2;
    }
  }, "code", "ERR_JWT_EXPIRED");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
    }
  }, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JOSE_NOT_SUPPORTED");
    }
  }, "code", "ERR_JOSE_NOT_SUPPORTED");
  x(class extends Qh {
    constructor() {
      super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "decryption operation failed", arguments.length > 1 ? arguments[1] : void 0), x(this, "code", "ERR_JWE_DECRYPTION_FAILED");
    }
  }, "code", "ERR_JWE_DECRYPTION_FAILED");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JWE_INVALID");
    }
  }, "code", "ERR_JWE_INVALID");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JWS_INVALID");
    }
  }, "code", "ERR_JWS_INVALID");
  class Yh extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JWT_INVALID");
    }
  }
  x(Yh, "code", "ERR_JWT_INVALID");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JWK_INVALID");
    }
  }, "code", "ERR_JWK_INVALID");
  x(class extends Qh {
    constructor() {
      super(...arguments), x(this, "code", "ERR_JWKS_INVALID");
    }
  }, "code", "ERR_JWKS_INVALID");
  x(class extends Qh {
    constructor() {
      super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "no applicable key found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), x(this, "code", "ERR_JWKS_NO_MATCHING_KEY");
    }
  }, "code", "ERR_JWKS_NO_MATCHING_KEY");
  x(class extends Qh {
    constructor() {
      super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "multiple matching keys found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), x(this, Symbol.asyncIterator, /* @__PURE__ */ (function(e2) {
        return function() {
          return new V(e2.apply(this, arguments));
        };
      })((function* () {
      }))), x(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
    }
  }, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
  x(class extends Qh {
    constructor() {
      super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "request timed out", arguments.length > 1 ? arguments[1] : void 0), x(this, "code", "ERR_JWKS_TIMEOUT");
    }
  }, "code", "ERR_JWKS_TIMEOUT");
  x(class extends Qh {
    constructor() {
      super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "signature verification failed", arguments.length > 1 ? arguments[1] : void 0), x(this, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
    }
  }, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
  function Xh(e2) {
    try {
      return (function(e3) {
        let t2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (Uint8Array.fromBase64) return Uint8Array.fromBase64(e3, { alphabet: t2 ? "base64url" : "base64" });
        if (t2) {
          if (e3.includes("+") || e3.includes("/")) throw new TypeError("Invalid base64url");
          e3 = e3.replace(/-/g, "+").replace(/_/g, "/");
        }
        const n2 = atob(e3), i2 = new Uint8Array(n2.length);
        for (let r2 = 0; r2 < n2.length; r2++) i2[r2] = n2.charCodeAt(r2);
        return i2;
      })("string" == typeof e2 ? e2 : Gh.decode(e2), true);
    } catch (t2) {
      throw new TypeError("The input to be decoded is not correctly encoded.", { cause: t2 });
    }
  }
  function Zh(e2) {
    if ("string" != typeof e2) throw new Yh("JWTs must use Compact JWS serialization, JWT must be a string");
    const t2 = e2.split("."), n2 = t2[1], i2 = t2.length;
    if (5 === i2) throw new Yh("Only JWTs using Compact JWS serialization can be decoded");
    if (3 !== i2) throw new Yh("Invalid JWT");
    if (!n2) throw new Yh("JWTs must contain a payload");
    let r2, o2;
    try {
      r2 = Xh(n2);
    } catch (s2) {
      throw new Yh("Failed to base64url decode the payload");
    }
    try {
      o2 = JSON.parse(Jh.decode(r2));
    } catch (a2) {
      throw new Yh("Failed to parse the decoded payload as JSON");
    }
    if (!(function(e3) {
      if ("object" != typeof e3 || null === e3 || "[object Object]" !== Object.prototype.toString.call(e3)) return false;
      const t3 = Object.getPrototypeOf(e3);
      return null === t3 || null === Object.getPrototypeOf(t3);
    })(o2)) throw new Yh("Invalid JWT Claims Set");
    return o2;
  }
  const $h = 1e3;
  function ep(e2) {
    const t2 = Zh(e2);
    t2.roomConfig;
    const n2 = fr(t2, ["roomConfig"]);
    return Object.assign(Object.assign({}, n2), { roomConfig: t2.roomConfig ? Fn.fromJson(t2.roomConfig, { ignoreUnknownFields: true }) : void 0 });
  }
  function tp(e2, t2) {
    const n2 = /* @__PURE__ */ new Set([...Object.keys(e2), ...Object.keys(t2)]);
    for (const i2 of n2) switch (i2) {
      case "roomName":
      case "participantName":
      case "participantIdentity":
      case "participantMetadata":
      case "participantAttributes":
      case "agentName":
      case "agentMetadata":
      case "deployment":
        if (e2[i2] !== t2[i2]) return false;
        break;
      default:
        throw new Error("Options key ".concat(i2, " not being checked for equality!"));
    }
    return true;
  }
  class np extends zh {
    constructor() {
      super(...arguments), this.cachedFetchOptions = null, this.cachedResponse = null, this.fetchMutex = new r();
    }
    isSameAsCachedFetchOptions(e2) {
      return !!this.cachedFetchOptions && tp(e2, this.cachedFetchOptions);
    }
    shouldReturnCachedValueFromFetch(e2) {
      return !!this.cachedResponse && (!!(function(e3) {
        const t2 = ep(e3.participantToken);
        if (!(null == t2 ? void 0 : t2.exp)) return false;
        const n2 = /* @__PURE__ */ new Date();
        if (t2.nbf) {
          const e4 = t2.nbf * $h;
          if (new Date(e4) > n2) return false;
        }
        const i2 = t2.exp * $h;
        return new Date(i2 - 6e4) > n2;
      })(this.cachedResponse) && !!this.isSameAsCachedFetchOptions(e2));
    }
    getCachedResponseJwtPayload() {
      return this.cachedResponse ? ep(this.cachedResponse.participantToken) : null;
    }
    fetch(e2, t2) {
      return kr(this, void 0, void 0, (function* () {
        const n2 = yield this.fetchMutex.lock();
        try {
          if (t2 && (this.cachedResponse = null), this.shouldReturnCachedValueFromFetch(e2)) return this.cachedResponse.toJson();
          this.cachedFetchOptions = e2;
          const n3 = yield this.update(e2);
          return this.cachedResponse = n3, n3.toJson();
        } finally {
          n2();
        }
      }));
    }
  }
  class ip extends Kh {
    constructor(e2) {
      super(), this.literalOrFn = e2;
    }
    fetch() {
      return kr(this, void 0, void 0, (function* () {
        return "function" == typeof this.literalOrFn ? this.literalOrFn() : this.literalOrFn;
      }));
    }
  }
  class rp extends np {
    constructor(e2) {
      super(), this.customFn = e2;
    }
    update(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = this.customFn(e2);
        let n2;
        return n2 = t2 instanceof Promise ? yield t2 : t2, $i.fromJson(n2, { ignoreUnknownFields: true });
      }));
    }
  }
  class op extends np {
    constructor(e2) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      super(), this.url = e2, this.endpointOptions = t2;
    }
    createRequestFromOptions(e2) {
      var t2, n2, i2, r2;
      const o2 = new Zi();
      for (const s2 of Object.keys(e2)) switch (s2) {
        case "roomName":
        case "participantName":
        case "participantIdentity":
        case "participantMetadata":
          o2[s2] = e2[s2];
          break;
        case "participantAttributes":
          o2.participantAttributes = null !== (t2 = e2.participantAttributes) && void 0 !== t2 ? t2 : {};
          break;
        case "agentName":
          o2.roomConfig = null !== (n2 = o2.roomConfig) && void 0 !== n2 ? n2 : new Fn(), 0 === o2.roomConfig.agents.length && o2.roomConfig.agents.push(new vn()), o2.roomConfig.agents[0].agentName = e2.agentName;
          break;
        case "agentMetadata":
          o2.roomConfig = null !== (i2 = o2.roomConfig) && void 0 !== i2 ? i2 : new Fn(), 0 === o2.roomConfig.agents.length && o2.roomConfig.agents.push(new vn()), o2.roomConfig.agents[0].metadata = e2.agentMetadata;
          break;
        case "deployment":
          o2.roomConfig = null !== (r2 = o2.roomConfig) && void 0 !== r2 ? r2 : new Fn(), 0 === o2.roomConfig.agents.length && o2.roomConfig.agents.push(new vn()), o2.roomConfig.agents[0].deployment = e2.deployment;
          break;
        default:
          throw new Error("Options key ".concat(s2, " not being included in forming request!"));
      }
      return o2;
    }
    update(e2) {
      return kr(this, void 0, void 0, (function* () {
        var t2;
        const n2 = this.createRequestFromOptions(e2), i2 = yield fetch(this.url, Object.assign(Object.assign({}, this.endpointOptions), { method: null !== (t2 = this.endpointOptions.method) && void 0 !== t2 ? t2 : "POST", headers: Object.assign({ "Content-Type": "application/json" }, this.endpointOptions.headers), body: n2.toJsonString({ useProtoFieldName: true }) }));
        if (!i2.ok) throw new Error("Error generating token from endpoint ".concat(this.url, ": received ").concat(i2.status, " / ").concat(yield i2.text()));
        const r2 = yield i2.json();
        return $i.fromJson(r2, { ignoreUnknownFields: true });
      }));
    }
  }
  class sp extends op {
    constructor(e2, t2) {
      const n2 = t2.baseUrl, i2 = void 0 === n2 ? "https://cloud-api.livekit.io" : n2, r2 = fr(t2, ["baseUrl"]);
      super("".concat(i2, "/api/v2/sandbox/connection-details"), Object.assign(Object.assign({}, r2), { headers: { "X-Sandbox-ID": e2 } }));
    }
  }
  class ap extends sp {
  }
  const cp = { literal: (e2) => new ip(e2), custom: (e2) => new rp(e2), endpoint(e2) {
    return new op(e2, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {});
  }, sandboxTokenServer(e2) {
    return new ap(e2, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {});
  }, developmentTokenServer(e2) {
    return new sp(e2, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {});
  } };
  const dp = /* @__PURE__ */ new Map([["obs virtual camera", { facingMode: "environment", confidence: "medium" }]]), lp = /* @__PURE__ */ new Map([["iphone", { facingMode: "environment", confidence: "medium" }], ["ipad", { facingMode: "environment", confidence: "medium" }]]);
  function up(e2) {
    var t2;
    const n2 = e2.trim().toLowerCase();
    if ("" !== n2) return dp.has(n2) ? dp.get(n2) : null === (t2 = Array.from(lp.entries()).find(((e3) => {
      let t3 = j(e3, 1)[0];
      return n2.includes(t3);
    }))) || void 0 === t2 ? void 0 : t2[1];
  }
  const hp = /* @__PURE__ */ Symbol.for("lk.serializer");
  function pp(e2) {
    return Object.assign(Object.assign({}, e2), { symbol: hp });
  }
  const mp = { json: function() {
    return pp({ parse: (e2) => JSON.parse(e2), serialize: (e2) => JSON.stringify(e2) });
  }, raw: function() {
    return pp({ parse: (e2) => e2, serialize: (e2) => e2 });
  }, custom: function(e2) {
    return pp(e2);
  } };
  e.BaseKeyProvider = yc, e.CLIENT_PROTOCOL_DATA_STREAM_RPC = 1, e.CLIENT_PROTOCOL_DATA_STREAM_V2 = 2, e.CLIENT_PROTOCOL_DEFAULT = 0, e.Checker = Lh, e.ConnectionCheck = Hh, e.ConnectionError = Zo, e.CriticalTimers = ls, e.CryptorError = Tc, e.DataPacket_Kind = Lt, e.DataStreamError = cs, e.DataTrackPacket = xu, e.DefaultReconnectPolicy = vr, e.DeviceUnsupportedError = es, e.DisconnectReason = at, e.Encryption_Type = yt, e.ExternalE2EEKeyProvider = class extends yc {
    constructor() {
      let e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      super(Object.assign(Object.assign({}, e2), { sharedKey: true, ratchetWindowSize: 0, failureTolerance: -1 }));
    }
    setKey(e2) {
      return kr(this, void 0, void 0, (function* () {
        const t2 = "string" == typeof e2 ? yield gc(e2) : yield vc(e2);
        this.onSetEncryptionKey(t2);
      }));
    }
  }, e.FrameMetadataManager = Nc, e.LivekitError = Wo, e.LivekitReasonedError = Ho, e.LocalAudioTrack = wl, e.LocalDataTrack = nh, e.LocalParticipant = Ch, e.LocalTrack = Cl, e.LocalTrackPublication = fh, e.LocalTrackRecorder = El, e.LocalVideoTrack = Fl, e.Mutex = r, e.NegotiationError = rs, e.PacketTrailerManager = xc, e.Participant = Eh, e.ParticipantKind = ft, e.PublishDataError = os, e.PublishTrackError = ss, e.RemoteAudioTrack = gh, e.RemoteDataTrack = Au, e.RemoteParticipant = Ih, e.RemoteTrack = Ic, e.RemoteTrackPublication = Ph, e.RemoteVideoTrack = _c, e.Room = Mh, e.RpcError = ah, e.ScreenSharePresets = Ps, e.SignalReconnectError = ds, e.SignalRequestError = as, e.SimulatedError = class extends Wo {
    constructor() {
      super(-1, arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "Simulated failure"), this.name = "simulated";
    }
  }, e.SubscriptionError = dt, e.TokenSource = cp, e.TokenSourceConfigurable = zh, e.TokenSourceFixed = Kh, e.Track = Ws, e.TrackInvalidError = ts, e.TrackPublication = vh, e.TrackType = nt, e.UnexpectedConnectionState = is, e.UnsupportedServer = ns, e.VideoPreset = fs, e.VideoPresets = ws, e.VideoPresets43 = Rs, e.areTokenSourceFetchOptionsEqual = tp, e.asEncryptablePacket = kc, e.attachToElement = Hs, e.attributes = Ah, e.audioCodecs = ks, e.canFailOverToAnotherRegion = $o, e.clientProtocol = 2, e.compareVersions = ba, e.createAudioAnalyser = function(e2, t2) {
    const n2 = Object.assign({ cloneTrack: false, fftSize: 2048, smoothingTimeConstant: 0.8, minDecibels: -100, maxDecibels: -80 }, t2), i2 = Os();
    if (!i2) throw new Error("Audio Context not supported on this browser");
    const r2 = n2.cloneTrack ? e2.mediaStreamTrack.clone() : e2.mediaStreamTrack, o2 = i2.createMediaStreamSource(new MediaStream([r2])), s2 = i2.createAnalyser();
    s2.minDecibels = n2.minDecibels, s2.maxDecibels = n2.maxDecibels, s2.fftSize = n2.fftSize, s2.smoothingTimeConstant = n2.smoothingTimeConstant, o2.connect(s2);
    const a2 = new Uint8Array(s2.frequencyBinCount);
    let c2 = false;
    return { calculateVolume: () => {
      s2.getByteFrequencyData(a2);
      let e3 = 0;
      for (const t3 of a2) e3 += Math.pow(t3 / 255, 2);
      return Math.sqrt(e3 / a2.length);
    }, analyser: s2, cleanup: () => kr(this, void 0, void 0, (function* () {
      c2 || (c2 = true, o2.disconnect(), s2.disconnect(), n2.cloneTrack && r2.stop(), yield i2.close());
    })) };
  }, e.createE2EEKey = function() {
    return window.crypto.getRandomValues(new Uint8Array(32));
  }, e.createKeyMaterialFromBuffer = vc, e.createKeyMaterialFromString = gc, e.createLocalAudioTrack = bh, e.createLocalScreenTracks = function(e2) {
    return kr(this, void 0, void 0, (function* () {
      if (void 0 === e2 && (e2 = {}), void 0 !== e2.resolution || ua() || (e2.resolution = Ps.h1080fps30.resolution), void 0 === navigator.mediaDevices.getDisplayMedia) throw new es("getDisplayMedia not supported");
      const t2 = Ns(e2), n2 = yield navigator.mediaDevices.getDisplayMedia(t2), i2 = n2.getVideoTracks();
      if (0 === i2.length) throw new ts("no video track found");
      const r2 = new Fl(i2[0], void 0, false);
      r2.source = Ws.Source.ScreenShare;
      const o2 = [r2];
      if (n2.getAudioTracks().length > 0) {
        const e3 = new wl(n2.getAudioTracks()[0], void 0, false);
        e3.source = Ws.Source.ScreenShareAudio, o2.push(e3);
      }
      return o2;
    }));
  }, e.createLocalTracks = kh, e.createLocalVideoTrack = yh, e.decodeTokenPayload = ep, e.deriveKeys = function(e2, t2) {
    return kr(this, void 0, void 0, (function* () {
      const n2 = fc(e2.algorithm.name, t2.ratchetSalt), i2 = yield crypto.subtle.deriveKey(n2, e2, { name: sc, length: t2.keySize }, false, ["encrypt", "decrypt"]);
      return { material: e2, encryptionKey: i2 };
    }));
  }, e.detachTrack = Ks, e.facingModeFromDeviceLabel = up, e.facingModeFromLocalTrack = function(e2) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    var n2;
    const i2 = Va(e2) ? e2.mediaStreamTrack : e2, r2 = i2.getSettings();
    let o2 = { facingMode: null !== (n2 = t2.defaultFacingMode) && void 0 !== n2 ? n2 : "user", confidence: "low" };
    if ("facingMode" in r2) {
      const e3 = r2.facingMode;
      ar.trace("rawFacingMode", { rawFacingMode: e3 }), e3 && "string" == typeof e3 && (function(e4) {
        const t3 = ["user", "environment", "left", "right"];
        return void 0 === e4 || t3.includes(e4);
      })(e3) && (o2 = { facingMode: e3, confidence: "high" });
    }
    if (["low", "medium"].includes(o2.confidence)) {
      ar.trace("Try to get facing mode from device label: (".concat(i2.label, ")"));
      const e3 = up(i2.label);
      void 0 !== e3 && (o2 = e3);
    }
    return o2;
  }, e.getBrowser = Fo, e.getEmptyAudioStreamTrack = Oa, e.getEmptyVideoStreamTrack = function() {
    return Pa || (Pa = Ma()), Pa.clone();
  }, e.getLogger = dr, e.importKey = function(e2) {
    return kr(this, arguments, void 0, (function(e3) {
      let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { name: sc }, n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "encrypt";
      return (function* () {
        return crypto.subtle.importKey("raw", e3, t2, false, "derive" === n2 ? ["deriveBits", "deriveKey"] : ["encrypt", "decrypt"]);
      })();
    }));
  }, e.isAudioCodec = function(e2) {
    return ks.includes(e2);
  }, e.isAudioTrack = Wa, e.isBackupCodec = Ss, e.isBackupVideoCodec = Ts, e.isBrowserSupported = ra, e.isE2EESupported = hc, e.isInsertableStreamSupported = mc, e.isLocalParticipant = Ya, e.isLocalTrack = Va, e.isRemoteParticipant = function(e2) {
    return !e2.isLocal;
  }, e.isRemoteTrack = Ga, e.isSVCCodec = $s, e.isScriptTransformSupported = pc, e.isSerializer = function(e2) {
    return "object" == typeof e2 && null !== e2 && "symbol" in e2 && e2.symbol === hp;
  }, e.isVideoCodec = Na, e.isVideoFrame = function(e2) {
    return "type" in e2;
  }, e.isVideoTrack = Ha, e.needsRbspUnescaping = function(e2) {
    for (var t2 = 0; t2 < e2.length - 3; t2++) if (0 == e2[t2] && 0 == e2[t2 + 1] && 3 == e2[t2 + 2]) return true;
    return false;
  }, e.parseRbsp = function(e2) {
    const t2 = [];
    for (var n2 = e2.length, i2 = 0; i2 < e2.length; ) n2 - i2 >= 3 && !e2[i2] && !e2[i2 + 1] && 3 == e2[i2 + 2] ? (t2.push(e2[i2++]), t2.push(e2[i2++]), i2++) : t2.push(e2[i2++]);
    return new Uint8Array(t2);
  }, e.protocolVersion = 17, e.ratchet = function(e2, t2) {
    return kr(this, void 0, void 0, (function* () {
      const n2 = fc(e2.algorithm.name, t2);
      return crypto.subtle.deriveBits(n2, e2, 256);
    }));
  }, e.releaseEmptyAudioStreamTrack = Aa, e.serializers = mp, e.setLogExtension = function(t2, n2) {
    (n2 ? [n2] : cr).forEach(((n3) => {
      const i2 = n3.methodFactory;
      n3.methodFactory = (n4, r2, o2) => {
        const s2 = i2(n4, r2, o2), a2 = e.LogLevel[n4], c2 = a2 >= r2 && a2 < e.LogLevel.silent;
        return (e2, n5) => {
          n5 ? s2(e2, n5) : s2(e2), c2 && t2(a2, e2, n5);
        };
      }, n3.setLevel(n3.getLevel());
    }));
  }, e.setLogLevel = function(e2, t2) {
    if (t2) sr.getLogger(t2).setLevel(e2);
    else for (const n2 of cr) n2.setLevel(e2);
  }, e.supportsAV1 = Xs, e.supportsAdaptiveStream = function() {
    return "undefined" != typeof ResizeObserver && "undefined" != typeof IntersectionObserver;
  }, e.supportsAudioOutputSelection = function() {
    return ia();
  }, e.supportsDynacast = function() {
    return Qs();
  }, e.supportsH265 = function() {
    if (!("getCapabilities" in RTCRtpSender)) return false;
    const e2 = RTCRtpSender.getCapabilities("video");
    let t2 = false;
    if (e2) {
      for (const n2 of e2.codecs) if ("video/h265" === n2.mimeType.toLowerCase()) {
        t2 = true;
        break;
      }
    }
    return t2;
  }, e.supportsVP9 = Zs, e.version = Vo, e.videoCodecs = bs, e.writeRbsp = function(e2) {
    const t2 = [];
    for (var n2 = 0, i2 = 0; i2 < e2.length; ++i2) {
      var r2 = e2[i2];
      r2 <= 3 && n2 >= 2 && (t2.push(3), n2 = 0), t2.push(r2), 0 == r2 ? ++n2 : n2 = 0;
    }
    return new Uint8Array(t2);
  };
}));
