#!/usr/bin/env node.js

const field = FIELD.create(4, 3, 2, 1);

const res1 = field.coordinates(-1);

field.repeatDimensions = false;
const res2 = field.bigCoordinates(43210);
field.repeatDimensions = true;
const res3 = field.bigCoordinates(43210);

dir(field.toString(), 'FIELD.create(4, 3, 2, 1)');
console.eol(4);
dir(res1, '(field).coordinates(-1)');
console.eol(2);
dir(res2, '(field).bigCoordinates(43210) w/ .repeatDimensions = false;');
console.eol();
dir(res3, '(field).bigCoordinates(43210) w/ .repeatDimensions = true;');

