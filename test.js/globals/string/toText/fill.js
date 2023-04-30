#!/usr/bin/env node.js

const prefix = '(PREFIX) ';
//const width = Math.round(console.width / 2);
const width = console.width;
const string = String.fill(Math.round(width / 2), 'abcdef') + EOL + String.fill(Math.round(width / 2), 'fedcba');

const result1 = string.toText({prefix,width});	//w/out align there are no spaces as endings of lines..
const result2 = string.toText({prefix,width,align:'left', fill: '.,' });
const result3 = string.toText({prefix,width,align:'center', fill: '.,', fillLeft: true });
const result4 = string.toText({prefix,width,align:'right', fill: '.,', fillLeft: false });
const result5 = string.toText({prefix,width,align:'right', fill: '.,', fillLeft: true });

console.eol();
stdout(result1);
console.eol(2);
stdout(result2);
console.eol(2);
stdout(result3);
console.eol(2);
stdout(result4);
console.eol(2);
stdout(result5);
console.eol();

