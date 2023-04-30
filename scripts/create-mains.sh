#!/usr/bin/env bash

FILE="main.js"

#
force="no"

for i in "$@"; do
	if [[ "$i" = "--force" ]]; then
		force="yes"
	elif [[ "$i" = "-f" ]]; then
		force="yes"
	fi
done

real="$(realpath "$0")"
dir="$(dirname "$real")"
lib="$(realpath "$dir/../lib.js/")"
work="$(realpath "`pwd`")"

if [[ "$force" = "no" ]]; then
	if [[ "${work##${lib}}" = "$work" ]]; then
		echo " >> WARNING: You are below the ./lib.js/ directory.." >&2
		echo -n " >>          Do you really want to continue <yes/no>? "
		read cont

		case "$cont" in
			y*|Y*);;
			*) exit;;
		esac
	fi
fi

#
total=0
existed=0
created=0

IFS=$'\n'
for i in `find ./ -type d`; do
	let total=$total+1

	if [[ -e "$i/${FILE}" ]]; then
		echo "[exists] '$i'"
		let existed=$existed+1
	else
		echo -n "[CREATE] '$i' ... "
		ls $i/ | grep -v ${FILE} >>"$i/${FILE}"
		echo "OK!"
		let created=$created+1
	fi
done

echo; echo
echo " >> Total $total directories, $created created '${FILE}', $existed '${FILE}' already existed"
echo

