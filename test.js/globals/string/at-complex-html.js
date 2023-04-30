#!/usr/bin/env node.js

const str = '<bold>bold</bold>';

const res1 = str.at(-1);
const res2 = str.at(-4, 'bold', true, 'html');

dir(res1, str.toString('"') + '.at(-1)');
dir(res2, str.toString('"') + '.at(-4, "bold", true, "html")');

