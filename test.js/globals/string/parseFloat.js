#!/usr/bin/env node.js

const str = 'ads3dsafd.ads1asd4';

const resA = str.parseFloat();
const resB = parseFloat(str);

dir(resA, str.toString('"') + '.parseFloat(10)');
dir(resB, 'parseFloat(' + str.toString('"') + ', 10)');

