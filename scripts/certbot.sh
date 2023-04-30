#!/usr/bin/env bash

#
KEYSIZE=4096
LIVE="/etc/letsencrypt/live/"

#
if [[ `id -u` -ne 0 ]]; then
	echo " >> You need to be logged in as 'root' superuser." >&2
	exit 2
fi

if [[ -z "`which certbot 2>/dev/null`" ]]; then
	echo " >> \`certbot\` can\'t be found (in your \$PATH)!" >&2
	exit 3
fi

#
CMD="certbot certonly --standalone --rsa-key-size $KEYSIZE --cert-name"

if [[ $# -eq 0 ]]; then
	echo ">> Specify your domain w/ all additional ones (space by space)!" >&2
	exit 1
fi

main="$1"
[ -n "$1" ] && CMD="${CMD} $1 -d $1"
shift

if [[ -d "${LIVE}${main}" ]]; then
	echo " >> You already have main cert/key for domain '$main'!" >&2
	exit 7
fi

symlinks=""
for arg in "$@"; do
	symlinks="${symlinks} $arg"
	CMD="${CMD} -d $arg"
done
symlinks="${symlinks:1}"

for link in $symlinks; do
	if [[ -d "${LIVE}${link}" ]]; then
		echo " >> Your additional domain '$link' already exists as main domain!" >&2
		exit 8
	fi
done

echo
eval "$CMD"
res=$?
echo

if [[ $res -ne 0 ]]; then
	echo " >> Something went wrong ($res)!" >&2
	exit 5
elif [[ ! -d "$LIVE" ]]; then
	echo " >> Is your configured LIVE path maybe wrong ('$LIVE')?" >&2
	exit 6
fi

for link in $symlinks; do
	echo -n "    ... "
	
	if [[ -h "${LIVE}${link}" ]]; then
		rm "${LIVE}${link}"
		echo -n " REMOVED OLD ... "
	fi

	ln -sv $main "${LIVE}${link}"
done

