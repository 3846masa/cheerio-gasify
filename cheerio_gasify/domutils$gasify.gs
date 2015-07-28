function domutils_(module, exports, global) {
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
  "name": "domutils",
  "version": "1.4.3",
  "description": "utilities for working with htmlparser2's dom",
  "main": "index.js",
  "directories": {
    "test": "tests"
  },
  "scripts": {
    "test": "mocha test/tests/**.js && jshint index.js test/**/*.js lib/*.js"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/FB55/domutils.git"
  },
  "keywords": [
    "dom",
    "htmlparser2"
  ],
  "dependencies": {
    "domelementtype": "1"
  },
  "devDependencies": {
    "htmlparser2": "~3.3.0",
    "domhandler": "2",
    "jshint": "~2.3.0",
    "mocha": "~1.15.1"
  },
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "jshintConfig": {
    "proto": true,
    "unused": true,
    "eqnull": true,
    "undef": true,
    "quotmark": "double",
    "eqeqeq": true,
    "trailing": true,
    "node": true,
    "globals": {
      "describe": true,
      "it": true
    }
  },
  "bugs": {
    "url": "https://github.com/FB55/domutils/issues"
  },
  "homepage": "https://github.com/FB55/domutils",
  "_id": "domutils@1.4.3",
  "dist": {
    "shasum": "0865513796c6b306031850e175516baf80b72a6f",
    "tarball": "http://registry.npmjs.org/domutils/-/domutils-1.4.3.tgz"
  },
  "_from": "domutils@>=1.4.0 <1.5.0",
  "_npmVersion": "1.4.6",
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
  "_shasum": "0865513796c6b306031850e175516baf80b72a6f",
  "_resolved": "https://registry.npmjs.org/domutils/-/domutils-1.4.3.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    var DomUtils = module.exports;
    
    [
    	require("./lib/stringify"),
    	require("./lib/traversal"),
    	require("./lib/manipulation"),
    	require("./lib/querying"),
    	require("./lib/legacy"),
    	require("./lib/helpers")
    ].forEach(function(ext){
    	Object.keys(ext).forEach(function(key){
    		DomUtils[key] = ext[key].bind(DomUtils);
    	});
    });
    
  };

  this.lib$stringify_ = function(module, exports, global) {
    var ElementType = require("domelementtype"),
        isTag = ElementType.isTag;
    
    module.exports = {
    	getInnerHTML: getInnerHTML,
    	getOuterHTML: getOuterHTML,
    	getText: getText
    };
    
    function getInnerHTML(elem){
    	return elem.children ? elem.children.map(getOuterHTML).join("") : "";
    }
    
    //boolean attributes without a value (taken from MatthewMueller/cheerio)
    var booleanAttribs = {
    	__proto__: null,
    	async: true,
    	autofocus: true,
    	autoplay: true,
    	checked: true,
    	controls: true,
    	defer: true,
    	disabled: true,
    	hidden: true,
    	loop: true,
    	multiple: true,
    	open: true,
    	readonly: true,
    	required: true,
    	scoped: true,
    	selected: true
    };
    
    var emptyTags = {
    	__proto__: null,
    	area: true,
    	base: true,
    	basefont: true,
    	br: true,
    	col: true,
    	frame: true,
    	hr: true,
    	img: true,
    	input: true,
    	isindex: true,
    	link: true,
    	meta: true,
    	param: true,
    	embed: true
    };
    
    function getOuterHTML(elem){
    	switch(elem.type){
    	case ElementType.Text:
    		return elem.data;
    	case ElementType.Comment:
    		return "<!--" + elem.data + "-->";
    	case ElementType.Directive:
    		return "<" + elem.data + ">";
    	case ElementType.CDATA:
    		return "<!CDATA " + getInnerHTML(elem) + "]]>";
    	}
    
    	var ret = "<" + elem.name;
    	if("attribs" in elem){
    		for(var attr in elem.attribs){
    			if(elem.attribs.hasOwnProperty(attr)){
    				ret += " " + attr;
    				var value = elem.attribs[attr];
    				if(value == null){
    					if( !(attr in booleanAttribs) ){
    						ret += "=\"\"";
    					}
    				} else {
    					ret += "=\"" + value + "\"";
    				}
    			}
    		}
    	}
    
    	if (elem.name in emptyTags && elem.children.length === 0) {
    		return ret + " />";
    	} else {
    		return ret + ">" + getInnerHTML(elem) + "</" + elem.name + ">";
    	}
    }
    
    function getText(elem){
    	if(Array.isArray(elem)) return elem.map(getText).join("");
    	if(isTag(elem) || elem.type === ElementType.CDATA) return getText(elem.children);
    	if(elem.type === ElementType.Text) return elem.data;
    	return "";
    }
  };

  this.lib$traversal_ = function(module, exports, global) {
    var getChildren = exports.getChildren = function(elem){
    	return elem.children;
    };
    
    var getParent = exports.getParent = function(elem){
    	return elem.parent;
    };
    
    exports.getSiblings = function(elem){
    	var parent = getParent(elem);
    	return parent ? getChildren(parent) : [elem];
    };
    
    exports.getAttributeValue = function(elem, name){
    	return elem.attribs && elem.attribs[name];
    };
    
    exports.hasAttrib = function(elem, name){
    	return hasOwnProperty.call(elem.attribs, name);
    };
    
    exports.getName = function(elem){
    	return elem.name;
    };
    
  };

  this.lib$manipulation_ = function(module, exports, global) {
    exports.removeElement = function(elem){
    	if(elem.prev) elem.prev.next = elem.next;
    	if(elem.next) elem.next.prev = elem.prev;
    
    	if(elem.parent){
    		var childs = elem.parent.children;
    		childs.splice(childs.lastIndexOf(elem), 1);
    	}
    };
    
    exports.replaceElement = function(elem, replacement){
    	var prev = replacement.prev = elem.prev;
    	if(prev){
    		prev.next = replacement;
    	}
    
    	var next = replacement.next = elem.next;
    	if(next){
    		next.prev = replacement;
    	}
    
    	var parent = replacement.parent = elem.parent;
    	if(parent){
    		var childs = parent.children;
    		childs[childs.lastIndexOf(elem)] = replacement;
    	}
    };
    
    exports.appendChild = function(elem, child){
    	child.parent = elem;
    
    	if(elem.children.push(child) !== 1){
    		var sibling = elem.children[elem.children.length - 2];
    		sibling.next = child;
    		child.prev = sibling;
    		child.next = null;
    	}
    };
    
    exports.append = function(elem, next){
    	var parent = elem.parent,
    		currNext = elem.next;
    
    	next.next = currNext;
    	next.prev = elem;
    	elem.next = next;
    	next.parent = parent;
    
    	if(currNext){
    		currNext.prev = next;
    		if(parent){
    			var childs = parent.children;
    			childs.splice(childs.lastIndexOf(currNext), 0, next);
    		}
    	} else if(parent){
    		parent.children.push(next);
    	}
    };
    
    exports.prepend = function(elem, prev){
    	var parent = elem.parent;
    	if(parent){
    		var childs = parent.children;
    		childs.splice(childs.lastIndexOf(elem), 0, prev);
    	}
    
    	if(elem.prev){
    		elem.prev.next = prev;
    	}
    	
    	prev.parent = parent;
    	prev.prev = elem.prev;
    	prev.next = elem;
    	elem.prev = prev;
    };
    
    
    
  };

  this.lib$querying_ = function(module, exports, global) {
    var isTag = require("domelementtype").isTag;
    
    module.exports = {
    	filter: filter,
    	find: find,
    	findOneChild: findOneChild,
    	findOne: findOne,
    	existsOne: existsOne,
    	findAll: findAll
    };
    
    function filter(test, element, recurse, limit){
    	if(!Array.isArray(element)) element = [element];
    
    	if(typeof limit !== "number" || !isFinite(limit)){
    		limit = Infinity;
    	}
    	return find(test, element, recurse !== false, limit);
    }
    
    function find(test, elems, recurse, limit){
    	var result = [], childs;
    
    	for(var i = 0, j = elems.length; i < j; i++){
    		if(test(elems[i])){
    			result.push(elems[i]);
    			if(--limit <= 0) break;
    		}
    
    		childs = elems[i].children;
    		if(recurse && childs && childs.length > 0){
    			childs = find(test, childs, recurse, limit);
    			result = result.concat(childs);
    			limit -= childs.length;
    			if(limit <= 0) break;
    		}
    	}
    
    	return result;
    }
    
    function findOneChild(test, elems){
    	for(var i = 0, l = elems.length; i < l; i++){
    		if(test(elems[i])) return elems[i];
    	}
    
    	return null;
    }
    
    function findOne(test, elems){
    	var elem = null;
    
    	for(var i = 0, l = elems.length; i < l && !elem; i++){
    		if(!isTag(elems[i])){
    			continue;
    		} else if(test(elems[i])){
    			elem = elems[i];
    		} else if(elems[i].children.length > 0){
    			elem = findOne(test, elems[i].children);
    		}
    	}
    
    	return elem;
    }
    
    function existsOne(test, elems){
    	for(var i = 0, l = elems.length; i < l; i++){
    		if(
    			isTag(elems[i]) && (
    				test(elems[i]) || (
    					elems[i].children.length > 0 &&
    					existsOne(test, elems[i].children)
    				)
    			)
    		){
    			return true;
    		}
    	}
    
    	return false;
    }
    
    function findAll(test, elems){
    	var result = [];
    	for(var i = 0, j = elems.length; i < j; i++){
    		if(!isTag(elems[i])) continue;
    		if(test(elems[i])) result.push(elems[i]);
    
    		if(elems[i].children.length > 0){
    			result = result.concat(findAll(test, elems[i].children));
    		}
    	}
    	return result;
    }
    
  };

  this.lib$legacy_ = function(module, exports, global) {
    var ElementType = require("domelementtype");
    var isTag = exports.isTag = ElementType.isTag;
    
    exports.testElement = function(options, element){
    	for(var key in options){
    		if(!options.hasOwnProperty(key));
    		else if(key === "tag_name"){
    			if(!isTag(element) || !options.tag_name(element.name)){
    				return false;
    			}
    		} else if(key === "tag_type"){
    			if(!options.tag_type(element.type)) return false;
    		} else if(key === "tag_contains"){
    			if(isTag(element) || !options.tag_contains(element.data)){
    				return false;
    			}
    		} else if(!element.attribs || !options[key](element.attribs[key])){
    			return false;
    		}
    	}
    	return true;
    };
    
    var Checks = {
    	tag_name: function(name){
    		if(typeof name === "function"){
    			return function(elem){ return isTag(elem) && name(elem.name); };
    		} else if(name === "*"){
    			return isTag;
    		} else {
    			return function(elem){ return isTag(elem) && elem.name === name; };
    		}
    	},
    	tag_type: function(type){
    		if(typeof type === "function"){
    			return function(elem){ return type(elem.type); };
    		} else {
    			return function(elem){ return elem.type === type; };
    		}
    	},
    	tag_contains: function(data){
    		if(typeof data === "function"){
    			return function(elem){ return !isTag(elem) && data(elem.data); };
    		} else {
    			return function(elem){ return !isTag(elem) && elem.data === data; };
    		}
    	}
    };
    
    function getAttribCheck(attrib, value){
    	if(typeof value === "function"){
    		return function(elem){ return elem.attribs && value(elem.attribs[attrib]); };
    	} else {
    		return function(elem){ return elem.attribs && elem.attribs[attrib] === value; };
    	}
    }
    
    function combineFuncs(a, b){
    	return function(elem){
    		return a(elem) || b(elem);
    	};
    }
    
    exports.getElements = function(options, element, recurse, limit){
    	var funcs = Object.keys(options).map(function(key){
    		var value = options[key];
    		return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
    	});
    
    	return funcs.length === 0 ? [] : this.filter(
    		funcs.reduce(combineFuncs),
    		element, recurse, limit
    	);
    };
    
    exports.getElementById = function(id, element, recurse){
    	if(!Array.isArray(element)) element = [element];
    	return this.findOne(getAttribCheck("id", id), element, recurse !== false);
    };
    
    exports.getElementsByTagName = function(name, element, recurse, limit){
    	return this.filter(Checks.tag_name(name), element, recurse, limit);
    };
    
    exports.getElementsByTagType = function(type, element, recurse, limit){
    	return this.filter(Checks.tag_type(type), element, recurse, limit);
    };
    
  };

  this.lib$helpers_ = function(module, exports, global) {
    // removeSubsets
    // Given an array of nodes, remove any member that is contained by another.
    exports.removeSubsets = function(nodes) {
    	var idx = nodes.length, node, ancestor, replace;
    
    	// Check if each node (or one of its ancestors) is already contained in the
    	// array.
    	while (--idx > -1) {
    		node = ancestor = nodes[idx];
    
    		// Temporarily remove the node under consideration
    		nodes[idx] = null;
    		replace = true;
    
    		while (ancestor) {
    			if (nodes.indexOf(ancestor) > -1) {
    				replace = false;
    				nodes.splice(idx, 1);
    				break;
    			}
    			ancestor = ancestor.parent;
    		}
    
    		// If the node has been found to be unique, re-insert it.
    		if (replace) {
    			nodes[idx] = node;
    		}
    	}
    
    	return nodes;
    };
    
  };

  return this.index_(module, exports, global);
};
