#!/usr/bin/env node.js

const o = { eins: 'EINS', zwei: 'ZWEI', drei: 'DREI' };

const r0 = o.filter([ 'eins', 'zwei' ]); //true
const r1 = o.filter([ 'eins', 'ZWEI' ]); //false

const r2 = o.filter({ eins: 'EINS', zwei: 'ZWEI' }); //true
const r3 = o.filter({ eins: 'ONE', zwei: 'TWO' }); //false

const r4 = o.filter({ eins: 'String', zwei: 'String' }, true); // true
const r5 = o.filter({ eins: 'String', zwei: [ 'Number', 'String' ] }, true); // true

const r6 = o.filter({ eins: 'string', zwei: 'string' }, true, true); //true
const r7 = o.filter({ eins: 'string', zwei: 'number' }, true, true); //false

const r8 = o.filter({ eins: 'string', zwei: [ 'number', 'string' ] }, true, true); //true
const r9 = o.filter({ eins: 'string', none: 'string' }, true, true); //false

//
dir(o, '(object)');
console.eol(4);
dir(r0, '(object).filter([ "eins", "zwei" ]) // true');
dir(r1, '(object).filter([ "eins", "ZWEI" ]) // false');
console.eol(2);
dir(r2, '(object).filter({ eins: "EINS", zwei: "ZWEI" }); // true');
dir(r3, '(object).filter({ eins: "ONE", zwei: "TWO" }); // false');
console.eol(2);
dir(r4, '(object).filter({ eins: "String", zwei: "String" }, true) // true');
dir(r5, '(object).filter({ eins: "String", zwei: [ "Number", "String" ] }, true) // true');
console.eol();
dir(r6, '(object).filter({ eins: "string", zwei: "string" }, true, true) // true');
dir(r7, '(object).filter({ eins: "string", zwei: "number" }, true, true) // false');
console.eol();
dir(r8, '(object).filter({ eins: "string", zwei: [ "number", "string" ] }, true, true) // true');
dir(r9, '(object).filter({ eins: "string", none: "string" }, true, true) // false');

