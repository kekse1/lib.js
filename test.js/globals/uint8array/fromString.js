#!/usr/bin/env node.js

const string = ' a b c ';
const result = Uint8Array.fromString(string, 1, string.length - 2);

dir(result, 'Uint8Array.fromString("' + string + '", 1, (string).length - 2)');

