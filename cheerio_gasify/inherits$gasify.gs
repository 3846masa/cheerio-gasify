function inherits_(module, exports, global) {
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
  "name": "inherits",
  "description": "Browser-friendly inheritance fully compatible with standard node.js inherits()",
  "version": "2.0.1",
  "keywords": [
    "inheritance",
    "class",
    "klass",
    "oop",
    "object-oriented",
    "inherits",
    "browser",
    "browserify"
  ],
  "main": "./inherits.js",
  "browser": "./inherits_browser.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/isaacs/inherits.git"
  },
  "license": "ISC",
  "scripts": {
    "test": "node test"
  },
  "bugs": {
    "url": "https://github.com/isaacs/inherits/issues"
  },
  "_id": "inherits@2.0.1",
  "dist": {
    "shasum": "b17d08d326b4423e568eff719f91b0b1cbdf69f1",
    "tarball": "http://registry.npmjs.org/inherits/-/inherits-2.0.1.tgz"
  },
  "_from": "inherits@2.0.1",
  "_npmVersion": "1.3.8",
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
  "_shasum": "b17d08d326b4423e568eff719f91b0b1cbdf69f1",
  "_resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.1.tgz",
  "readme": "ERROR: No README data found!",
  "homepage": "https://github.com/isaacs/inherits#readme"
}
;
  };

  this.inherits_ = function(module, exports, global) {
    module.exports = require('util').inherits
    
  };

  return this.inherits_(module, exports, global);
};
