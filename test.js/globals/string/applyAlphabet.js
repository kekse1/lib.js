#!/usr/bin/env node.js

var string = 'dies ist ein test';

const result1 = string.applyAlphabet(16);
const result2 = string.applyAlphabet('te st');
const result3 = string.applyAlphabet(65536);

string = string.quote('"');

dir(result1, string + '.applyAlphabet(16)');
dir(result2, string + '.applyAlphabet("ein test")');
dir(result3, string + '.applyAlphabet(65536)');

