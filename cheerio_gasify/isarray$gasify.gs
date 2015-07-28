function isarray_(module, exports, global) {
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
  "name": "isarray",
  "description": "Array#isArray for older browsers",
  "version": "0.0.1",
  "repository": {
    "type": "git",
    "url": "git://github.com/juliangruber/isarray.git"
  },
  "homepage": "https://github.com/juliangruber/isarray",
  "main": "index.js",
  "scripts": {
    "test": "tap test/*.js"
  },
  "dependencies": {},
  "devDependencies": {
    "tap": "*"
  },
  "keywords": [
    "browser",
    "isarray",
    "array"
  ],
  "author": {
    "name": "Julian Gruber",
    "email": "mail@juliangruber.com",
    "url": "http://juliangruber.com"
  },
  "license": "MIT",
  "_id": "isarray@0.0.1",
  "dist": {
    "shasum": "8a18acfca9a8f4177e09abfc6038939b05d1eedf",
    "tarball": "http://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz"
  },
  "_from": "isarray@0.0.1",
  "_npmVersion": "1.2.18",
  "_npmUser": {
    "name": "juliangruber",
    "email": "julian@juliangruber.com"
  },
  "maintainers": [
    {
      "name": "juliangruber",
      "email": "julian@juliangruber.com"
    }
  ],
  "directories": {},
  "_shasum": "8a18acfca9a8f4177e09abfc6038939b05d1eedf",
  "_resolved": "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
  "bugs": {
    "url": "https://github.com/juliangruber/isarray/issues"
  },
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    module.exports = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };
    
  };

  return this.index_(module, exports, global);
};
