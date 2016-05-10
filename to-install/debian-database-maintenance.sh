#!/bin/bash


if [[ "$1" == "compact" ]]; then
	cozy-monitor compact
elif [[ "$1" == "views" ]]; then
	cozy-monitor compact-all-views
elif [[ "$1" == "cleanup" ]]; then
	cozy-monitor cleanup
else
	echo "unknown command..."
	exit 1
fi

exit $?
