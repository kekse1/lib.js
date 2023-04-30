#!/usr/bin/env bash

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "$dir/../")"
lib="$root/lib.js"

#
#. "$dir/text.sh"

#
search="$lib"
match="*.js"

if [[ ! -d "$search" ]]; then
	echo " >> Not a directory ($search)!" >&2
	exit 1
fi

#
files=0
lines=0
update="$((`date +'%s%N'`/1000000))"

#
IFS=$'\n'
for i in `find $search -type f -iname "$match"`; do
	let files=$files+1
	let current=`wc -l "$i" | cut -d' ' -f1`
	let lines=$lines+$current
done

update="$((`date +'%s%N'`/1000000))"
#files="`toText $files`"
#lines="`toText $lines`"
defaults=""
defaultsCounter=0

IFS=$'\n'
for i in `grep -r 'const DEFAULT_' "$lib"`; do
	let defaultsCounter=$defaultsCounter+1
	defaults="$defaults
$(echo "$i" | cut -d' ' -f2)"
done
defaults="${defaults:1}"

#
UPDATE="update.txt"
LINES="lines.txt"
FILES="files.txt"
DEFAULTS="DEFAULTS.txt"
COUNTING="defaults.txt"

#
DIRECTORY="./"

#
if [[ $# -gt 0 ]]; then
	DIRECTORY="$(realpath "$1")"
	
	if [[ ! -d "$DIRECTORY" ]]; then
		echo " >> This is not an existing directory ($((realpath "$1")))!" >&2
		exit 1
	fi
fi

FILES="$DIRECTORY/$FILES"
LINES="$DIRECTORY/$LINES"
UPDATE="$DIRECTORY/$UPDATE"
DEFAULTS="$DIRECTORY/$DEFAULTS"
COUNTING="$DIRECTORY/$COUNTING"

if [[ $# -eq 0 ]]; then
	echo "  Update: $update"
	echo "   Files: $files"
	echo "   Lines: $lines"
	echo "Defaults: $defaultsCounter"
else
	echo -n "$update" >"$UPDATE"
	echo "  Update: $update"
	echo -n "$lines" >"$LINES"
	echo "   Files: $files"
	echo -n "$files" >"$FILES"
	echo "   Lines: $lines"
	echo -n "$defaults" >"$DEFAULTS"
	echo -n "$defaultsCounter" >"$COUNTING"
	echo "Defaults: $defaultsCounter"

	echo
	echo "Written to:"
	echo " >> '$UPDATE'"
	echo " >> '$LINES'"
	echo " >> '$FILES'"
	echo " >> '$DEFAULTS'"
	echo " >> '$COUNTING'"
fi

