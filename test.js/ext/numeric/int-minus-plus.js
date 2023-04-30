#!/usr/bin/env node.js
const strTrue = '+-+-12';
const strFalse = '+-+-';

const resTrue = strTrue.isInt();
const resFalse = strFalse.isInt();

const resOne = strTrue.parseInt();
const resTwo = strFalse.parseInt();

dir(resOne + ' / ' + resTrue, strTrue.quote('"'));
dir(resTwo + ' / ' + resFalse, strFalse.quote('"'));

console.eol(3);
dir('-'.isInt(), '"-".isInt()');
dir('+'.isInt(), '"+".isInt()');

