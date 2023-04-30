#!/usr/bin/env node.js

var look = [ 'eins', 'zwei', 'drei', 'vier', 'five', 'six', 'seven' ];
const obj = [ 'EiNs', 'ZWEi', 'DrEi' ];

obj.VieR = 'vier';
obj.fiVE = 'fuenf';
obj.siX = 'sechs';

const res = obj.lookUp(... look);
look = look.toString({ depth: 1, colors: false });

dir(obj, '(object)');
console.eol(3);
dir(res, '(object).lookUp(... ' + look + ')');

