#!/usr/bin/env node.js

console.line({ center: ' #1: Ternary INDEX test ' });
require(path.join(__dirname, 'ternary-INDEX.js'));
console.eol(2);
console.line({ center: ' #2: Ternary COORDINATES test '});
require(path.join(__dirname, 'ternary-COORDINATES.js'));
console.eol();

