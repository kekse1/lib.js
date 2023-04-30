#!/usr/bin/env node.js

const fb = new BUFFER();
fb.buffer = './buffer';
fb.appendData('abc');
fb.info('(BUFFER).info(...)');
fb.limitMemory = 16;
fb.info('after setting \'% = %\'...  ==>  %', '.limitMemory', 2, 'file should NOT exist (' + fb.buffer + ')!');

