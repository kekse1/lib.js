#!/usr/bin/env node.js

//
const dimensions = FIELD.getRadixDimensions(2, 8);
const coordinates = [ 1, 0, 1, 0, 1 ]; //21 in binary.. see field-radix (2) [above]

//
const length = FIELD.getLength(null, dimensions);

const result1 = FIELD.getIndex(true, dimensions, coordinates);
const result2 = FIELD.getIndex(false, dimensions, ... coordinates);

//
dir(dimensions, 'FIELD.getRadixDimensions(2, 8)');
dir(length, 'FIELD.getLength(null, (dimensions))');
console.eol(2);
dir(coordinates, '(coordinates equal (21))');
console.eol(4);
dir(result1, 'FIELD.getIndex(true, dimensions, coordinates)');
dir(result2, 'FIELD.getIndex(false, dimensions, ... coordinates)');

