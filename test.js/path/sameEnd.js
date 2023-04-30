#!/usr/bin/env node.js

const end1 = [
	'/abc/def/c/a/ghi/jkl',
	'/cba/fed/b/a/ghi/jkl/',
	'/bbb/ccc/b/a/ghi/jkl//./'
];

const end2 = [
	'/tmp/test/a/xy/z',
	'/tmp/test/b/xy/z/.//'
];

const end3 = [
	'/a/b/tmp/',
	'a/./b/tmp',
	'./a/b/tmp',	//TODO [0]='/' weg
	'a/b/tmp//'	//TODO 'a' => 'x'
];

const end4 = [
	'/abc/def/ghi/',
	'/abc/def/ghi/'
];

//
console.eol(10);

const resEnd1 = path.sameEnd(... end1);
const resEnd2 = path.sameEnd(... end2);
const resEnd3 = path.sameEnd(... end3);
const resEnd4 = path.sameEnd(... end4);

//
console.eol(2);
dir(end1, '(end #1)');
dir(resEnd1, 'path.sameEnd(... (end #1)');
console.eol(3);
dir(end2, '(end #2)');
dir(resEnd2, 'path.sameEnd(... (end #2)');
console.eol(3);
dir(end3, '(end #3)');
dir(resEnd3, 'path.sameEnd(... (end #3)');
console.eol(3);
dir(end4, '(end #4)');
dir(resEnd4, 'path.sameEnd(... (end #4)');
console.eol();

