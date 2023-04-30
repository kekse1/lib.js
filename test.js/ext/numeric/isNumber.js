#!/usr/bin/env node.js

var str = '11111111';

const res1 = isNumber(str, '012');
const res2 = isNumber(str, true);
const res3 = isNumber(str, 2);

console.eol();

dir(res1, 'isNumber("' + str + '", "01")');
dir(res2, 'isNumber("' + str + '", true)');
dir(res3, 'isNumber("' + str + '", 2)');
console.eol();

str = 'ffff';

const res4 = isInt(str);
const res5 = isInt(str, 16);
const res6 = isInt(str, 'efg');

dir(res4, 'isInt("' + str + '")');
dir(res5, 'isInt("' + str + '", 16)');
dir(res6, 'isInt("' + str + '", "efg")');
console.eol();

const res7 = isFloat(str);
const res8 = isFloat(str, 16);

dir(res7, 'isFloat("' + str + '")');
dir(res8, 'isFloat("' + str + '", 16)');
console.eol();

const res9 = isNumber(3.14);
const resa = isInt(3.14);
const resb = isFloat(3.14);

dir(res9, 'isNumber(3.14)');
dir(resa, 'isInt(3.14)');
dir(resb, 'isFloat(3.14)');
console.eol();

const resc = isNumber('3.14');
const resd = isNumber('3.14', true);

dir(resc, 'isNumber("3.14")');
dir(resd, 'isNumber("3.14", true)');
console.eol();

