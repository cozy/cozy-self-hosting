#!/bin/bash

if [ "$1" = "reboot" ]; then
	reboot
elif [ "$1" = "halt" ]; then
	halt
else
	echo unknown option
fi
