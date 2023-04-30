#!/usr/bin/env node.js

const prefix = '(PREFIX) ';
const string = String.fill(512, 'a-b-c-d-e-f-') + String.fill(100, alphabet.LOWER).underline.high.bold + String.fill(512, '-f-e-d-c-b-a');

const result1 = string.toText({prefix});
const result2 = string.toText({prefix,all:true, width:console.log.width });

stdout(result1);
console.eol();
stdout(result2);
console.eol(4);
log(result2);

