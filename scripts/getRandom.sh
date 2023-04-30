#!/usr/bin/env bash
#modulo=11
#echo "$(($RANDOM % $modulo))"

getRandom()
{
	max=1
	min=0

	if [[ $# -gt 0 ]]; then
		max=$1

		if [[ $# -gt 1 ]]; then
			min=$2
		fi
	fi

	[[ -n $1 ]] && max=$1
	[[ -n $2 ]] && min=$2

	echo -n "$((($RANDOM % ($max - $min + 1)) + $min))"
}

