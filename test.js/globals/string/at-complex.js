#!/usr/bin/env node.js

//
const str = ((ESC + '[1m' + NUL) + 'testing' + (ESC + '[0m' + NUL));
//
const res0 = str.at(-1);
const res1 = str.at(0, null, null, true);//'t'
const res2 = str.at(-1, null, null, true);//'g'
//
const res3 = str.at(1, 'EstINg', false, true)
const res4 = str.at(0, 'TEST', true, true);
const res5 = str.at(-2, 'ng', null, true);

//
dir(res0, str.toString('"') + '.at(-1) // \'<NUL>\'');
dir(res1, str.toString('"') + '.at(0, null, null, true) // \'t\'');
dir(res2, str.toString('"') + '.at(-1, null, null, true) // \'g\'');
dir(res3, str.toString('"') + '.at(1, "EstINg", false, true) // true');
dir(res4, str.toString('"') + '.at(0, "TEST", true, true) // false');
dir(res5, str.toString('"') + '.at(-2, "ng", null, true) // true');

