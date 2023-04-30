#!/usr/bin/env node.js

const obj = [ 1, 2, 3, 4 ];

OFF = false;
dir(JSON.stringify(obj), 'JSON');
console.eol(3);
OFF = true;
dir(JSON.stringify(obj), 'JSOFF');;//similar HERE to 'JSOFF.stringify()' ;-)

