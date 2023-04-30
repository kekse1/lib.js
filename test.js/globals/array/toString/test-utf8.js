#!/usr/bin/env node.js

const arr = [ 'yy', 32, 99, 100, 102, 32, 'xx', false ];
const res = arr.toString('utf8');

dir(arr, '(array)');
dir(res, '(array).toString("utf-8")');

