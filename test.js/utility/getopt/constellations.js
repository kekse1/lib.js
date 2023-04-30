#!/usr/bin/env node.js

const args = getopt({
	drei: { group: 'group' },
	eight: { null: 'nul', undefined: 'undef' },
	eins: { undefined: 'undef' },
	five: { group: 'group', undefined: 'undef' },
	null: { default: 'def' },
	seven: { group: 'group', null: 'null', undefined: 'undefined' },
	six: { group: 'group', default: 'def' },
	vier: { group: 'group', null: 'null' },
	zwei: { null: 'null' },
	same: { null: [1,2], undefined: [1,2], args: 1 }
});

dir(args);
dir(args.RESULT);

