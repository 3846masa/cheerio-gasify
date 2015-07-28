var global = this;
function require(libname) {
  libname = libname.split('/').reverse()[0];
  libname = libname.replace(/\.js$/, '').replace(/-/g, '_');
  libname += '_';
  
  var module = { exports : function(){} };
  var fn = global[libname];
  new fn(module, module.exports, global);
  return module.exports;
}

String.prototype.trimLeft = function() {
  return this.replace(/^\s*/, '');
};
String.prototype.trimRight = function() {
  return this.replace(/\s*$/, '');
};
