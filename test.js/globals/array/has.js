#!/usr/bin/env node.js

const array = [ 'eins zwei drei vier'.toRandomCase(), 'eins zwei'.toRandomCase() ];
const needles = [ 'eins zwei'.toRandomCase(), 'ab cd', 'def' ];

const resFalse = array.has(... needles);
const resFalse2 = array.has(... needles.subarr(0, 2));
const resTrue = array.has(needles[0]);

dir(array, '(array)');
console.eol(3);
dir(resFalse, '(array).has(... ' + needles.join(', ') + ')');
dir(resFalse2, '(array).has(... ' + needles.subarr(0, 2).join(', ') + ')');
dir(resTrue, '(array).has(' + needles[0] + ')');

