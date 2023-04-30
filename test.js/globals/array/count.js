#!/usr/bin/env node.js

var compare = 'eins zwei drei vier fuenf sechs sieben drei zwei eins'.split(' ');
const search = [ 'zwei', 'vier', 'drei', 'eins', 'eins' ];

const resultZero = compare.count('xyz');
const resultOne = compare.count('zwei');
const resultMany = compare.count(... search);
const resultMultiply = compare.count('xyz', 'sieben', 'sieben');

dir(compare, '(compare array)');
console.eol(4);

dir(resultZero, '(array).compare("xyz") // 0');
dir(resultOne, '(array).compare("zwei") // 2');
dir(resultMany, '(array).compare(... ' + search.toString({depth:1,colors:false}) + ') // 9');
dir(resultMultiply, '(array).compare("xyz", "sieben", "sieben") // 2');

