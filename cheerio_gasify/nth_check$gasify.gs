function nth_check_(module, exports, global) {
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
  "name": "nth-check",
  "version": "1.0.1",
  "description": "performant nth-check parser & compiler",
  "main": "index.js",
  "scripts": {
    "test": "node test"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fb55/nth-check.git"
  },
  "keywords": [
    "nth-child",
    "nth",
    "css"
  ],
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "license": "BSD",
  "bugs": {
    "url": "https://github.com/fb55/nth-check/issues"
  },
  "homepage": "https://github.com/fb55/nth-check",
  "dependencies": {
    "boolbase": "~1.0.0"
  },
  "gitHead": "257338e5bbd53228236abd4cc09539b66b27dd11",
  "_id": "nth-check@1.0.1",
  "_shasum": "9929acdf628fc2c41098deab82ac580cf149aae4",
  "_from": "nth-check@>=1.0.0 <1.1.0",
  "_npmVersion": "2.6.1",
  "_nodeVersion": "1.5.1",
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
    "shasum": "9929acdf628fc2c41098deab82ac580cf149aae4",
    "tarball": "http://registry.npmjs.org/nth-check/-/nth-check-1.0.1.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/nth-check/-/nth-check-1.0.1.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    var parse = require("./parse.js"),
        compile = require("./compile.js");
    
    module.exports = function nthCheck(formula){
    	return compile(parse(formula));
    };
    
    module.exports.parse = parse;
    module.exports.compile = compile;
  };

  this.parse_ = function(module, exports, global) {
    module.exports = parse;
    
    //following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
    
    //[ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
    var re_nthElement = /^([+\-]?\d*n)?\s*(?:([+\-]?)\s*(\d+))?$/;
    
    /*
    	parses a nth-check formula, returns an array of two numbers
    */
    function parse(formula){
    	formula = formula.trim().toLowerCase();
    
    	if(formula === "even"){
    		return [2, 0];
    	} else if(formula === "odd"){
    		return [2, 1];
    	} else {
    		var parsed = formula.match(re_nthElement);
    
    		if(!parsed){
    			throw new SyntaxError("n-th rule couldn't be parsed ('" + formula + "')");
    		}
    
    		var a;
    
    		if(parsed[1]){
    			a = parseInt(parsed[1], 10);
    			if(isNaN(a)){
    				if(parsed[1].charAt(0) === "-") a = -1;
    				else a = 1;
    			}
    		} else a = 0;
    
    		return [
    			a,
    			parsed[3] ? parseInt((parsed[2] || "") + parsed[3], 10) : 0
    		];
    	}
    }
    
  };

  this.compile_ = function(module, exports, global) {
    module.exports = compile;
    
    var BaseFuncs = require("boolbase"),
        trueFunc  = BaseFuncs.trueFunc,
        falseFunc = BaseFuncs.falseFunc;
    
    /*
    	returns a function that checks if an elements index matches the given rule
    	highly optimized to return the fastest solution
    */
    function compile(parsed){
    	var a = parsed[0],
    	    b = parsed[1] - 1;
    
    	//when b <= 0, a*n won't be possible for any matches when a < 0
    	//besides, the specification says that no element is matched when a and b are 0
    	if(b < 0 && a <= 0) return falseFunc;
    
    	//when a is in the range -1..1, it matches any element (so only b is checked)
    	if(a ===-1) return function(pos){ return pos <= b; };
    	if(a === 0) return function(pos){ return pos === b; };
    	//when b <= 0 and a === 1, they match any element
    	if(a === 1) return b < 0 ? trueFunc : function(pos){ return pos >= b; };
    
    	//when a > 0, modulo can be used to check if there is a match
    	var bMod = b % a;
    	if(bMod < 0) bMod += a;
    
    	if(a > 1){
    		return function(pos){
    			return pos >= b && pos % a === bMod;
    		};
    	}
    
    	a *= -1; //make `a` positive
    
    	return function(pos){
    		return pos <= b && pos % a === bMod;
    	};
    }
  };

  return this.index_(module, exports, global);
};
