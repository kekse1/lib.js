#!/usr/bin/env node.js

var arr = 'abcdefghijklmnopqrstuvwxyz'.split('');

const res1 = arr.getStarting('b','c','a').toString();
const res2 = arr.getEnding('y','x','z').toString();
arr = arr.toString();

console.info('Array:');
stdout(arr);
console.eol(4);

console.debug('.getStarting("b", "c", "a")');
stdout(res1);
console.eol(4);

console.debug('.getEnding("y", "x", "z")');
stdout(res2);
console.eol(3);

