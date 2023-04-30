#!/usr/bin/env bash

real="$(realpath "$0")"
dir="$(dirname "$real")"
base="$(basename "$real")"
script="${dir}/getRandom.sh"

#
. "$script"

#
max=9
min=0

if [[ $# -eq 0 ]]; then
	echo " >> Syntax: ${base} <count> [ <max> [ <min> ] ]" >&2
	exit 1
elif [[ $# -gt 1 ]]; then
	if [[ $# -eq 2 ]]; then
		max=$2
	elif [[ $# -ge 3 ]]; then
		min=$3
	fi
fi

for i in `seq 1 $1`; do
	getRandom $max $min
done

