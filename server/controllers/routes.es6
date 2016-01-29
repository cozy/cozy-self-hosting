// See documentation on https://github.com/frankrousseau/americano#routes

const debian = require('./debian');

module.exports = {
  'debian/fqdn': {
    get: debian.get_fqdn,
    post: debian.update_fqdn,
  },
};
