#!/bin/bash

# TODO # 'DELETE' parameter, so the files will be deleted everywhere..!! ;-)
# TODO # better output, maybe only a --summary or so..
# TODO # really show every .keep created path in a line!?
# TODO # eher auch hier --summary, oder? ;-)
# TODO # shell-getopt!?? gibts', aber evtl selbst meines von lib.js..!?! 

KEEP_FILENAME=".keep"

if [[ -n "$*" ]]; then
	KEEP_FILENAME="$*"
	echo -e "WARNING: You changed the '.keep' filename to '$*'!\n"
fi

ERROR=0
ERROR_FILES=""
SUCCESS=0
SUCCESS_FILES=""
TOTAL=0
TOTAL_FILES=""
IGNORED=0
IGNORED_FILES=""
EXISTS=0
EXISTS_FILES=""

createKeepFile()
{
	if [[ -e "$*" ]]; then
		let EXISTS=$EXISTS+1
		EXISTS_FILES="$EXISTS_FILES '$*'"
		return
	fi
	
	touch "$*" >/dev/null 2>&1

	if [[ $? -eq 0 ]]; then
		echo -en " :-) "
		let SUCCESS=$SUCCESS+1
		SUCCESS_FILES="$SUCCESS_FILES '$*'"
	else
		echo -en " :-( "
		let ERROR=$ERROR+1
		ERROR_FILES="$ERROR_FILES '$*'"
	fi
	
	echo -e "\t'$*'"
}

IFS=$'\n'

for i in `find -L -type d -not -path '*/.git/*'`; do

	let TOTAL=$TOTAL+1
	TOTAL_FILES="$TOTAL_FILES '$i'"

	base="$(basename "$i")"

	if [[ "$i" = "." ]]; then
		createKeepFile "$i/$KEEP_FILENAME"
	elif [[ "${base::1}" = "." ]]; then
		let IGNORED=$IGNORED+1
		IGNORED_FILES="$IGNORED_FILES '$i'"
	else
		createKeepFile "$i/$KEEP_FILENAME"
	fi
done

TOTAL_FILES="${TOTAL_FILES:1}"
IGNORED_FILES="${IGNORED_FILES:1}"
SUCCESS_FILES="${SUCCESS_FILES:1}"
ERROR_FILES="${ERROR_FILES:1}"
EXISTS_FILES="${EXISTS_FILES:1}"

#
#TODO#

#printf "\n >> %${LEN}d .keep's created.\n >> %${LEN}d already existed.\n >> %${LEN}d couldn't be created.\n" "$OK" "$EX" "$ERR"

