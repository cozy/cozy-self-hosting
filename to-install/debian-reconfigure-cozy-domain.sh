#!/bin/bash
DOMAIN="$1"

echo $DOMAIN
echo 'cozy cozy/certificate text ' | debconf-set-selections
echo "cozy cozy/fqdn string $DOMAIN" | debconf-set-selections

/var/lib/dpkg/info/cozy.postinst reconfigure
