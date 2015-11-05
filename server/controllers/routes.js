// See documentation on https://github.com/frankrousseau/americano#routes

'use strict';

var debian = require('./debian');

module.exports = {
  'debian/fqdn': {
    get: debian.get_fqdn,
    post: debian.update_fqdn
  }
};