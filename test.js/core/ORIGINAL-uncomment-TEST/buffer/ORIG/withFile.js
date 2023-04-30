#!/usr/bin/env node.js

const fb = new BUFFER();
fb.buffer = './buffer';
fb.appendData('abc');
fb.info('(BUFFER).info(...)');
fb.limitMemory = 2;
fb.info('after setting \'% = %\'...  ==>  %', '.limitMemory', 2, 'file should exist (' + fb.buffer + ')');

