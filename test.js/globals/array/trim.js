#!/usr/bin/env node.js

const string = '   ,  abc  ,,,     def   , ghi ';
const items = string.split(',');
const copy = items.clone();

dir(items, string.toString() + '.split(",")');
console.eol(4);

items.trim(true);
dir(items, '(items).trim(true)');
console.eol(3);

dir(copy, 'items.clone()');
copy.trim();
dir(copy, '(copy).trim()');
console.eol();

