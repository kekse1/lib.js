#!/usr/bin/env node.js

const args = getopt({
	with: { short: 'w', args: 1, list: true },
	without: { short: 'o', args: 1, list: false }
}, false, false, false, false);

dir(args.RESULT, 'getopt(...).RESULT');

