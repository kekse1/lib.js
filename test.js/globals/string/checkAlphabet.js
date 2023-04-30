#!/usr/bin/env node.js

var string1 = 'dies ist ein test';
var string2 = '0123456789AbCdEf';
var stringU = String.fromCodePoint(256) + String.fromCodePoint(257);

const result1False = string1.checkAlphabet(16);
const result1True = string1.checkAlphabet(65536);
const result1AlwaysTrue = string1.checkAlphabet(string1);

const result2False = string2.checkAlphabet();
const result2True = string2.checkAlphabet(16);
const result2AlwaysTrue = string2.checkAlphabet(string2);

const resultUTrue1 = stringU.checkAlphabet(256);
const resultUFalse = stringU.checkAlphabet(257);
const resultUTrue2 = stringU.checkAlphabet(258);

string1 = string1.quote('"');
string2 = string2.quote('"');
stringU = stringU.toArray(true).toString({depth:1,colors:false});

dir(result1False, string1 + '.checkAlphabet(16)');
dir(result1True, string1 + '.checkAlphabet(65536)');
dir(result1AlwaysTrue, string1 + '.checkAlphabet(' + string1 + ')');
console.eol(2);
dir(result2False, string2 + '.checkAlphabet()');
dir(result2True, string2 + '.checkAlphabet(16)');
dir(result2AlwaysTrue, string2 + '.checkAlphabet(' + string2 + ')');
console.eol(2);
dir(resultUTrue1, stringU + '.checkAlphabet(256)');
dir(resultUFalse, stringU + '.checkAlphabet(257)');
dir(resultUTrue2, stringU + '.checkAlphabet(258)');

