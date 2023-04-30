#!/usr/bin/env node.js

const obj = Object.create(null);
obj[Symbol('sym')] = 'symbol';

const res1 = Object.getOwnPropertyNames(obj);
const res2 = Object.getOwnProperties(obj);

dir(res1, 'Object.getOwnPropertyNames(...)');
dir(res2, 'Object.getOwnProperties(...)');

