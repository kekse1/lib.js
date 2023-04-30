#!/usr/bin/env node.js

const string = 'Hello World!';
const encoding = 'base64';

const result = string.toUint8Array(0, string.length, encoding);

dir(result, string.quote('"') + '.toUint8Array(..., ' + encoding.quote('"') + ')');

