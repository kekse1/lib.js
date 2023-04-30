#!/usr/bin/env node.js

// 
// try w/ argv: '-aa a b -a x y'.. e.g.
//

const args = getopt({
	test: { short: 't', args: 3, null: ['DEF 3','DEF 4'], undefined: ['DEF 1','DEF 2'], help: [ 'Testing the "%" function, ...\n.. "if(% > %)"... ^_^', 'fill()', 'todo()', -1 ], group: 'zweite gruppe' },
	last: { short: 'l', args: -3, default: 'default', help: [ 'Test with e.g. "%".. if(%) is adapted to the whole (%)!\n... AND see (% < %). ;-)', '-lll', '.last', '.args', '.args', 0 ]  },
	array: { short: 'a', args: 4, default: [ 'eins', null, /regexp/gi ] },
	one: { short: 'o', args: 1, undefined: undefined, null: null, help: 'Gegentest... #1\n' },
	zero: { short: 'z', args: 0, default: /zero/g, group: 'erste gruppe' },
	printf: { help: [ 'dies % ist % ein % test..\n\n', 3.14, 4096n, null ], group: 'erste gruppe' },
	noArray: { short: 'N', args: 3, default: [], group: 'erste gruppe' },
	defaulting: { short: 'D', args: 4, null: [ [1,2,3,4], [1,2,3] ], undefined: [ [2,4,6,8], [3,6,9] ], help: 'from undef+null to default', env: 'ENV-VARIABLE', group: 'zweite gruppe' },
	help: { short: '?', call: 'help', help: [ 'see % or %..', 'getopt.call*', 'Utility' ], group: 'zweite gruppe' },
	zaa: { short: 'Z', call: 'test', help: 'ein hilfe-text' },
	zza: {},
	zzb: { help: 'test-help-string' },
	zzzzzb: {},
	verbose: { short: 'v' }
});

//dir({ argv: args.ARGV, test: args.test, last: args.last, array: args.array, one: args.one, zero: args.zero }, '{ test, last }');
//dir(args.RESERVED, '.RESERVED');
dir(args.RESULT, '.RESULT');

