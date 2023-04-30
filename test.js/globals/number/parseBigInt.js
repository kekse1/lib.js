#!/usr/bin/env node.js

const str = '---FfFf';

const resFalse = parseBigInt(str);
const resTrue = parseBigInt(str, 16);

dir(resFalse, 'parseBigInt("' + str + '")');
dir(resTrue, 'parseBigInt("' + str + '", 16)');

