#!/usr/bin/env node.js

const INDEX = true;
const RADIX_1 = 'xyz';
const RADIX_2 = -9;
const DEPTH = null;
const COLORS = true;

const obj = { 'eins': 'zehn' };
Object.defineProperty(obj, 'test', { get: function() {} });

const testFunc = () => {};
const arr = [ 4096n, 3.14, [ [], [] ], null, undefined, false, /test/gi, ()=>{}, testFunc, String.repeat(8, 'test-string-').removeLast().toRandomCase(), 4096n, [ [ 2,4,6, [ 8, 10 ] ], 12 ], obj ];

const res1 = arr.toString({ compact: false, depth: DEPTH, colors: COLORS, index: INDEX, radix: RADIX_1 });
const res2 = arr.toString({ compact: false, depth: DEPTH, colors: COLORS, index: INDEX, radix: RADIX_2 });

dir(arr, '(array)');
console.eol(4);
stdout(res1);
console.eol(2);
stdout(res2);

