#!/usr/bin/env node.js

const number = 12345678;
const result1 = number.toString(2);
const result2 = number.toString(-3);

dir(result1, '(' + number + ').toString(2)');
dir(result2, '(' + number + ').toString(-3)');

