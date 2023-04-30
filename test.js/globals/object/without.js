#!/usr/bin/env node.js

//
//see also 'test.js/array/without.js'! ;-)
//

//
const obj = { a: 'eins', b: 'zwei', c: 'drei', d: 'vier', e: 'fuenf' };
dir(obj, '(object)');
console.eol(2);

const res = obj.without('a', 'b', 'z', 'y');
dir(res, '(object).without("a", "b", "z", "y")');

console.eol();
dir(obj, '(object) AFTER .without(...)');

