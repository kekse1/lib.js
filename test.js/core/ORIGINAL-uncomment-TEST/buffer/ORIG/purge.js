#!/usr/bin/env node.js

const buf = BUFFER.create({
	buffer: path.join(__dirname, 'buffer', 'purge-test-file.tmp'),
	collect: 0,
	limitMemory: 0
});

buf.appendData('test..');

console.debug('fs.exists(%) => %', buf.buffer, fs.exists.file(buf.buffer, true));
console.debug('in 2 seconds we\'ll check the file again..');

setTimeout(() => {

	const p = buf.buffer;
	buf.file = null;

	console.debug('now fs.exists(%) => %', p, fs.exists.file(p, true));
	dir(BUFFER.INDEX.DIR, 'BUFFER.INDEX.DIR');

}, 2000);

