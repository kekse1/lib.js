#!/usr/bin/env node.js

const ROWS = 12;
const COLUMNS = -36;
const text = Math.random.text(ROWS, COLUMNS);

const left = text.alignLeft();
const center = text.alignCenter();
const right = text.alignRight();

console.line();
stdout(left);
console.eol(2);
stdout(center);
console.eol(2);
stdout(right);
console.eol(6);

const leftAlign = right.alignLeft();
const centerAlign = right.alignCenter();
const rightAlign = right.alignRight();

console.line();
stdout(leftAlign);
console.line();
stdout(centerAlign);
console.line();
stdout(rightAlign);
console.line();

