#!/usr/bin/env node.js

const arr = [1,2,[3,4,[5,6,[7,8]]]];

const defaultResult = arr.toString();
const colorResult = arr.toString(true);
const twoDepthResult = arr.toString(2);
const objResult = arr.toString({ depth: 2, colors: false, index: true, compact: true, width: 20 });
const argsResult = arr.toString(null, false, true, true, -200);
const totalResult = arr.toString(null);


console.eol();
stdout(defaultResult);
console.eol();
stdout(colorResult);
console.eol();
stdout(twoDepthResult);
console.eol();
stdout(objResult);
console.eol();
stdout(argsResult);
console.eol();
stdout(totalResult);
console.eol();

