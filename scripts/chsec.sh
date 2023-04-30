#!/usr/bin/env bash
#
# BTW: this is an older script, which has not been testen quite a while ago... TODO: test! ^_^
#

if [ $# -eq 0 ]; then

	echo -e "\n\tSyntax: chsec.sh <path> \"YES\"\n"

	echo -e "Use this script to secure all your files, best if you chose '/home/\$user/' as directory argument!"
	echo -e "\nThat way all of your files will be \`chmod\`-altered to only be available for YOU, and YOU ONLY!"
	echo -e "All other users may *not* access your files, even if they're in the same group as you..!!\n\n"
	
	echo -e "After the directory (may also be '.' or './', but best would be '/home/\$user/') you NEED to argue"
	echo -e "with \"YES\" (upper-case), just to remind you, that *every* file below the start directory will be"
	echo -e "REALLY altered (only by \`chmod\`)! Maybe you want to backup them?\n\n"

	echo -e "(@ BACKUP:) I JUST FORCED TO LOG EVERY *OLD* MODE STATE OF ALL YOUR CHANGED FILES. JUST IN CASE.."
	echo -e "YOU'LL FIND THIS LOG WITH ALL THE OTHER LOGS (including a single file for additional STICKY BITs)"
	echo -e "IN './tmp/chsec-*.log' (directly under your specified directory!)!"

	echo
	exit

fi

P="$(realpath "$1")"

if [ -d "$P" ]; then
	chmod 700 "$P"
else
	echo -e "\n\tSyntax: chsec.sh <path> \"YES\""
	echo -e "\nYour directory is not available.. you could e.g. use '.', './' or '/home/$USER/'(!)"

	echo
	exit 1
fi

if [ "$2" != "YES" ]; then

	echo -e "\n\tSyntax: chsec.sh <path> \"YES\""

	echo -e "\nPlease beware of changing so many file modes (recursively) blindfold... to be sure you consider"
	echo -e "this, you need to append \"YES\" to your command line input! Just to be sure you're really sure.."

	echo
	exit 2
	
fi

LOGS="${P}/tmp/chsec"
mkdir -pv "$LOGS/" 2>/dev/null

BACKUP="chsec-MODE-BACKUP.log"
ERRORS="chsec-ERRORS.log"
DIR="chsec-DIRECTORIES.log"
FILE_X="chsec-EXECUTABLES.log"
FILE_NX="chsec-FILES.log"
STICKY="chsec-STICKY.log"

rm "$LOGS/$BACKUP" 2>/dev/null
rm "$LOGS/$ERRORS" 2>/dev/null
rm "$LOGS/$DIR" 2>/dev/null
rm "$LOGS/$FILE_X" 2>/dev/null
rm "$LOGS/$FILE_NX" 2>/dev/null
rm "$LOGS/$STICKY" 2>/dev/null

#
errors=0
total=0

IFS=$'\n'
for i in $(find "$P/" -type d); do

	file="${i//\'/\\\'}"

	[ -L "$i" ] && continue
	let total=$total+1

	OLD="$(stat -c '%a' "$i")"
	echo -e "$OLD\t$i" >>$LOGS/$BACKUP

	CMD="chmod"

	if [ -k "$file" ]; then
		CMD="$CMD 1700 $'$file'"
		echo -e "$CMD" >>$LOGS/$STICKY
	else
		CMD="$CMD 700 $'$file'"
	fi
	echo -e "$CMD" >>$LOGS/$DIR

	eval "$CMD"

	if [ $? -ne 0 ]; then
		echo -e "$i" >>$LOGS/$ERRORS
		let errors=$errors+1
	fi
done

for i in $(find "$P/" -type f); do

	file="${i//\'/\\\'}"

	[ -L "$i" ] && continue
	let total=$total+1

	OLD="$(stat -c '%a' "$i")"
	echo -e "$OLD\t$i" >>$LOGS/$BACKUP

	CMD="chmod"

	if [ -x "$i" ]; then
		if [ -k "$file" ]; then
			CMD="$CMD 1700 $'$file'"
			echo -e "$CMD" >>$LOGS/$STICKY
		else
			CMD="$CMD 700 $'$file'"
		fi
		echo -e "$CMD" >>$LOGS/$FILE_X
	else
		if [ -k "$file" ]; then
			CMD="$CMD 1600 $'$file'"
			echo -e "$CMD" >>$LOGS/$STICKY
		else
			CMD="$CMD 600 $'$file'"
		fi
		echo -e "$CMD" >>$LOGS/$FILE_NX
	fi

	eval "$CMD"

	if [ $? -ne 0 ]; then
		echo -e "$i" >>$LOGS/$ERRORS
		let errors=$errors+1
	fi
done

# also secure your new log files..
chmod 700 $LOGS $LOGS/ 2>/dev/null
chmod 600 $LOGS/$BACKUP 2>/dev/null
chmod 600 $LOGS/$ERRORS 2>/dev/null
chmod 600 $LOGS/$DIR 2>/dev/null
chmod 600 $LOGS/$FILE_X 2>/dev/null
chmod 600 $LOGS/$FILE_NX 2>/dev/null
chmod 600 $LOGS/$STICKY 2>/dev/null

#
echo -e "\n\n >> List of changed files and ERRORS in '$LOGS/*.log'."
echo -en " >> $errors ERRORS occured"

if [ $errors -eq 0 ]; then
	echo -e ". :-)"
else
	echo -e "!! :-("
fi

echo -e "\n >> Everything's DONE. Affected $total entries.. :-)"

