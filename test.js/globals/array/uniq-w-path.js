#!/usr/bin/env node.js

const arr = [ { eins: 'EINS' }, { eins: 'ZWEI' }, { eins: 'EINS' } ];
const res = arr.unique('eins');

dir(arr, '(array)');
dir(res, '(array).unique("eins")');

