#!/usr/bin/env node.js

require('tty/vector');

const arr = [ 0.25, 0.75, -1.5 ];

const ratio = vector.ratio(arr);
const ratioX = vector.ratio.x(arr);
const ratioY = vector.ratio.y(arr);

dir(arr, '(array)');
console.eol(7);

dir(ratio, 'vector.ratio(array)');
dir(ratioX, 'vector.ratio.x(array)');
dir(ratioY, 'vector.ratio.y(array)');

console.eol(4);

const createdX = vector.ratio.createX(ratioX);
const createdY = vector.ratio.createY(ratioY);

dir(createdX, 'vector.ratio.createX(...)');
dir(createdY, 'vector.ratio.createY(...)');

console.eol(4);

const wrongXYx = vector.ratio.createX(ratioY);
const wrongXYy = vector.ratio.createY(ratioX);

dir(wrongXYx, 'vector.ratio.createX(*Y*-coords!)');
dir(wrongXYy, 'vector.ratio.createY(*X*-coords!)');

