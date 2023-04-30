#!/usr/bin/env node.js

const sub = [ 2,4,6,8 ];
sub.SUB_A = 'erstes array-sub';
sub.SUB_B = 'zweites array-sub';
sub.SUB_C = [ 3, 6, 9 ];

const obj = { null: true, eins: { zwei: { drei: 'DREI', vier: 'VIER' }, drei: { vier: 'FUENF', fuenf: 'SECHS' }, vier: 'SIEBEN', acht: [ 2, 4, 6, 8 ], neun: sub }, zehn: sub, elf: 3.14 };
const flat = Object.flat(obj);
const res = Object.deflat(flat);

dir(obj, '(object)');
console.eol(6);
dir(flat, 'Object.flat((object))');
console.eol(6);
dir(res, 'Object.deflat((flat))');

