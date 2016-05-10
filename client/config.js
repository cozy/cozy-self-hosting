// Generated by CoffeeScript 1.10.0
(function() {
  exports.config = {
    paths: {
      "public": 'public'
    },
    files: {
      javascripts: {
        defaultExtension: 'js',
        joinTo: {
          'javascripts/app.js': /^app/,
          'javascripts/vendor.js': /^vendor/
        },
        order: {
          before: ['vendor/javascripts/console-helper.js', 'vendor/javascripts/jquery-2.1.1.min.js', 'vendor/javascripts/underscore-1.6.0.min.js', 'vendor/javascripts/backbone-1.1.2.min.js', 'vendor/javascripts/backbone-mediator.js', 'vendor/javascripts/bootstrap-3.1.1.min.js', 'vendor/javascripts/bootstrap-tooltip.js', 'vendor/javascripts/bootstrap-confirmation.js']
        }
      },
      stylesheets: {
        defaultExtension: 'styl',
        joinTo: 'stylesheets/app.css',
        order: {
          before: [],
          after: []
        }
      },
      templates: {
        defaultExtension: 'jade',
        joinTo: 'javascripts/app.js'
      }
    }
  };

}).call(this);
