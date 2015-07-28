function dom_serializer_(module, exports, global) {
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
  "name": "dom-serializer",
  "version": "0.1.0",
  "description": "render dom nodes to string",
  "author": {
    "name": "Felix Boehm",
    "email": "me@feedic.com"
  },
  "keywords": [
    "html",
    "xml",
    "render"
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/cheeriojs/dom-renderer.git"
  },
  "main": "./index.js",
  "files": [
    "index.js"
  ],
  "dependencies": {
    "domelementtype": "~1.1.1",
    "entities": "~1.1.1"
  },
  "devDependencies": {
    "cheerio": "*",
    "expect.js": "~0.3.1",
    "jshint": "~2.3.0",
    "lodash": "~2.4.1",
    "mocha": "*",
    "xyz": "0.4.x"
  },
  "scripts": {
    "test": "mocha test.js"
  },
  "license": "MIT",
  "gitHead": "249b9a921e6ba318c52b87de21e8475bcb4050e5",
  "bugs": {
    "url": "https://github.com/cheeriojs/dom-renderer/issues"
  },
  "homepage": "https://github.com/cheeriojs/dom-renderer",
  "_id": "dom-serializer@0.1.0",
  "_shasum": "073c697546ce0780ce23be4a28e293e40bc30c82",
  "_from": "dom-serializer@>=0.1.0 <0.2.0",
  "_npmVersion": "2.4.1",
  "_nodeVersion": "1.2.0",
  "_npmUser": {
    "name": "feedic",
    "email": "me@feedic.com"
  },
  "maintainers": [
    {
      "name": "feedic",
      "email": "me@feedic.com"
    },
    {
      "name": "davidchambers",
      "email": "dc@davidchambers.me"
    },
    {
      "name": "mattmueller",
      "email": "mattmuelle@gmail.com"
    }
  ],
  "dist": {
    "shasum": "073c697546ce0780ce23be4a28e293e40bc30c82",
    "tarball": "http://registry.npmjs.org/dom-serializer/-/dom-serializer-0.1.0.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-0.1.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    /*
      Module dependencies
    */
    var ElementType = require('domelementtype');
    var entities = require('entities');
    
    /*
      Boolean Attributes
    */
    var booleanAttributes = {
      __proto__: null,
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      hidden: true,
      ismap: true,
      loop: true,
      multiple: true,
      muted: true,
      open: true,
      readonly: true,
      required: true,
      reversed: true,
      scoped: true,
      seamless: true,
      selected: true,
      typemustmatch: true
    };
    
    var unencodedElements = {
      __proto__: null,
      style: true,
      script: true,
      xmp: true,
      iframe: true,
      noembed: true,
      noframes: true,
      plaintext: true,
      noscript: true
    };
    
    /*
      Format attributes
    */
    function formatAttrs(attributes, opts) {
      if (!attributes) return;
    
      var output = '',
          value;
    
      // Loop through the attributes
      for (var key in attributes) {
        value = attributes[key];
        if (output) {
          output += ' ';
        }
    
        if (!value && booleanAttributes[key]) {
          output += key;
        } else {
          output += key + '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
        }
      }
    
      return output;
    }
    
    /*
      Self-enclosing tags (stolen from node-htmlparser)
    */
    var singleTag = {
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
    };
    
    
    var render = module.exports = function(dom, opts) {
      if (!Array.isArray(dom) && !dom.cheerio) dom = [dom];
      opts = opts || {};
    
      var output = '';
    
      for(var i = 0; i < dom.length; i++){
        var elem = dom[i];
    
        if (elem.type === 'root')
          output += render(elem.children, opts);
        else if (ElementType.isTag(elem))
          output += renderTag(elem, opts);
        else if (elem.type === ElementType.Directive)
          output += renderDirective(elem);
        else if (elem.type === ElementType.Comment)
          output += renderComment(elem);
        else if (elem.type === ElementType.CDATA)
          output += renderCdata(elem);
        else
          output += renderText(elem, opts);
      }
    
      return output;
    };
    
    function renderTag(elem, opts) {
      // Handle SVG
      if (elem.name === "svg") opts = {decodeEntities: opts.decodeEntities, xmlMode: true};
    
      var tag = '<' + elem.name,
          attribs = formatAttrs(elem.attribs, opts);
    
      if (attribs) {
        tag += ' ' + attribs;
      }
    
      if (
        opts.xmlMode
        && (!elem.children || elem.children.length === 0)
      ) {
        tag += '/>';
      } else {
        tag += '>';
        if (elem.children) {
          tag += render(elem.children, opts);
        }
    
        if (!singleTag[elem.name] || opts.xmlMode) {
          tag += '</' + elem.name + '>';
        }
      }
    
      return tag;
    }
    
    function renderDirective(elem) {
      return '<' + elem.data + '>';
    }
    
    function renderText(elem, opts) {
      var data = elem.data || '';
    
      // if entities weren't decoded, no need to encode them back
      if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
        data = entities.encodeXML(data);
      }
    
      return data;
    }
    
    function renderCdata(elem) {
      return '<![CDATA[' + elem.children[0].data + ']]>';
    }
    
    function renderComment(elem) {
      return '<!--' + elem.data + '-->';
    }
    
  };

  return this.index_(module, exports, global);
};
