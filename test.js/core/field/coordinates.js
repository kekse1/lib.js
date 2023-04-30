#!/usr/bin/env node.js

//
const field = FIELD.create(3, 3);

//
const coords1 = field.coordinates(0);
const coords2 = field.coordinates(1);
const coords3 = field.coordinates(2);
const coords4 = field.coordinates(3);
const coords5 = field.coordinates(4);
const coords6 = field.coordinates(5);
const coords7 = field.coordinates(6);
const coords8 = field.coordinates(7);
const coords9 = field.coordinates(8);

const coordsA = field.coordinates(9);
const coordsB = field.coordinates(10);
const coordsC = field.coordinates(11);

const coordsD = field.coordinates(-1);
const coordsE = field.coordinates(-2);
const coordsF = field.coordinates(-3);
const coordsG = field.coordinates(-4);

//
dir(field.toString(), 'FIELD.create(3, 3) // w/ DEFAULTS (.*modulo / DEFAULT_MODULO_*)');
console.eol(4);

dir(coords1, '(field).coordinates(0)');
dir(coords2, '(field).coordinates(1)');
dir(coords3, '(field).coordinates(2)');
dir(coords4, '(field).coordinates(3)');
dir(coords5, '(field).coordinates(4)');
dir(coords6, '(field).coordinates(5)');
dir(coords7, '(field).coordinates(6)');
dir(coords8, '(field).coordinates(7)');
dir(coords9, '(field).coordinates(8)');
console.eol(3);
dir(coordsA, '(field).coordinates(9)');
dir(coordsB, '(field).coordinates(10)');
dir(coordsC, '(field).coordinates(11)');
console.eol(2);
dir(coordsD, '(field).coordinates(-1)');
dir(coordsE, '(field).coordinates(-2)');
dir(coordsF, '(field).coordinates(-3)');
dir(coordsG, '(field).coordinates(-4)');

