#!/usr/bin/env node.js

const str = '---FfFf';

const resFalse = parseInt(str);
const resTrue = parseInt(str, 16);

dir(resFalse, 'parseInt("' + str + '")');
dir(resTrue, 'parseInt("' + str + '", 16)');

