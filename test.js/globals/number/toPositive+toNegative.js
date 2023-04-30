#!/usr/bin/env node.js

var a = -3.14;
var b = 3.14;

const r1 = a.toNegative();
const r2 = a.toPositive();
const r3 = b.toNegative();
const r4 = b.toPositive();

a = a.toString().toString('(', ')');
b = b.toString().toString('(', ')');

dir(r1, a + '.toNegative()');
dir(r2, a + '.toPositive()');
dir(r3, b + '.toNegative()');
dir(r4, b + '.toPositive()');

