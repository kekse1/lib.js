#!/usr/bin/env bash

real="$(realpath "$0")"
dir="$(dirname "$real")"
work="$(realpath "`pwd`")"

#
if [[ $# -eq 0 ]]; then
	echo " >> Syntax: <sed expression> <file mask> <new backup directory>" >&2
	exit 255
fi

#
SED="$1"
FIND="$2"
BACKUP="$3"

#
deadFile=".dead"

if [[ -z "$SED" ]]; then
	echo " >> Your \`sed\` regular expression is not defined." >&2
	echo " >> You should define it within ' quotation marks" >&2
	exit 1
else
	testCmd="echo | sed '$SED' 2>&1"
	testCmd="$(eval "$testCmd")"

	if [[ $? -ne 0 ]]; then
		echo " >> Invalid \`sed\` sequence:" >&2
		echo "$testCmd"
	fi
fi

if [[ -z "$FIND" ]]; then
	echo " >> Your search pattern is empty.. to replace all files, set '*' as second argument." >&2
	echo " >> Consider it should NOT be evaluated by your shell, so use ' quotation marks, please.." >&2
	exit 2
fi

if [[ -z "$BACKUP" ]]; then
	echo " >> To be really sure, confirm your wish by arguing with a BACKUP DIRECTORY as third argument." >&2
	exit 3
elif [[ ! -d "$BACKUP" ]]; then
	echo " >> Your BACKUP directory doesn't exist. Please create it first.." >&2
	exit 4
else
	BACKUP="$(realpath "$BACKUP")"
fi

if [[ "${BACKUP##${work}}" != "${BACKUP}" ]]; then
	echo " >> WARNING: Your BACKUP directory may not be below the target directory (where files would be searched)!" >&2
	echo " >> PLEASE give me another BACKUP directory BELOW '${work}'..!" >&2
	exit 5
else
	echo " >> GREAT, your BACKUP directory is outside this target directory (CWD) '$work'! :-)"
fi

#
if [[ -f "$BACKUP/${deadFile}" ]]; then
	echo " >> ERROR: You can NOT use a BACKUP directory twice; that'd be really foolish! ;-/" >&2
	exit 6
else
	read -p " >> Are you sure to replace all '$FIND' files(!) via '$SED'...!? <yes|no> " sure

	case "$sure" in
		y*|Y*) ;;
		*) echo " >> So we\'re aborting right here, right now.."; exit 254;;
	esac

	echo "`date +'%s%N'`" >"$BACKUP/${deadFile}"
fi

#
echo

total=0
changed=0
same=0

IFS=$'\n'

for i in `find -type f -iname "$FIND"`; do
	backupFile="${i//\//_}"
	[[ "${backupFile::1}" = "." ]] && backupFile="${backupFile:1}"
	backupPath="${BACKUP}/${backupFile}"

	cp "$i" "${backupPath}"
	cmd="sed '$SED' '$i' >'$i.sed-tmp'"
	eval "$cmd"

	diff "$i" "$i.sed-tmp" >/dev/null 2>&1

	if [[ $? -eq 0 ]]; then
		rm "${backupPath}"
		rm "$i.sed-tmp"
		let same=$same+1
	else
		mv "$i.sed-tmp" "$i"
		chmod --reference="$backupPath" "$i"
		echo " >> '$i' (=> '$backupFile')"
		let changed=$changed+1
	fi

	let total=$total+1
done

[[ $changed -ne 0 ]] && echo
echo " >> The \`sed\` sequence was '$SED'."
echo " >> ${total} files in total, ${changed} changed (so ${same} stayed the same)."

if [[ $changed -eq 0 ]]; then
	rm "${BACKUP}/.dead"
else
	echo " >> Please do NOT use your BACKUP directory ($BACKUP) later again..! ^_^"
fi

