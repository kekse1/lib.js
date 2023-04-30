#!/usr/bin/env node.js

const args = getopt({
	eins: { short: 'ms', args: 2 },
	zwei: { short: 'sm', args: 0 }
});

dir(args.RESULT);

