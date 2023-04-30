#!/bin/bash

onlyFind="$1"

if [[ -z "$onlyFind" ]]; then
	read -p "Do you really want to do this here (`pwd`)!? [yes/no] " really

	case "$really" in
		y*|Y*);;
		*) echo "Aborted..."; exit 1;;
	esac
fi

IFS=$'\n'

for i in `find ./ -type f -iname '*.js'`; do
	first="$(head -n1 "$i")"

	#if [[ "$first" = '#!/usr/bin/env node.js' ]]; then
	if [[ "${first::3}" = '#!/' ]]; then
		if [[ -z "$onlyFind" ]]; then
			chmod -v +x "$i"
		else
			echo "$i"
		fi
	fi
done

