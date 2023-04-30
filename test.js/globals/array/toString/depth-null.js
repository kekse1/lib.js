#!/usr/bin/env node.js

const INDEX = true;
const RADIX = 16;
const DEPTH = null;

const obj = { 'eins': 'zehn' };
Object.defineProperty(obj, 'test', { get: function() {} });

const arr = [ 4096n, 3.14, [ [], [] ], null, undefined, false, /test/gi, ()=>{}, 'test-string', 4096n, [ [ 2,4,6, [ 8, 10 ] ], 12 ], obj ];

const res1 = arr.toString({ compact: true, depth: DEPTH, colors: true, radix: RADIX, index: INDEX });
const res2 = arr.toString({ compact: false, depth: DEPTH, colors: true, radix: RADIX, index: INDEX });

dir(arr, '(array)');
console.eol(4);
stdout(res1);
console.eol(2);
stdout(res2);

