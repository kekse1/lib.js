#!/usr/bin/env node.js

const INDEX = true;
const RADIX = 8;
const DEPTH = null;
const COLORS = true;
//const index = { open: '[', close: ']' };
const index = { open: '', close: ':' };

const obj = { 'eins': 'zehn' };
Object.defineProperty(obj, 'test', { get: function() {} });

const arr = [ 4096n, 3.14, [ [], [] ], null, undefined, false, /test/gi, ()=>{}, String.repeat(8, 'test-string-').removeLast().toRandomCase(), 4096n, [ [ 2,4,6, [ 8, 10 ] ], 12 ], obj ];

const res1 = arr.toString({ compact: true, depth: DEPTH, colors: COLORS, index: INDEX, radix: RADIX, indexOpen: index.open, indexClose: index.close });
const res2 = arr.toString({ compact: false, depth: DEPTH, colors: COLORS, index: INDEX, radix: RADIX, indexOpen: index.open, indexClose: index.close });

dir(arr, '(array)');
console.eol(4);
stdout(res1);
console.eol(2);
stdout(res2);

