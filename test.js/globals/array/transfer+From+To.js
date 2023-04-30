#!/usr/bin/env node.js

const target1 = [ 'eins', 'zwei', 'drei' ];
const target2 = [ ... target1 ];
const target3 = [ ... target2 ];

dir((target1 === target2 && target2 === target3), 'target1 === target2 === target3');

const source = [ 'source', 'array' ];

Array.transfer(target1, source);
target2.transferFrom(source);
source.transferTo(target3);

console.eol(2);

dir(target1, 'target1');
dir(target2, 'target2');
dir(target3, 'target3');

console.eol(3);
dir((target1 === target2 && target2 === target3), 'target1 === target2 === target3');
