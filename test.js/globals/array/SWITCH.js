#!/usr/bin/env node.js

const a = [ 'eins' ];
const b = [ 'zwei' ];

dir(a, '(array A)');
dir(b, '(array B)');

Array.switch(a, b);

dir(a, '(array A) after Array.switch(a, b)');
dir(b, '(array B) after Array.switch(a, b)');

