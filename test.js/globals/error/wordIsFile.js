#!/usr/bin/env node.js

const res0 = Error.wordIsFile('');
const res1 = Error.wordIsFile('abcdef');
const res2 = Error.wordIsFile('/abcdef');
const res3 = Error.wordIsFile('https://abcdef');
const res4 = Error.wordIsFile('node:internal/abcdef');

dir(res0, 'Error.wordIsFile("")');
dir(res1, 'Error.wordIsFile("abcdef")');
dir(res2, 'Error.wordIsFile("/abcdef")');
dir(res3, 'Error.wordIsFile("https://abcdef")');
dir(res4, 'Error.wordIsFile("node:internal/abcdef")');

