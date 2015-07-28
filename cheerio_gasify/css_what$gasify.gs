function css_what_(module, exports, global) {
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
  "author": {
    "name": "Felix Böhm",
    "email": "me@feedic.com",
    "url": "http://feedic.com"
  },
  "name": "css-what",
  "description": "a CSS selector parser",
  "version": "1.0.0",
  "repository": {
    "url": "git+https://github.com/fb55/css-what.git"
  },
  "main": "./index.js",
  "files": [
    "index.js"
  ],
  "scripts": {
    "test": "node tests/test.js && jshint *.js"
  },
  "dependencies": {},
  "devDependencies": {
    "jshint": "2"
  },
  "optionalDependencies": {},
  "engines": {
    "node": "*"
  },
  "license": "BSD-like",
  "jshintConfig": {
    "eqeqeq": true,
    "freeze": true,
    "latedef": "nofunc",
    "noarg": true,
    "nonbsp": true,
    "quotmark": "double",
    "undef": true,
    "unused": true,
    "trailing": true,
    "eqnull": true,
    "proto": true,
    "smarttabs": true,
    "node": true,
    "globals": {
      "describe": true,
      "it": true
    }
  },
  "gitHead": "d54c2857acbb22d56190fc998b48744597ddd730",
  "bugs": {
    "url": "https://github.com/fb55/css-what/issues"
  },
  "homepage": "https://github.com/fb55/css-what",
  "_id": "css-what@1.0.0",
  "_shasum": "d7cc2df45180666f99d2b14462639469e00f736c",
  "_from": "css-what@>=1.0.0 <1.1.0",
  "_npmVersion": "2.4.1",
  "_nodeVersion": "1.0.4",
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
    "shasum": "d7cc2df45180666f99d2b14462639469e00f736c",
    "tarball": "http://registry.npmjs.org/css-what/-/css-what-1.0.0.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/css-what/-/css-what-1.0.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    "use strict";
    
    module.exports = parse;
    
    var re_ws = /^\s/,
        re_name = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/,
        re_escape = /\\([\da-f]{1,6}\s?|(\s)|.)/ig,
        //modified version of https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L87
        re_attr = /^\s*((?:\\.|[\w\u00c0-\uFFFF\-])+)\s*(?:(\S?)=\s*(?:(['"])(.*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF\-])*)|)|)\s*(i)?\]/;
    
    var actionTypes = {
    	__proto__: null,
    	"undefined": "exists",
    	"":  "equals",
    	"~": "element",
    	"^": "start",
    	"$": "end",
    	"*": "any",
    	"!": "not",
    	"|": "hyphen"
    };
    
    var simpleSelectors = {
    	__proto__: null,
    	">": "child",
    	"<": "parent",
    	"~": "sibling",
    	"+": "adjacent"
    };
    
    var attribSelectors = {
    	__proto__: null,
    	"#": ["id", "equals"],
    	".": ["class", "element"]
    };
    
    //unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L139
    function funescape( _, escaped, escapedWhitespace ) {
    	var high = "0x" + escaped - 0x10000;
    	// NaN means non-codepoint
    	// Support: Firefox
    	// Workaround erroneous numeric interpretation of +"0x"
    	return high !== high || escapedWhitespace ?
    		escaped :
    		// BMP codepoint
    		high < 0 ?
    			String.fromCharCode( high + 0x10000 ) :
    			// Supplemental Plane codepoint (surrogate pair)
    			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    }
    
    function unescapeCSS(str){
    	return str.replace(re_escape, funescape);
    }
    
    function getClosingPos(selector){
    	var pos = 1, counter = 1, len = selector.length;
    
    	for(; counter > 0 && pos < len; pos++){
    		if(selector.charAt(pos) === "(") counter++;
    		else if(selector.charAt(pos) === ")") counter--;
    	}
    
    	return pos;
    }
    
    function parse(selector, options){
    	selector = (selector + "").trimLeft();
    
    	var subselects = [],
    	    tokens = [],
    	    sawWS = false,
    	    data, firstChar, name;
    	
    	function getName(){
    		var sub = selector.match(re_name)[0];
    		selector = selector.substr(sub.length);
    		return unescapeCSS(sub);
    	}
    
    	while(selector !== ""){
    		if(re_name.test(selector)){
    			if(sawWS){
    				tokens.push({type: "descendant"});
    				sawWS = false;
    			}
    
    			name = getName();
    
    			if(!options || ("lowerCaseTags" in options ? options.lowerCaseTags : !options.xmlMode)){
    				name = name.toLowerCase();
    			}
    
    			tokens.push({type: "tag", name: name});
    		} else if(re_ws.test(selector)){
    			sawWS = true;
    			selector = selector.trimLeft();
    		} else {
    			firstChar = selector.charAt(0);
    			selector = selector.substr(1);
    
    			if(firstChar in simpleSelectors){
    				tokens.push({type: simpleSelectors[firstChar]});
    				selector = selector.trimLeft();
    				sawWS = false;
    				continue;
    			} else if(firstChar === ","){
    				if(tokens.length === 0){
    					throw new SyntaxError("empty sub-selector");
    				}
    				subselects.push(tokens);
    				tokens = [];
    
    				selector = selector.trimLeft();
    				sawWS = false;
    				continue;
    			} else if(sawWS){
    				tokens.push({type: "descendant"});
    				sawWS = false;
    			}
    
    			if(firstChar === "*"){
    				tokens.push({type: "universal"});
    			} else if(firstChar in attribSelectors){
    				tokens.push({
    					type: "attribute",
    					name: attribSelectors[firstChar][0],
    					action: attribSelectors[firstChar][1],
    					value: getName(),
    					ignoreCase: false
    				});
    			} else if(firstChar === "["){
    				data = selector.match(re_attr);
    				if(!data){
    					throw new SyntaxError("Malformed attribute selector: " + selector);
    				}
    				selector = selector.substr(data[0].length);
    				name = unescapeCSS(data[1]);
    
    				if(
    					!options || (
    						"lowerCaseAttributeNames" in options ?
    							options.lowerCaseAttributeNames :
    							!options.xmlMode
    					)
    				){
    					name = name.toLowerCase();
    				}
    
    				tokens.push({
    					type: "attribute",
    					name: name,
    					action: actionTypes[data[2]],
    					value: unescapeCSS(data[4] || data[5] || ""),
    					ignoreCase: !!data[6]
    				});
    				
    			} else if(firstChar === ":"){
    				//if(selector.charAt(0) === ":"){} //TODO pseudo-element
    				name = getName().toLowerCase();
    				data = null;
    				
    				if(selector.charAt(0) === "("){
    					var pos = getClosingPos(selector);
    					data = selector.substr(1, pos - 2);
    					selector = selector.substr(pos);
    				}
    				
    				tokens.push({type: "pseudo", name: name, data: data});
    			} else {
    				//otherwise, the parser needs to throw or it would enter an infinite loop
    				throw new SyntaxError("Unmatched selector: " + firstChar + selector);
    			}
    		}
    	}
    	
    	if(subselects.length > 0 && tokens.length === 0){
    		throw new SyntaxError("empty sub-selector");
    	}
    	subselects.push(tokens);
    	return subselects;
    }
  };

  return this.index_(module, exports, global);
};
