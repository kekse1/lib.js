#!/usr/bin/env node.js

const SPACE_LEFT = 20;
const SPACE_RIGHT = 20;
const prefix = '(PREFIX) ';
const string = String.fill(512, 'a-b-c-d-e-f-') + String.fill(100, alphabet.LOWER).underline.high.bold + String.fill(512, '-f-e-d-c-b-a');

const result1 = string.toText({prefix, leftSpace: SPACE_LEFT, rightSpace: SPACE_RIGHT});
const result2 = string.toText({prefix, rightSpace: SPACE_RIGHT, realLeftSpace: SPACE_LEFT});//*real*LeftSpace...

stdout(result1);
console.eol(2);
stdout(result2);

