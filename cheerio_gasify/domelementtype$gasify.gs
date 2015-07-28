function domelementtype_(module, exports, global) {
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
  "name": "domelementtype",
  "version": "1.1.3",
  "description": "all the types of nodes in htmlparser2's dom",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/FB55/domelementtype.git"
  },
  "keywords": [
    "dom",
    "htmlparser2"
  ],
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "gitHead": "012a97a1d38737e096de2045b2b5f28768d8187e",
  "bugs": {
    "url": "https://github.com/FB55/domelementtype/issues"
  },
  "homepage": "https://github.com/FB55/domelementtype",
  "_id": "domelementtype@1.1.3",
  "scripts": {},
  "_shasum": "bd28773e2642881aec51544924299c5cd822185b",
  "_from": "domelementtype@>=1.1.1 <1.2.0",
  "_npmVersion": "2.1.5",
  "_nodeVersion": "0.10.32",
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
  "dist": {
    "shasum": "bd28773e2642881aec51544924299c5cd822185b",
    "tarball": "http://registry.npmjs.org/domelementtype/-/domelementtype-1.1.3.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-1.1.3.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    //Types of elements found in the DOM
    module.exports = {
    	Text: "text", //Text
    	Directive: "directive", //<? ... ?>
    	Comment: "comment", //<!-- ... -->
    	Script: "script", //<script> tags
    	Style: "style", //<style> tags
    	Tag: "tag", //Any tag
    	CDATA: "cdata", //<![CDATA[ ... ]]>
    
    	isTag: function(elem){
    		return elem.type === "tag" || elem.type === "script" || elem.type === "style";
    	}
    };
  };

  return this.index_(module, exports, global);
};
