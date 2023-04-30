#!/usr/bin/env node.js

//
const buffer = BUFFER.create({
	directory: path.join(process.cwd(), 'buffer'),
	limitMemory: 8
});


//
buffer.debug('@ create');

buffer.appendData('eins');
buffer.debug('@ .appendData("eins")');

buffer.appendData('zwei');
buffer.debug('@ .appendData("zwei")');

buffer.limitMemory = 9;
buffer.debug('@ .limitMemory = 8');

buffer.limitMemory = 6;
buffer.debug('@ .limitMemory = 6');

buffer.limitMemory = 8;
buffer.debug('@ .limitMemory = 8');

buffer.appendData('!');
buffer.debug('@ .appendData("!")');

buffer.flushBuffer();
buffer.debug('@ .flushBuffer()');

//buffer.reset();
//buffer.debug('@ .reset()');

