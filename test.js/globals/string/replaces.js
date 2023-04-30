#!/usr/bin/env node.js

//
var str = 'tetestst';

const res0 = str.replaces('test', '');
const res1 = str.replaces('tEsT', '');
const res2 = str.replaces('tEsT', '', false);
const res3 = str.replaces('test', '', null);
const res4 = str.replaces('Test', '', 0, true);
const res5 = str.replaces('tEST', '', false, 1);
const res6 = str.replaces('test', '', 1, true);
const res7 = str.replaces('/TeSt/gi', '');
const res8 = str.replaces('/tEsT/gi', '', 1);

//
str = str.toString('"') + '.replaces(';

//
dir(res0, str + '"test", "")');
dir(res1, str + '"tEsT", "")');
dir(res2, str + '"tEsT", "", false)');
dir(res3, str + '"test", "", null)');
dir(res4, str + '"Test", "", 0, true)');
dir(res5, str + '"tEST", "", false, 1)');
dir(res6, str + '"test", "", 1, true)');
dir(res7, str + '/TeSt/gi, "")');
dir(res8, str + '/tEsT/gi, "", 1)');

