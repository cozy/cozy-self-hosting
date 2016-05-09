#!/bin/bash
APP_NAME=self-hosting
SOURCE_DIR=/usr/local/cozy/apps/${APP_NAME}/to-install

cozy-monitor install ${APP_NAME} -r https://github.com/cozy/cozy-self-hosting.git

cp ${SOURCE_DIR}/debian-reconfigure-cozy-domain.sh /usr/local/sbin/debian-reconfigure-cozy-domain.sh
cp ${SOURCE_DIR}/debian-halt.sh /usr/local/sbin/debian-halt.sh
cp ${SOURCE_DIR}/debian-reboot.sh /usr/local/sbin/debian-reboot.sh
cp ${SOURCE_DIR}/sudoers.d_cozy-self-hosting /etc/sudoers.d/cozy-self-hosting
cp ${SOURCE_DIR}/self-hosting.json /etc/cozy/self-hosting.json

chown root:root /etc/sudoers.d/cozy-self-hosting
chmod 440 /etc/sudoers.d/cozy-self-hosting

chown root:root /etc/cozy/self-hosting.json
chmod 644 /etc/cozy/self-hosting.json
