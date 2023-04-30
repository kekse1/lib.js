#!/usr/bin/env node.js

const arr = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

dir(arr, '(array)');

arr.switch(-2, 1);

dir(arr, '(array).switch(-2, 1)');

