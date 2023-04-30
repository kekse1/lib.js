#!/usr/bin/env bash

BACKUP="BACKUP"
ORIG="ORIG"

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
base="$(realpath "$dir/../")"

[[ -d "$base.$BACKUP" ]] && rm -rf "$base.$BACKUP"
cp -r "$base" "$base.$BACKUP"
rm -rf "$base.$BACKUP/.git"
echo "`date +'$s%N'`" >"$base.$BACKUP/date.txt"

curr="`pwd`"
cd "$base"

#if [[ ! -d /data/data/com.termux/ ]]; then
#	if [[ -x "${dir}/keep.sh" ]]; then
#		eval "${dir}/keep.sh && echo && echo"
#	fi
#fi

git pull
git add --all
git commit -m "`date +'%s%N'`"
git push

cd "$curr"

[[ -d "$base.$ORIG.$ORIG" ]] && rm -rf "$base.$ORIG.$ORIG"
[[ -d "$base.$ORIG" ]] && mv "$base.$ORIG" "$base.$ORIG.$ORIG"
[[ -d "$base.$ORIG.$ORIG" ]] && echo "`date +'%s%N'`" >"$base.$ORIG.$ORIG/date.txt"

cp -r "$base" "$base.$ORIG"
echo "`date +'%s%N'`" >"$base.$ORIG/date.txt"
rm -rf "$base.$ORIG/.git"

