#!/usr/bin/env node.js

const a = [ 1, 1, 2, 3, 4 ];

const r1 = a.contains(2, 4);//true
const r2 = a.contains(1, 2, 3, 4);//true
const r3 = a.contains(1, 1, 2);//true
const r4 = a.contains(1, 1, 1, 2);//false
const r5 = a.contains(5);//false

dir(a, '(array)');
console.eol(4);
dir(r1, '(array).contains(2, 4); //true');
dir(r2, '(array).contains(1, 2, 3, 4); //true');
dir(r3, '(array).contains(1, 1, 2); //true');
dir(r4, '(array).contains(1, 1, 1, 2); //false');
dir(r5, '(array).contains(5); //false');

