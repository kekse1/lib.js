#!/usr/bin/env node.js

const dimensions = FIELD.getRadixDimensions(2, 8);

const resultNumber = FIELD.getLength(false, dimensions);
const resultBigInt = FIELD.getLength(true, ... dimensions);

dir(resultNumber, 'FIELD.getLength(false, FIELD.getRadixDimensions(2, 8))');
dir(resultBigInt, 'FIELD.getLength(true, ... FIELD.getRadixDimensions(2, 8))');

