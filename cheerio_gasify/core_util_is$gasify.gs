function core_util_is_(module, exports, global) {
  var self = this;

  function require(libname) {
    libname = libname.replace(/^\.?\.\//, '').replace(/\//g, '$');
    libname = libname.replace(/\.js$/, '').replace(/[^\w\$_]/g, '_');
    libname += '_';

    var module = { exports : function(){} };
    var hasFuncs = Object.keys(self);
    for (var i = 0; i < hasFuncs.length; i++) {
      var func = hasFuncs[i];
      if (func.match(new RegExp(libname.replace(/\$/g, '\\$') + '(\\$index)?$'))) {
        var fn = self[func].bind(self);
        fn(module, module.exports, global);
        return module.exports;
      }
    };

    if (global[libname]) {
      var fn = global[libname];
      new fn(module, module.exports, global);
    } else {
      throw new Error("Can't find function '" + libname + "'.");
    }
    return module.exports;
  };
  this.package_ = function(module, exports, global) {
    module.exports = {
  "name": "core-util-is",
  "version": "1.0.1",
  "description": "The `util.is*` functions introduced in Node v0.12.",
  "main": "lib/util.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/isaacs/core-util-is.git"
  },
  "keywords": [
    "util",
    "isBuffer",
    "isArray",
    "isNumber",
    "isString",
    "isRegExp",
    "isThis",
    "isThat",
    "polyfill"
  ],
  "author": {
    "name": "Isaac Z. Schlueter",
    "email": "i@izs.me",
    "url": "http://blog.izs.me/"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/isaacs/core-util-is/issues"
  },
  "readme": "# core-util-is\n\nThe `util.is*` functions introduced in Node v0.12.\n",
  "readmeFilename": "README.md",
  "homepage": "https://github.com/isaacs/core-util-is",
  "_id": "core-util-is@1.0.1",
  "dist": {
    "shasum": "6b07085aef9a3ccac6ee53bf9d3df0c1521a5538",
    "tarball": "http://registry.npmjs.org/core-util-is/-/core-util-is-1.0.1.tgz"
  },
  "_from": "core-util-is@>=1.0.0 <1.1.0",
  "_npmVersion": "1.3.23",
  "_npmUser": {
    "name": "isaacs",
    "email": "i@izs.me"
  },
  "maintainers": [
    {
      "name": "isaacs",
      "email": "i@izs.me"
    }
  ],
  "directories": {},
  "_shasum": "6b07085aef9a3ccac6ee53bf9d3df0c1521a5538",
  "_resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.1.tgz"
}
;
  };

  this.lib$util_ = function(module, exports, global) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    
    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;
    
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    
    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;
    
    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;
    
    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;
    
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;
    
    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;
    
    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;
    
    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;
    
    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;
    
    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;
    
    function isBuffer(arg) {
      return Buffer.isBuffer(arg);
    }
    exports.isBuffer = isBuffer;
    
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  };

  return this.lib$util_(module, exports, global);
};
