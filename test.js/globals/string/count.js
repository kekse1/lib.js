#!/usr/bin/env node.js

var compare = 'eins zwei drei vier fuenf sechs sieben drei zwei eins';
const search = [ 'zwei', 'vier', 'drei', 'eins', 'eins' ];

const resultZero = compare.count('xyz');
const resultOne = compare.count('zwei');
const resultManyMultiply = compare.count(true, ... search);
const resultManyNoMultiply = compare.count(... search, false);
const resultMultiply = compare.count(true, 'xyz', 'sieben', 'sieben');
const resultNoMultiply = compare.count('sieben', 'sieben', false);

compare = compare.quote('"');

dir(resultZero, compare + '.compare("xyz") // 0');
dir(resultOne, compare + '.compare("zwei") // 2');
dir(resultManyMultiply, compare + '.compare(true, ... ' + search.toString({depth:1,colors:false}) + ') // 9');
dir(resultManyNoMultiply, compare + '.compare(... ' + search.toString({depth:1,colors:false}) + ', false) // 7');
dir(resultMultiply, compare + '.compare(true, "xyz", "sieben", "sieben") // 2');
dir(resultNoMultiply, compare + '.compare("sieben", "sieben", false) // 1');

