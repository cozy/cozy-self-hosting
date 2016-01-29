// See documentation on https://github.com/frankrousseau/americano#routes

import debian from './debian';

module.exports = {
  'debian/fqdn': {
    get: debian.get_fqdn,
    post: debian.update_fqdn,
  },
};
