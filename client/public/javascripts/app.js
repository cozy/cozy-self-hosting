(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var refresh_fqdn = function() {
    // Get fqdn from CozyDB
    $.get("./debian/fqdn", function(data) {
        // And update view
        $("#input-fqdn").val(data);
    });
};

var save_fqdn = function() {
    // Get new value in input text
    var form_value = $("#input-fqdn").val();
    // Push configuration
    $.post("./debian/fqdn", {fqdn: form_value}, function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message);
        $("#div-status-ok").show();
    });
};

var Application = {
  initialize: function () {
      refresh_fqdn();
      $("#button-refresh").click(function() {
          refresh_fqdn();
      });
      $("#button-reconfigure").click(function() {
          save_fqdn();
      });
      $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        $("#div-status-ok").hide();
        $("#div-status-ko").html(thrownError + ':<br/>\n' + jqxhr.responseText);
        $("#div-status-ko").show();
      });
  }
};

module.exports = Application;

});

require.register("initialize", function(exports, require, module) {
var application = require('application');

$(function () {
  application.initialize();
});

});


//# sourceMappingURL=app.js.map