#!/usr/bin/env node.js

//
//getopt.pause();

//
const res1 = getopt.prepare({
	eins: { short: '1', help: 'eins / 1', group: 'first' },
	json: { short: 'j', help: 'json @ eins..', group: 'first' },
	help: { short: '?', help: 'help @ eins...', call: 'help', group: 'first' }
});

dir(res1, 'getopt.prepare({ eins ... })');

const res2 = getopt.prepare({
	zwei: { short: '2', help: 'in the second getopt.prepare() call', group: 'second' },
	drei: { short: '3', help: 'also in the second getopt.prepare() call', group: 'second' }
});

dir(res2, 'getopt.prepare({ zwei ... })');

//
//const res3 = getopt.continue();
const res3 = getopt();

console.eol(4);
dir(res3, 'getopt.continue()');

console.eol(4);
dir(process.args === res3, '(process.args === res3 [== getopt.continue()])');

