#!/usr/bin/env node.js

const enc1 = null;
const enc2 = 'base64';
const enc3 = 2;
const enc4 = 'abcdef';

const string = 'Hello World!';

console.eol();
dir(string, '(string)');
console.eol(3);

//
var res1 = string.encode(enc1);
var res2 = string.encode(enc2);
var res3 = string.encode(enc3, true);
var res4 = string.encode(enc4, true);

dir(res1, '(null)');
dir(res2, '("base64")');
dir(res3, '(2)');
dir(res4, '("abcdef")');

console.eol(2);

//
res1 = String.fromUint8Array(res1);
res2 = res2.decode(enc2);
res3 = res3.decode(enc3, true);
res4 = res4.decode(enc4, true);

dir(res1);
dir(res2);
dir(res3);
dir(res4);

