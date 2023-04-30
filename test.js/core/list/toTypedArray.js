#!/usr/bin/env node.js

const list = LIST.create(new Uint8ClampedArray([ 2, 4, 6, 8, 10, 12, 14, 16 ]));

dir(list.toString(), 'LIST.create(new Uint8ClampedArray([ 2, 4, 6, 8, 10, 12, 14, 16 ]))');
console.eol(7);

dir(list.array, 'list.array BEFORE conversion, w/ "Uint8ClampedArray"');
list.toUint32Array(true);
console.eol(2);
dir(list.array, 'list.array AFTER .toUint32Array(true)');
console.eol(2);
list.toUint8Array(true);
dir(list.array, 'list.array AFTER RE-conversion via .toUint8Array(true)');

