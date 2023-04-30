#!/usr/bin/env node.js

//
var string = '';
const hash = 'sha3-512';

//
dir(String.hash, 'String.hash');
console.eol(4);

//
const res1 = string.hash(hash, 'utf8');
const res2 = string.hash(hash, 'hex');
const res3 = string.hash(hash, 'base64');

//
string = string.quote('"');

dir(res1, string + '.hash("' + hash + '", "utf8")');
dir(res2, string + '.hash("' + hash + '", "hex")');
dir(res3, string + '.hash("' + hash + '", "base64")');

console.eol();

