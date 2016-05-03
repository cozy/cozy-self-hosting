(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;require.register("fs", function(exports, require, module) {
  module.exports = {};
});
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("application.js", function(exports, require, module) {
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
        $("#div-status-ok").html(data.message).show();
    });
};

var host_halt = function() {
	// ask for halt host
	$("#button-halt").confirmation('hide')
    $.get("./debian/host/halt", function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
    });
};

var host_reboot = function() {
	// ask for halt host
	$("#button-reboot").confirmation('hide')
    $.get("./debian/host/reboot", function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
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

	  $("#button-halt").confirmation({
		"title": "Do you really want to halt the host ?",
		"btnOkClass": "btn-danger",
		"btnCancelClass": "btn-info",
		"btnOkLabel": "HALT",
		"btnCancelLabel": "CANCEL",
		"placement": "bottom",
		"popout": true,
		"singleton": true,
		"onConfirm": host_halt
	  });
	  $("#button-reboot").confirmation({
		"title": "Do you really want to reboot the host ?",
		"btnOkClass": "btn-warning",
		"btnCancelClass": "btn-info",
		"btnOkLabel": "REBOOT",
		"btnCancelLabel": "CANCEL",
		"placement": "bottom",
		"popout": true,
		"singleton": true,
		"onConfirm": host_reboot
	  });

      $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        $("#div-status-ok").hide();
		var data = JSON.parse(jqxhr.responseText);
		console.log(data);
		if (data.message) {
			$("#div-status-ko").html(thrownError + ':<br/>\n' + data.message).show();
		} else {
			$("#div-status-ko").html(thrownError + ':<br/>\n' + jqxhr.responseText).show();
		}
      });
  }
};

module.exports = Application;

});

require.register("initialize.js", function(exports, require, module) {
var application = require('application');

$(function () {
  application.initialize();
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map