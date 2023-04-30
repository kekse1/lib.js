#!/usr/bin/env node.js

//
var string = 'teteststabcdeF';

const res0 = string.remove('test', 'def');
const res1 = string.remove('test', 0, 'def');
const res2 = string.remove('test', false, 'def');
const res3 = string.remove('test', null, true, 'def');
const res4 = string.remove(/tEsT/gi);
const res5 = string.remove(/TeSt/gi, 1);

//
string = string.toString('"') + '.remove("test", ';

//
dir(res0, string + '"def")');
dir(res1, string + '0, "def")');
dir(res2, string + 'false, "def")');
dir(res3, string + 'null, true, "def")');
dir(res4, string + '/tEsT/gi)');
dir(res5, string + '/TeSt/gi, 1)');

//
var str = 'tetestst';

const r1 = str.remove(/test/gi);
const r2 = str.remove(/test/gi, 2);

str = str.quote('"') + '.remove(/';

console.eol(4);
dir(r1, str + 'test/gi)');
dir(r2, str + 'test/gi, 2)');

