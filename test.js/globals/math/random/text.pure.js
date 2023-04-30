#!/usr/bin/env node.js

//
//this is like 'Math.random.text()', but w/o _chance_newline (=0.2)! ^_^
//

const text1 = Math.random.text.pure();
const text2 = Math.random.text.pure(10, 40);
const text3 = Math.random.text.pure(10, -80);

console.log(text1);
console.eol(2);
console.log(text2);
console.eol(2);
console.log(text3);

