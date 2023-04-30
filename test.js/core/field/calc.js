#!/usr/bin/env node.js

const field = FIELD.create(3, 3, 3);

const index1 = field.index(-1, -1, -1);
const index2 = field.index(-2, -1, -1);
const index3 = field.index(-1, -2, -1);
const index4 = field.index(0, 1, 0);
const index5 = field.index(0, 0, 1);
const index6 = field.index(2, 2, 2);

const coord1 = field.coordinates(index1);
const coord2 = field.coordinates(index2);
const coord3 = field.coordinates(index3);
const coord4 = field.coordinates(index4);
const coord5 = field.coordinates(index5);
const coord6 = field.coordinates(index6);

console.eol(2);
dir(field.toString(), 'FIELD.create(3, 3, 3)');
console.eol(3);

dir(index1, '(field).index(-1, -1, -1)');
dir(index2, '(field).index(-2, -1, -1)');
dir(index3, '(field).index(-1, -2, -1)');
dir(index4, '(field).index(0, 1, 0)');
dir(index5, '(field).index(0, 0, 1)');
dir(index6, '(field).index(2, 2, 2)');

console.eol();

dir(coord1, '(field).coordinates(' + index1 + ')');
dir(coord2, '(field).coordinates(' + index2 + ')');
dir(coord3, '(field).coordinates(' + index3 + ')');
dir(coord4, '(field).coordinates(' + index4 + ')');
dir(coord5, '(field).coordinates(' + index5 + ')');
dir(coord6, '(field).coordinates(' + index6 + ')');

console.eol(2);

