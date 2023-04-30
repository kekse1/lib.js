#!/usr/bin/env bash

#
opt="/opt/node.js"

#
if [[ -d "/data/data/com.termux/" ]]; then
	opt="/data/data/com.termux/files/usr/${opt}"
elif [[ `id -u` -ne 0 ]]; then
	echo " >> You need to be the 'root' superuser to do this.." >&2
	exit 1
fi

#
versions=""
current="$(basename $(realpath "$opt/0"))"

listAvailable()
{
	echo
	echo ' >> Available versions:'
	echo

	for i in $opt/*; do
		base="$(basename "$i")"
		[[ "$base" = "0" ]] && continue
		[[ ! -d "$i" ]] && continue

		c=""
		[[ "$base" = "$current" ]] && c="*"

		versions="$versions
$base"
		#
		if [[ -z "$c" ]]; then
			echo "    $base"
		else
			echo " *  $base"
		fi
	done
	echo
}

selectVersion()
{
	sel()
	{
		[[ -L "$opt/0" ]] && rm "$opt/0"
		ln -s $1 "$opt/0"

		echo " >> Version '$1' selected! :-)"
	}

	if [[ -d "$opt/$1" ]]; then
		if [[ "$1" = "$current" ]]; then
			echo " >> Your version '$1' is already selected." >&2
			exit 2
		fi

		sel $1
	else
		echo " >> Version '$1' is unavailable." >&2
		exit 3
	fi
}

#
if [[ $# -eq 0 ]]; then
	listAvailable
else
	selectVersion $1
fi

