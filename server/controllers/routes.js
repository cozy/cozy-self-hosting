// See documentation on https://github.com/frankrousseau/americano#routes

var debian = require('./debian');

module.exports = {
  'debian/fqdn': {
    get: debian.get_fqdn,
    post: debian.update_fqdn
  },
  'debian/host/halt': {
    get: debian.host_halt
  },
  'debian/host/reboot': {
    get: debian.host_reboot
  },
  'debian/host/isvps': {
    get: debian.is_vps
  }

};