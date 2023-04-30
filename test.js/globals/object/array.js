#!/usr/bin/env node.js

const obj = { eins: "EINS", zwei: "ZWEI" };
const arr = [ 2, 4, 6, 8 ];

const res1 = Object.array(obj);
const res2 = Object.array(obj, arr);

dir(res1, 'Object.array(object)');
dir(res2, 'Object.array(object, array)');

const res3 = Object.array(res2, [ 99, 88 ]);

dir(res3, 'Object.array((res3), [ 99, 88 ])');

