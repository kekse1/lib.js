#!/usr/bin/env node.js

const types = Prompt.types;

const exampleKeys = Prompt.Range.items();
const exampleOnly = Prompt.Range.keys;
const exampleTooo = Prompt.items('range');
const exampleBase = Prompt.items();

dir(types, 'Prompt.types');
console.eol(4);

dir(exampleKeys, 'Prompt.Range.items()');
console.eol(2);
dir(exampleOnly, 'Prompt.Range.keys');
console.eol(2);
dir(exampleTooo, 'Prompt.items("range")');
console.eol(3);
dir(exampleBase, 'Prompt.items()');
console.eol();

