#!/usr/bin/env node.js

//
const field = FIELD.create(3, 3);

//
const idx1 = field.index(0, 0);
const idx2 = field.index(0, 1);
const idx3 = field.index(0, 2);
const idx4 = field.index(1, 0);
const idx5 = field.index(1, 1);
const idx6 = field.index(1, 2);
const idx7 = field.index(2, 0);
const idx8 = field.index(2, 1);
const idx9 = field.index(2, 2);

const idxA = field.index(3, 0);
const idxB = field.index(3, 1);

const idxC = field.index(-1, -1);
const idxD = field.index(0, -1);
const idxE = field.index(-1, 0);

const idxF = field.index(4, 3, 2, 1);

//
dir(field.toString(), 'FIELD.create(3, 3) // w/ DEFAULTS (.*modulo / DEFAULT_MODULO_*)');
console.eol(4);
dir(idx1, '(field).index(0, 0)');
dir(idx2, '(field).index(0, 1)');
dir(idx3, '(field).index(0, 2)');
dir(idx4, '(field).index(1, 0)');
dir(idx5, '(field).index(1, 1)');
dir(idx6, '(field).index(), 2');
dir(idx7, '(field).index(2, 0)');
dir(idx8, '(field).index(2, 1)');
dir(idx9, '(field).index(2, 2)');
console.eol();
dir(idxA, '(field).index(3, 0)');
dir(idxB, '(field).index(3, 1)');
console.eol(2);
dir(idxC, '(field).index(-1, -1)');
dir(idxD, '(field).index(0, -1)');
dir(idxE, '(field).index(-1, 0)');
console.eol(2);
dir(idxF, '(field).index(4, 3, 2, 1)');

