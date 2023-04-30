#!/usr/bin/env node.js

const obj = { eins: { zwei: "ZWEI" } };

const res = obj.clone();

dir(obj, 'obj');
dir(res, 'obj.clone()');
dir(obj === res, 'obj === res');

const obj2 = [ 'eins' ];

const res2 = obj2.clone();

dir(obj2, 'obj2');
dir(res2, 'obj2.clone()');
dir(obj2 === res2, 'obj2 === res2');

