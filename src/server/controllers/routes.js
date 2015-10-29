// See documentation on https://github.com/frankrousseau/americano#routes

var index = require('./index');
var debian = require('./debian');

module.exports = {
  '': {
    get: index.main
  },
  'debian/fqdn': {
    get: debian.get_fqdn,
    post: debian.update_fqdn
  }
};

