function domhandler_(module, exports, global) {
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
  "name": "domhandler",
  "version": "2.3.0",
  "description": "handler for htmlparser2 that turns pages into a dom",
  "main": "index.js",
  "directories": {
    "test": "tests"
  },
  "scripts": {
    "test": "mocha -R list && jshint index.js test/"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/fb55/DomHandler.git"
  },
  "keywords": [
    "dom",
    "htmlparser2"
  ],
  "dependencies": {
    "domelementtype": "1"
  },
  "devDependencies": {
    "htmlparser2": "3.8",
    "mocha": "1",
    "jshint": "~2.3.0"
  },
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "jshintConfig": {
    "quotmark": "double",
    "trailing": true,
    "unused": true,
    "undef": true,
    "node": true,
    "proto": true,
    "globals": {
      "it": true
    }
  },
  "gitHead": "9c224be43a43bc54ebfc2d2e47ab3b9f97836cb2",
  "bugs": {
    "url": "https://github.com/fb55/DomHandler/issues"
  },
  "homepage": "https://github.com/fb55/DomHandler",
  "_id": "domhandler@2.3.0",
  "_shasum": "2de59a0822d5027fabff6f032c2b25a2a8abe738",
  "_from": "domhandler@>=2.3.0 <2.4.0",
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
    "shasum": "2de59a0822d5027fabff6f032c2b25a2a8abe738",
    "tarball": "http://registry.npmjs.org/domhandler/-/domhandler-2.3.0.tgz"
  },
  "_resolved": "https://registry.npmjs.org/domhandler/-/domhandler-2.3.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    var ElementType = require("domelementtype");
    
    var re_whitespace = /\s+/g;
    var NodePrototype = require("./lib/node");
    var ElementPrototype = require("./lib/element");
    
    function DomHandler(callback, options, elementCB){
    	if(typeof callback === "object"){
    		elementCB = options;
    		options = callback;
    		callback = null;
    	} else if(typeof options === "function"){
    		elementCB = options;
    		options = defaultOpts;
    	}
    	this._callback = callback;
    	this._options = options || defaultOpts;
    	this._elementCB = elementCB;
    	this.dom = [];
    	this._done = false;
    	this._tagStack = [];
    	this._parser = this._parser || null;
    }
    
    //default options
    var defaultOpts = {
    	normalizeWhitespace: false, //Replace all whitespace with single spaces
    	withStartIndices: false, //Add startIndex properties to nodes
    };
    
    DomHandler.prototype.onparserinit = function(parser){
    	this._parser = parser;
    };
    
    //Resets the handler back to starting state
    DomHandler.prototype.onreset = function(){
    	DomHandler.call(this, this._callback, this._options, this._elementCB);
    };
    
    //Signals the handler that parsing is done
    DomHandler.prototype.onend = function(){
    	if(this._done) return;
    	this._done = true;
    	this._parser = null;
    	this._handleCallback(null);
    };
    
    DomHandler.prototype._handleCallback =
    DomHandler.prototype.onerror = function(error){
    	if(typeof this._callback === "function"){
    		this._callback(error, this.dom);
    	} else {
    		if(error) throw error;
    	}
    };
    
    DomHandler.prototype.onclosetag = function(){
    	//if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));
    	var elem = this._tagStack.pop();
    	if(this._elementCB) this._elementCB(elem);
    };
    
    DomHandler.prototype._addDomElement = function(element){
    	var parent = this._tagStack[this._tagStack.length - 1];
    	var siblings = parent ? parent.children : this.dom;
    	var previousSibling = siblings[siblings.length - 1];
    
    	element.next = null;
    
    	if(this._options.withStartIndices){
    		element.startIndex = this._parser.startIndex;
    	}
    
    	if (this._options.withDomLvl1) {
    		element.__proto__ = element.type === "tag" ? ElementPrototype : NodePrototype;
    	}
    
    	if(previousSibling){
    		element.prev = previousSibling;
    		previousSibling.next = element;
    	} else {
    		element.prev = null;
    	}
    
    	siblings.push(element);
    	element.parent = parent || null;
    };
    
    DomHandler.prototype.onopentag = function(name, attribs){
    	var element = {
    		type: name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag,
    		name: name,
    		attribs: attribs,
    		children: []
    	};
    
    	this._addDomElement(element);
    
    	this._tagStack.push(element);
    };
    
    DomHandler.prototype.ontext = function(data){
    	//the ignoreWhitespace is officially dropped, but for now,
    	//it's an alias for normalizeWhitespace
    	var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;
    
    	var lastTag;
    
    	if(!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length-1]).type === ElementType.Text){
    		if(normalize){
    			lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
    		} else {
    			lastTag.data += data;
    		}
    	} else {
    		if(
    			this._tagStack.length &&
    			(lastTag = this._tagStack[this._tagStack.length - 1]) &&
    			(lastTag = lastTag.children[lastTag.children.length - 1]) &&
    			lastTag.type === ElementType.Text
    		){
    			if(normalize){
    				lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
    			} else {
    				lastTag.data += data;
    			}
    		} else {
    			if(normalize){
    				data = data.replace(re_whitespace, " ");
    			}
    
    			this._addDomElement({
    				data: data,
    				type: ElementType.Text
    			});
    		}
    	}
    };
    
    DomHandler.prototype.oncomment = function(data){
    	var lastTag = this._tagStack[this._tagStack.length - 1];
    
    	if(lastTag && lastTag.type === ElementType.Comment){
    		lastTag.data += data;
    		return;
    	}
    
    	var element = {
    		data: data,
    		type: ElementType.Comment
    	};
    
    	this._addDomElement(element);
    	this._tagStack.push(element);
    };
    
    DomHandler.prototype.oncdatastart = function(){
    	var element = {
    		children: [{
    			data: "",
    			type: ElementType.Text
    		}],
    		type: ElementType.CDATA
    	};
    
    	this._addDomElement(element);
    	this._tagStack.push(element);
    };
    
    DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function(){
    	this._tagStack.pop();
    };
    
    DomHandler.prototype.onprocessinginstruction = function(name, data){
    	this._addDomElement({
    		name: name,
    		data: data,
    		type: ElementType.Directive
    	});
    };
    
    module.exports = DomHandler;
    
  };

  this.lib$node_ = function(module, exports, global) {
    // This object will be used as the prototype for Nodes when creating a
    // DOM-Level-1-compliant structure.
    var NodePrototype = module.exports = {
    	get firstChild() {
    		var children = this.children;
    		return children && children[0] || null;
    	},
    	get lastChild() {
    		var children = this.children;
    		return children && children[children.length - 1] || null;
    	},
    	get nodeType() {
    		return nodeTypes[this.type] || nodeTypes.element;
    	}
    };
    
    var domLvl1 = {
    	tagName: "name",
    	childNodes: "children",
    	parentNode: "parent",
    	previousSibling: "prev",
    	nextSibling: "next",
    	nodeValue: "data"
    };
    
    var nodeTypes = {
    	element: 1,
    	text: 3,
    	cdata: 4,
    	comment: 8
    };
    
    Object.keys(domLvl1).forEach(function(key) {
    	var shorthand = domLvl1[key];
    	Object.defineProperty(NodePrototype, key, {
    		get: function() {
    			return this[shorthand] || null;
    		},
    		set: function(val) {
    			this[shorthand] = val;
    			return val;
    		}
    	});
    });
    
  };

  this.lib$element_ = function(module, exports, global) {
    // DOM-Level-1-compliant structure
    var NodePrototype = require('./node');
    var ElementPrototype = module.exports = Object.create(NodePrototype);
    
    var domLvl1 = {
    	tagName: "name"
    };
    
    Object.keys(domLvl1).forEach(function(key) {
    	var shorthand = domLvl1[key];
    	Object.defineProperty(ElementPrototype, key, {
    		get: function() {
    			return this[shorthand] || null;
    		},
    		set: function(val) {
    			this[shorthand] = val;
    			return val;
    		}
    	});
    });
    
  };

  return this.index_(module, exports, global);
};
