function css_select_(module, exports, global) {
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
  "name": "css-select",
  "version": "1.0.0",
  "description": "a CSS selector compiler/engine",
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "keywords": [
    "css",
    "selector",
    "sizzle"
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/fb55/css-select.git"
  },
  "files": [
    "index.js",
    "lib"
  ],
  "dependencies": {
    "css-what": "1.0",
    "domutils": "1.4",
    "boolbase": "~1.0.0",
    "nth-check": "~1.0.0"
  },
  "devDependencies": {
    "htmlparser2": "*",
    "cheerio-soupselect": "*",
    "mocha": "*",
    "mocha-lcov-reporter": "*",
    "coveralls": "*",
    "istanbul": "*",
    "expect.js": "*",
    "jshint": "2"
  },
  "scripts": {
    "test": "mocha && npm run lint",
    "lint": "jshint index.js lib/*.js test/*.js",
    "lcov": "istanbul cover _mocha --report lcovonly -- -R spec",
    "coveralls": "npm run lint && npm run lcov && (cat coverage/lcov.info | coveralls || exit 0)"
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
  "gitHead": "c73512d9b5b4dc3f537702283143c9463b4f7d7d",
  "bugs": {
    "url": "https://github.com/fb55/css-select/issues"
  },
  "homepage": "https://github.com/fb55/css-select",
  "_id": "css-select@1.0.0",
  "_shasum": "b1121ca51848dd264e2244d058cee254deeb44b0",
  "_from": "css-select@>=1.0.0 <1.1.0",
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
    "shasum": "b1121ca51848dd264e2244d058cee254deeb44b0",
    "tarball": "http://registry.npmjs.org/css-select/-/css-select-1.0.0.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/css-select/-/css-select-1.0.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    "use strict";
    
    module.exports = CSSselect;
    
    var Pseudos       = require("./lib/pseudos.js"),
        DomUtils      = require("domutils"),
        findOne       = DomUtils.findOne,
        findAll       = DomUtils.findAll,
        getChildren   = DomUtils.getChildren,
        removeSubsets = DomUtils.removeSubsets,
        falseFunc     = require("boolbase").falseFunc,
        compile       = require("./lib/compile.js"),
        compileUnsafe = compile.compileUnsafe;
    
    function getSelectorFunc(searchFunc){
    	return function select(query, elems, options){
    		if(typeof query !== "function") query = compileUnsafe(query, options);
    		if(!Array.isArray(elems)) elems = getChildren(elems);
    		else elems = removeSubsets(elems);
    		return searchFunc(query, elems);
    	};
    }
    
    var selectAll = getSelectorFunc(function selectAll(query, elems){
    	return (query === falseFunc || !elems || elems.length === 0) ? [] : findAll(query, elems);
    });
    
    var selectOne = getSelectorFunc(function selectOne(query, elems){
    	return (query === falseFunc || !elems || elems.length === 0) ? null : findOne(query, elems);
    });
    
    function is(elem, query, options){
    	return (typeof query === "function" ? query : compile(query, options))(elem);
    }
    
    /*
    	the exported interface
    */
    function CSSselect(query, elems, options){
    	return selectAll(query, elems, options);
    }
    
    CSSselect.compile = compile;
    CSSselect.filters = Pseudos.filters;
    CSSselect.pseudos = Pseudos.pseudos;
    
    CSSselect.selectAll = selectAll;
    CSSselect.selectOne = selectOne;
    
    CSSselect.is = is;
    
    //legacy methods (might be removed)
    CSSselect.parse = compile;
    CSSselect.iterate = selectAll;
    
    //useful for debugging
    CSSselect._compileUnsafe = compileUnsafe;
    
  };

  this.lib$pseudos_ = function(module, exports, global) {
    /*
    	pseudo selectors
    	
    	---
    	
    	they are available in two forms:
    	* filters called when the selector 
    	  is compiled and return a function
    	  that needs to return next()
    	* pseudos get called on execution
    	  they need to return a boolean
    */
    
    var DomUtils    = require("domutils"),
        isTag       = DomUtils.isTag,
        getText     = DomUtils.getText,
        getParent   = DomUtils.getParent,
        getChildren = DomUtils.getChildren,
        getSiblings = DomUtils.getSiblings,
        hasAttrib   = DomUtils.hasAttrib,
        getName     = DomUtils.getName,
        getAttribute= DomUtils.getAttributeValue,
        getNCheck   = require("nth-check"),
        checkAttrib = require("./attributes.js").rules.equals,
        BaseFuncs   = require("boolbase"),
        trueFunc    = BaseFuncs.trueFunc,
        falseFunc   = BaseFuncs.falseFunc;
    
    //helper methods
    function getFirstElement(elems){
    	for(var i = 0; elems && i < elems.length; i++){
    		if(isTag(elems[i])) return elems[i];
    	}
    }
    
    function getAttribFunc(name, value){
    	var data = {name: name, value: value};
    	return function attribFunc(next){
    		return checkAttrib(next, data);
    	};
    }
    
    function getChildFunc(next){
    	return function(elem){
    		return !!getParent(elem) && next(elem);
    	};
    }
    
    var filters = {
    	contains: function(next, text){
    		if(
    			(text.charAt(0) === "\"" || text.charAt(0) === "'") &&
    			text.charAt(0) === text.substr(-1)
    		){
    			text = text.slice(1, -1);
    		}
    		return function contains(elem){
    			return next(elem) && getText(elem).indexOf(text) >= 0;
    		};
    	},
    
    	//location specific methods
    	"nth-child": function(next, rule){
    		var func = getNCheck(rule);
    
    		if(func === falseFunc) return func;
    		if(func === trueFunc)  return getChildFunc(next);
    
    		return function nthChild(elem){
    			var siblings = getSiblings(elem);
    
    			for(var i = 0, pos = 0; i < siblings.length; i++){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					else pos++;
    				}
    			}
    
    			return func(pos) && next(elem);
    		};
    	},
    	"nth-last-child": function(next, rule){
    		var func = getNCheck(rule);
    
    		if(func === falseFunc) return func;
    		if(func === trueFunc)  return getChildFunc(next);
    
    		return function nthLastChild(elem){
    			var siblings = getSiblings(elem);
    
    			for(var pos = 0, i = siblings.length - 1; i >= 0; i--){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					else pos++;
    				}
    			}
    
    			return func(pos) && next(elem);
    		};
    	},
    	"nth-of-type": function(next, rule){
    		var func = getNCheck(rule);
    
    		if(func === falseFunc) return func;
    		if(func === trueFunc)  return getChildFunc(next);
    
    		return function nthOfType(elem){
    			var siblings = getSiblings(elem);
    
    			for(var pos = 0, i = 0; i < siblings.length; i++){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					if(getName(siblings[i]) === getName(elem)) pos++;
    				}
    			}
    
    			return func(pos) && next(elem);
    		};
    	},
    	"nth-last-of-type": function(next, rule){
    		var func = getNCheck(rule);
    
    		if(func === falseFunc) return func;
    		if(func === trueFunc)  return getChildFunc(next);
    
    		return function nthLastOfType(elem){
    			var siblings = getSiblings(elem);
    
    			for(var pos = 0, i = siblings.length - 1; i >= 0; i--){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					if(getName(siblings[i]) === getName(elem)) pos++;
    				}
    			}
    
    			return func(pos) && next(elem);
    		};
    	},
    
    	//jQuery extensions (others follow as pseudos)
    	checkbox: getAttribFunc("type", "checkbox"),
    	file: getAttribFunc("type", "file"),
    	password: getAttribFunc("type", "password"),
    	radio: getAttribFunc("type", "radio"),
    	reset: getAttribFunc("type", "reset"),
    	image: getAttribFunc("type", "image"),
    	submit: getAttribFunc("type", "submit")
    };
    
    //while filters are precompiled, pseudos get called when they are needed
    var pseudos = {
    	root: function(elem){
    		return !getParent(elem);
    	},
    	empty: function(elem){
    		return !getChildren(elem).some(function(elem){
    			return isTag(elem) || elem.type === "text";
    		});
    	},
    
    	"first-child": function(elem){
    		return getFirstElement(getSiblings(elem)) === elem;
    	},
    	"last-child": function(elem){
    		var siblings = getSiblings(elem);
    
    		for(var i = siblings.length - 1; i >= 0; i--){
    			if(siblings[i] === elem) return true;
    			if(isTag(siblings[i])) break;
    		}
    
    		return false;
    	},
    	"first-of-type": function(elem){
    		var siblings = getSiblings(elem);
    
    		for(var i = 0; i < siblings.length; i++){
    			if(isTag(siblings[i])){
    				if(siblings[i] === elem) return true;
    				if(getName(siblings[i]) === getName(elem)) break;
    			}
    		}
    
    		return false;
    	},
    	"last-of-type": function(elem){
    		var siblings = getSiblings(elem);
    
    		for(var i = siblings.length-1; i >= 0; i--){
    			if(isTag(siblings[i])){
    				if(siblings[i] === elem) return true;
    				if(getName(siblings[i]) === getName(elem)) break;
    			}
    		}
    
    		return false;
    	},
    	"only-of-type": function(elem){
    		var siblings = getSiblings(elem);
    
    		for(var i = 0, j = siblings.length; i < j; i++){
    			if(isTag(siblings[i])){
    				if(siblings[i] === elem) continue;
    				if(getName(siblings[i]) === getName(elem)) return false;
    			}
    		}
    
    		return true;
    	},
    	"only-child": function(elem){
    		var siblings = getSiblings(elem);
    
    		for(var i = 0; i < siblings.length; i++){
    			if(isTag(siblings[i]) && siblings[i] !== elem) return false;
    		}
    
    		return true;
    	},
    
    	//forms
    	//to consider: :target, :enabled
    	selected: function(elem){
    		if(hasAttrib(elem, "selected")) return true;
    		else if(getName(elem) !== "option") return false;
    
    		//the first <option> in a <select> is also selected
    		var parent = getParent(elem);
    
    		if(
    			!parent ||
    			getName(parent) !== "select" ||
    			hasAttrib(parent, "multiple")
    		) return false;
    
    		var siblings = getChildren(parent),
    			sawElem  = false;
    
    		for(var i = 0; i < siblings.length; i++){
    			if(isTag(siblings[i])){
    				if(siblings[i] === elem){
    					sawElem = true;
    				} else if(!sawElem){
    					return false;
    				} else if(hasAttrib(siblings[i], "selected")){
    					return false;
    				}
    			}
    		}
    
    		return sawElem;
    	},
    	disabled: function(elem){
    		return hasAttrib(elem, "disabled");
    	},
    	enabled: function(elem){
    		return !hasAttrib(elem, "disabled");
    	},
    	checked: function(elem){
    		return hasAttrib(elem, "checked") || pseudos.selected(elem);
    	},
    
    	//jQuery extensions
    
    	//:parent is the inverse of :empty
    	parent: function(elem){
    		return !pseudos.empty(elem);
    	},
    	header: function(elem){
    		var name = getName(elem);
    		return name === "h1" ||
    		       name === "h2" ||
    		       name === "h3" ||
    		       name === "h4" ||
    		       name === "h5" ||
    		       name === "h6";
    	},
    
    	button: function(elem){
    		var name = getName(elem);
    		return name === "button" ||
    		       name === "input" &&
    		       getAttribute(elem, "type") === "button";
    	},
    	input: function(elem){
    		var name = getName(elem);
    		return name === "input" ||
    		       name === "textarea" ||
    		       name === "select" ||
    		       name === "button";
    	},
    	text: function(elem){
    		var attr;
    		return getName(elem) === "input" && (
    			!(attr = getAttribute(elem, "type")) ||
    			attr.toLowerCase() === "text"
    		);
    	}
    };
    
    function verifyArgs(func, name, subselect){
    	if(subselect === null){
    		if(func.length > 1){
    			throw new SyntaxError("pseudo-selector :" + name + " requires an argument");
    		}
    	} else {
    		if(func.length === 1){
    			throw new SyntaxError("pseudo-selector :" + name + " doesn't have any arguments");
    		}
    	}
    }
    
    //TODO this feels hacky
    var re_CSS3 = /^(?:(?:nth|last|first|only)-(?:child|of-type)|root|empty|(?:en|dis)abled|checked|not)$/;
    
    module.exports = {
    	compile: function(next, data, options){
    		var name = data.name,
    			subselect = data.data;
    
    		if(options && options.strict && !re_CSS3.test(name)){
    			throw SyntaxError(":" + name + " isn't part of CSS3");
    		}
    
    		if(typeof filters[name] === "function"){
    			verifyArgs(filters[name], name,  subselect);
    			return filters[name](next, subselect, options);
    		} else if(typeof pseudos[name] === "function"){
    			var func = pseudos[name];
    			verifyArgs(func, name, subselect);
    
    			if(next === trueFunc) return func;
    
    			return function pseudoArgs(elem){
    				return func(elem, subselect) && next(elem);
    			};
    		} else {
    			throw new SyntaxError("unmatched pseudo-class :" + name);
    		}
    	},
    	filters: filters,
    	pseudos: pseudos
    };
    
  };

  this.lib$attributes_ = function(module, exports, global) {
    var DomUtils  = require("domutils"),
        hasAttrib = DomUtils.hasAttrib,
        getAttributeValue = DomUtils.getAttributeValue,
        falseFunc = require("boolbase").falseFunc;
    
    //https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js#L469
    var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
    
    /*
    	attribute selectors
    */
    
    var attributeRules = {
    	__proto__: null,
    	equals: function(next, data){
    		var name  = data.name,
    		    value = data.value;
    
    		if(data.ignoreCase){
    			value = value.toLowerCase();
    
    			return function equalsIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null && attr.toLowerCase() === value && next(elem);
    			};
    		}
    
    		return function equals(elem){
    			return getAttributeValue(elem, name) === value && next(elem);
    		};
    	},
    	hyphen: function(next, data){
    		var name  = data.name,
    		    value = data.value,
    		    len = value.length;
    
    		if(data.ignoreCase){
    			value = value.toLowerCase();
    
    			return function hyphenIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null &&
    						(attr.length === len || attr.charAt(len) === "-") &&
    						attr.substr(0, len).toLowerCase() === value &&
    						next(elem);
    			};
    		}
    
    		return function hyphen(elem){
    			var attr = getAttributeValue(elem, name);
    			return attr != null &&
    					attr.substr(0, len) === value &&
    					(attr.length === len || attr.charAt(len) === "-") &&
    					next(elem);
    		};
    	},
    	element: function(next, data){
    		var name = data.name,
    		    value = data.value;
    
    		if(/\s/.test(value)){
    			return falseFunc;
    		}
    
    		value = value.replace(reChars, "\\$&");
    
    		var pattern = "(?:^|\\s)" + value + "(?:$|\\s)",
    		    flags = data.ignoreCase ? "i" : "",
    		    regex = new RegExp(pattern, flags);
    
    		return function element(elem){
    			var attr = getAttributeValue(elem, name);
    			return attr != null && regex.test(attr) && next(elem);
    		};
    	},
    	exists: function(next, data){
    		var name = data.name;
    		return function exists(elem){
    			return hasAttrib(elem, name) && next(elem);
    		};
    	},
    	start: function(next, data){
    		var name  = data.name,
    		    value = data.value,
    		    len = value.length;
    
    		if(len === 0){
    			return falseFunc;
    		}
    		
    		if(data.ignoreCase){
    			value = value.toLowerCase();
    
    			return function startIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null && attr.substr(0, len).toLowerCase() === value && next(elem);
    			};
    		}
    
    		return function start(elem){
    			var attr = getAttributeValue(elem, name);
    			return attr != null && attr.substr(0, len) === value && next(elem);
    		};
    	},
    	end: function(next, data){
    		var name  = data.name,
    		    value = data.value,
    		    len   = -value.length;
    
    		if(len === 0){
    			return falseFunc;
    		}
    
    		if(data.ignoreCase){
    			value = value.toLowerCase();
    
    			return function endIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null && attr.substr(len).toLowerCase() === value && next(elem);
    			};
    		}
    
    		return function end(elem){
    			var attr = getAttributeValue(elem, name);
    			return attr != null && attr.substr(len) === value && next(elem);
    		};
    	},
    	any: function(next, data){
    		var name  = data.name,
    		    value = data.value;
    
    		if(value === ""){
    			return falseFunc;
    		}
    
    		if(data.ignoreCase){
    			var regex = new RegExp(value.replace(reChars, "\\$&"), "i");
    
    			return function anyIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null && regex.test(attr) && next(elem);
    			};
    		}
    
    		return function any(elem){
    			var attr = getAttributeValue(elem, name);
    			return attr != null && attr.indexOf(value) >= 0 && next(elem);
    		};
    	},
    	not: function(next, data){
    		var name  = data.name,
    		    value = data.value;
    
    		if(value === ""){
    			return function notEmpty(elem){
    				return !!getAttributeValue(elem, name) && next(elem);
    			};
    		} else if(data.ignoreCase){
    			value = value.toLowerCase();
    
    			return function notIC(elem){
    				var attr = getAttributeValue(elem, name);
    				return attr != null && attr.toLowerCase() !== value && next(elem);
    			};
    		}
    
    		return function not(elem){
    			return getAttributeValue(elem, name) !== value && next(elem);
    		};
    	}
    };
    
    module.exports = {
    	compile: function(next, data, options){
    		if(options && options.strict && (
    			data.ignoreCase || data.action === "not"
    		)) throw SyntaxError("Unsupported attribute selector");
    		return attributeRules[data.action](next, data);
    	},
    	rules: attributeRules
    };
    
  };

  this.lib$compile_ = function(module, exports, global) {
    /*
    	compiles a selector to an executable function
    */
    
    module.exports = compile;
    module.exports.compileUnsafe = compileUnsafe;
    
    var parse       = require("css-what"),
        DomUtils    = require("domutils"),
        isTag       = DomUtils.isTag,
        Rules       = require("./general.js"),
        sortRules   = require("./sort.js"),
        BaseFuncs   = require("boolbase"),
        trueFunc    = BaseFuncs.trueFunc,
        falseFunc   = BaseFuncs.falseFunc,
        procedure   = require("./procedure.json");
    
    function compile(selector, options){
    	var next = compileUnsafe(selector, options);
    	return wrap(next);
    }
    
    function wrap(next){
    	return function base(elem){
    		return isTag(elem) && next(elem);
    	};
    }
    
    function compileUnsafe(selector, options){
    	var token = parse(selector, options);
    	return compileToken(token, options);
    }
    
    function compileToken(token, options){
    	token.forEach(sortRules);
    
    	if(options && options.context){
    		var ctx = options.context;
    
    		token.forEach(function(t){
    			if(!isTraversal(t[0])){
    				t.unshift({type: "descendant"});
    			}
    		});
    
    		var context = Array.isArray(ctx) ?
    			function(elem){
    				return ctx.indexOf(elem) >= 0;
    			} : function(elem){
    				return ctx === elem;
    			};
    
    		if(options.rootFunc){
    			var root = options.rootFunc;
    
    			options.rootFunc = function(elem){
    				return context(elem) && root(elem);
    			};
    		} else {
    			options.rootFunc = context;
    		}
    	}
    
    	return token
    		.map(compileRules, options)
    		.reduce(reduceRules, falseFunc);
    }
    
    function isTraversal(t){
    	return procedure[t.type] < 0;
    }
    
    function compileRules(rules){
    	if(rules.length === 0) return falseFunc;
    
    	var options = this;
    
    	return rules.reduce(function(func, rule){
    		if(func === falseFunc) return func;
    		return Rules[rule.type](func, rule, options);
    	}, options && options.rootFunc || trueFunc);
    }
    
    function reduceRules(a, b){
    	if(b === falseFunc || a === trueFunc){
    		return a;
    	}
    	if(a === falseFunc || b === trueFunc){
    		return b;
    	}
    
    	return function combine(elem){
    		return a(elem) || b(elem);
    	};
    }
    
    //:not, :has and :matches have to compile selectors
    //doing this in lib/pseudos.js would lead to circular dependencies,
    //so we add them here
    
    var Pseudos     = require("./pseudos.js"),
        filters     = Pseudos.filters,
        existsOne   = DomUtils.existsOne,
        isTag       = DomUtils.isTag,
        getChildren = DomUtils.getChildren;
    
    
    function containsTraversal(t){
    	return t.some(isTraversal);
    }
    
    function stripQuotes(str){
    	var firstChar = str.charAt(0);
    
    	if(firstChar === str.slice(-1) && (firstChar === "'" || firstChar === "\"")){
    		str = str.slice(1, -1);
    	}
    
    	return str;
    }
    
    filters.not = function(next, select, options){
    	var func,
    	    opts = {
    	    	xmlMode: !!(options && options.xmlMode),
    	    	strict: !!(options && options.strict)
    	    };
    
    	select = stripQuotes(select);
    
    	if(opts.strict){
    		var tokens = parse(select);
    		if(tokens.length > 1 || tokens.some(containsTraversal)){
    			throw new SyntaxError("complex selectors in :not aren't allowed in strict mode");
    		}
    
    		func = compileToken(tokens, opts);
    	} else {
    		func = compileUnsafe(select, opts);
    	}
    
    	if(func === falseFunc) return next;
    	if(func === trueFunc)  return falseFunc;
    
    	return function(elem){
    		return !func(elem) && next(elem);
    	};
    };
    
    filters.has = function(next, selector, options){
    	//TODO add a dynamic context in front of every selector with a traversal
    	//:has will never be reached with options.strict == true
    	var opts = {
    		xmlMode: !!(options && options.xmlMode),
    		strict: !!(options && options.strict)
    	};
    	var func = compileUnsafe(selector, opts);
    
    	if(func === falseFunc) return falseFunc;
    	if(func === trueFunc)  return function(elem){
    			return getChildren(elem).some(isTag) && next(elem);
    		};
    
    	func = wrap(func);
    
    	return function has(elem){
    		return next(elem) && existsOne(func, getChildren(elem));
    	};
    };
    
    filters.matches = function(next, selector, options){
    	var opts = {
    		xmlMode: !!(options && options.xmlMode),
    		strict: !!(options && options.strict),
    		rootFunc: next
    	};
    
    	selector = stripQuotes(selector);
    
    	return compileUnsafe(selector, opts);
    };
    
  };

  this.lib$general_ = function(module, exports, global) {
    var DomUtils    = require("domutils"),
        isTag       = DomUtils.isTag,
        getParent   = DomUtils.getParent,
        getChildren = DomUtils.getChildren,
        getSiblings = DomUtils.getSiblings,
        getName     = DomUtils.getName;
    
    /*
    	all available rules
    */
    module.exports = {
    	__proto__: null,
    
    	attribute: require("./attributes.js").compile,
    	pseudo: require("./pseudos.js").compile,
    
    	//tags
    	tag: function(next, data){
    		var name = data.name;
    		return function tag(elem){
    			return getName(elem) === name && next(elem);
    		};
    	},
    
    	//traversal
    	descendant: function(next){
    		return function descendant(elem){
    			var found = false;
    
    			while(!found && (elem = getParent(elem))){
    				found = next(elem);
    			}
    
    			return found;
    		};
    	},
    	parent: function(next, data, options){
    		if(options && options.strict) throw SyntaxError("Parent selector isn't part of CSS3");
    
    		return function parent(elem){
    			return getChildren(elem).some(test);
    		};
    
    		function test(elem){
    			return isTag(elem) && next(elem);
    		}
    	},
    	child: function(next){
    		return function child(elem){
    			var parent = getParent(elem);
    			return !!parent && next(parent);
    		};
    	},
    	sibling: function(next){
    		return function sibling(elem){
    			var siblings = getSiblings(elem);
    
    			for(var i = 0; i < siblings.length; i++){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					if(next(siblings[i])) return true;
    				}
    			}
    
    			return false;
    		};
    	},
    	adjacent: function(next){
    		return function adjacent(elem){
    			var siblings = getSiblings(elem),
    			    lastElement;
    
    			for(var i = 0; i < siblings.length; i++){
    				if(isTag(siblings[i])){
    					if(siblings[i] === elem) break;
    					lastElement = siblings[i];
    				}
    			}
    
    			return !!lastElement && next(lastElement);
    		};
    	},
    	universal: function(next){
    		return next;
    	}
    };
  };

  this.lib$sort_ = function(module, exports, global) {
    module.exports = sortByProcedure;
    
    /*
    	sort the parts of the passed selector,
    	as there is potential for optimization
    	(some types of selectors are faster than others)
    */
    
    var procedure = require("./procedure.json");
    
    var ATTRIBUTE = procedure.attribute;
    
    var attributes = {
    	__proto__: null,
    	exists: 8,
    	equals: 7,
    	not: 6,
    	start: 5,
    	end: 4,
    	any: 3,
    	hyphen: 2,
    	element: 1
    };
    
    function sortByProcedure(arr){
    	for(var i = 1; i < arr.length; i++){
    		var procNew = procedure[arr[i].type];
    
    		if(procNew < 0) continue;
    
    		for(var j = i - 1; j >= 0; j--){
    			if(
    				procNew > procedure[arr[j].type] || !(
    					procNew === ATTRIBUTE &&
    					procedure[arr[j].type] === ATTRIBUTE &&
    					attributes[arr[i].action] <= attributes[arr[j].action]
    				)
    			) break;
    
    			var tmp = arr[j + 1];
    			arr[j + 1] = arr[j];
    			arr[j] = tmp;
    		}
    	}
    }
  };

  this.lib$procedure_json_ = function(module, exports, global) {
    module.exports = {
      "universal": 5,
      "tag": 3,
      "attribute": 1,
      "pseudo": 0,
      "descendant": -1,
      "child": -1,
      "parent": -1,
      "sibling": -1,
      "adjacent": -1
    }
    ;
  };

  return this.index_(module, exports, global);
};
