#!/usr/bin/env node.js

const obj = { millisecond: 500, second: 30, minutes: 4, hours: 2, days: 1 };

const res = Math.time.from(obj);

dir(obj, '(object)');
console.eol(4);
dir(res, 'Math.time.from(object)');

