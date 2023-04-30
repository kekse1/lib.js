#!/usr/bin/env node.js

const alpha = 'xyz';
const number = 4096n;
const result = number.toString(alpha);

dir(result, '(' + number + ').toString("' + alpha + '")');

