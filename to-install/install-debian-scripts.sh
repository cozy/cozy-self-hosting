#!/bin/bash
APP_NAME=self-hosting
SOURCE_DIR=/usr/local/cozy/apps/${APP_NAME}/to-install

cozy-monitor install ${APP_NAME} -r https://gitlab.cozycloud.cc/nico/cozy-self-hosting.git

cp ${SOURCE_DIR}/debian-reconfigure-cozy-domain.sh
cp ${SOURCE_DIR}/sudoers.d_cozy-self-hosting /etc/sudoers.d/cozy-self-hosting

chown root:root /etc/sudoers.d/cozy-self-hosting
chmod 440 /etc/sudoers.d/cozy-self-hosting
