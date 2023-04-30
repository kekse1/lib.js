#!/usr/bin/env node.js

on('radix', (_new, _old) => {
	log('\'%\' event (old = %, new = %; random = %)', 'radix', _old, _new, RADIX_RANDOM);
});

process.stdin.resume();

dir(radix(), 'radix() [will also initialize the timer.. see CONFIG.RADIX_INTERVAL ;-]');
//setTimeout(() => { dir(radix(), 'radix() [will also initialize the timer ;-]'); }, 7000);

