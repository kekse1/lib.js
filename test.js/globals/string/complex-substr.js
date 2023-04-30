#!/usr/bin/env node.js

const str = 'test'.underline + 'abcdef' + 'ghijkl'.highBG + 'xyzyxxx...';

const res1 = str.ansiSubstr(3, 16);	// both are..
const res2 = str.substr(3, 16, true);	// ..the same.

dir(str, '.. => (..).ansiSubstr(3, 16); // => "tabcdefGHIJKLxyz"');
stdout(str);
console.eol(3);
stdout(res1);
stdout(res2);

