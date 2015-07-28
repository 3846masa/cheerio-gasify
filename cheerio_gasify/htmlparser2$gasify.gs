function htmlparser2_(module, exports, global) {
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
  "name": "htmlparser2",
  "description": "Fast & forgiving HTML/XML/RSS parser",
  "version": "3.8.3",
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "keywords": [
    "html",
    "parser",
    "streams",
    "xml",
    "dom",
    "rss",
    "feed",
    "atom"
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/fb55/htmlparser2.git"
  },
  "bugs": {
    "url": "http://github.com/fb55/htmlparser2/issues"
  },
  "directories": {
    "lib": "lib/"
  },
  "main": "lib/index.js",
  "scripts": {
    "lcov": "istanbul cover _mocha --report lcovonly -- -R spec",
    "coveralls": "npm run lint && npm run lcov && (cat coverage/lcov.info | coveralls || exit 0)",
    "test": "mocha && npm run lint",
    "lint": "jshint lib test && jscs lib test"
  },
  "dependencies": {
    "domhandler": "2.3",
    "domutils": "1.5",
    "domelementtype": "1",
    "readable-stream": "1.1",
    "entities": "1.0"
  },
  "devDependencies": {
    "mocha": "1",
    "mocha-lcov-reporter": "*",
    "coveralls": "*",
    "istanbul": "*",
    "jscs": "1.5.8",
    "jshint": "2"
  },
  "browser": {
    "readable-stream": false
  },
  "license": "MIT",
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
  "gitHead": "44e48f58526de05d2639199f4baaaef235521f6b",
  "homepage": "https://github.com/fb55/htmlparser2#readme",
  "_id": "htmlparser2@3.8.3",
  "_shasum": "996c28b191516a8be86501a7d79757e5c70c1068",
  "_from": "htmlparser2@>=3.8.1 <3.9.0",
  "_npmVersion": "2.11.1",
  "_nodeVersion": "2.2.1",
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
    "shasum": "996c28b191516a8be86501a7d79757e5c70c1068",
    "tarball": "http://registry.npmjs.org/htmlparser2/-/htmlparser2-3.8.3.tgz"
  },
  "_resolved": "https://registry.npmjs.org/htmlparser2/-/htmlparser2-3.8.3.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.lib$index_ = function(module, exports, global) {
    var Parser = require("./Parser.js"),
        DomHandler = require("domhandler");
    
    function defineProp(name, value){
    	delete module.exports[name];
    	module.exports[name] = value;
    	return value;
    }
    
    module.exports = {
    	Parser: Parser,
    	Tokenizer: require("./Tokenizer.js"),
    	ElementType: require("domelementtype"),
    	DomHandler: DomHandler,
    	get FeedHandler(){
    		return defineProp("FeedHandler", require("./FeedHandler.js"));
    	},
    	get Stream(){
    		return defineProp("Stream", require("./Stream.js"));
    	},
    	get WritableStream(){
    		return defineProp("WritableStream", require("./WritableStream.js"));
    	},
    	get ProxyHandler(){
    		return defineProp("ProxyHandler", require("./ProxyHandler.js"));
    	},
    	get DomUtils(){
    		return defineProp("DomUtils", require("domutils"));
    	},
    	get CollectingHandler(){
    		return defineProp("CollectingHandler", require("./CollectingHandler.js"));
    	},
    	// For legacy support
    	DefaultHandler: DomHandler,
    	get RssHandler(){
    		return defineProp("RssHandler", this.FeedHandler);
    	},
    	//helper methods
    	parseDOM: function(data, options){
    		var handler = new DomHandler(options);
    		new Parser(handler, options).end(data);
    		return handler.dom;
    	},
    	parseFeed: function(feed, options){
    		var handler = new module.exports.FeedHandler(options);
    		new Parser(handler, options).end(feed);
    		return handler.dom;
    	},
    	createDomStream: function(cb, options, elementCb){
    		var handler = new DomHandler(cb, options, elementCb);
    		return new Parser(handler, options);
    	},
    	// List of all events that the parser emits
    	EVENTS: { /* Format: eventname: number of arguments */
    		attribute: 2,
    		cdatastart: 0,
    		cdataend: 0,
    		text: 1,
    		processinginstruction: 2,
    		comment: 1,
    		commentend: 0,
    		closetag: 1,
    		opentag: 2,
    		opentagname: 1,
    		error: 1,
    		end: 0
    	}
    };
    
  };

  this.lib$Parser_ = function(module, exports, global) {
    var Tokenizer = require("./Tokenizer.js");
    
    /*
    	Options:
    
    	xmlMode: Disables the special behavior for script/style tags (false by default)
    	lowerCaseAttributeNames: call .toLowerCase for each attribute name (true if xmlMode is `false`)
    	lowerCaseTags: call .toLowerCase for each tag name (true if xmlMode is `false`)
    */
    
    /*
    	Callbacks:
    
    	oncdataend,
    	oncdatastart,
    	onclosetag,
    	oncomment,
    	oncommentend,
    	onerror,
    	onopentag,
    	onprocessinginstruction,
    	onreset,
    	ontext
    */
    
    var formTags = {
    	input: true,
    	option: true,
    	optgroup: true,
    	select: true,
    	button: true,
    	datalist: true,
    	textarea: true
    };
    
    var openImpliesClose = {
    	tr      : { tr:true, th:true, td:true },
    	th      : { th:true },
    	td      : { thead:true, th:true, td:true },
    	body    : { head:true, link:true, script:true },
    	li      : { li:true },
    	p       : { p:true },
    	h1      : { p:true },
    	h2      : { p:true },
    	h3      : { p:true },
    	h4      : { p:true },
    	h5      : { p:true },
    	h6      : { p:true },
    	select  : formTags,
    	input   : formTags,
    	output  : formTags,
    	button  : formTags,
    	datalist: formTags,
    	textarea: formTags,
    	option  : { option:true },
    	optgroup: { optgroup:true }
    };
    
    var voidElements = {
    	__proto__: null,
    	area: true,
    	base: true,
    	basefont: true,
    	br: true,
    	col: true,
    	command: true,
    	embed: true,
    	frame: true,
    	hr: true,
    	img: true,
    	input: true,
    	isindex: true,
    	keygen: true,
    	link: true,
    	meta: true,
    	param: true,
    	source: true,
    	track: true,
    	wbr: true,
    
    	//common self closing svg elements
    	path: true,
    	circle: true,
    	ellipse: true,
    	line: true,
    	rect: true,
    	use: true,
    	stop: true,
    	polyline: true,
    	polygon: true
    };
    
    var re_nameEnd = /\s|\//;
    
    function Parser(cbs, options){
    	this._options = options || {};
    	this._cbs = cbs || {};
    
    	this._tagname = "";
    	this._attribname = "";
    	this._attribvalue = "";
    	this._attribs = null;
    	this._stack = [];
    
    	this.startIndex = 0;
    	this.endIndex = null;
    
    	this._lowerCaseTagNames = "lowerCaseTags" in this._options ?
    									!!this._options.lowerCaseTags :
    									!this._options.xmlMode;
    	this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ?
    									!!this._options.lowerCaseAttributeNames :
    									!this._options.xmlMode;
    
    	this._tokenizer = new Tokenizer(this._options, this);
    
    	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
    }
    
    require("util").inherits(Parser, require("events").EventEmitter);
    
    Parser.prototype._updatePosition = function(initialOffset){
    	if(this.endIndex === null){
    		if(this._tokenizer._sectionStart <= initialOffset){
    			this.startIndex = 0;
    		} else {
    			this.startIndex = this._tokenizer._sectionStart - initialOffset;
    		}
    	}
    	else this.startIndex = this.endIndex + 1;
    	this.endIndex = this._tokenizer.getAbsoluteIndex();
    };
    
    //Tokenizer event handlers
    Parser.prototype.ontext = function(data){
    	this._updatePosition(1);
    	this.endIndex--;
    
    	if(this._cbs.ontext) this._cbs.ontext(data);
    };
    
    Parser.prototype.onopentagname = function(name){
    	if(this._lowerCaseTagNames){
    		name = name.toLowerCase();
    	}
    
    	this._tagname = name;
    
    	if(!this._options.xmlMode && name in openImpliesClose) {
    		for(
    			var el;
    			(el = this._stack[this._stack.length - 1]) in openImpliesClose[name];
    			this.onclosetag(el)
    		);
    	}
    
    	if(this._options.xmlMode || !(name in voidElements)){
    		this._stack.push(name);
    	}
    
    	if(this._cbs.onopentagname) this._cbs.onopentagname(name);
    	if(this._cbs.onopentag) this._attribs = {};
    };
    
    Parser.prototype.onopentagend = function(){
    	this._updatePosition(1);
    
    	if(this._attribs){
    		if(this._cbs.onopentag) this._cbs.onopentag(this._tagname, this._attribs);
    		this._attribs = null;
    	}
    
    	if(!this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements){
    		this._cbs.onclosetag(this._tagname);
    	}
    
    	this._tagname = "";
    };
    
    Parser.prototype.onclosetag = function(name){
    	this._updatePosition(1);
    
    	if(this._lowerCaseTagNames){
    		name = name.toLowerCase();
    	}
    
    	if(this._stack.length && (!(name in voidElements) || this._options.xmlMode)){
    		var pos = this._stack.lastIndexOf(name);
    		if(pos !== -1){
    			if(this._cbs.onclosetag){
    				pos = this._stack.length - pos;
    				while(pos--) this._cbs.onclosetag(this._stack.pop());
    			}
    			else this._stack.length = pos;
    		} else if(name === "p" && !this._options.xmlMode){
    			this.onopentagname(name);
    			this._closeCurrentTag();
    		}
    	} else if(!this._options.xmlMode && (name === "br" || name === "p")){
    		this.onopentagname(name);
    		this._closeCurrentTag();
    	}
    };
    
    Parser.prototype.onselfclosingtag = function(){
    	if(this._options.xmlMode || this._options.recognizeSelfClosing){
    		this._closeCurrentTag();
    	} else {
    		this.onopentagend();
    	}
    };
    
    Parser.prototype._closeCurrentTag = function(){
    	var name = this._tagname;
    
    	this.onopentagend();
    
    	//self-closing tags will be on the top of the stack
    	//(cheaper check than in onclosetag)
    	if(this._stack[this._stack.length - 1] === name){
    		if(this._cbs.onclosetag){
    			this._cbs.onclosetag(name);
    		}
    		this._stack.pop();
    	}
    };
    
    Parser.prototype.onattribname = function(name){
    	if(this._lowerCaseAttributeNames){
    		name = name.toLowerCase();
    	}
    	this._attribname = name;
    };
    
    Parser.prototype.onattribdata = function(value){
    	this._attribvalue += value;
    };
    
    Parser.prototype.onattribend = function(){
    	if(this._cbs.onattribute) this._cbs.onattribute(this._attribname, this._attribvalue);
    	if(
    		this._attribs &&
    		!Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
    	){
    		this._attribs[this._attribname] = this._attribvalue;
    	}
    	this._attribname = "";
    	this._attribvalue = "";
    };
    
    Parser.prototype._getInstructionName = function(value){
    	var idx = value.search(re_nameEnd),
    	    name = idx < 0 ? value : value.substr(0, idx);
    
    	if(this._lowerCaseTagNames){
    		name = name.toLowerCase();
    	}
    
    	return name;
    };
    
    Parser.prototype.ondeclaration = function(value){
    	if(this._cbs.onprocessinginstruction){
    		var name = this._getInstructionName(value);
    		this._cbs.onprocessinginstruction("!" + name, "!" + value);
    	}
    };
    
    Parser.prototype.onprocessinginstruction = function(value){
    	if(this._cbs.onprocessinginstruction){
    		var name = this._getInstructionName(value);
    		this._cbs.onprocessinginstruction("?" + name, "?" + value);
    	}
    };
    
    Parser.prototype.oncomment = function(value){
    	this._updatePosition(4);
    
    	if(this._cbs.oncomment) this._cbs.oncomment(value);
    	if(this._cbs.oncommentend) this._cbs.oncommentend();
    };
    
    Parser.prototype.oncdata = function(value){
    	this._updatePosition(1);
    
    	if(this._options.xmlMode || this._options.recognizeCDATA){
    		if(this._cbs.oncdatastart) this._cbs.oncdatastart();
    		if(this._cbs.ontext) this._cbs.ontext(value);
    		if(this._cbs.oncdataend) this._cbs.oncdataend();
    	} else {
    		this.oncomment("[CDATA[" + value + "]]");
    	}
    };
    
    Parser.prototype.onerror = function(err){
    	if(this._cbs.onerror) this._cbs.onerror(err);
    };
    
    Parser.prototype.onend = function(){
    	if(this._cbs.onclosetag){
    		for(
    			var i = this._stack.length;
    			i > 0;
    			this._cbs.onclosetag(this._stack[--i])
    		);
    	}
    	if(this._cbs.onend) this._cbs.onend();
    };
    
    
    //Resets the parser to a blank state, ready to parse a new HTML document
    Parser.prototype.reset = function(){
    	if(this._cbs.onreset) this._cbs.onreset();
    	this._tokenizer.reset();
    
    	this._tagname = "";
    	this._attribname = "";
    	this._attribs = null;
    	this._stack = [];
    
    	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
    };
    
    //Parses a complete HTML document and pushes it to the handler
    Parser.prototype.parseComplete = function(data){
    	this.reset();
    	this.end(data);
    };
    
    Parser.prototype.write = function(chunk){
    	this._tokenizer.write(chunk);
    };
    
    Parser.prototype.end = function(chunk){
    	this._tokenizer.end(chunk);
    };
    
    Parser.prototype.pause = function(){
    	this._tokenizer.pause();
    };
    
    Parser.prototype.resume = function(){
    	this._tokenizer.resume();
    };
    
    //alias for backwards compat
    Parser.prototype.parseChunk = Parser.prototype.write;
    Parser.prototype.done = Parser.prototype.end;
    
    module.exports = Parser;
    
  };

  this.lib$Tokenizer_ = function(module, exports, global) {
    module.exports = Tokenizer;
    
    var decodeCodePoint = require("entities/lib/decode_codepoint.js"),
        entityMap = require("entities/maps/entities.json"),
        legacyMap = require("entities/maps/legacy.json"),
        xmlMap    = require("entities/maps/xml.json"),
    
        i = 0,
    
        TEXT                      = i++,
        BEFORE_TAG_NAME           = i++, //after <
        IN_TAG_NAME               = i++,
        IN_SELF_CLOSING_TAG       = i++,
        BEFORE_CLOSING_TAG_NAME   = i++,
        IN_CLOSING_TAG_NAME       = i++,
        AFTER_CLOSING_TAG_NAME    = i++,
    
        //attributes
        BEFORE_ATTRIBUTE_NAME     = i++,
        IN_ATTRIBUTE_NAME         = i++,
        AFTER_ATTRIBUTE_NAME      = i++,
        BEFORE_ATTRIBUTE_VALUE    = i++,
        IN_ATTRIBUTE_VALUE_DQ     = i++, // "
        IN_ATTRIBUTE_VALUE_SQ     = i++, // '
        IN_ATTRIBUTE_VALUE_NQ     = i++,
    
        //declarations
        BEFORE_DECLARATION        = i++, // !
        IN_DECLARATION            = i++,
    
        //processing instructions
        IN_PROCESSING_INSTRUCTION = i++, // ?
    
        //comments
        BEFORE_COMMENT            = i++,
        IN_COMMENT                = i++,
        AFTER_COMMENT_1           = i++,
        AFTER_COMMENT_2           = i++,
    
        //cdata
        BEFORE_CDATA_1            = i++, // [
        BEFORE_CDATA_2            = i++, // C
        BEFORE_CDATA_3            = i++, // D
        BEFORE_CDATA_4            = i++, // A
        BEFORE_CDATA_5            = i++, // T
        BEFORE_CDATA_6            = i++, // A
        IN_CDATA                  = i++, // [
        AFTER_CDATA_1             = i++, // ]
        AFTER_CDATA_2             = i++, // ]
    
        //special tags
        BEFORE_SPECIAL            = i++, //S
        BEFORE_SPECIAL_END        = i++,   //S
    
        BEFORE_SCRIPT_1           = i++, //C
        BEFORE_SCRIPT_2           = i++, //R
        BEFORE_SCRIPT_3           = i++, //I
        BEFORE_SCRIPT_4           = i++, //P
        BEFORE_SCRIPT_5           = i++, //T
        AFTER_SCRIPT_1            = i++, //C
        AFTER_SCRIPT_2            = i++, //R
        AFTER_SCRIPT_3            = i++, //I
        AFTER_SCRIPT_4            = i++, //P
        AFTER_SCRIPT_5            = i++, //T
    
        BEFORE_STYLE_1            = i++, //T
        BEFORE_STYLE_2            = i++, //Y
        BEFORE_STYLE_3            = i++, //L
        BEFORE_STYLE_4            = i++, //E
        AFTER_STYLE_1             = i++, //T
        AFTER_STYLE_2             = i++, //Y
        AFTER_STYLE_3             = i++, //L
        AFTER_STYLE_4             = i++, //E
    
        BEFORE_ENTITY             = i++, //&
        BEFORE_NUMERIC_ENTITY     = i++, //#
        IN_NAMED_ENTITY           = i++,
        IN_NUMERIC_ENTITY         = i++,
        IN_HEX_ENTITY             = i++, //X
    
        j = 0,
    
        SPECIAL_NONE              = j++,
        SPECIAL_SCRIPT            = j++,
        SPECIAL_STYLE             = j++;
    
    function whitespace(c){
    	return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
    }
    
    function characterState(char, SUCCESS){
    	return function(c){
    		if(c === char) this._state = SUCCESS;
    	};
    }
    
    function ifElseState(upper, SUCCESS, FAILURE){
    	var lower = upper.toLowerCase();
    
    	if(upper === lower){
    		return function(c){
    			if(c === lower){
    				this._state = SUCCESS;
    			} else {
    				this._state = FAILURE;
    				this._index--;
    			}
    		};
    	} else {
    		return function(c){
    			if(c === lower || c === upper){
    				this._state = SUCCESS;
    			} else {
    				this._state = FAILURE;
    				this._index--;
    			}
    		};
    	}
    }
    
    function consumeSpecialNameChar(upper, NEXT_STATE){
    	var lower = upper.toLowerCase();
    
    	return function(c){
    		if(c === lower || c === upper){
    			this._state = NEXT_STATE;
    		} else {
    			this._state = IN_TAG_NAME;
    			this._index--; //consume the token again
    		}
    	};
    }
    
    function Tokenizer(options, cbs){
    	this._state = TEXT;
    	this._buffer = "";
    	this._sectionStart = 0;
    	this._index = 0;
    	this._bufferOffset = 0; //chars removed from _buffer
    	this._baseState = TEXT;
    	this._special = SPECIAL_NONE;
    	this._cbs = cbs;
    	this._running = true;
    	this._ended = false;
    	this._xmlMode = !!(options && options.xmlMode);
    	this._decodeEntities = !!(options && options.decodeEntities);
    }
    
    Tokenizer.prototype._stateText = function(c){
    	if(c === "<"){
    		if(this._index > this._sectionStart){
    			this._cbs.ontext(this._getSection());
    		}
    		this._state = BEFORE_TAG_NAME;
    		this._sectionStart = this._index;
    	} else if(this._decodeEntities && this._special === SPECIAL_NONE && c === "&"){
    		if(this._index > this._sectionStart){
    			this._cbs.ontext(this._getSection());
    		}
    		this._baseState = TEXT;
    		this._state = BEFORE_ENTITY;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateBeforeTagName = function(c){
    	if(c === "/"){
    		this._state = BEFORE_CLOSING_TAG_NAME;
    	} else if(c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
    		this._state = TEXT;
    	} else if(c === "!"){
    		this._state = BEFORE_DECLARATION;
    		this._sectionStart = this._index + 1;
    	} else if(c === "?"){
    		this._state = IN_PROCESSING_INSTRUCTION;
    		this._sectionStart = this._index + 1;
    	} else if(c === "<"){
    		this._cbs.ontext(this._getSection());
    		this._sectionStart = this._index;
    	} else {
    		this._state = (!this._xmlMode && (c === "s" || c === "S")) ?
    						BEFORE_SPECIAL : IN_TAG_NAME;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateInTagName = function(c){
    	if(c === "/" || c === ">" || whitespace(c)){
    		this._emitToken("onopentagname");
    		this._state = BEFORE_ATTRIBUTE_NAME;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateBeforeCloseingTagName = function(c){
    	if(whitespace(c));
    	else if(c === ">"){
    		this._state = TEXT;
    	} else if(this._special !== SPECIAL_NONE){
    		if(c === "s" || c === "S"){
    			this._state = BEFORE_SPECIAL_END;
    		} else {
    			this._state = TEXT;
    			this._index--;
    		}
    	} else {
    		this._state = IN_CLOSING_TAG_NAME;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateInCloseingTagName = function(c){
    	if(c === ">" || whitespace(c)){
    		this._emitToken("onclosetag");
    		this._state = AFTER_CLOSING_TAG_NAME;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateAfterCloseingTagName = function(c){
    	//skip everything until ">"
    	if(c === ">"){
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	}
    };
    
    Tokenizer.prototype._stateBeforeAttributeName = function(c){
    	if(c === ">"){
    		this._cbs.onopentagend();
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	} else if(c === "/"){
    		this._state = IN_SELF_CLOSING_TAG;
    	} else if(!whitespace(c)){
    		this._state = IN_ATTRIBUTE_NAME;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateInSelfClosingTag = function(c){
    	if(c === ">"){
    		this._cbs.onselfclosingtag();
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	} else if(!whitespace(c)){
    		this._state = BEFORE_ATTRIBUTE_NAME;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateInAttributeName = function(c){
    	if(c === "=" || c === "/" || c === ">" || whitespace(c)){
    		this._cbs.onattribname(this._getSection());
    		this._sectionStart = -1;
    		this._state = AFTER_ATTRIBUTE_NAME;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateAfterAttributeName = function(c){
    	if(c === "="){
    		this._state = BEFORE_ATTRIBUTE_VALUE;
    	} else if(c === "/" || c === ">"){
    		this._cbs.onattribend();
    		this._state = BEFORE_ATTRIBUTE_NAME;
    		this._index--;
    	} else if(!whitespace(c)){
    		this._cbs.onattribend();
    		this._state = IN_ATTRIBUTE_NAME;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateBeforeAttributeValue = function(c){
    	if(c === "\""){
    		this._state = IN_ATTRIBUTE_VALUE_DQ;
    		this._sectionStart = this._index + 1;
    	} else if(c === "'"){
    		this._state = IN_ATTRIBUTE_VALUE_SQ;
    		this._sectionStart = this._index + 1;
    	} else if(!whitespace(c)){
    		this._state = IN_ATTRIBUTE_VALUE_NQ;
    		this._sectionStart = this._index;
    		this._index--; //reconsume token
    	}
    };
    
    Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function(c){
    	if(c === "\""){
    		this._emitToken("onattribdata");
    		this._cbs.onattribend();
    		this._state = BEFORE_ATTRIBUTE_NAME;
    	} else if(this._decodeEntities && c === "&"){
    		this._emitToken("onattribdata");
    		this._baseState = this._state;
    		this._state = BEFORE_ENTITY;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateInAttributeValueSingleQuotes = function(c){
    	if(c === "'"){
    		this._emitToken("onattribdata");
    		this._cbs.onattribend();
    		this._state = BEFORE_ATTRIBUTE_NAME;
    	} else if(this._decodeEntities && c === "&"){
    		this._emitToken("onattribdata");
    		this._baseState = this._state;
    		this._state = BEFORE_ENTITY;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateInAttributeValueNoQuotes = function(c){
    	if(whitespace(c) || c === ">"){
    		this._emitToken("onattribdata");
    		this._cbs.onattribend();
    		this._state = BEFORE_ATTRIBUTE_NAME;
    		this._index--;
    	} else if(this._decodeEntities && c === "&"){
    		this._emitToken("onattribdata");
    		this._baseState = this._state;
    		this._state = BEFORE_ENTITY;
    		this._sectionStart = this._index;
    	}
    };
    
    Tokenizer.prototype._stateBeforeDeclaration = function(c){
    	this._state = c === "[" ? BEFORE_CDATA_1 :
    					c === "-" ? BEFORE_COMMENT :
    						IN_DECLARATION;
    };
    
    Tokenizer.prototype._stateInDeclaration = function(c){
    	if(c === ">"){
    		this._cbs.ondeclaration(this._getSection());
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	}
    };
    
    Tokenizer.prototype._stateInProcessingInstruction = function(c){
    	if(c === ">"){
    		this._cbs.onprocessinginstruction(this._getSection());
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	}
    };
    
    Tokenizer.prototype._stateBeforeComment = function(c){
    	if(c === "-"){
    		this._state = IN_COMMENT;
    		this._sectionStart = this._index + 1;
    	} else {
    		this._state = IN_DECLARATION;
    	}
    };
    
    Tokenizer.prototype._stateInComment = function(c){
    	if(c === "-") this._state = AFTER_COMMENT_1;
    };
    
    Tokenizer.prototype._stateAfterComment1 = function(c){
    	if(c === "-"){
    		this._state = AFTER_COMMENT_2;
    	} else {
    		this._state = IN_COMMENT;
    	}
    };
    
    Tokenizer.prototype._stateAfterComment2 = function(c){
    	if(c === ">"){
    		//remove 2 trailing chars
    		this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2));
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	} else if(c !== "-"){
    		this._state = IN_COMMENT;
    	}
    	// else: stay in AFTER_COMMENT_2 (`--->`)
    };
    
    Tokenizer.prototype._stateBeforeCdata1 = ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata2 = ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata3 = ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata4 = ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
    Tokenizer.prototype._stateBeforeCdata5 = ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);
    
    Tokenizer.prototype._stateBeforeCdata6 = function(c){
    	if(c === "["){
    		this._state = IN_CDATA;
    		this._sectionStart = this._index + 1;
    	} else {
    		this._state = IN_DECLARATION;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateInCdata = function(c){
    	if(c === "]") this._state = AFTER_CDATA_1;
    };
    
    Tokenizer.prototype._stateAfterCdata1 = characterState("]", AFTER_CDATA_2);
    
    Tokenizer.prototype._stateAfterCdata2 = function(c){
    	if(c === ">"){
    		//remove 2 trailing chars
    		this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2));
    		this._state = TEXT;
    		this._sectionStart = this._index + 1;
    	} else if(c !== "]") {
    		this._state = IN_CDATA;
    	}
    	//else: stay in AFTER_CDATA_2 (`]]]>`)
    };
    
    Tokenizer.prototype._stateBeforeSpecial = function(c){
    	if(c === "c" || c === "C"){
    		this._state = BEFORE_SCRIPT_1;
    	} else if(c === "t" || c === "T"){
    		this._state = BEFORE_STYLE_1;
    	} else {
    		this._state = IN_TAG_NAME;
    		this._index--; //consume the token again
    	}
    };
    
    Tokenizer.prototype._stateBeforeSpecialEnd = function(c){
    	if(this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")){
    		this._state = AFTER_SCRIPT_1;
    	} else if(this._special === SPECIAL_STYLE && (c === "t" || c === "T")){
    		this._state = AFTER_STYLE_1;
    	}
    	else this._state = TEXT;
    };
    
    Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
    Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
    Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
    Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar("T", BEFORE_SCRIPT_5);
    
    Tokenizer.prototype._stateBeforeScript5 = function(c){
    	if(c === "/" || c === ">" || whitespace(c)){
    		this._special = SPECIAL_SCRIPT;
    	}
    	this._state = IN_TAG_NAME;
    	this._index--; //consume the token again
    };
    
    Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
    Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
    Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
    Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);
    
    Tokenizer.prototype._stateAfterScript5 = function(c){
    	if(c === ">" || whitespace(c)){
    		this._special = SPECIAL_NONE;
    		this._state = IN_CLOSING_TAG_NAME;
    		this._sectionStart = this._index - 6;
    		this._index--; //reconsume the token
    	}
    	else this._state = TEXT;
    };
    
    Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar("Y", BEFORE_STYLE_2);
    Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar("L", BEFORE_STYLE_3);
    Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar("E", BEFORE_STYLE_4);
    
    Tokenizer.prototype._stateBeforeStyle4 = function(c){
    	if(c === "/" || c === ">" || whitespace(c)){
    		this._special = SPECIAL_STYLE;
    	}
    	this._state = IN_TAG_NAME;
    	this._index--; //consume the token again
    };
    
    Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
    Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
    Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);
    
    Tokenizer.prototype._stateAfterStyle4 = function(c){
    	if(c === ">" || whitespace(c)){
    		this._special = SPECIAL_NONE;
    		this._state = IN_CLOSING_TAG_NAME;
    		this._sectionStart = this._index - 5;
    		this._index--; //reconsume the token
    	}
    	else this._state = TEXT;
    };
    
    Tokenizer.prototype._stateBeforeEntity = ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
    Tokenizer.prototype._stateBeforeNumericEntity = ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);
    
    //for entities terminated with a semicolon
    Tokenizer.prototype._parseNamedEntityStrict = function(){
    	//offset = 1
    	if(this._sectionStart + 1 < this._index){
    		var entity = this._buffer.substring(this._sectionStart + 1, this._index),
    		    map = this._xmlMode ? xmlMap : entityMap;
    
    		if(map.hasOwnProperty(entity)){
    			this._emitPartial(map[entity]);
    			this._sectionStart = this._index + 1;
    		}
    	}
    };
    
    
    //parses legacy entities (without trailing semicolon)
    Tokenizer.prototype._parseLegacyEntity = function(){
    	var start = this._sectionStart + 1,
    	    limit = this._index - start;
    
    	if(limit > 6) limit = 6; //the max length of legacy entities is 6
    
    	while(limit >= 2){ //the min length of legacy entities is 2
    		var entity = this._buffer.substr(start, limit);
    
    		if(legacyMap.hasOwnProperty(entity)){
    			this._emitPartial(legacyMap[entity]);
    			this._sectionStart += limit + 1;
    			return;
    		} else {
    			limit--;
    		}
    	}
    };
    
    Tokenizer.prototype._stateInNamedEntity = function(c){
    	if(c === ";"){
    		this._parseNamedEntityStrict();
    		if(this._sectionStart + 1 < this._index && !this._xmlMode){
    			this._parseLegacyEntity();
    		}
    		this._state = this._baseState;
    	} else if((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")){
    		if(this._xmlMode);
    		else if(this._sectionStart + 1 === this._index);
    		else if(this._baseState !== TEXT){
    			if(c !== "="){
    				this._parseNamedEntityStrict();
    			}
    		} else {
    			this._parseLegacyEntity();
    		}
    
    		this._state = this._baseState;
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._decodeNumericEntity = function(offset, base){
    	var sectionStart = this._sectionStart + offset;
    
    	if(sectionStart !== this._index){
    		//parse entity
    		var entity = this._buffer.substring(sectionStart, this._index);
    		var parsed = parseInt(entity, base);
    
    		this._emitPartial(decodeCodePoint(parsed));
    		this._sectionStart = this._index;
    	} else {
    		this._sectionStart--;
    	}
    
    	this._state = this._baseState;
    };
    
    Tokenizer.prototype._stateInNumericEntity = function(c){
    	if(c === ";"){
    		this._decodeNumericEntity(2, 10);
    		this._sectionStart++;
    	} else if(c < "0" || c > "9"){
    		if(!this._xmlMode){
    			this._decodeNumericEntity(2, 10);
    		} else {
    			this._state = this._baseState;
    		}
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._stateInHexEntity = function(c){
    	if(c === ";"){
    		this._decodeNumericEntity(3, 16);
    		this._sectionStart++;
    	} else if((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")){
    		if(!this._xmlMode){
    			this._decodeNumericEntity(3, 16);
    		} else {
    			this._state = this._baseState;
    		}
    		this._index--;
    	}
    };
    
    Tokenizer.prototype._cleanup = function (){
    	if(this._sectionStart < 0){
    		this._buffer = "";
    		this._index = 0;
    		this._bufferOffset += this._index;
    	} else if(this._running){
    		if(this._state === TEXT){
    			if(this._sectionStart !== this._index){
    				this._cbs.ontext(this._buffer.substr(this._sectionStart));
    			}
    			this._buffer = "";
    			this._index = 0;
    			this._bufferOffset += this._index;
    		} else if(this._sectionStart === this._index){
    			//the section just started
    			this._buffer = "";
    			this._index = 0;
    			this._bufferOffset += this._index;
    		} else {
    			//remove everything unnecessary
    			this._buffer = this._buffer.substr(this._sectionStart);
    			this._index -= this._sectionStart;
    			this._bufferOffset += this._sectionStart;
    		}
    
    		this._sectionStart = 0;
    	}
    };
    
    //TODO make events conditional
    Tokenizer.prototype.write = function(chunk){
    	if(this._ended) this._cbs.onerror(Error(".write() after done!"));
    
    	this._buffer += chunk;
    	this._parse();
    };
    
    Tokenizer.prototype._parse = function(){
    	while(this._index < this._buffer.length && this._running){
    		var c = this._buffer.charAt(this._index);
    		if(this._state === TEXT) {
    			this._stateText(c);
    		} else if(this._state === BEFORE_TAG_NAME){
    			this._stateBeforeTagName(c);
    		} else if(this._state === IN_TAG_NAME) {
    			this._stateInTagName(c);
    		} else if(this._state === BEFORE_CLOSING_TAG_NAME){
    			this._stateBeforeCloseingTagName(c);
    		} else if(this._state === IN_CLOSING_TAG_NAME){
    			this._stateInCloseingTagName(c);
    		} else if(this._state === AFTER_CLOSING_TAG_NAME){
    			this._stateAfterCloseingTagName(c);
    		} else if(this._state === IN_SELF_CLOSING_TAG){
    			this._stateInSelfClosingTag(c);
    		}
    
    		/*
    		*	attributes
    		*/
    		else if(this._state === BEFORE_ATTRIBUTE_NAME){
    			this._stateBeforeAttributeName(c);
    		} else if(this._state === IN_ATTRIBUTE_NAME){
    			this._stateInAttributeName(c);
    		} else if(this._state === AFTER_ATTRIBUTE_NAME){
    			this._stateAfterAttributeName(c);
    		} else if(this._state === BEFORE_ATTRIBUTE_VALUE){
    			this._stateBeforeAttributeValue(c);
    		} else if(this._state === IN_ATTRIBUTE_VALUE_DQ){
    			this._stateInAttributeValueDoubleQuotes(c);
    		} else if(this._state === IN_ATTRIBUTE_VALUE_SQ){
    			this._stateInAttributeValueSingleQuotes(c);
    		} else if(this._state === IN_ATTRIBUTE_VALUE_NQ){
    			this._stateInAttributeValueNoQuotes(c);
    		}
    
    		/*
    		*	declarations
    		*/
    		else if(this._state === BEFORE_DECLARATION){
    			this._stateBeforeDeclaration(c);
    		} else if(this._state === IN_DECLARATION){
    			this._stateInDeclaration(c);
    		}
    
    		/*
    		*	processing instructions
    		*/
    		else if(this._state === IN_PROCESSING_INSTRUCTION){
    			this._stateInProcessingInstruction(c);
    		}
    
    		/*
    		*	comments
    		*/
    		else if(this._state === BEFORE_COMMENT){
    			this._stateBeforeComment(c);
    		} else if(this._state === IN_COMMENT){
    			this._stateInComment(c);
    		} else if(this._state === AFTER_COMMENT_1){
    			this._stateAfterComment1(c);
    		} else if(this._state === AFTER_COMMENT_2){
    			this._stateAfterComment2(c);
    		}
    
    		/*
    		*	cdata
    		*/
    		else if(this._state === BEFORE_CDATA_1){
    			this._stateBeforeCdata1(c);
    		} else if(this._state === BEFORE_CDATA_2){
    			this._stateBeforeCdata2(c);
    		} else if(this._state === BEFORE_CDATA_3){
    			this._stateBeforeCdata3(c);
    		} else if(this._state === BEFORE_CDATA_4){
    			this._stateBeforeCdata4(c);
    		} else if(this._state === BEFORE_CDATA_5){
    			this._stateBeforeCdata5(c);
    		} else if(this._state === BEFORE_CDATA_6){
    			this._stateBeforeCdata6(c);
    		} else if(this._state === IN_CDATA){
    			this._stateInCdata(c);
    		} else if(this._state === AFTER_CDATA_1){
    			this._stateAfterCdata1(c);
    		} else if(this._state === AFTER_CDATA_2){
    			this._stateAfterCdata2(c);
    		}
    
    		/*
    		* special tags
    		*/
    		else if(this._state === BEFORE_SPECIAL){
    			this._stateBeforeSpecial(c);
    		} else if(this._state === BEFORE_SPECIAL_END){
    			this._stateBeforeSpecialEnd(c);
    		}
    
    		/*
    		* script
    		*/
    		else if(this._state === BEFORE_SCRIPT_1){
    			this._stateBeforeScript1(c);
    		} else if(this._state === BEFORE_SCRIPT_2){
    			this._stateBeforeScript2(c);
    		} else if(this._state === BEFORE_SCRIPT_3){
    			this._stateBeforeScript3(c);
    		} else if(this._state === BEFORE_SCRIPT_4){
    			this._stateBeforeScript4(c);
    		} else if(this._state === BEFORE_SCRIPT_5){
    			this._stateBeforeScript5(c);
    		}
    
    		else if(this._state === AFTER_SCRIPT_1){
    			this._stateAfterScript1(c);
    		} else if(this._state === AFTER_SCRIPT_2){
    			this._stateAfterScript2(c);
    		} else if(this._state === AFTER_SCRIPT_3){
    			this._stateAfterScript3(c);
    		} else if(this._state === AFTER_SCRIPT_4){
    			this._stateAfterScript4(c);
    		} else if(this._state === AFTER_SCRIPT_5){
    			this._stateAfterScript5(c);
    		}
    
    		/*
    		* style
    		*/
    		else if(this._state === BEFORE_STYLE_1){
    			this._stateBeforeStyle1(c);
    		} else if(this._state === BEFORE_STYLE_2){
    			this._stateBeforeStyle2(c);
    		} else if(this._state === BEFORE_STYLE_3){
    			this._stateBeforeStyle3(c);
    		} else if(this._state === BEFORE_STYLE_4){
    			this._stateBeforeStyle4(c);
    		}
    
    		else if(this._state === AFTER_STYLE_1){
    			this._stateAfterStyle1(c);
    		} else if(this._state === AFTER_STYLE_2){
    			this._stateAfterStyle2(c);
    		} else if(this._state === AFTER_STYLE_3){
    			this._stateAfterStyle3(c);
    		} else if(this._state === AFTER_STYLE_4){
    			this._stateAfterStyle4(c);
    		}
    
    		/*
    		* entities
    		*/
    		else if(this._state === BEFORE_ENTITY){
    			this._stateBeforeEntity(c);
    		} else if(this._state === BEFORE_NUMERIC_ENTITY){
    			this._stateBeforeNumericEntity(c);
    		} else if(this._state === IN_NAMED_ENTITY){
    			this._stateInNamedEntity(c);
    		} else if(this._state === IN_NUMERIC_ENTITY){
    			this._stateInNumericEntity(c);
    		} else if(this._state === IN_HEX_ENTITY){
    			this._stateInHexEntity(c);
    		}
    
    		else {
    			this._cbs.onerror(Error("unknown _state"), this._state);
    		}
    
    		this._index++;
    	}
    
    	this._cleanup();
    };
    
    Tokenizer.prototype.pause = function(){
    	this._running = false;
    };
    Tokenizer.prototype.resume = function(){
    	this._running = true;
    
    	if(this._index < this._buffer.length){
    		this._parse();
    	}
    	if(this._ended){
    		this._finish();
    	}
    };
    
    Tokenizer.prototype.end = function(chunk){
    	if(this._ended) this._cbs.onerror(Error(".end() after done!"));
    	if(chunk) this.write(chunk);
    
    	this._ended = true;
    
    	if(this._running) this._finish();
    };
    
    Tokenizer.prototype._finish = function(){
    	//if there is remaining data, emit it in a reasonable way
    	if(this._sectionStart < this._index){
    		this._handleTrailingData();
    	}
    
    	this._cbs.onend();
    };
    
    Tokenizer.prototype._handleTrailingData = function(){
    	var data = this._buffer.substr(this._sectionStart);
    
    	if(this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2){
    		this._cbs.oncdata(data);
    	} else if(this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2){
    		this._cbs.oncomment(data);
    	} else if(this._state === IN_NAMED_ENTITY && !this._xmlMode){
    		this._parseLegacyEntity();
    		if(this._sectionStart < this._index){
    			this._state = this._baseState;
    			this._handleTrailingData();
    		}
    	} else if(this._state === IN_NUMERIC_ENTITY && !this._xmlMode){
    		this._decodeNumericEntity(2, 10);
    		if(this._sectionStart < this._index){
    			this._state = this._baseState;
    			this._handleTrailingData();
    		}
    	} else if(this._state === IN_HEX_ENTITY && !this._xmlMode){
    		this._decodeNumericEntity(3, 16);
    		if(this._sectionStart < this._index){
    			this._state = this._baseState;
    			this._handleTrailingData();
    		}
    	} else if(
    		this._state !== IN_TAG_NAME &&
    		this._state !== BEFORE_ATTRIBUTE_NAME &&
    		this._state !== BEFORE_ATTRIBUTE_VALUE &&
    		this._state !== AFTER_ATTRIBUTE_NAME &&
    		this._state !== IN_ATTRIBUTE_NAME &&
    		this._state !== IN_ATTRIBUTE_VALUE_SQ &&
    		this._state !== IN_ATTRIBUTE_VALUE_DQ &&
    		this._state !== IN_ATTRIBUTE_VALUE_NQ &&
    		this._state !== IN_CLOSING_TAG_NAME
    	){
    		this._cbs.ontext(data);
    	}
    	//else, ignore remaining data
    	//TODO add a way to remove current tag
    };
    
    Tokenizer.prototype.reset = function(){
    	Tokenizer.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs);
    };
    
    Tokenizer.prototype.getAbsoluteIndex = function(){
    	return this._bufferOffset + this._index;
    };
    
    Tokenizer.prototype._getSection = function(){
    	return this._buffer.substring(this._sectionStart, this._index);
    };
    
    Tokenizer.prototype._emitToken = function(name){
    	this._cbs[name](this._getSection());
    	this._sectionStart = -1;
    };
    
    Tokenizer.prototype._emitPartial = function(value){
    	if(this._baseState !== TEXT){
    		this._cbs.onattribdata(value); //TODO implement the new event
    	} else {
    		this._cbs.ontext(value);
    	}
    };
    
  };

  this.node_modules$entities$lib$decode_codepoint_ = function(module, exports, global) {
    var decodeMap = require("../maps/decode.json");
    
    module.exports = decodeCodePoint;
    
    // modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
    function decodeCodePoint(codePoint){
    
    	if((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF){
    		return "\uFFFD";
    	}
    
    	if(codePoint in decodeMap){
    		codePoint = decodeMap[codePoint];
    	}
    
    	var output = "";
    
    	if(codePoint > 0xFFFF){
    		codePoint -= 0x10000;
    		output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
    		codePoint = 0xDC00 | codePoint & 0x3FF;
    	}
    
    	output += String.fromCharCode(codePoint);
    	return output;
    }
    
  };

  this.node_modules$entities$maps$decode_json_ = function(module, exports, global) {
    module.exports = {"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376};
  };

  this.node_modules$entities$maps$entities_json_ = function(module, exports, global) {
    module.exports = {"Aacute":"\u00C1","aacute":"\u00E1","Abreve":"\u0102","abreve":"\u0103","ac":"\u223E","acd":"\u223F","acE":"\u223E\u0333","Acirc":"\u00C2","acirc":"\u00E2","acute":"\u00B4","Acy":"\u0410","acy":"\u0430","AElig":"\u00C6","aelig":"\u00E6","af":"\u2061","Afr":"\uD835\uDD04","afr":"\uD835\uDD1E","Agrave":"\u00C0","agrave":"\u00E0","alefsym":"\u2135","aleph":"\u2135","Alpha":"\u0391","alpha":"\u03B1","Amacr":"\u0100","amacr":"\u0101","amalg":"\u2A3F","amp":"&","AMP":"&","andand":"\u2A55","And":"\u2A53","and":"\u2227","andd":"\u2A5C","andslope":"\u2A58","andv":"\u2A5A","ang":"\u2220","ange":"\u29A4","angle":"\u2220","angmsdaa":"\u29A8","angmsdab":"\u29A9","angmsdac":"\u29AA","angmsdad":"\u29AB","angmsdae":"\u29AC","angmsdaf":"\u29AD","angmsdag":"\u29AE","angmsdah":"\u29AF","angmsd":"\u2221","angrt":"\u221F","angrtvb":"\u22BE","angrtvbd":"\u299D","angsph":"\u2222","angst":"\u00C5","angzarr":"\u237C","Aogon":"\u0104","aogon":"\u0105","Aopf":"\uD835\uDD38","aopf":"\uD835\uDD52","apacir":"\u2A6F","ap":"\u2248","apE":"\u2A70","ape":"\u224A","apid":"\u224B","apos":"'","ApplyFunction":"\u2061","approx":"\u2248","approxeq":"\u224A","Aring":"\u00C5","aring":"\u00E5","Ascr":"\uD835\uDC9C","ascr":"\uD835\uDCB6","Assign":"\u2254","ast":"*","asymp":"\u2248","asympeq":"\u224D","Atilde":"\u00C3","atilde":"\u00E3","Auml":"\u00C4","auml":"\u00E4","awconint":"\u2233","awint":"\u2A11","backcong":"\u224C","backepsilon":"\u03F6","backprime":"\u2035","backsim":"\u223D","backsimeq":"\u22CD","Backslash":"\u2216","Barv":"\u2AE7","barvee":"\u22BD","barwed":"\u2305","Barwed":"\u2306","barwedge":"\u2305","bbrk":"\u23B5","bbrktbrk":"\u23B6","bcong":"\u224C","Bcy":"\u0411","bcy":"\u0431","bdquo":"\u201E","becaus":"\u2235","because":"\u2235","Because":"\u2235","bemptyv":"\u29B0","bepsi":"\u03F6","bernou":"\u212C","Bernoullis":"\u212C","Beta":"\u0392","beta":"\u03B2","beth":"\u2136","between":"\u226C","Bfr":"\uD835\uDD05","bfr":"\uD835\uDD1F","bigcap":"\u22C2","bigcirc":"\u25EF","bigcup":"\u22C3","bigodot":"\u2A00","bigoplus":"\u2A01","bigotimes":"\u2A02","bigsqcup":"\u2A06","bigstar":"\u2605","bigtriangledown":"\u25BD","bigtriangleup":"\u25B3","biguplus":"\u2A04","bigvee":"\u22C1","bigwedge":"\u22C0","bkarow":"\u290D","blacklozenge":"\u29EB","blacksquare":"\u25AA","blacktriangle":"\u25B4","blacktriangledown":"\u25BE","blacktriangleleft":"\u25C2","blacktriangleright":"\u25B8","blank":"\u2423","blk12":"\u2592","blk14":"\u2591","blk34":"\u2593","block":"\u2588","bne":"=\u20E5","bnequiv":"\u2261\u20E5","bNot":"\u2AED","bnot":"\u2310","Bopf":"\uD835\uDD39","bopf":"\uD835\uDD53","bot":"\u22A5","bottom":"\u22A5","bowtie":"\u22C8","boxbox":"\u29C9","boxdl":"\u2510","boxdL":"\u2555","boxDl":"\u2556","boxDL":"\u2557","boxdr":"\u250C","boxdR":"\u2552","boxDr":"\u2553","boxDR":"\u2554","boxh":"\u2500","boxH":"\u2550","boxhd":"\u252C","boxHd":"\u2564","boxhD":"\u2565","boxHD":"\u2566","boxhu":"\u2534","boxHu":"\u2567","boxhU":"\u2568","boxHU":"\u2569","boxminus":"\u229F","boxplus":"\u229E","boxtimes":"\u22A0","boxul":"\u2518","boxuL":"\u255B","boxUl":"\u255C","boxUL":"\u255D","boxur":"\u2514","boxuR":"\u2558","boxUr":"\u2559","boxUR":"\u255A","boxv":"\u2502","boxV":"\u2551","boxvh":"\u253C","boxvH":"\u256A","boxVh":"\u256B","boxVH":"\u256C","boxvl":"\u2524","boxvL":"\u2561","boxVl":"\u2562","boxVL":"\u2563","boxvr":"\u251C","boxvR":"\u255E","boxVr":"\u255F","boxVR":"\u2560","bprime":"\u2035","breve":"\u02D8","Breve":"\u02D8","brvbar":"\u00A6","bscr":"\uD835\uDCB7","Bscr":"\u212C","bsemi":"\u204F","bsim":"\u223D","bsime":"\u22CD","bsolb":"\u29C5","bsol":"\\","bsolhsub":"\u27C8","bull":"\u2022","bullet":"\u2022","bump":"\u224E","bumpE":"\u2AAE","bumpe":"\u224F","Bumpeq":"\u224E","bumpeq":"\u224F","Cacute":"\u0106","cacute":"\u0107","capand":"\u2A44","capbrcup":"\u2A49","capcap":"\u2A4B","cap":"\u2229","Cap":"\u22D2","capcup":"\u2A47","capdot":"\u2A40","CapitalDifferentialD":"\u2145","caps":"\u2229\uFE00","caret":"\u2041","caron":"\u02C7","Cayleys":"\u212D","ccaps":"\u2A4D","Ccaron":"\u010C","ccaron":"\u010D","Ccedil":"\u00C7","ccedil":"\u00E7","Ccirc":"\u0108","ccirc":"\u0109","Cconint":"\u2230","ccups":"\u2A4C","ccupssm":"\u2A50","Cdot":"\u010A","cdot":"\u010B","cedil":"\u00B8","Cedilla":"\u00B8","cemptyv":"\u29B2","cent":"\u00A2","centerdot":"\u00B7","CenterDot":"\u00B7","cfr":"\uD835\uDD20","Cfr":"\u212D","CHcy":"\u0427","chcy":"\u0447","check":"\u2713","checkmark":"\u2713","Chi":"\u03A7","chi":"\u03C7","circ":"\u02C6","circeq":"\u2257","circlearrowleft":"\u21BA","circlearrowright":"\u21BB","circledast":"\u229B","circledcirc":"\u229A","circleddash":"\u229D","CircleDot":"\u2299","circledR":"\u00AE","circledS":"\u24C8","CircleMinus":"\u2296","CirclePlus":"\u2295","CircleTimes":"\u2297","cir":"\u25CB","cirE":"\u29C3","cire":"\u2257","cirfnint":"\u2A10","cirmid":"\u2AEF","cirscir":"\u29C2","ClockwiseContourIntegral":"\u2232","CloseCurlyDoubleQuote":"\u201D","CloseCurlyQuote":"\u2019","clubs":"\u2663","clubsuit":"\u2663","colon":":","Colon":"\u2237","Colone":"\u2A74","colone":"\u2254","coloneq":"\u2254","comma":",","commat":"@","comp":"\u2201","compfn":"\u2218","complement":"\u2201","complexes":"\u2102","cong":"\u2245","congdot":"\u2A6D","Congruent":"\u2261","conint":"\u222E","Conint":"\u222F","ContourIntegral":"\u222E","copf":"\uD835\uDD54","Copf":"\u2102","coprod":"\u2210","Coproduct":"\u2210","copy":"\u00A9","COPY":"\u00A9","copysr":"\u2117","CounterClockwiseContourIntegral":"\u2233","crarr":"\u21B5","cross":"\u2717","Cross":"\u2A2F","Cscr":"\uD835\uDC9E","cscr":"\uD835\uDCB8","csub":"\u2ACF","csube":"\u2AD1","csup":"\u2AD0","csupe":"\u2AD2","ctdot":"\u22EF","cudarrl":"\u2938","cudarrr":"\u2935","cuepr":"\u22DE","cuesc":"\u22DF","cularr":"\u21B6","cularrp":"\u293D","cupbrcap":"\u2A48","cupcap":"\u2A46","CupCap":"\u224D","cup":"\u222A","Cup":"\u22D3","cupcup":"\u2A4A","cupdot":"\u228D","cupor":"\u2A45","cups":"\u222A\uFE00","curarr":"\u21B7","curarrm":"\u293C","curlyeqprec":"\u22DE","curlyeqsucc":"\u22DF","curlyvee":"\u22CE","curlywedge":"\u22CF","curren":"\u00A4","curvearrowleft":"\u21B6","curvearrowright":"\u21B7","cuvee":"\u22CE","cuwed":"\u22CF","cwconint":"\u2232","cwint":"\u2231","cylcty":"\u232D","dagger":"\u2020","Dagger":"\u2021","daleth":"\u2138","darr":"\u2193","Darr":"\u21A1","dArr":"\u21D3","dash":"\u2010","Dashv":"\u2AE4","dashv":"\u22A3","dbkarow":"\u290F","dblac":"\u02DD","Dcaron":"\u010E","dcaron":"\u010F","Dcy":"\u0414","dcy":"\u0434","ddagger":"\u2021","ddarr":"\u21CA","DD":"\u2145","dd":"\u2146","DDotrahd":"\u2911","ddotseq":"\u2A77","deg":"\u00B0","Del":"\u2207","Delta":"\u0394","delta":"\u03B4","demptyv":"\u29B1","dfisht":"\u297F","Dfr":"\uD835\uDD07","dfr":"\uD835\uDD21","dHar":"\u2965","dharl":"\u21C3","dharr":"\u21C2","DiacriticalAcute":"\u00B4","DiacriticalDot":"\u02D9","DiacriticalDoubleAcute":"\u02DD","DiacriticalGrave":"`","DiacriticalTilde":"\u02DC","diam":"\u22C4","diamond":"\u22C4","Diamond":"\u22C4","diamondsuit":"\u2666","diams":"\u2666","die":"\u00A8","DifferentialD":"\u2146","digamma":"\u03DD","disin":"\u22F2","div":"\u00F7","divide":"\u00F7","divideontimes":"\u22C7","divonx":"\u22C7","DJcy":"\u0402","djcy":"\u0452","dlcorn":"\u231E","dlcrop":"\u230D","dollar":"$","Dopf":"\uD835\uDD3B","dopf":"\uD835\uDD55","Dot":"\u00A8","dot":"\u02D9","DotDot":"\u20DC","doteq":"\u2250","doteqdot":"\u2251","DotEqual":"\u2250","dotminus":"\u2238","dotplus":"\u2214","dotsquare":"\u22A1","doublebarwedge":"\u2306","DoubleContourIntegral":"\u222F","DoubleDot":"\u00A8","DoubleDownArrow":"\u21D3","DoubleLeftArrow":"\u21D0","DoubleLeftRightArrow":"\u21D4","DoubleLeftTee":"\u2AE4","DoubleLongLeftArrow":"\u27F8","DoubleLongLeftRightArrow":"\u27FA","DoubleLongRightArrow":"\u27F9","DoubleRightArrow":"\u21D2","DoubleRightTee":"\u22A8","DoubleUpArrow":"\u21D1","DoubleUpDownArrow":"\u21D5","DoubleVerticalBar":"\u2225","DownArrowBar":"\u2913","downarrow":"\u2193","DownArrow":"\u2193","Downarrow":"\u21D3","DownArrowUpArrow":"\u21F5","DownBreve":"\u0311","downdownarrows":"\u21CA","downharpoonleft":"\u21C3","downharpoonright":"\u21C2","DownLeftRightVector":"\u2950","DownLeftTeeVector":"\u295E","DownLeftVectorBar":"\u2956","DownLeftVector":"\u21BD","DownRightTeeVector":"\u295F","DownRightVectorBar":"\u2957","DownRightVector":"\u21C1","DownTeeArrow":"\u21A7","DownTee":"\u22A4","drbkarow":"\u2910","drcorn":"\u231F","drcrop":"\u230C","Dscr":"\uD835\uDC9F","dscr":"\uD835\uDCB9","DScy":"\u0405","dscy":"\u0455","dsol":"\u29F6","Dstrok":"\u0110","dstrok":"\u0111","dtdot":"\u22F1","dtri":"\u25BF","dtrif":"\u25BE","duarr":"\u21F5","duhar":"\u296F","dwangle":"\u29A6","DZcy":"\u040F","dzcy":"\u045F","dzigrarr":"\u27FF","Eacute":"\u00C9","eacute":"\u00E9","easter":"\u2A6E","Ecaron":"\u011A","ecaron":"\u011B","Ecirc":"\u00CA","ecirc":"\u00EA","ecir":"\u2256","ecolon":"\u2255","Ecy":"\u042D","ecy":"\u044D","eDDot":"\u2A77","Edot":"\u0116","edot":"\u0117","eDot":"\u2251","ee":"\u2147","efDot":"\u2252","Efr":"\uD835\uDD08","efr":"\uD835\uDD22","eg":"\u2A9A","Egrave":"\u00C8","egrave":"\u00E8","egs":"\u2A96","egsdot":"\u2A98","el":"\u2A99","Element":"\u2208","elinters":"\u23E7","ell":"\u2113","els":"\u2A95","elsdot":"\u2A97","Emacr":"\u0112","emacr":"\u0113","empty":"\u2205","emptyset":"\u2205","EmptySmallSquare":"\u25FB","emptyv":"\u2205","EmptyVerySmallSquare":"\u25AB","emsp13":"\u2004","emsp14":"\u2005","emsp":"\u2003","ENG":"\u014A","eng":"\u014B","ensp":"\u2002","Eogon":"\u0118","eogon":"\u0119","Eopf":"\uD835\uDD3C","eopf":"\uD835\uDD56","epar":"\u22D5","eparsl":"\u29E3","eplus":"\u2A71","epsi":"\u03B5","Epsilon":"\u0395","epsilon":"\u03B5","epsiv":"\u03F5","eqcirc":"\u2256","eqcolon":"\u2255","eqsim":"\u2242","eqslantgtr":"\u2A96","eqslantless":"\u2A95","Equal":"\u2A75","equals":"=","EqualTilde":"\u2242","equest":"\u225F","Equilibrium":"\u21CC","equiv":"\u2261","equivDD":"\u2A78","eqvparsl":"\u29E5","erarr":"\u2971","erDot":"\u2253","escr":"\u212F","Escr":"\u2130","esdot":"\u2250","Esim":"\u2A73","esim":"\u2242","Eta":"\u0397","eta":"\u03B7","ETH":"\u00D0","eth":"\u00F0","Euml":"\u00CB","euml":"\u00EB","euro":"\u20AC","excl":"!","exist":"\u2203","Exists":"\u2203","expectation":"\u2130","exponentiale":"\u2147","ExponentialE":"\u2147","fallingdotseq":"\u2252","Fcy":"\u0424","fcy":"\u0444","female":"\u2640","ffilig":"\uFB03","fflig":"\uFB00","ffllig":"\uFB04","Ffr":"\uD835\uDD09","ffr":"\uD835\uDD23","filig":"\uFB01","FilledSmallSquare":"\u25FC","FilledVerySmallSquare":"\u25AA","fjlig":"fj","flat":"\u266D","fllig":"\uFB02","fltns":"\u25B1","fnof":"\u0192","Fopf":"\uD835\uDD3D","fopf":"\uD835\uDD57","forall":"\u2200","ForAll":"\u2200","fork":"\u22D4","forkv":"\u2AD9","Fouriertrf":"\u2131","fpartint":"\u2A0D","frac12":"\u00BD","frac13":"\u2153","frac14":"\u00BC","frac15":"\u2155","frac16":"\u2159","frac18":"\u215B","frac23":"\u2154","frac25":"\u2156","frac34":"\u00BE","frac35":"\u2157","frac38":"\u215C","frac45":"\u2158","frac56":"\u215A","frac58":"\u215D","frac78":"\u215E","frasl":"\u2044","frown":"\u2322","fscr":"\uD835\uDCBB","Fscr":"\u2131","gacute":"\u01F5","Gamma":"\u0393","gamma":"\u03B3","Gammad":"\u03DC","gammad":"\u03DD","gap":"\u2A86","Gbreve":"\u011E","gbreve":"\u011F","Gcedil":"\u0122","Gcirc":"\u011C","gcirc":"\u011D","Gcy":"\u0413","gcy":"\u0433","Gdot":"\u0120","gdot":"\u0121","ge":"\u2265","gE":"\u2267","gEl":"\u2A8C","gel":"\u22DB","geq":"\u2265","geqq":"\u2267","geqslant":"\u2A7E","gescc":"\u2AA9","ges":"\u2A7E","gesdot":"\u2A80","gesdoto":"\u2A82","gesdotol":"\u2A84","gesl":"\u22DB\uFE00","gesles":"\u2A94","Gfr":"\uD835\uDD0A","gfr":"\uD835\uDD24","gg":"\u226B","Gg":"\u22D9","ggg":"\u22D9","gimel":"\u2137","GJcy":"\u0403","gjcy":"\u0453","gla":"\u2AA5","gl":"\u2277","glE":"\u2A92","glj":"\u2AA4","gnap":"\u2A8A","gnapprox":"\u2A8A","gne":"\u2A88","gnE":"\u2269","gneq":"\u2A88","gneqq":"\u2269","gnsim":"\u22E7","Gopf":"\uD835\uDD3E","gopf":"\uD835\uDD58","grave":"`","GreaterEqual":"\u2265","GreaterEqualLess":"\u22DB","GreaterFullEqual":"\u2267","GreaterGreater":"\u2AA2","GreaterLess":"\u2277","GreaterSlantEqual":"\u2A7E","GreaterTilde":"\u2273","Gscr":"\uD835\uDCA2","gscr":"\u210A","gsim":"\u2273","gsime":"\u2A8E","gsiml":"\u2A90","gtcc":"\u2AA7","gtcir":"\u2A7A","gt":">","GT":">","Gt":"\u226B","gtdot":"\u22D7","gtlPar":"\u2995","gtquest":"\u2A7C","gtrapprox":"\u2A86","gtrarr":"\u2978","gtrdot":"\u22D7","gtreqless":"\u22DB","gtreqqless":"\u2A8C","gtrless":"\u2277","gtrsim":"\u2273","gvertneqq":"\u2269\uFE00","gvnE":"\u2269\uFE00","Hacek":"\u02C7","hairsp":"\u200A","half":"\u00BD","hamilt":"\u210B","HARDcy":"\u042A","hardcy":"\u044A","harrcir":"\u2948","harr":"\u2194","hArr":"\u21D4","harrw":"\u21AD","Hat":"^","hbar":"\u210F","Hcirc":"\u0124","hcirc":"\u0125","hearts":"\u2665","heartsuit":"\u2665","hellip":"\u2026","hercon":"\u22B9","hfr":"\uD835\uDD25","Hfr":"\u210C","HilbertSpace":"\u210B","hksearow":"\u2925","hkswarow":"\u2926","hoarr":"\u21FF","homtht":"\u223B","hookleftarrow":"\u21A9","hookrightarrow":"\u21AA","hopf":"\uD835\uDD59","Hopf":"\u210D","horbar":"\u2015","HorizontalLine":"\u2500","hscr":"\uD835\uDCBD","Hscr":"\u210B","hslash":"\u210F","Hstrok":"\u0126","hstrok":"\u0127","HumpDownHump":"\u224E","HumpEqual":"\u224F","hybull":"\u2043","hyphen":"\u2010","Iacute":"\u00CD","iacute":"\u00ED","ic":"\u2063","Icirc":"\u00CE","icirc":"\u00EE","Icy":"\u0418","icy":"\u0438","Idot":"\u0130","IEcy":"\u0415","iecy":"\u0435","iexcl":"\u00A1","iff":"\u21D4","ifr":"\uD835\uDD26","Ifr":"\u2111","Igrave":"\u00CC","igrave":"\u00EC","ii":"\u2148","iiiint":"\u2A0C","iiint":"\u222D","iinfin":"\u29DC","iiota":"\u2129","IJlig":"\u0132","ijlig":"\u0133","Imacr":"\u012A","imacr":"\u012B","image":"\u2111","ImaginaryI":"\u2148","imagline":"\u2110","imagpart":"\u2111","imath":"\u0131","Im":"\u2111","imof":"\u22B7","imped":"\u01B5","Implies":"\u21D2","incare":"\u2105","in":"\u2208","infin":"\u221E","infintie":"\u29DD","inodot":"\u0131","intcal":"\u22BA","int":"\u222B","Int":"\u222C","integers":"\u2124","Integral":"\u222B","intercal":"\u22BA","Intersection":"\u22C2","intlarhk":"\u2A17","intprod":"\u2A3C","InvisibleComma":"\u2063","InvisibleTimes":"\u2062","IOcy":"\u0401","iocy":"\u0451","Iogon":"\u012E","iogon":"\u012F","Iopf":"\uD835\uDD40","iopf":"\uD835\uDD5A","Iota":"\u0399","iota":"\u03B9","iprod":"\u2A3C","iquest":"\u00BF","iscr":"\uD835\uDCBE","Iscr":"\u2110","isin":"\u2208","isindot":"\u22F5","isinE":"\u22F9","isins":"\u22F4","isinsv":"\u22F3","isinv":"\u2208","it":"\u2062","Itilde":"\u0128","itilde":"\u0129","Iukcy":"\u0406","iukcy":"\u0456","Iuml":"\u00CF","iuml":"\u00EF","Jcirc":"\u0134","jcirc":"\u0135","Jcy":"\u0419","jcy":"\u0439","Jfr":"\uD835\uDD0D","jfr":"\uD835\uDD27","jmath":"\u0237","Jopf":"\uD835\uDD41","jopf":"\uD835\uDD5B","Jscr":"\uD835\uDCA5","jscr":"\uD835\uDCBF","Jsercy":"\u0408","jsercy":"\u0458","Jukcy":"\u0404","jukcy":"\u0454","Kappa":"\u039A","kappa":"\u03BA","kappav":"\u03F0","Kcedil":"\u0136","kcedil":"\u0137","Kcy":"\u041A","kcy":"\u043A","Kfr":"\uD835\uDD0E","kfr":"\uD835\uDD28","kgreen":"\u0138","KHcy":"\u0425","khcy":"\u0445","KJcy":"\u040C","kjcy":"\u045C","Kopf":"\uD835\uDD42","kopf":"\uD835\uDD5C","Kscr":"\uD835\uDCA6","kscr":"\uD835\uDCC0","lAarr":"\u21DA","Lacute":"\u0139","lacute":"\u013A","laemptyv":"\u29B4","lagran":"\u2112","Lambda":"\u039B","lambda":"\u03BB","lang":"\u27E8","Lang":"\u27EA","langd":"\u2991","langle":"\u27E8","lap":"\u2A85","Laplacetrf":"\u2112","laquo":"\u00AB","larrb":"\u21E4","larrbfs":"\u291F","larr":"\u2190","Larr":"\u219E","lArr":"\u21D0","larrfs":"\u291D","larrhk":"\u21A9","larrlp":"\u21AB","larrpl":"\u2939","larrsim":"\u2973","larrtl":"\u21A2","latail":"\u2919","lAtail":"\u291B","lat":"\u2AAB","late":"\u2AAD","lates":"\u2AAD\uFE00","lbarr":"\u290C","lBarr":"\u290E","lbbrk":"\u2772","lbrace":"{","lbrack":"[","lbrke":"\u298B","lbrksld":"\u298F","lbrkslu":"\u298D","Lcaron":"\u013D","lcaron":"\u013E","Lcedil":"\u013B","lcedil":"\u013C","lceil":"\u2308","lcub":"{","Lcy":"\u041B","lcy":"\u043B","ldca":"\u2936","ldquo":"\u201C","ldquor":"\u201E","ldrdhar":"\u2967","ldrushar":"\u294B","ldsh":"\u21B2","le":"\u2264","lE":"\u2266","LeftAngleBracket":"\u27E8","LeftArrowBar":"\u21E4","leftarrow":"\u2190","LeftArrow":"\u2190","Leftarrow":"\u21D0","LeftArrowRightArrow":"\u21C6","leftarrowtail":"\u21A2","LeftCeiling":"\u2308","LeftDoubleBracket":"\u27E6","LeftDownTeeVector":"\u2961","LeftDownVectorBar":"\u2959","LeftDownVector":"\u21C3","LeftFloor":"\u230A","leftharpoondown":"\u21BD","leftharpoonup":"\u21BC","leftleftarrows":"\u21C7","leftrightarrow":"\u2194","LeftRightArrow":"\u2194","Leftrightarrow":"\u21D4","leftrightarrows":"\u21C6","leftrightharpoons":"\u21CB","leftrightsquigarrow":"\u21AD","LeftRightVector":"\u294E","LeftTeeArrow":"\u21A4","LeftTee":"\u22A3","LeftTeeVector":"\u295A","leftthreetimes":"\u22CB","LeftTriangleBar":"\u29CF","LeftTriangle":"\u22B2","LeftTriangleEqual":"\u22B4","LeftUpDownVector":"\u2951","LeftUpTeeVector":"\u2960","LeftUpVectorBar":"\u2958","LeftUpVector":"\u21BF","LeftVectorBar":"\u2952","LeftVector":"\u21BC","lEg":"\u2A8B","leg":"\u22DA","leq":"\u2264","leqq":"\u2266","leqslant":"\u2A7D","lescc":"\u2AA8","les":"\u2A7D","lesdot":"\u2A7F","lesdoto":"\u2A81","lesdotor":"\u2A83","lesg":"\u22DA\uFE00","lesges":"\u2A93","lessapprox":"\u2A85","lessdot":"\u22D6","lesseqgtr":"\u22DA","lesseqqgtr":"\u2A8B","LessEqualGreater":"\u22DA","LessFullEqual":"\u2266","LessGreater":"\u2276","lessgtr":"\u2276","LessLess":"\u2AA1","lesssim":"\u2272","LessSlantEqual":"\u2A7D","LessTilde":"\u2272","lfisht":"\u297C","lfloor":"\u230A","Lfr":"\uD835\uDD0F","lfr":"\uD835\uDD29","lg":"\u2276","lgE":"\u2A91","lHar":"\u2962","lhard":"\u21BD","lharu":"\u21BC","lharul":"\u296A","lhblk":"\u2584","LJcy":"\u0409","ljcy":"\u0459","llarr":"\u21C7","ll":"\u226A","Ll":"\u22D8","llcorner":"\u231E","Lleftarrow":"\u21DA","llhard":"\u296B","lltri":"\u25FA","Lmidot":"\u013F","lmidot":"\u0140","lmoustache":"\u23B0","lmoust":"\u23B0","lnap":"\u2A89","lnapprox":"\u2A89","lne":"\u2A87","lnE":"\u2268","lneq":"\u2A87","lneqq":"\u2268","lnsim":"\u22E6","loang":"\u27EC","loarr":"\u21FD","lobrk":"\u27E6","longleftarrow":"\u27F5","LongLeftArrow":"\u27F5","Longleftarrow":"\u27F8","longleftrightarrow":"\u27F7","LongLeftRightArrow":"\u27F7","Longleftrightarrow":"\u27FA","longmapsto":"\u27FC","longrightarrow":"\u27F6","LongRightArrow":"\u27F6","Longrightarrow":"\u27F9","looparrowleft":"\u21AB","looparrowright":"\u21AC","lopar":"\u2985","Lopf":"\uD835\uDD43","lopf":"\uD835\uDD5D","loplus":"\u2A2D","lotimes":"\u2A34","lowast":"\u2217","lowbar":"_","LowerLeftArrow":"\u2199","LowerRightArrow":"\u2198","loz":"\u25CA","lozenge":"\u25CA","lozf":"\u29EB","lpar":"(","lparlt":"\u2993","lrarr":"\u21C6","lrcorner":"\u231F","lrhar":"\u21CB","lrhard":"\u296D","lrm":"\u200E","lrtri":"\u22BF","lsaquo":"\u2039","lscr":"\uD835\uDCC1","Lscr":"\u2112","lsh":"\u21B0","Lsh":"\u21B0","lsim":"\u2272","lsime":"\u2A8D","lsimg":"\u2A8F","lsqb":"[","lsquo":"\u2018","lsquor":"\u201A","Lstrok":"\u0141","lstrok":"\u0142","ltcc":"\u2AA6","ltcir":"\u2A79","lt":"<","LT":"<","Lt":"\u226A","ltdot":"\u22D6","lthree":"\u22CB","ltimes":"\u22C9","ltlarr":"\u2976","ltquest":"\u2A7B","ltri":"\u25C3","ltrie":"\u22B4","ltrif":"\u25C2","ltrPar":"\u2996","lurdshar":"\u294A","luruhar":"\u2966","lvertneqq":"\u2268\uFE00","lvnE":"\u2268\uFE00","macr":"\u00AF","male":"\u2642","malt":"\u2720","maltese":"\u2720","Map":"\u2905","map":"\u21A6","mapsto":"\u21A6","mapstodown":"\u21A7","mapstoleft":"\u21A4","mapstoup":"\u21A5","marker":"\u25AE","mcomma":"\u2A29","Mcy":"\u041C","mcy":"\u043C","mdash":"\u2014","mDDot":"\u223A","measuredangle":"\u2221","MediumSpace":"\u205F","Mellintrf":"\u2133","Mfr":"\uD835\uDD10","mfr":"\uD835\uDD2A","mho":"\u2127","micro":"\u00B5","midast":"*","midcir":"\u2AF0","mid":"\u2223","middot":"\u00B7","minusb":"\u229F","minus":"\u2212","minusd":"\u2238","minusdu":"\u2A2A","MinusPlus":"\u2213","mlcp":"\u2ADB","mldr":"\u2026","mnplus":"\u2213","models":"\u22A7","Mopf":"\uD835\uDD44","mopf":"\uD835\uDD5E","mp":"\u2213","mscr":"\uD835\uDCC2","Mscr":"\u2133","mstpos":"\u223E","Mu":"\u039C","mu":"\u03BC","multimap":"\u22B8","mumap":"\u22B8","nabla":"\u2207","Nacute":"\u0143","nacute":"\u0144","nang":"\u2220\u20D2","nap":"\u2249","napE":"\u2A70\u0338","napid":"\u224B\u0338","napos":"\u0149","napprox":"\u2249","natural":"\u266E","naturals":"\u2115","natur":"\u266E","nbsp":"\u00A0","nbump":"\u224E\u0338","nbumpe":"\u224F\u0338","ncap":"\u2A43","Ncaron":"\u0147","ncaron":"\u0148","Ncedil":"\u0145","ncedil":"\u0146","ncong":"\u2247","ncongdot":"\u2A6D\u0338","ncup":"\u2A42","Ncy":"\u041D","ncy":"\u043D","ndash":"\u2013","nearhk":"\u2924","nearr":"\u2197","neArr":"\u21D7","nearrow":"\u2197","ne":"\u2260","nedot":"\u2250\u0338","NegativeMediumSpace":"\u200B","NegativeThickSpace":"\u200B","NegativeThinSpace":"\u200B","NegativeVeryThinSpace":"\u200B","nequiv":"\u2262","nesear":"\u2928","nesim":"\u2242\u0338","NestedGreaterGreater":"\u226B","NestedLessLess":"\u226A","NewLine":"\n","nexist":"\u2204","nexists":"\u2204","Nfr":"\uD835\uDD11","nfr":"\uD835\uDD2B","ngE":"\u2267\u0338","nge":"\u2271","ngeq":"\u2271","ngeqq":"\u2267\u0338","ngeqslant":"\u2A7E\u0338","nges":"\u2A7E\u0338","nGg":"\u22D9\u0338","ngsim":"\u2275","nGt":"\u226B\u20D2","ngt":"\u226F","ngtr":"\u226F","nGtv":"\u226B\u0338","nharr":"\u21AE","nhArr":"\u21CE","nhpar":"\u2AF2","ni":"\u220B","nis":"\u22FC","nisd":"\u22FA","niv":"\u220B","NJcy":"\u040A","njcy":"\u045A","nlarr":"\u219A","nlArr":"\u21CD","nldr":"\u2025","nlE":"\u2266\u0338","nle":"\u2270","nleftarrow":"\u219A","nLeftarrow":"\u21CD","nleftrightarrow":"\u21AE","nLeftrightarrow":"\u21CE","nleq":"\u2270","nleqq":"\u2266\u0338","nleqslant":"\u2A7D\u0338","nles":"\u2A7D\u0338","nless":"\u226E","nLl":"\u22D8\u0338","nlsim":"\u2274","nLt":"\u226A\u20D2","nlt":"\u226E","nltri":"\u22EA","nltrie":"\u22EC","nLtv":"\u226A\u0338","nmid":"\u2224","NoBreak":"\u2060","NonBreakingSpace":"\u00A0","nopf":"\uD835\uDD5F","Nopf":"\u2115","Not":"\u2AEC","not":"\u00AC","NotCongruent":"\u2262","NotCupCap":"\u226D","NotDoubleVerticalBar":"\u2226","NotElement":"\u2209","NotEqual":"\u2260","NotEqualTilde":"\u2242\u0338","NotExists":"\u2204","NotGreater":"\u226F","NotGreaterEqual":"\u2271","NotGreaterFullEqual":"\u2267\u0338","NotGreaterGreater":"\u226B\u0338","NotGreaterLess":"\u2279","NotGreaterSlantEqual":"\u2A7E\u0338","NotGreaterTilde":"\u2275","NotHumpDownHump":"\u224E\u0338","NotHumpEqual":"\u224F\u0338","notin":"\u2209","notindot":"\u22F5\u0338","notinE":"\u22F9\u0338","notinva":"\u2209","notinvb":"\u22F7","notinvc":"\u22F6","NotLeftTriangleBar":"\u29CF\u0338","NotLeftTriangle":"\u22EA","NotLeftTriangleEqual":"\u22EC","NotLess":"\u226E","NotLessEqual":"\u2270","NotLessGreater":"\u2278","NotLessLess":"\u226A\u0338","NotLessSlantEqual":"\u2A7D\u0338","NotLessTilde":"\u2274","NotNestedGreaterGreater":"\u2AA2\u0338","NotNestedLessLess":"\u2AA1\u0338","notni":"\u220C","notniva":"\u220C","notnivb":"\u22FE","notnivc":"\u22FD","NotPrecedes":"\u2280","NotPrecedesEqual":"\u2AAF\u0338","NotPrecedesSlantEqual":"\u22E0","NotReverseElement":"\u220C","NotRightTriangleBar":"\u29D0\u0338","NotRightTriangle":"\u22EB","NotRightTriangleEqual":"\u22ED","NotSquareSubset":"\u228F\u0338","NotSquareSubsetEqual":"\u22E2","NotSquareSuperset":"\u2290\u0338","NotSquareSupersetEqual":"\u22E3","NotSubset":"\u2282\u20D2","NotSubsetEqual":"\u2288","NotSucceeds":"\u2281","NotSucceedsEqual":"\u2AB0\u0338","NotSucceedsSlantEqual":"\u22E1","NotSucceedsTilde":"\u227F\u0338","NotSuperset":"\u2283\u20D2","NotSupersetEqual":"\u2289","NotTilde":"\u2241","NotTildeEqual":"\u2244","NotTildeFullEqual":"\u2247","NotTildeTilde":"\u2249","NotVerticalBar":"\u2224","nparallel":"\u2226","npar":"\u2226","nparsl":"\u2AFD\u20E5","npart":"\u2202\u0338","npolint":"\u2A14","npr":"\u2280","nprcue":"\u22E0","nprec":"\u2280","npreceq":"\u2AAF\u0338","npre":"\u2AAF\u0338","nrarrc":"\u2933\u0338","nrarr":"\u219B","nrArr":"\u21CF","nrarrw":"\u219D\u0338","nrightarrow":"\u219B","nRightarrow":"\u21CF","nrtri":"\u22EB","nrtrie":"\u22ED","nsc":"\u2281","nsccue":"\u22E1","nsce":"\u2AB0\u0338","Nscr":"\uD835\uDCA9","nscr":"\uD835\uDCC3","nshortmid":"\u2224","nshortparallel":"\u2226","nsim":"\u2241","nsime":"\u2244","nsimeq":"\u2244","nsmid":"\u2224","nspar":"\u2226","nsqsube":"\u22E2","nsqsupe":"\u22E3","nsub":"\u2284","nsubE":"\u2AC5\u0338","nsube":"\u2288","nsubset":"\u2282\u20D2","nsubseteq":"\u2288","nsubseteqq":"\u2AC5\u0338","nsucc":"\u2281","nsucceq":"\u2AB0\u0338","nsup":"\u2285","nsupE":"\u2AC6\u0338","nsupe":"\u2289","nsupset":"\u2283\u20D2","nsupseteq":"\u2289","nsupseteqq":"\u2AC6\u0338","ntgl":"\u2279","Ntilde":"\u00D1","ntilde":"\u00F1","ntlg":"\u2278","ntriangleleft":"\u22EA","ntrianglelefteq":"\u22EC","ntriangleright":"\u22EB","ntrianglerighteq":"\u22ED","Nu":"\u039D","nu":"\u03BD","num":"#","numero":"\u2116","numsp":"\u2007","nvap":"\u224D\u20D2","nvdash":"\u22AC","nvDash":"\u22AD","nVdash":"\u22AE","nVDash":"\u22AF","nvge":"\u2265\u20D2","nvgt":">\u20D2","nvHarr":"\u2904","nvinfin":"\u29DE","nvlArr":"\u2902","nvle":"\u2264\u20D2","nvlt":"<\u20D2","nvltrie":"\u22B4\u20D2","nvrArr":"\u2903","nvrtrie":"\u22B5\u20D2","nvsim":"\u223C\u20D2","nwarhk":"\u2923","nwarr":"\u2196","nwArr":"\u21D6","nwarrow":"\u2196","nwnear":"\u2927","Oacute":"\u00D3","oacute":"\u00F3","oast":"\u229B","Ocirc":"\u00D4","ocirc":"\u00F4","ocir":"\u229A","Ocy":"\u041E","ocy":"\u043E","odash":"\u229D","Odblac":"\u0150","odblac":"\u0151","odiv":"\u2A38","odot":"\u2299","odsold":"\u29BC","OElig":"\u0152","oelig":"\u0153","ofcir":"\u29BF","Ofr":"\uD835\uDD12","ofr":"\uD835\uDD2C","ogon":"\u02DB","Ograve":"\u00D2","ograve":"\u00F2","ogt":"\u29C1","ohbar":"\u29B5","ohm":"\u03A9","oint":"\u222E","olarr":"\u21BA","olcir":"\u29BE","olcross":"\u29BB","oline":"\u203E","olt":"\u29C0","Omacr":"\u014C","omacr":"\u014D","Omega":"\u03A9","omega":"\u03C9","Omicron":"\u039F","omicron":"\u03BF","omid":"\u29B6","ominus":"\u2296","Oopf":"\uD835\uDD46","oopf":"\uD835\uDD60","opar":"\u29B7","OpenCurlyDoubleQuote":"\u201C","OpenCurlyQuote":"\u2018","operp":"\u29B9","oplus":"\u2295","orarr":"\u21BB","Or":"\u2A54","or":"\u2228","ord":"\u2A5D","order":"\u2134","orderof":"\u2134","ordf":"\u00AA","ordm":"\u00BA","origof":"\u22B6","oror":"\u2A56","orslope":"\u2A57","orv":"\u2A5B","oS":"\u24C8","Oscr":"\uD835\uDCAA","oscr":"\u2134","Oslash":"\u00D8","oslash":"\u00F8","osol":"\u2298","Otilde":"\u00D5","otilde":"\u00F5","otimesas":"\u2A36","Otimes":"\u2A37","otimes":"\u2297","Ouml":"\u00D6","ouml":"\u00F6","ovbar":"\u233D","OverBar":"\u203E","OverBrace":"\u23DE","OverBracket":"\u23B4","OverParenthesis":"\u23DC","para":"\u00B6","parallel":"\u2225","par":"\u2225","parsim":"\u2AF3","parsl":"\u2AFD","part":"\u2202","PartialD":"\u2202","Pcy":"\u041F","pcy":"\u043F","percnt":"%","period":".","permil":"\u2030","perp":"\u22A5","pertenk":"\u2031","Pfr":"\uD835\uDD13","pfr":"\uD835\uDD2D","Phi":"\u03A6","phi":"\u03C6","phiv":"\u03D5","phmmat":"\u2133","phone":"\u260E","Pi":"\u03A0","pi":"\u03C0","pitchfork":"\u22D4","piv":"\u03D6","planck":"\u210F","planckh":"\u210E","plankv":"\u210F","plusacir":"\u2A23","plusb":"\u229E","pluscir":"\u2A22","plus":"+","plusdo":"\u2214","plusdu":"\u2A25","pluse":"\u2A72","PlusMinus":"\u00B1","plusmn":"\u00B1","plussim":"\u2A26","plustwo":"\u2A27","pm":"\u00B1","Poincareplane":"\u210C","pointint":"\u2A15","popf":"\uD835\uDD61","Popf":"\u2119","pound":"\u00A3","prap":"\u2AB7","Pr":"\u2ABB","pr":"\u227A","prcue":"\u227C","precapprox":"\u2AB7","prec":"\u227A","preccurlyeq":"\u227C","Precedes":"\u227A","PrecedesEqual":"\u2AAF","PrecedesSlantEqual":"\u227C","PrecedesTilde":"\u227E","preceq":"\u2AAF","precnapprox":"\u2AB9","precneqq":"\u2AB5","precnsim":"\u22E8","pre":"\u2AAF","prE":"\u2AB3","precsim":"\u227E","prime":"\u2032","Prime":"\u2033","primes":"\u2119","prnap":"\u2AB9","prnE":"\u2AB5","prnsim":"\u22E8","prod":"\u220F","Product":"\u220F","profalar":"\u232E","profline":"\u2312","profsurf":"\u2313","prop":"\u221D","Proportional":"\u221D","Proportion":"\u2237","propto":"\u221D","prsim":"\u227E","prurel":"\u22B0","Pscr":"\uD835\uDCAB","pscr":"\uD835\uDCC5","Psi":"\u03A8","psi":"\u03C8","puncsp":"\u2008","Qfr":"\uD835\uDD14","qfr":"\uD835\uDD2E","qint":"\u2A0C","qopf":"\uD835\uDD62","Qopf":"\u211A","qprime":"\u2057","Qscr":"\uD835\uDCAC","qscr":"\uD835\uDCC6","quaternions":"\u210D","quatint":"\u2A16","quest":"?","questeq":"\u225F","quot":"\"","QUOT":"\"","rAarr":"\u21DB","race":"\u223D\u0331","Racute":"\u0154","racute":"\u0155","radic":"\u221A","raemptyv":"\u29B3","rang":"\u27E9","Rang":"\u27EB","rangd":"\u2992","range":"\u29A5","rangle":"\u27E9","raquo":"\u00BB","rarrap":"\u2975","rarrb":"\u21E5","rarrbfs":"\u2920","rarrc":"\u2933","rarr":"\u2192","Rarr":"\u21A0","rArr":"\u21D2","rarrfs":"\u291E","rarrhk":"\u21AA","rarrlp":"\u21AC","rarrpl":"\u2945","rarrsim":"\u2974","Rarrtl":"\u2916","rarrtl":"\u21A3","rarrw":"\u219D","ratail":"\u291A","rAtail":"\u291C","ratio":"\u2236","rationals":"\u211A","rbarr":"\u290D","rBarr":"\u290F","RBarr":"\u2910","rbbrk":"\u2773","rbrace":"}","rbrack":"]","rbrke":"\u298C","rbrksld":"\u298E","rbrkslu":"\u2990","Rcaron":"\u0158","rcaron":"\u0159","Rcedil":"\u0156","rcedil":"\u0157","rceil":"\u2309","rcub":"}","Rcy":"\u0420","rcy":"\u0440","rdca":"\u2937","rdldhar":"\u2969","rdquo":"\u201D","rdquor":"\u201D","rdsh":"\u21B3","real":"\u211C","realine":"\u211B","realpart":"\u211C","reals":"\u211D","Re":"\u211C","rect":"\u25AD","reg":"\u00AE","REG":"\u00AE","ReverseElement":"\u220B","ReverseEquilibrium":"\u21CB","ReverseUpEquilibrium":"\u296F","rfisht":"\u297D","rfloor":"\u230B","rfr":"\uD835\uDD2F","Rfr":"\u211C","rHar":"\u2964","rhard":"\u21C1","rharu":"\u21C0","rharul":"\u296C","Rho":"\u03A1","rho":"\u03C1","rhov":"\u03F1","RightAngleBracket":"\u27E9","RightArrowBar":"\u21E5","rightarrow":"\u2192","RightArrow":"\u2192","Rightarrow":"\u21D2","RightArrowLeftArrow":"\u21C4","rightarrowtail":"\u21A3","RightCeiling":"\u2309","RightDoubleBracket":"\u27E7","RightDownTeeVector":"\u295D","RightDownVectorBar":"\u2955","RightDownVector":"\u21C2","RightFloor":"\u230B","rightharpoondown":"\u21C1","rightharpoonup":"\u21C0","rightleftarrows":"\u21C4","rightleftharpoons":"\u21CC","rightrightarrows":"\u21C9","rightsquigarrow":"\u219D","RightTeeArrow":"\u21A6","RightTee":"\u22A2","RightTeeVector":"\u295B","rightthreetimes":"\u22CC","RightTriangleBar":"\u29D0","RightTriangle":"\u22B3","RightTriangleEqual":"\u22B5","RightUpDownVector":"\u294F","RightUpTeeVector":"\u295C","RightUpVectorBar":"\u2954","RightUpVector":"\u21BE","RightVectorBar":"\u2953","RightVector":"\u21C0","ring":"\u02DA","risingdotseq":"\u2253","rlarr":"\u21C4","rlhar":"\u21CC","rlm":"\u200F","rmoustache":"\u23B1","rmoust":"\u23B1","rnmid":"\u2AEE","roang":"\u27ED","roarr":"\u21FE","robrk":"\u27E7","ropar":"\u2986","ropf":"\uD835\uDD63","Ropf":"\u211D","roplus":"\u2A2E","rotimes":"\u2A35","RoundImplies":"\u2970","rpar":")","rpargt":"\u2994","rppolint":"\u2A12","rrarr":"\u21C9","Rrightarrow":"\u21DB","rsaquo":"\u203A","rscr":"\uD835\uDCC7","Rscr":"\u211B","rsh":"\u21B1","Rsh":"\u21B1","rsqb":"]","rsquo":"\u2019","rsquor":"\u2019","rthree":"\u22CC","rtimes":"\u22CA","rtri":"\u25B9","rtrie":"\u22B5","rtrif":"\u25B8","rtriltri":"\u29CE","RuleDelayed":"\u29F4","ruluhar":"\u2968","rx":"\u211E","Sacute":"\u015A","sacute":"\u015B","sbquo":"\u201A","scap":"\u2AB8","Scaron":"\u0160","scaron":"\u0161","Sc":"\u2ABC","sc":"\u227B","sccue":"\u227D","sce":"\u2AB0","scE":"\u2AB4","Scedil":"\u015E","scedil":"\u015F","Scirc":"\u015C","scirc":"\u015D","scnap":"\u2ABA","scnE":"\u2AB6","scnsim":"\u22E9","scpolint":"\u2A13","scsim":"\u227F","Scy":"\u0421","scy":"\u0441","sdotb":"\u22A1","sdot":"\u22C5","sdote":"\u2A66","searhk":"\u2925","searr":"\u2198","seArr":"\u21D8","searrow":"\u2198","sect":"\u00A7","semi":";","seswar":"\u2929","setminus":"\u2216","setmn":"\u2216","sext":"\u2736","Sfr":"\uD835\uDD16","sfr":"\uD835\uDD30","sfrown":"\u2322","sharp":"\u266F","SHCHcy":"\u0429","shchcy":"\u0449","SHcy":"\u0428","shcy":"\u0448","ShortDownArrow":"\u2193","ShortLeftArrow":"\u2190","shortmid":"\u2223","shortparallel":"\u2225","ShortRightArrow":"\u2192","ShortUpArrow":"\u2191","shy":"\u00AD","Sigma":"\u03A3","sigma":"\u03C3","sigmaf":"\u03C2","sigmav":"\u03C2","sim":"\u223C","simdot":"\u2A6A","sime":"\u2243","simeq":"\u2243","simg":"\u2A9E","simgE":"\u2AA0","siml":"\u2A9D","simlE":"\u2A9F","simne":"\u2246","simplus":"\u2A24","simrarr":"\u2972","slarr":"\u2190","SmallCircle":"\u2218","smallsetminus":"\u2216","smashp":"\u2A33","smeparsl":"\u29E4","smid":"\u2223","smile":"\u2323","smt":"\u2AAA","smte":"\u2AAC","smtes":"\u2AAC\uFE00","SOFTcy":"\u042C","softcy":"\u044C","solbar":"\u233F","solb":"\u29C4","sol":"/","Sopf":"\uD835\uDD4A","sopf":"\uD835\uDD64","spades":"\u2660","spadesuit":"\u2660","spar":"\u2225","sqcap":"\u2293","sqcaps":"\u2293\uFE00","sqcup":"\u2294","sqcups":"\u2294\uFE00","Sqrt":"\u221A","sqsub":"\u228F","sqsube":"\u2291","sqsubset":"\u228F","sqsubseteq":"\u2291","sqsup":"\u2290","sqsupe":"\u2292","sqsupset":"\u2290","sqsupseteq":"\u2292","square":"\u25A1","Square":"\u25A1","SquareIntersection":"\u2293","SquareSubset":"\u228F","SquareSubsetEqual":"\u2291","SquareSuperset":"\u2290","SquareSupersetEqual":"\u2292","SquareUnion":"\u2294","squarf":"\u25AA","squ":"\u25A1","squf":"\u25AA","srarr":"\u2192","Sscr":"\uD835\uDCAE","sscr":"\uD835\uDCC8","ssetmn":"\u2216","ssmile":"\u2323","sstarf":"\u22C6","Star":"\u22C6","star":"\u2606","starf":"\u2605","straightepsilon":"\u03F5","straightphi":"\u03D5","strns":"\u00AF","sub":"\u2282","Sub":"\u22D0","subdot":"\u2ABD","subE":"\u2AC5","sube":"\u2286","subedot":"\u2AC3","submult":"\u2AC1","subnE":"\u2ACB","subne":"\u228A","subplus":"\u2ABF","subrarr":"\u2979","subset":"\u2282","Subset":"\u22D0","subseteq":"\u2286","subseteqq":"\u2AC5","SubsetEqual":"\u2286","subsetneq":"\u228A","subsetneqq":"\u2ACB","subsim":"\u2AC7","subsub":"\u2AD5","subsup":"\u2AD3","succapprox":"\u2AB8","succ":"\u227B","succcurlyeq":"\u227D","Succeeds":"\u227B","SucceedsEqual":"\u2AB0","SucceedsSlantEqual":"\u227D","SucceedsTilde":"\u227F","succeq":"\u2AB0","succnapprox":"\u2ABA","succneqq":"\u2AB6","succnsim":"\u22E9","succsim":"\u227F","SuchThat":"\u220B","sum":"\u2211","Sum":"\u2211","sung":"\u266A","sup1":"\u00B9","sup2":"\u00B2","sup3":"\u00B3","sup":"\u2283","Sup":"\u22D1","supdot":"\u2ABE","supdsub":"\u2AD8","supE":"\u2AC6","supe":"\u2287","supedot":"\u2AC4","Superset":"\u2283","SupersetEqual":"\u2287","suphsol":"\u27C9","suphsub":"\u2AD7","suplarr":"\u297B","supmult":"\u2AC2","supnE":"\u2ACC","supne":"\u228B","supplus":"\u2AC0","supset":"\u2283","Supset":"\u22D1","supseteq":"\u2287","supseteqq":"\u2AC6","supsetneq":"\u228B","supsetneqq":"\u2ACC","supsim":"\u2AC8","supsub":"\u2AD4","supsup":"\u2AD6","swarhk":"\u2926","swarr":"\u2199","swArr":"\u21D9","swarrow":"\u2199","swnwar":"\u292A","szlig":"\u00DF","Tab":"\t","target":"\u2316","Tau":"\u03A4","tau":"\u03C4","tbrk":"\u23B4","Tcaron":"\u0164","tcaron":"\u0165","Tcedil":"\u0162","tcedil":"\u0163","Tcy":"\u0422","tcy":"\u0442","tdot":"\u20DB","telrec":"\u2315","Tfr":"\uD835\uDD17","tfr":"\uD835\uDD31","there4":"\u2234","therefore":"\u2234","Therefore":"\u2234","Theta":"\u0398","theta":"\u03B8","thetasym":"\u03D1","thetav":"\u03D1","thickapprox":"\u2248","thicksim":"\u223C","ThickSpace":"\u205F\u200A","ThinSpace":"\u2009","thinsp":"\u2009","thkap":"\u2248","thksim":"\u223C","THORN":"\u00DE","thorn":"\u00FE","tilde":"\u02DC","Tilde":"\u223C","TildeEqual":"\u2243","TildeFullEqual":"\u2245","TildeTilde":"\u2248","timesbar":"\u2A31","timesb":"\u22A0","times":"\u00D7","timesd":"\u2A30","tint":"\u222D","toea":"\u2928","topbot":"\u2336","topcir":"\u2AF1","top":"\u22A4","Topf":"\uD835\uDD4B","topf":"\uD835\uDD65","topfork":"\u2ADA","tosa":"\u2929","tprime":"\u2034","trade":"\u2122","TRADE":"\u2122","triangle":"\u25B5","triangledown":"\u25BF","triangleleft":"\u25C3","trianglelefteq":"\u22B4","triangleq":"\u225C","triangleright":"\u25B9","trianglerighteq":"\u22B5","tridot":"\u25EC","trie":"\u225C","triminus":"\u2A3A","TripleDot":"\u20DB","triplus":"\u2A39","trisb":"\u29CD","tritime":"\u2A3B","trpezium":"\u23E2","Tscr":"\uD835\uDCAF","tscr":"\uD835\uDCC9","TScy":"\u0426","tscy":"\u0446","TSHcy":"\u040B","tshcy":"\u045B","Tstrok":"\u0166","tstrok":"\u0167","twixt":"\u226C","twoheadleftarrow":"\u219E","twoheadrightarrow":"\u21A0","Uacute":"\u00DA","uacute":"\u00FA","uarr":"\u2191","Uarr":"\u219F","uArr":"\u21D1","Uarrocir":"\u2949","Ubrcy":"\u040E","ubrcy":"\u045E","Ubreve":"\u016C","ubreve":"\u016D","Ucirc":"\u00DB","ucirc":"\u00FB","Ucy":"\u0423","ucy":"\u0443","udarr":"\u21C5","Udblac":"\u0170","udblac":"\u0171","udhar":"\u296E","ufisht":"\u297E","Ufr":"\uD835\uDD18","ufr":"\uD835\uDD32","Ugrave":"\u00D9","ugrave":"\u00F9","uHar":"\u2963","uharl":"\u21BF","uharr":"\u21BE","uhblk":"\u2580","ulcorn":"\u231C","ulcorner":"\u231C","ulcrop":"\u230F","ultri":"\u25F8","Umacr":"\u016A","umacr":"\u016B","uml":"\u00A8","UnderBar":"_","UnderBrace":"\u23DF","UnderBracket":"\u23B5","UnderParenthesis":"\u23DD","Union":"\u22C3","UnionPlus":"\u228E","Uogon":"\u0172","uogon":"\u0173","Uopf":"\uD835\uDD4C","uopf":"\uD835\uDD66","UpArrowBar":"\u2912","uparrow":"\u2191","UpArrow":"\u2191","Uparrow":"\u21D1","UpArrowDownArrow":"\u21C5","updownarrow":"\u2195","UpDownArrow":"\u2195","Updownarrow":"\u21D5","UpEquilibrium":"\u296E","upharpoonleft":"\u21BF","upharpoonright":"\u21BE","uplus":"\u228E","UpperLeftArrow":"\u2196","UpperRightArrow":"\u2197","upsi":"\u03C5","Upsi":"\u03D2","upsih":"\u03D2","Upsilon":"\u03A5","upsilon":"\u03C5","UpTeeArrow":"\u21A5","UpTee":"\u22A5","upuparrows":"\u21C8","urcorn":"\u231D","urcorner":"\u231D","urcrop":"\u230E","Uring":"\u016E","uring":"\u016F","urtri":"\u25F9","Uscr":"\uD835\uDCB0","uscr":"\uD835\uDCCA","utdot":"\u22F0","Utilde":"\u0168","utilde":"\u0169","utri":"\u25B5","utrif":"\u25B4","uuarr":"\u21C8","Uuml":"\u00DC","uuml":"\u00FC","uwangle":"\u29A7","vangrt":"\u299C","varepsilon":"\u03F5","varkappa":"\u03F0","varnothing":"\u2205","varphi":"\u03D5","varpi":"\u03D6","varpropto":"\u221D","varr":"\u2195","vArr":"\u21D5","varrho":"\u03F1","varsigma":"\u03C2","varsubsetneq":"\u228A\uFE00","varsubsetneqq":"\u2ACB\uFE00","varsupsetneq":"\u228B\uFE00","varsupsetneqq":"\u2ACC\uFE00","vartheta":"\u03D1","vartriangleleft":"\u22B2","vartriangleright":"\u22B3","vBar":"\u2AE8","Vbar":"\u2AEB","vBarv":"\u2AE9","Vcy":"\u0412","vcy":"\u0432","vdash":"\u22A2","vDash":"\u22A8","Vdash":"\u22A9","VDash":"\u22AB","Vdashl":"\u2AE6","veebar":"\u22BB","vee":"\u2228","Vee":"\u22C1","veeeq":"\u225A","vellip":"\u22EE","verbar":"|","Verbar":"\u2016","vert":"|","Vert":"\u2016","VerticalBar":"\u2223","VerticalLine":"|","VerticalSeparator":"\u2758","VerticalTilde":"\u2240","VeryThinSpace":"\u200A","Vfr":"\uD835\uDD19","vfr":"\uD835\uDD33","vltri":"\u22B2","vnsub":"\u2282\u20D2","vnsup":"\u2283\u20D2","Vopf":"\uD835\uDD4D","vopf":"\uD835\uDD67","vprop":"\u221D","vrtri":"\u22B3","Vscr":"\uD835\uDCB1","vscr":"\uD835\uDCCB","vsubnE":"\u2ACB\uFE00","vsubne":"\u228A\uFE00","vsupnE":"\u2ACC\uFE00","vsupne":"\u228B\uFE00","Vvdash":"\u22AA","vzigzag":"\u299A","Wcirc":"\u0174","wcirc":"\u0175","wedbar":"\u2A5F","wedge":"\u2227","Wedge":"\u22C0","wedgeq":"\u2259","weierp":"\u2118","Wfr":"\uD835\uDD1A","wfr":"\uD835\uDD34","Wopf":"\uD835\uDD4E","wopf":"\uD835\uDD68","wp":"\u2118","wr":"\u2240","wreath":"\u2240","Wscr":"\uD835\uDCB2","wscr":"\uD835\uDCCC","xcap":"\u22C2","xcirc":"\u25EF","xcup":"\u22C3","xdtri":"\u25BD","Xfr":"\uD835\uDD1B","xfr":"\uD835\uDD35","xharr":"\u27F7","xhArr":"\u27FA","Xi":"\u039E","xi":"\u03BE","xlarr":"\u27F5","xlArr":"\u27F8","xmap":"\u27FC","xnis":"\u22FB","xodot":"\u2A00","Xopf":"\uD835\uDD4F","xopf":"\uD835\uDD69","xoplus":"\u2A01","xotime":"\u2A02","xrarr":"\u27F6","xrArr":"\u27F9","Xscr":"\uD835\uDCB3","xscr":"\uD835\uDCCD","xsqcup":"\u2A06","xuplus":"\u2A04","xutri":"\u25B3","xvee":"\u22C1","xwedge":"\u22C0","Yacute":"\u00DD","yacute":"\u00FD","YAcy":"\u042F","yacy":"\u044F","Ycirc":"\u0176","ycirc":"\u0177","Ycy":"\u042B","ycy":"\u044B","yen":"\u00A5","Yfr":"\uD835\uDD1C","yfr":"\uD835\uDD36","YIcy":"\u0407","yicy":"\u0457","Yopf":"\uD835\uDD50","yopf":"\uD835\uDD6A","Yscr":"\uD835\uDCB4","yscr":"\uD835\uDCCE","YUcy":"\u042E","yucy":"\u044E","yuml":"\u00FF","Yuml":"\u0178","Zacute":"\u0179","zacute":"\u017A","Zcaron":"\u017D","zcaron":"\u017E","Zcy":"\u0417","zcy":"\u0437","Zdot":"\u017B","zdot":"\u017C","zeetrf":"\u2128","ZeroWidthSpace":"\u200B","Zeta":"\u0396","zeta":"\u03B6","zfr":"\uD835\uDD37","Zfr":"\u2128","ZHcy":"\u0416","zhcy":"\u0436","zigrarr":"\u21DD","zopf":"\uD835\uDD6B","Zopf":"\u2124","Zscr":"\uD835\uDCB5","zscr":"\uD835\uDCCF","zwj":"\u200D","zwnj":"\u200C"};
  };

  this.node_modules$entities$maps$legacy_json_ = function(module, exports, global) {
    module.exports = {"Aacute":"\u00C1","aacute":"\u00E1","Acirc":"\u00C2","acirc":"\u00E2","acute":"\u00B4","AElig":"\u00C6","aelig":"\u00E6","Agrave":"\u00C0","agrave":"\u00E0","amp":"&","AMP":"&","Aring":"\u00C5","aring":"\u00E5","Atilde":"\u00C3","atilde":"\u00E3","Auml":"\u00C4","auml":"\u00E4","brvbar":"\u00A6","Ccedil":"\u00C7","ccedil":"\u00E7","cedil":"\u00B8","cent":"\u00A2","copy":"\u00A9","COPY":"\u00A9","curren":"\u00A4","deg":"\u00B0","divide":"\u00F7","Eacute":"\u00C9","eacute":"\u00E9","Ecirc":"\u00CA","ecirc":"\u00EA","Egrave":"\u00C8","egrave":"\u00E8","ETH":"\u00D0","eth":"\u00F0","Euml":"\u00CB","euml":"\u00EB","frac12":"\u00BD","frac14":"\u00BC","frac34":"\u00BE","gt":">","GT":">","Iacute":"\u00CD","iacute":"\u00ED","Icirc":"\u00CE","icirc":"\u00EE","iexcl":"\u00A1","Igrave":"\u00CC","igrave":"\u00EC","iquest":"\u00BF","Iuml":"\u00CF","iuml":"\u00EF","laquo":"\u00AB","lt":"<","LT":"<","macr":"\u00AF","micro":"\u00B5","middot":"\u00B7","nbsp":"\u00A0","not":"\u00AC","Ntilde":"\u00D1","ntilde":"\u00F1","Oacute":"\u00D3","oacute":"\u00F3","Ocirc":"\u00D4","ocirc":"\u00F4","Ograve":"\u00D2","ograve":"\u00F2","ordf":"\u00AA","ordm":"\u00BA","Oslash":"\u00D8","oslash":"\u00F8","Otilde":"\u00D5","otilde":"\u00F5","Ouml":"\u00D6","ouml":"\u00F6","para":"\u00B6","plusmn":"\u00B1","pound":"\u00A3","quot":"\"","QUOT":"\"","raquo":"\u00BB","reg":"\u00AE","REG":"\u00AE","sect":"\u00A7","shy":"\u00AD","sup1":"\u00B9","sup2":"\u00B2","sup3":"\u00B3","szlig":"\u00DF","THORN":"\u00DE","thorn":"\u00FE","times":"\u00D7","Uacute":"\u00DA","uacute":"\u00FA","Ucirc":"\u00DB","ucirc":"\u00FB","Ugrave":"\u00D9","ugrave":"\u00F9","uml":"\u00A8","Uuml":"\u00DC","uuml":"\u00FC","Yacute":"\u00DD","yacute":"\u00FD","yen":"\u00A5","yuml":"\u00FF"};
  };

  this.node_modules$entities$maps$xml_json_ = function(module, exports, global) {
    module.exports = {"amp":"&","apos":"'","gt":">","lt":"<","quot":"\""}
    ;
  };

  this.lib$FeedHandler_ = function(module, exports, global) {
    var index = require("./index.js"),
        DomHandler = index.DomHandler,
    	DomUtils = index.DomUtils;
    
    //TODO: make this a streamable handler
    function FeedHandler(callback, options){
    	this.init(callback, options);
    }
    
    require("util").inherits(FeedHandler, DomHandler);
    
    FeedHandler.prototype.init = DomHandler;
    
    function getElements(what, where){
    	return DomUtils.getElementsByTagName(what, where, true);
    }
    function getOneElement(what, where){
    	return DomUtils.getElementsByTagName(what, where, true, 1)[0];
    }
    function fetch(what, where, recurse){
    	return DomUtils.getText(
    		DomUtils.getElementsByTagName(what, where, recurse, 1)
    	).trim();
    }
    
    function addConditionally(obj, prop, what, where, recurse){
    	var tmp = fetch(what, where, recurse);
    	if(tmp) obj[prop] = tmp;
    }
    
    var isValidFeed = function(value){
    	return value === "rss" || value === "feed" || value === "rdf:RDF";
    };
    
    FeedHandler.prototype.onend = function(){
    	var feed = {},
    		feedRoot = getOneElement(isValidFeed, this.dom),
    		tmp, childs;
    
    	if(feedRoot){
    		if(feedRoot.name === "feed"){
    			childs = feedRoot.children;
    
    			feed.type = "atom";
    			addConditionally(feed, "id", "id", childs);
    			addConditionally(feed, "title", "title", childs);
    			if((tmp = getOneElement("link", childs)) && (tmp = tmp.attribs) && (tmp = tmp.href)) feed.link = tmp;
    			addConditionally(feed, "description", "subtitle", childs);
    			if((tmp = fetch("updated", childs))) feed.updated = new Date(tmp);
    			addConditionally(feed, "author", "email", childs, true);
    
    			feed.items = getElements("entry", childs).map(function(item){
    				var entry = {}, tmp;
    
    				item = item.children;
    
    				addConditionally(entry, "id", "id", item);
    				addConditionally(entry, "title", "title", item);
    				if((tmp = getOneElement("link", item)) && (tmp = tmp.attribs) && (tmp = tmp.href)) entry.link = tmp;
    				if((tmp = fetch("summary", item) || fetch("content", item))) entry.description = tmp;
    				if((tmp = fetch("updated", item))) entry.pubDate = new Date(tmp);
    				return entry;
    			});
    		} else {
    			childs = getOneElement("channel", feedRoot.children).children;
    
    			feed.type = feedRoot.name.substr(0, 3);
    			feed.id = "";
    			addConditionally(feed, "title", "title", childs);
    			addConditionally(feed, "link", "link", childs);
    			addConditionally(feed, "description", "description", childs);
    			if((tmp = fetch("lastBuildDate", childs))) feed.updated = new Date(tmp);
    			addConditionally(feed, "author", "managingEditor", childs, true);
    
    			feed.items = getElements("item", feedRoot.children).map(function(item){
    				var entry = {}, tmp;
    
    				item = item.children;
    
    				addConditionally(entry, "id", "guid", item);
    				addConditionally(entry, "title", "title", item);
    				addConditionally(entry, "link", "link", item);
    				addConditionally(entry, "description", "description", item);
    				if((tmp = fetch("pubDate", item))) entry.pubDate = new Date(tmp);
    				return entry;
    			});
    		}
    	}
    	this.dom = feed;
    	DomHandler.prototype._handleCallback.call(
    		this, feedRoot ? null : Error("couldn't find root of feed")
    	);
    };
    
    module.exports = FeedHandler;
    
  };

  this.lib$Stream_ = function(module, exports, global) {
    module.exports = Stream;
    
    var Parser = require("./WritableStream.js");
    
    function Stream(options){
    	Parser.call(this, new Cbs(this), options);
    }
    
    require("util").inherits(Stream, Parser);
    
    Stream.prototype.readable = true;
    
    function Cbs(scope){
    	this.scope = scope;
    }
    
    var EVENTS = require("../").EVENTS;
    
    Object.keys(EVENTS).forEach(function(name){
    	if(EVENTS[name] === 0){
    		Cbs.prototype["on" + name] = function(){
    			this.scope.emit(name);
    		};
    	} else if(EVENTS[name] === 1){
    		Cbs.prototype["on" + name] = function(a){
    			this.scope.emit(name, a);
    		};
    	} else if(EVENTS[name] === 2){
    		Cbs.prototype["on" + name] = function(a, b){
    			this.scope.emit(name, a, b);
    		};
    	} else {
    		throw Error("wrong number of arguments!");
    	}
    });
  };

  this.lib$WritableStream_ = function(module, exports, global) {
    module.exports = Stream;
    
    var Parser = require("./Parser.js"),
        WritableStream = require("stream").Writable || require("readable-stream").Writable;
    
    function Stream(cbs, options){
    	var parser = this._parser = new Parser(cbs, options);
    
    	WritableStream.call(this, {decodeStrings: false});
    
    	this.once("finish", function(){
    		parser.end();
    	});
    }
    
    require("util").inherits(Stream, WritableStream);
    
    WritableStream.prototype._write = function(chunk, encoding, cb){
    	this._parser.write(chunk);
    	cb();
    };
  };

  this.lib$ProxyHandler_ = function(module, exports, global) {
    module.exports = ProxyHandler;
    
    function ProxyHandler(cbs){
    	this._cbs = cbs || {};
    }
    
    var EVENTS = require("./").EVENTS;
    Object.keys(EVENTS).forEach(function(name){
    	if(EVENTS[name] === 0){
    		name = "on" + name;
    		ProxyHandler.prototype[name] = function(){
    			if(this._cbs[name]) this._cbs[name]();
    		};
    	} else if(EVENTS[name] === 1){
    		name = "on" + name;
    		ProxyHandler.prototype[name] = function(a){
    			if(this._cbs[name]) this._cbs[name](a);
    		};
    	} else if(EVENTS[name] === 2){
    		name = "on" + name;
    		ProxyHandler.prototype[name] = function(a, b){
    			if(this._cbs[name]) this._cbs[name](a, b);
    		};
    	} else {
    		throw Error("wrong number of arguments");
    	}
    });
  };

  this.lib$CollectingHandler_ = function(module, exports, global) {
    module.exports = CollectingHandler;
    
    function CollectingHandler(cbs){
    	this._cbs = cbs || {};
    	this.events = [];
    }
    
    var EVENTS = require("./").EVENTS;
    Object.keys(EVENTS).forEach(function(name){
    	if(EVENTS[name] === 0){
    		name = "on" + name;
    		CollectingHandler.prototype[name] = function(){
    			this.events.push([name]);
    			if(this._cbs[name]) this._cbs[name]();
    		};
    	} else if(EVENTS[name] === 1){
    		name = "on" + name;
    		CollectingHandler.prototype[name] = function(a){
    			this.events.push([name, a]);
    			if(this._cbs[name]) this._cbs[name](a);
    		};
    	} else if(EVENTS[name] === 2){
    		name = "on" + name;
    		CollectingHandler.prototype[name] = function(a, b){
    			this.events.push([name, a, b]);
    			if(this._cbs[name]) this._cbs[name](a, b);
    		};
    	} else {
    		throw Error("wrong number of arguments");
    	}
    });
    
    CollectingHandler.prototype.onreset = function(){
    	this.events = [];
    	if(this._cbs.onreset) this._cbs.onreset();
    };
    
    CollectingHandler.prototype.restart = function(){
    	if(this._cbs.onreset) this._cbs.onreset();
    
    	for(var i = 0, len = this.events.length; i < len; i++){
    		if(this._cbs[this.events[i][0]]){
    
    			var num = this.events[i].length;
    
    			if(num === 1){
    				this._cbs[this.events[i][0]]();
    			} else if(num === 2){
    				this._cbs[this.events[i][0]](this.events[i][1]);
    			} else {
    				this._cbs[this.events[i][0]](this.events[i][1], this.events[i][2]);
    			}
    		}
    	}
    };
    
  };

  return this.lib$index_(module, exports, global);
};
