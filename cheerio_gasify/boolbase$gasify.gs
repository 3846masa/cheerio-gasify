function boolbase_(module, exports, global) {
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
  "name": "boolbase",
  "version": "1.0.0",
  "description": "two functions: One that returns true, one that returns false",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fb55/boolbase.git"
  },
  "keywords": [
    "boolean",
    "function"
  ],
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/fb55/boolbase/issues"
  },
  "homepage": "https://github.com/fb55/boolbase",
  "_id": "boolbase@1.0.0",
  "dist": {
    "shasum": "68dff5fbe60c51eb37725ea9e3ed310dcc1e776e",
    "tarball": "http://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz"
  },
  "_from": "boolbase@>=1.0.0 <1.1.0",
  "_npmVersion": "1.4.2",
  "_npmUser": {
    "name": "feedic",
    "email": "me@feedic.com"
  },
  "maintainers": [
    {
      "name": "feedic",
      "email": "me@feedic.com"
    }
  ],
  "directories": {},
  "_shasum": "68dff5fbe60c51eb37725ea9e3ed310dcc1e776e",
  "_resolved": "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    module.exports = {
    	trueFunc: function trueFunc(){
    		return true;
    	},
    	falseFunc: function falseFunc(){
    		return false;
    	}
    };
  };

  return this.index_(module, exports, global);
};
