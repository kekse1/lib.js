#!/usr/bin/env node.js

const str = 'eins zwei drei vier'.toRandomCase();
const needles = [ 'zwei'.toRandomCase(), 'drei'.toRandomCase() ];

const resFalse = str.has('a', 'b');
const resTrue = str.has(... needles);

dir(resFalse, str.toString('"') + '.has("a", "b")');
dir(resTrue, str.toString('"') + '.has(' + needles.join(', ') + ')');

