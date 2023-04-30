#!/usr/bin/env node.js

const a = [ 60, 40, 20, 0 ];
const b = [ 90, 60, 30 ];

a.one = 60n;
a.two = 40n;
a.three = 20n;
a.four = 0n;

b.three = 30n;
b.two = 60n;
b.one = 90n;

const res = Math.distance(a, b);

dir(a, '(a)');
dir(b, '(b)');
console.eol(3);
dir(res, 'Math.distance(a, b)');

