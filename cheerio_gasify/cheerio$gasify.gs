function cheerio_(module, exports, global) {
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
  "name": "cheerio",
  "version": "0.19.0",
  "description": "Tiny, fast, and elegant implementation of core jQuery designed specifically for the server",
  "author": {
    "name": "Matt Mueller",
    "email": "mattmuelle@gmail.com",
    "url": "mat.io"
  },
  "license": "MIT",
  "keywords": [
    "htmlparser",
    "jquery",
    "selector",
    "scraper",
    "parser",
    "html"
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/cheeriojs/cheerio.git"
  },
  "main": "./index.js",
  "engines": {
    "node": ">= 0.6"
  },
  "dependencies": {
    "css-select": "~1.0.0",
    "entities": "~1.1.1",
    "htmlparser2": "~3.8.1",
    "dom-serializer": "~0.1.0",
    "lodash": "^3.2.0"
  },
  "devDependencies": {
    "benchmark": "~1.0.0",
    "coveralls": "~2.10",
    "expect.js": "~0.3.1",
    "istanbul": "~0.2",
    "jsdom": "~0.8.9",
    "jshint": "~2.5.1",
    "mocha": "*",
    "xyz": "~0.5.0"
  },
  "scripts": {
    "test": "make test"
  },
  "gitHead": "9e3746d391c47a09ad5b130d770c747a0d673869",
  "bugs": {
    "url": "https://github.com/cheeriojs/cheerio/issues"
  },
  "homepage": "https://github.com/cheeriojs/cheerio",
  "_id": "cheerio@0.19.0",
  "_shasum": "772e7015f2ee29965096d71ea4175b75ab354925",
  "_from": "cheerio@*",
  "_npmVersion": "2.7.1",
  "_nodeVersion": "1.5.1",
  "_npmUser": {
    "name": "feedic",
    "email": "me@feedic.com"
  },
  "maintainers": [
    {
      "name": "mattmueller",
      "email": "mattmuelle@gmail.com"
    },
    {
      "name": "davidchambers",
      "email": "dc@davidchambers.me"
    },
    {
      "name": "jugglinmike",
      "email": "mike@mikepennisi.com"
    },
    {
      "name": "feedic",
      "email": "me@feedic.com"
    }
  ],
  "dist": {
    "shasum": "772e7015f2ee29965096d71ea4175b75ab354925",
    "tarball": "http://registry.npmjs.org/cheerio/-/cheerio-0.19.0.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/cheerio/-/cheerio-0.19.0.tgz",
  "readme": "ERROR: No README data found!"
}
;
  };

  this.index_ = function(module, exports, global) {
    /**
     * Export cheerio (with )
     */
    
    exports = module.exports = require('./lib/cheerio');
    
    /*
      Export the version
    */
    
    exports.version = require('./package').version;
    
  };

  this.lib$cheerio_ = function(module, exports, global) {
    /*
      Module dependencies
    */
    
    var parse = require('./parse'),
        _ = require('lodash');
    
    /*
     * The API
     */
    
    var api = [
      require('./api/attributes'),
      require('./api/traversing'),
      require('./api/manipulation'),
      require('./api/css'),
      require('./api/forms')
    ];
    
    /*
     * A simple way to check for HTML strings or ID strings
     */
    
    var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
    
    /*
     * Instance of cheerio
     */
    
    var Cheerio = module.exports = function(selector, context, root, options) {
      if (!(this instanceof Cheerio)) return new Cheerio(selector, context, root, options);
    
      this.options = _.defaults(options || {}, this.options);
    
      // $(), $(null), $(undefined), $(false)
      if (!selector) return this;
    
      if (root) {
        if (typeof root === 'string') root = parse(root, this.options);
        this._root = Cheerio.call(this, root);
      }
    
      // $($)
      if (selector.cheerio) return selector;
    
      // $(dom)
      if (isNode(selector))
        selector = [selector];
    
      // $([dom])
      if (Array.isArray(selector)) {
        _.forEach(selector, function(elem, idx) {
          this[idx] = elem;
        }, this);
        this.length = selector.length;
        return this;
      }
    
      // $(<html>)
      if (typeof selector === 'string' && isHtml(selector)) {
        return Cheerio.call(this, parse(selector, this.options).children);
      }
    
      // If we don't have a context, maybe we have a root, from loading
      if (!context) {
        context = this._root;
      } else if (typeof context === 'string') {
        if (isHtml(context)) {
          // $('li', '<ul>...</ul>')
          context = parse(context, this.options);
          context = Cheerio.call(this, context);
        } else {
          // $('li', 'ul')
          selector = [context, selector].join(' ');
          context = this._root;
        }
      // $('li', node), $('li', [nodes])
      } else if (!context.cheerio) {
        context = Cheerio.call(this, context);
      }
    
      // If we still don't have a context, return
      if (!context) return this;
    
      // #id, .class, tag
      return context.find(selector);
    };
    
    /**
     * Mix in `static`
     */
    
    _.extend(Cheerio, require('./static'));
    
    /*
     * Set a signature of the object
     */
    
    Cheerio.prototype.cheerio = '[cheerio object]';
    
    /*
     * Cheerio default options
     */
    
    Cheerio.prototype.options = {
      withDomLvl1: true,
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: true
    };
    
    /*
     * Make cheerio an array-like object
     */
    
    Cheerio.prototype.length = 0;
    Cheerio.prototype.splice = Array.prototype.splice;
    
    /*
     * Check if string is HTML
     */
    var isHtml = function(str) {
      // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
      if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;
    
      // Run the regex
      var match = quickExpr.exec(str);
      return !!(match && match[1]);
    };
    
    /*
     * Make a cheerio object
     *
     * @api private
     */
    
    Cheerio.prototype._make = function(dom, context) {
      var cheerio = new this.constructor(dom, context, this._root, this.options);
      cheerio.prevObject = this;
      return cheerio;
    };
    
    /**
     * Turn a cheerio object into an array
     *
     * @deprecated
     */
    
    Cheerio.prototype.toArray = function() {
      return this.get();
    };
    
    /**
     * Plug in the API
     */
    api.forEach(function(mod) {
      _.extend(Cheerio.prototype, mod);
    });
    
    var isNode = function(obj) {
      return obj.name || obj.type === 'text' || obj.type === 'comment';
    };
    
  };

  this.lib$parse_ = function(module, exports, global) {
    /*
      Module Dependencies
    */
    var htmlparser = require('htmlparser2');
    
    /*
      Parser
    */
    exports = module.exports = function(content, options) {
      var dom = exports.evaluate(content, options),
          // Generic root element
          root = exports.evaluate('<root></root>', options)[0];
    
      root.type = 'root';
    
      // Update the dom using the root
      exports.update(dom, root);
    
      return root;
    };
    
    exports.evaluate = function(content, options) {
      // options = options || $.fn.options;
    
      var dom;
    
      if (typeof content === 'string' || Buffer.isBuffer(content)) {
        dom = htmlparser.parseDOM(content, options);
      } else {
        dom = content;
      }
    
      return dom;
    };
    
    /*
      Update the dom structure, for one changed layer
    */
    exports.update = function(arr, parent) {
      // normalize
      if (!Array.isArray(arr)) arr = [arr];
    
      // Update parent
      if (parent) {
        parent.children = arr;
      } else {
        parent = null;
      }
    
      // Update neighbors
      for (var i = 0; i < arr.length; i++) {
        var node = arr[i];
    
        // Cleanly remove existing nodes from their previous structures.
        var oldParent = node.parent || node.root,
            oldSiblings = oldParent && oldParent.children;
        if (oldSiblings && oldSiblings !== arr) {
          oldSiblings.splice(oldSiblings.indexOf(node), 1);
          if (node.prev) {
            node.prev.next = node.next;
          }
          if (node.next) {
            node.next.prev = node.prev;
          }
        }
    
        if (parent) {
          node.prev = arr[i - 1] || null;
          node.next = arr[i + 1] || null;
        } else {
          node.prev = node.next = null;
        }
    
        if (parent && parent.type === 'root') {
          node.root = parent;
          node.parent = null;
        } else {
          node.root = null;
          node.parent = parent;
        }
      }
    
      return parent;
    };
    
    // module.exports = $.extend(exports);
    
  };

  this.lib$api$attributes_ = function(module, exports, global) {
    var _ = require('lodash'),
      utils = require('../utils'),
      isTag = utils.isTag,
      domEach = utils.domEach,
      hasOwn = Object.prototype.hasOwnProperty,
      camelCase = utils.camelCase,
      cssCase = utils.cssCase,
      rspace = /\s+/,
      dataAttrPrefix = 'data-',
    
      // Lookup table for coercing string data-* attributes to their corresponding
      // JavaScript primitives
      primitives = {
        'null': null,
        'true': true,
        'false': false
      },
    
      // Attributes that are booleans
      rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
      // Matches strings that look like JSON objects or arrays
      rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
    
    
    var getAttr = function(elem, name) {
      if (!elem || !isTag(elem)) return;
    
      if (!elem.attribs) {
        elem.attribs = {};
      }
    
      // Return the entire attribs object if no attribute specified
      if (!name) {
        return elem.attribs;
      }
    
      if (hasOwn.call(elem.attribs, name)) {
        // Get the (decoded) attribute
        return rboolean.test(name) ? name : elem.attribs[name];
      }
    };
    
    var setAttr = function(el, name, value) {
    
      if (value === null) {
        removeAttribute(el, name);
      } else {
        el.attribs[name] = value+'';
      }
    };
    
    exports.attr = function(name, value) {
      // Set the value (with attr map support)
      if (typeof name === 'object' || value !== undefined) {
        if (typeof value === 'function') {
          return domEach(this, function(i, el) {
            setAttr(el, name, value.call(el, i, el.attribs[name]));
          });
        }
        return domEach(this, function(i, el) {
          if (!isTag(el)) return;
    
          if (typeof name === 'object') {
            _.each(name, function(name, key) {
              el.attribs[key] = name+'';
            });
          } else {
            setAttr(el, name, value);
          }
        });
      }
    
      return getAttr(this[0], name);
    };
    
    var setData = function(el, name, value) {
      if (typeof name === 'object') return _.extend(el.data, name);
      if (typeof name === 'string' && value !== undefined) {
        el.data[name] = value;
      } else if (typeof name === 'object') {
        _.exend(el.data, name);
      }
    };
    
    // Read the specified attribute from the equivalent HTML5 `data-*` attribute,
    // and (if present) cache the value in the node's internal data store. If no
    // attribute name is specified, read *all* HTML5 `data-*` attributes in this
    // manner.
    var readData = function(el, name) {
      var readAll = arguments.length === 1;
      var domNames, domName, jsNames, jsName, value, idx, length;
    
      if (readAll) {
        domNames = Object.keys(el.attribs).filter(function(attrName) {
          return attrName.slice(0, dataAttrPrefix.length) === dataAttrPrefix;
        });
        jsNames = domNames.map(function(domName) {
          return camelCase(domName.slice(dataAttrPrefix.length));
        });
      } else {
        domNames = [dataAttrPrefix + cssCase(name)];
        jsNames = [name];
      }
    
      for (idx = 0, length = domNames.length; idx < length; ++idx) {
        domName = domNames[idx];
        jsName = jsNames[idx];
        if (hasOwn.call(el.attribs, domName)) {
          value = el.attribs[domName];
    
          if (hasOwn.call(primitives, value)) {
            value = primitives[value];
          } else if (value === String(Number(value))) {
            value = Number(value);
          } else if (rbrace.test(value)) {
            try {
              value = JSON.parse(value);
            } catch(e){ }
          }
    
          el.data[jsName] = value;
        }
      }
    
      return readAll ? el.data : value;
    };
    
    exports.data = function(name, value) {
      var elem = this[0];
    
      if (!elem || !isTag(elem)) return;
    
      if (!elem.data) {
        elem.data = {};
      }
    
      // Return the entire data object if no data specified
      if (!name) {
        return readData(elem);
      }
    
      // Set the value (with attr map support)
      if (typeof name === 'object' || value !== undefined) {
        domEach(this, function(i, el) {
          setData(el, name, value);
        });
        return this;
      } else if (hasOwn.call(elem.data, name)) {
        return elem.data[name];
      }
    
      return readData(elem, name);
    };
    
    /**
     * Get the value of an element
     */
    
    exports.val = function(value) {
      var querying = arguments.length === 0,
          element = this[0];
    
      if(!element) return;
    
      switch (element.name) {
        case 'textarea':
          return this.text(value);
        case 'input':
          switch (this.attr('type')) {
            case 'radio':
              if (querying) {
                return this.attr('value');
              } else {
                this.attr('value', value);
                return this;
              }
              break;
            default:
              return this.attr('value', value);
          }
          return;
        case 'select':
          var option = this.find('option:selected'),
              returnValue;
          if (option === undefined) return undefined;
          if (!querying) {
            if (!this.attr().hasOwnProperty('multiple') && typeof value == 'object') {
              return this;
            }
            if (typeof value != 'object') {
              value = [value];
            }
            this.find('option').removeAttr('selected');
            for (var i = 0; i < value.length; i++) {
              this.find('option[value="' + value[i] + '"]').attr('selected', '');
            }
            return this;
          }
          returnValue = option.attr('value');
          if (this.attr().hasOwnProperty('multiple')) {
            returnValue = [];
            domEach(option, function(i, el) {
              returnValue.push(el.attribs.value);
            });
          }
          return returnValue;
        case 'option':
          if (!querying) {
            this.attr('value', value);
            return this;
          }
          return this.attr('value');
      }
    };
    
    /**
     * Remove an attribute
     */
    
    var removeAttribute = function(elem, name) {
      if (!elem.attribs || !hasOwn.call(elem.attribs, name))
        return;
    
      delete elem.attribs[name];
    };
    
    
    exports.removeAttr = function(name) {
      domEach(this, function(i, elem) {
        removeAttribute(elem, name);
      });
    
      return this;
    };
    
    exports.hasClass = function(className) {
      return _.any(this, function(elem) {
        var attrs = elem.attribs,
            clazz = attrs && attrs['class'],
            idx = -1,
            end;
    
        if (clazz) {
          while ((idx = clazz.indexOf(className, idx+1)) > -1) {
            end = idx + className.length;
    
            if ((idx === 0 || rspace.test(clazz[idx-1]))
                && (end === clazz.length || rspace.test(clazz[end]))) {
              return true;
            }
          }
        }
      });
    };
    
    exports.addClass = function(value) {
      // Support functions
      if (typeof value === 'function') {
        return domEach(this, function(i, el) {
          var className = el.attribs['class'] || '';
          exports.addClass.call([el], value.call(el, i, className));
        });
      }
    
      // Return if no value or not a string or function
      if (!value || typeof value !== 'string') return this;
    
      var classNames = value.split(rspace),
          numElements = this.length;
    
    
      for (var i = 0; i < numElements; i++) {
        // If selected element isn't a tag, move on
        if (!isTag(this[i])) continue;
    
        // If we don't already have classes
        var className = getAttr(this[i], 'class'),
            numClasses,
            setClass;
    
        if (!className) {
          setAttr(this[i], 'class', classNames.join(' ').trim());
        } else {
          setClass = ' ' + className + ' ';
          numClasses = classNames.length;
    
          // Check if class already exists
          for (var j = 0; j < numClasses; j++) {
            var appendClass = classNames[j] + ' ';
            if (setClass.indexOf(' ' + appendClass) < 0)
              setClass += appendClass;
          }
    
          setAttr(this[i], 'class', setClass.trim());
        }
      }
    
      return this;
    };
    
    var splitClass = function(className) {
      return className ? className.trim().split(rspace) : [];
    };
    
    exports.removeClass = function(value) {
      var classes,
          numClasses,
          removeAll;
    
      // Handle if value is a function
      if (typeof value === 'function') {
        return domEach(this, function(i, el) {
          exports.removeClass.call(
            [el], value.call(el, i, el.attribs['class'] || '')
          );
        });
      }
    
      classes = splitClass(value);
      numClasses = classes.length;
      removeAll = arguments.length === 0;
    
      return domEach(this, function(i, el) {
        if (!isTag(el)) return;
    
        if (removeAll) {
          // Short circuit the remove all case as this is the nice one
          el.attribs.class = '';
        } else {
          var elClasses = splitClass(el.attribs.class),
              index,
              changed;
    
          for (var j = 0; j < numClasses; j++) {
            index = elClasses.indexOf(classes[j]);
    
            if (index >= 0) {
              elClasses.splice(index, 1);
              changed = true;
    
              // We have to do another pass to ensure that there are not duplicate
              // classes listed
              j--;
            }
          }
          if (changed) {
            el.attribs.class = elClasses.join(' ');
          }
        }
      });
    };
    
    exports.toggleClass = function(value, stateVal) {
      // Support functions
      if (typeof value === 'function') {
        return domEach(this, function(i, el) {
          exports.toggleClass.call(
            [el],
            value.call(el, i, el.attribs['class'] || '', stateVal),
            stateVal
          );
        });
      }
    
      // Return if no value or not a string or function
      if (!value || typeof value !== 'string') return this;
    
      var classNames = value.split(rspace),
        numClasses = classNames.length,
        state = typeof stateVal === 'boolean' ? stateVal ? 1 : -1 : 0,
        numElements = this.length,
        elementClasses,
        index;
    
      for (var i = 0; i < numElements; i++) {
        // If selected element isn't a tag, move on
        if (!isTag(this[i])) continue;
    
        elementClasses = splitClass(this[i].attribs.class);
    
        // Check if class already exists
        for (var j = 0; j < numClasses; j++) {
          // Check if the class name is currently defined
          index = elementClasses.indexOf(classNames[j]);
    
          // Add if stateValue === true or we are toggling and there is no value
          if (state >= 0 && index < 0) {
            elementClasses.push(classNames[j]);
          } else if (state <= 0 && index >= 0) {
            // Otherwise remove but only if the item exists
            elementClasses.splice(index, 1);
          }
        }
    
        this[i].attribs.class = elementClasses.join(' ');
      }
    
      return this;
    };
    
    exports.is = function (selector) {
      if (selector) {
        return this.filter(selector).length > 0;
      }
      return false;
    };
    
  };

  this.lib$utils_ = function(module, exports, global) {
    var parse = require('./parse'),
        render = require('dom-serializer');
    
    /**
     * HTML Tags
     */
    
    var tags = { tag: true, script: true, style: true };
    
    /**
     * Check if the DOM element is a tag
     *
     * isTag(type) includes <script> and <style> tags
     */
    
    exports.isTag = function(type) {
      if (type.type) type = type.type;
      return tags[type] || false;
    };
    
    /**
     * Convert a string to camel case notation.
     * @param  {String} str String to be converted.
     * @return {String}     String in camel case notation.
     */
    
    exports.camelCase = function(str) {
      return str.replace(/[_.-](\w|$)/g, function(_, x) {
        return x.toUpperCase();
      });
    };
    
    /**
     * Convert a string from camel case to "CSS case", where word boundaries are
     * described by hyphens ("-") and all characters are lower-case.
     * @param  {String} str String to be converted.
     * @return {string}     String in "CSS case".
     */
    exports.cssCase = function(str) {
      return str.replace(/[A-Z]/g, '-$&').toLowerCase();
    };
    
    /**
     * Iterate over each DOM element without creating intermediary Cheerio instances.
     *
     * This is indented for use internally to avoid otherwise unnecessary memory pressure introduced
     * by _make.
     */
    
    exports.domEach = function(cheerio, fn) {
      var i = 0, len = cheerio.length;
      while (i < len && fn.call(cheerio, i, cheerio[i]) !== false) ++i;
      return cheerio;
    };
    
    /**
     * Create a deep copy of the given DOM structure by first rendering it to a
     * string and then parsing the resultant markup.
     *
     * @argument {Object} dom - The htmlparser2-compliant DOM structure
     * @argument {Object} options - The parsing/rendering options
     */
    exports.cloneDom = function(dom, options) {
      return parse(render(dom, options), options).children;
    };
    
  };

  this.lib$api$traversing_ = function(module, exports, global) {
    var _ = require('lodash'),
        select = require('css-select'),
        utils = require('../utils'),
        domEach = utils.domEach,
        uniqueSort = require('htmlparser2').DomUtils.uniqueSort,
        isTag = utils.isTag;
    
    exports.find = function(selectorOrHaystack) {
      var elems = _.reduce(this, function(memo, elem) {
        return memo.concat(_.filter(elem.children, isTag));
      }, []);
      var contains = this.constructor.contains;
      var haystack;
    
      if (selectorOrHaystack && typeof selectorOrHaystack !== 'string') {
        if (selectorOrHaystack.cheerio) {
          haystack = selectorOrHaystack.get();
        } else {
          haystack = [selectorOrHaystack];
        }
    
        return this._make(haystack.filter(function(elem) {
          var idx, len;
          for (idx = 0, len = this.length; idx < len; ++idx) {
            if (contains(this[idx], elem)) {
              return true;
            }
          }
        }, this));
      }
    
      return this._make(select(selectorOrHaystack, elems, this.options));
    };
    
    // Get the parent of each element in the current set of matched elements,
    // optionally filtered by a selector.
    exports.parent = function(selector) {
      var set = [];
    
      domEach(this, function(idx, elem) {
        var parentElem = elem.parent;
        if (parentElem && set.indexOf(parentElem) < 0) {
          set.push(parentElem);
        }
      });
    
      if (arguments.length) {
        set = exports.filter.call(set, selector, this);
      }
    
      return this._make(set);
    };
    
    exports.parents = function(selector) {
      var parentNodes = [];
    
      // When multiple DOM elements are in the original set, the resulting set will
      // be in *reverse* order of the original elements as well, with duplicates
      // removed.
      this.get().reverse().forEach(function(elem) {
        traverseParents(this, elem.parent, selector, Infinity)
          .forEach(function(node) {
            if (parentNodes.indexOf(node) === -1) {
              parentNodes.push(node);
            }
          }
        );
      }, this);
    
      return this._make(parentNodes);
    };
    
    exports.parentsUntil = function(selector, filter) {
      var parentNodes = [], untilNode, untilNodes;
    
      if (typeof selector === 'string') {
        untilNode = select(selector, this.parents().toArray(), this.options)[0];
      } else if (selector && selector.cheerio) {
        untilNodes = selector.toArray();
      } else if (selector) {
        untilNode = selector;
      }
    
      // When multiple DOM elements are in the original set, the resulting set will
      // be in *reverse* order of the original elements as well, with duplicates
      // removed.
    
      this.toArray().reverse().forEach(function(elem) {
        while ((elem = elem.parent)) {
          if ((untilNode && elem !== untilNode) ||
            (untilNodes && untilNodes.indexOf(elem) === -1) ||
            (!untilNode && !untilNodes)) {
            if (isTag(elem) && parentNodes.indexOf(elem) === -1) { parentNodes.push(elem); }
          } else {
            break;
          }
        }
      }, this);
    
      return this._make(filter ? select(filter, parentNodes, this.options) : parentNodes);
    };
    
    // For each element in the set, get the first element that matches the selector
    // by testing the element itself and traversing up through its ancestors in the
    // DOM tree.
    exports.closest = function(selector) {
      var set = [];
    
      if (!selector) {
        return this._make(set);
      }
    
      domEach(this, function(idx, elem) {
        var closestElem = traverseParents(this, elem, selector, 1)[0];
    
        // Do not add duplicate elements to the set
        if (closestElem && set.indexOf(closestElem) < 0) {
          set.push(closestElem);
        }
      }.bind(this));
    
      return this._make(set);
    };
    
    exports.next = function(selector) {
      if (!this[0]) { return this; }
      var elems = [];
    
      _.forEach(this, function(elem) {
        while ((elem = elem.next)) {
          if (isTag(elem)) {
            elems.push(elem);
            return;
          }
        }
      });
    
      return selector ?
        exports.filter.call(elems, selector, this) :
        this._make(elems);
    };
    
    exports.nextAll = function(selector) {
      if (!this[0]) { return this; }
      var elems = [];
    
      _.forEach(this, function(elem) {
        while ((elem = elem.next)) {
          if (isTag(elem) && elems.indexOf(elem) === -1) {
            elems.push(elem);
          }
        }
      });
    
      return selector ?
        exports.filter.call(elems, selector, this) :
        this._make(elems);
    };
    
    exports.nextUntil = function(selector, filterSelector) {
      if (!this[0]) { return this; }
      var elems = [], untilNode, untilNodes;
    
      if (typeof selector === 'string') {
        untilNode = select(selector, this.nextAll().get(), this.options)[0];
      } else if (selector && selector.cheerio) {
        untilNodes = selector.get();
      } else if (selector) {
        untilNode = selector;
      }
    
      _.forEach(this, function(elem) {
        while ((elem = elem.next)) {
          if ((untilNode && elem !== untilNode) ||
            (untilNodes && untilNodes.indexOf(elem) === -1) ||
            (!untilNode && !untilNodes)) {
            if (isTag(elem) && elems.indexOf(elem) === -1) {
              elems.push(elem);
            }
          } else {
            break;
          }
        }
      });
    
      return filterSelector ?
        exports.filter.call(elems, filterSelector, this) :
        this._make(elems);
    };
    
    exports.prev = function(selector) {
      if (!this[0]) { return this; }
      var elems = [];
    
      _.forEach(this, function(elem) {
        while ((elem = elem.prev)) {
          if (isTag(elem)) {
            elems.push(elem);
            return;
          }
        }
      });
    
      return selector ?
        exports.filter.call(elems, selector, this) :
        this._make(elems);
    };
    
    exports.prevAll = function(selector) {
      if (!this[0]) { return this; }
      var elems = [];
    
      _.forEach(this, function(elem) {
        while ((elem = elem.prev)) {
          if (isTag(elem) && elems.indexOf(elem) === -1) {
            elems.push(elem);
          }
        }
      });
    
      return selector ?
        exports.filter.call(elems, selector, this) :
        this._make(elems);
    };
    
    exports.prevUntil = function(selector, filterSelector) {
      if (!this[0]) { return this; }
      var elems = [], untilNode, untilNodes;
    
      if (typeof selector === 'string') {
        untilNode = select(selector, this.prevAll().get(), this.options)[0];
      } else if (selector && selector.cheerio) {
        untilNodes = selector.get();
      } else if (selector) {
        untilNode = selector;
      }
    
      _.forEach(this, function(elem) {
        while ((elem = elem.prev)) {
          if ((untilNode && elem !== untilNode) ||
            (untilNodes && untilNodes.indexOf(elem) === -1) ||
            (!untilNode && !untilNodes)) {
            if (isTag(elem) && elems.indexOf(elem) === -1) {
              elems.push(elem);
            }
          } else {
            break;
          }
        }
      });
    
      return filterSelector ?
        exports.filter.call(elems, filterSelector, this) :
        this._make(elems);
    };
    
    exports.siblings = function(selector) {
      var parent = this.parent();
    
      var elems = _.filter(
        parent ? parent.children() : this.siblingsAndMe(),
        function(elem) { return isTag(elem) && !this.is(elem); },
        this
      );
    
      if (selector !== undefined) {
        return exports.filter.call(elems, selector, this);
      } else {
        return this._make(elems);
      }
    };
    
    exports.children = function(selector) {
    
      var elems = _.reduce(this, function(memo, elem) {
        return memo.concat(_.filter(elem.children, isTag));
      }, []);
    
      if (selector === undefined) return this._make(elems);
    
      return exports.filter.call(elems, selector, this);
    };
    
    exports.contents = function() {
      return this._make(_.reduce(this, function(all, elem) {
        all.push.apply(all, elem.children);
        return all;
      }, []));
    };
    
    exports.each = function(fn) {
      var i = 0, len = this.length;
      while (i < len && fn.call(this[i], i, this[i]) !== false) ++i;
      return this;
    };
    
    exports.map = function(fn) {
      return this._make(_.reduce(this, function(memo, el, i) {
        var val = fn.call(el, i, el);
        return val == null ? memo : memo.concat(val);
      }, []));
    };
    
    var makeFilterMethod = function(filterFn) {
      return function(match, container) {
        var testFn;
        container = container || this;
    
        if (typeof match === 'string') {
          testFn = select.compile(match, container.options);
        } else if (typeof match === 'function') {
          testFn = function(el, i) {
            return match.call(el, i, el);
          };
        } else if (match.cheerio) {
          testFn = match.is.bind(match);
        } else {
          testFn = function(el) {
            return match === el;
          };
        }
    
        return container._make(filterFn(this, testFn));
      };
    };
    
    exports.filter = makeFilterMethod(_.filter);
    exports.not = makeFilterMethod(_.reject);
    
    exports.has = function(selectorOrHaystack) {
      var that = this;
      return exports.filter.call(this, function() {
        return that._make(this).find(selectorOrHaystack).length > 0;
      });
    };
    
    exports.first = function() {
      return this.length > 1 ? this._make(this[0]) : this;
    };
    
    exports.last = function() {
      return this.length > 1 ? this._make(this[this.length - 1]) : this;
    };
    
    // Reduce the set of matched elements to the one at the specified index.
    exports.eq = function(i) {
      i = +i;
    
      // Use the first identity optimization if possible
      if (i === 0 && this.length <= 1) return this;
    
      if (i < 0) i = this.length + i;
      return this[i] ? this._make(this[i]) : this._make([]);
    };
    
    // Retrieve the DOM elements matched by the jQuery object.
    exports.get = function(i) {
      if (i == null) {
        return Array.prototype.slice.call(this);
      } else {
        return this[i < 0 ? (this.length + i) : i];
      }
    };
    
    // Search for a given element from among the matched elements.
    exports.index = function(selectorOrNeedle) {
      var $haystack, needle;
    
      if (arguments.length === 0) {
        $haystack = this.parent().children();
        needle = this[0];
      } else if (typeof selectorOrNeedle === 'string') {
        $haystack = this._make(selectorOrNeedle);
        needle = this[0];
      } else {
        $haystack = this;
        needle = selectorOrNeedle.cheerio ? selectorOrNeedle[0] : selectorOrNeedle;
      }
    
      return $haystack.get().indexOf(needle);
    };
    
    exports.slice = function() {
      return this._make([].slice.apply(this, arguments));
    };
    
    function traverseParents(self, elem, selector, limit) {
      var elems = [];
      while (elem && elems.length < limit) {
        if (!selector || exports.filter.call([elem], selector, self).length) {
          elems.push(elem);
        }
        elem = elem.parent;
      }
      return elems;
    }
    
    // End the most recent filtering operation in the current chain and return the
    // set of matched elements to its previous state.
    exports.end = function() {
      return this.prevObject || this._make([]);
    };
    
    exports.add = function(other, context) {
      var selection = this._make(other, context);
      var contents = uniqueSort(selection.get().concat(this.get()));
    
      for (var i = 0; i < contents.length; ++i) {
        selection[i] = contents[i];
      }
      selection.length = contents.length;
    
      return selection;
    };
    
    // Add the previous set of elements on the stack to the current set, optionally
    // filtered by a selector.
    exports.addBack = function(selector) {
      return this.add(
        arguments.length ? this.prevObject.filter(selector) : this.prevObject
      );
    };
    
  };

  this.lib$api$manipulation_ = function(module, exports, global) {
    var _ = require('lodash'),
        parse = require('../parse'),
        $ = require('../static'),
        updateDOM = parse.update,
        evaluate = parse.evaluate,
        utils = require('../utils'),
        domEach = utils.domEach,
        cloneDom = utils.cloneDom,
        slice = Array.prototype.slice;
    
    // Create an array of nodes, recursing into arrays and parsing strings if
    // necessary
    exports._makeDomArray = function makeDomArray(elem, clone) {
      if (elem == null) {
        return [];
      } else if (elem.cheerio) {
        return clone ? cloneDom(elem.get(), elem.options) : elem.get();
      } else if (Array.isArray(elem)) {
        return _.flatten(elem.map(function(el) {
          return this._makeDomArray(el, clone);
        }, this));
      } else if (typeof elem === 'string') {
        return evaluate(elem, this.options);
      } else {
        return clone ? cloneDom([elem]) : [elem];
      }
    };
    
    var _insert = function(concatenator) {
      return function() {
        var elems = slice.call(arguments),
            lastIdx = this.length - 1;
    
        return domEach(this, function(i, el) {
          var dom, domSrc;
    
          if (typeof elems[0] === 'function') {
            domSrc = elems[0].call(el, i, $.html(el.children));
          } else {
            domSrc = elems;
          }
    
          dom = this._makeDomArray(domSrc, i < lastIdx);
          concatenator(dom, el.children, el);
        });
      };
    };
    
    /*
     * Modify an array in-place, removing some number of elements and adding new
     * elements directly following them.
     *
     * @param {Array} array Target array to splice.
     * @param {Number} spliceIdx Index at which to begin changing the array.
     * @param {Number} spliceCount Number of elements to remove from the array.
     * @param {Array} newElems Elements to insert into the array.
     *
     * @api private
     */
    var uniqueSplice = function(array, spliceIdx, spliceCount, newElems, parent) {
      var spliceArgs = [spliceIdx, spliceCount].concat(newElems),
          prev = array[spliceIdx - 1] || null,
          next = array[spliceIdx] || null;
      var idx, len, prevIdx, node, oldParent;
    
      // Before splicing in new elements, ensure they do not already appear in the
      // current array.
      for (idx = 0, len = newElems.length; idx < len; ++idx) {
        node = newElems[idx];
        oldParent = node.parent || node.root;
        prevIdx = oldParent && oldParent.children.indexOf(newElems[idx]);
    
        if (oldParent && prevIdx > -1) {
          oldParent.children.splice(prevIdx, 1);
          if (parent === oldParent && spliceIdx > prevIdx) {
            spliceArgs[0]--;
          }
        }
    
        node.root = null;
        node.parent = parent;
    
        if (node.prev) {
          node.prev.next = node.next || null;
        }
    
        if (node.next) {
          node.next.prev = node.prev || null;
        }
    
        node.prev = newElems[idx - 1] || prev;
        node.next = newElems[idx + 1] || next;
      }
    
      if (prev) {
        prev.next = newElems[0];
      }
      if (next) {
        next.prev = newElems[newElems.length - 1];
      }
      return array.splice.apply(array, spliceArgs);
    };
    
    exports.append = _insert(function(dom, children, parent) {
      uniqueSplice(children, children.length, 0, dom, parent);
    });
    
    exports.prepend = _insert(function(dom, children, parent) {
      uniqueSplice(children, 0, 0, dom, parent);
    });
    
    exports.after = function() {
      var elems = slice.call(arguments),
          lastIdx = this.length - 1;
    
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            index = siblings.indexOf(el),
            domSrc, dom;
    
        // If not found, move on
        if (index < 0) return;
    
        if (typeof elems[0] === 'function') {
          domSrc = elems[0].call(el, i, $.html(el.children));
        } else {
          domSrc = elems;
        }
        dom = this._makeDomArray(domSrc, i < lastIdx);
    
        // Add element after `this` element
        uniqueSplice(siblings, index + 1, 0, dom, parent);
      });
    
      return this;
    };
    
    exports.insertAfter = function(target) {
      var clones = [],
          self = this;
      if (typeof target === 'string') {
        target = this.constructor.call(this.constructor, target, null, this._originalRoot);
      }
      target = this._makeDomArray(target);
      self.remove();
      domEach(target, function(i, el) {
        var clonedSelf = self._makeDomArray(self.clone());
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            index = siblings.indexOf(el);
    
        // If not found, move on
        if (index < 0) return;
    
        // Add cloned `this` element(s) after target element
        uniqueSplice(siblings, index + 1, 0, clonedSelf, parent);
        clones.push(clonedSelf);
      });
      return this.constructor.call(this.constructor, this._makeDomArray(clones));
    };
    
    exports.before = function() {
      var elems = slice.call(arguments),
          lastIdx = this.length - 1;
    
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            index = siblings.indexOf(el),
            domSrc, dom;
    
        // If not found, move on
        if (index < 0) return;
    
        if (typeof elems[0] === 'function') {
          domSrc = elems[0].call(el, i, $.html(el.children));
        } else {
          domSrc = elems;
        }
    
        dom = this._makeDomArray(domSrc, i < lastIdx);
    
        // Add element before `el` element
        uniqueSplice(siblings, index, 0, dom, parent);
      });
    
      return this;
    };
    
    exports.insertBefore = function(target) {
      var clones = [],
          self = this;
      if (typeof target === 'string') {
        target = this.constructor.call(this.constructor, target, null, this._originalRoot);
      }
      target = this._makeDomArray(target);
      self.remove();
      domEach(target, function(i, el) {
        var clonedSelf = self._makeDomArray(self.clone());
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            index = siblings.indexOf(el);
    
        // If not found, move on
        if (index < 0) return;
    
        // Add cloned `this` element(s) after target element
        uniqueSplice(siblings, index, 0, clonedSelf, parent);
        clones.push(clonedSelf);
      });
      return this.constructor.call(this.constructor, this._makeDomArray(clones));
    };
    
    /*
      remove([selector])
    */
    exports.remove = function(selector) {
      var elems = this;
    
      // Filter if we have selector
      if (selector)
        elems = elems.filter(selector);
    
      domEach(elems, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            index = siblings.indexOf(el);
    
        if (index < 0) return;
    
        siblings.splice(index, 1);
        if (el.prev) {
          el.prev.next = el.next;
        }
        if (el.next) {
          el.next.prev = el.prev;
        }
        el.prev = el.next = el.parent = el.root = null;
      });
    
      return this;
    };
    
    exports.replaceWith = function(content) {
      var self = this;
    
      domEach(this, function(i, el) {
        var parent = el.parent || el.root;
        if (!parent) {
          return;
        }
    
        var siblings = parent.children,
            dom = self._makeDomArray(typeof content === 'function' ? content.call(el, i, el) : content),
            index;
    
        // In the case that `dom` contains nodes that already exist in other
        // structures, ensure those nodes are properly removed.
        updateDOM(dom, null);
    
        index = siblings.indexOf(el);
    
        // Completely remove old element
        uniqueSplice(siblings, index, 1, dom, parent);
        el.parent = el.prev = el.next = el.root = null;
      });
    
      return this;
    };
    
    exports.empty = function() {
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
    
        el.children.length = 0;
      });
      return this;
    };
    
    /**
     * Set/Get the HTML
     */
    exports.html = function(str) {
      if (str === undefined) {
        if (!this[0] || !this[0].children) return null;
        return $.html(this[0].children, this.options);
      }
    
      var opts = this.options;
    
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
    
        var content = str.cheerio ? str.clone().get() : evaluate(str, opts);
    
        updateDOM(content, el);
      });
    
      return this;
    };
    
    exports.toString = function() {
      return $.html(this, this.options);
    };
    
    exports.text = function(str) {
      // If `str` is undefined, act as a "getter"
      if (str === undefined) {
        return $.text(this);
      } else if (typeof str === 'function') {
        // Function support
        return domEach(this, function(i, el) {
          var $el = [el];
          return exports.text.call($el, str.call(el, i, $.text($el)));
        });
      }
    
      // Append text node to each selected elements
      domEach(this, function(i, el) {
        _.each(el.children, function(el) {
          el.next = el.prev = el.parent = null;
        });
    
        var elem = {
          data: str,
          type: 'text',
          parent: el,
          prev: null,
          next: null,
          children: []
        };
    
        updateDOM(elem, el);
      });
    
      return this;
    };
    
    exports.clone = function() {
      return this._make(cloneDom(this.get(), this.options));
    };
    
  };

  this.lib$static_ = function(module, exports, global) {
    /**
     * Module dependencies
     */
    
    var select = require('css-select'),
        parse = require('./parse'),
        serialize = require('dom-serializer'),
        _ = require('lodash');
    
    /**
     * $.load(str)
     */
    
    exports.load = function(content, options) {
      var Cheerio = require('./cheerio');
    
      options = _.defaults(options || {}, Cheerio.prototype.options);
    
      var root = parse(content, options);
    
      var initialize = function(selector, context, r, opts) {
        if (!(this instanceof initialize)) {
          return new initialize(selector, context, r, opts);
        }
        opts = _.defaults(opts || {}, options);
        return Cheerio.call(this, selector, context, r || root, opts);
      };
    
      // Ensure that selections created by the "loaded" `initialize` function are
      // true Cheerio instances.
      initialize.prototype = Object.create(Cheerio.prototype);
      initialize.prototype.constructor = initialize;
    
      // Mimic jQuery's prototype alias for plugin authors.
      initialize.fn = initialize.prototype;
    
      // Keep a reference to the top-level scope so we can chain methods that implicitly 
      // resolve selectors; e.g. $("<span>").(".bar"), which otherwise loses ._root
      initialize.prototype._originalRoot = root;
    
      // Add in the static methods
      _.merge(initialize, exports);
    
      // Add in the root
      initialize._root = root;
      // store options
      initialize._options = options;
    
      return initialize;
    };
    
    /*
    * Helper function
    */
    
    function render(that, dom, options) {
      if (!dom) {
        if (that._root && that._root.children) {
          dom = that._root.children;
        } else {
          return '';
        }
      } else if (typeof dom === 'string') {
        dom = select(dom, that._root, options);
      }
    
      return serialize(dom, options);
    }
    
    /**
     * $.html([selector | dom], [options])
     */
    
    exports.html = function(dom, options) {
      var Cheerio = require('./cheerio');
    
      // be flexible about parameters, sometimes we call html(),
      // with options as only parameter
      // check dom argument for dom element specific properties
      // assume there is no 'length' or 'type' properties in the options object
      if (Object.prototype.toString.call(dom) === '[object Object]' && !options && !('length' in dom) && !('type' in dom))
      {
        options = dom;
        dom = undefined;
      }
    
      // sometimes $.html() used without preloading html
      // so fallback non existing options to the default ones
      options = _.defaults(options || {}, this._options, Cheerio.prototype.options);
    
      return render(this, dom, options);
    };
    
    /**
     * $.xml([selector | dom])
     */
    
    exports.xml = function(dom) {
      var options = _.defaults({xmlMode: true}, this._options);
    
      return render(this, dom, options);
    };
    
    /**
     * $.text(dom)
     */
    
    exports.text = function(elems) {
      if (!elems) return '';
    
      var ret = '',
          len = elems.length,
          elem;
    
      for (var i = 0; i < len; i++) {
        elem = elems[i];
        if (elem.type === 'text') ret += elem.data;
        else if (elem.children && elem.type !== 'comment') {
          ret += exports.text(elem.children);
        }
      }
    
      return ret;
    };
    
    /**
     * $.parseHTML(data [, context ] [, keepScripts ])
     * Parses a string into an array of DOM nodes. The `context` argument has no
     * meaning for Cheerio, but it is maintained for API compatibility with jQuery.
     */
    exports.parseHTML = function(data, context, keepScripts) {
      var parsed;
    
      if (!data || typeof data !== 'string') {
        return null;
      }
    
      if (typeof context === 'boolean') {
        keepScripts = context;
      }
    
      parsed = this.load(data);
      if (!keepScripts) {
        parsed('script').remove();
      }
    
      // The `children` array is used by Cheerio internally to group elements that
      // share the same parents. When nodes created through `parseHTML` are
      // inserted into previously-existing DOM structures, they will be removed
      // from the `children` array. The results of `parseHTML` should remain
      // constant across these operations, so a shallow copy should be returned.
      return parsed.root()[0].children.slice();
    };
    
    /**
     * $.root()
     */
    exports.root = function() {
      return this(this._root);
    };
    
    /**
     * $.contains()
     */
    exports.contains = function(container, contained) {
    
      // According to the jQuery API, an element does not "contain" itself
      if (contained === container) {
        return false;
      }
    
      // Step up the descendants, stopping when the root element is reached
      // (signaled by `.parent` returning a reference to the same object)
      while (contained && contained !== contained.parent) {
        contained = contained.parent;
        if (contained === container) {
          return true;
        }
      }
    
      return false;
    };
    
  };

  this.lib$api$css_ = function(module, exports, global) {
    var _ = require('lodash'),
        domEach = require('../utils').domEach;
    var toString = Object.prototype.toString;
    
    /**
     * Set / Get css.
     *
     * @param {String|Object} prop
     * @param {String} val
     * @return {self}
     * @api public
     */
    
    exports.css = function(prop, val) {
      if (arguments.length === 2 ||
        // When `prop` is a "plain" object
        (toString.call(prop) === '[object Object]')) {
        return domEach(this, function(idx, el) {
          setCss(el, prop, val, idx);
        });
      } else {
        return getCss(this[0], prop);
      }
    };
    
    /**
     * Set styles of all elements.
     *
     * @param {String|Object} prop
     * @param {String} val
     * @param {Number} idx - optional index within the selection
     * @return {self}
     * @api private
     */
    
    function setCss(el, prop, val, idx) {
      if ('string' == typeof prop) {
        var styles = getCss(el);
        if (typeof val === 'function') {
          val = val.call(el, idx, styles[prop]);
        }
    
        if (val === '') {
          delete styles[prop];
        } else if (val != null) {
          styles[prop] = val;
        }
    
        el.attribs.style = stringify(styles);
      } else if ('object' == typeof prop) {
        Object.keys(prop).forEach(function(k){
          setCss(el, k, prop[k]);
        });
      }
    }
    
    /**
     * Get parsed styles of the first element.
     *
     * @param {String} prop
     * @return {Object}
     * @api private
     */
    
    function getCss(el, prop) {
      var styles = parse(el.attribs.style);
      if (typeof prop === 'string') {
        return styles[prop];
      } else if (Array.isArray(prop)) {
        return _.pick(styles, prop);
      } else {
        return styles;
      }
    }
    
    /**
     * Stringify `obj` to styles.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    
    function stringify(obj) {
      return Object.keys(obj || {})
        .reduce(function(str, prop){
          return str += ''
            + (str ? ' ' : '')
            + prop
            + ': '
            + obj[prop]
            + ';';
        }, '');
    }
    
    /**
     * Parse `styles`.
     *
     * @param {String} styles
     * @return {Object}
     * @api private
     */
    
    function parse(styles) {
      styles = (styles || '').trim();
    
      if (!styles) return {};
    
      return styles
        .split(';')
        .reduce(function(obj, str){
          var n = str.indexOf(':');
          // skip if there is no :, or if it is the first/last character
          if (n < 1 || n === str.length-1) return obj;
          obj[str.slice(0,n).trim()] = str.slice(n+1).trim();
          return obj;
        }, {});
    }
    
  };

  this.lib$api$forms_ = function(module, exports, global) {
    // https://github.com/jquery/jquery/blob/2.1.3/src/manipulation/var/rcheckableType.js
    // https://github.com/jquery/jquery/blob/2.1.3/src/serialize.js
    var _ = require('lodash'),
        submittableSelector = 'input,select,textarea,keygen',
        rCRLF = /\r?\n/g,
        rcheckableType = /^(?:checkbox|radio)$/i,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i;
    
    exports.serializeArray = function() {
      // Resolve all form elements from either forms or collections of form elements
      var Cheerio = this.constructor;
      return this.map(function() {
          var elem = this;
          var $elem = Cheerio(elem);
          if (elem.name === 'form') {
            return $elem.find(submittableSelector).toArray();
          } else {
            return $elem.filter(submittableSelector).toArray();
          }
        }).filter(function() {
          var $elem = Cheerio(this);
          var type = $elem.attr('type');
    
          // Verify elements have a name (`attr.name`) and are not disabled (`:disabled`)
          return $elem.attr('name') && !$elem.is(':disabled') &&
            // and cannot be clicked (`[type=submit]`) or are used in `x-www-form-urlencoded` (`[type=file]`)
            !rsubmitterTypes.test(type) &&
            // and are either checked/don't have a checkable state
            ($elem.attr('checked') || !rcheckableType.test(type));
        // Convert each of the elements to its value(s)
        }).map(function(i, elem) {
          var $elem = Cheerio(elem);
          var name = $elem.attr('name');
          var val = $elem.val();
    
          // If there is no value set (e.g. `undefined`, `null`), then return nothing
          if (val == null) {
            return null;
          } else {
            // If we have an array of values (e.g. `<select multiple>`), return an array of key/value pairs
            if (Array.isArray(val)) {
              return _.map(val, function(val) {
                // We trim replace any line endings (e.g. `\r` or `\r\n` with `\r\n`) to guarantee consistency across platforms
                //   These can occur inside of `<textarea>'s`
                return {name: name, value: val.replace( rCRLF, '\r\n' )};
              });
            // Otherwise (e.g. `<input type="text">`, return only one key/value pair
            } else {
              return {name: name, value: val.replace( rCRLF, '\r\n' )};
            }
          }
        // Convert our result to an array
        }).get();
    };
    
  };

  return this.index_(module, exports, global);
};
