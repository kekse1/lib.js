#!/usr/bin/env node.js

//
// spielwiese zum testen der INVALID vector keys (.long, .short, .env)..! ^_^
// erster test, daher, .. gerade "DEFAULT_MAX_*" eingefuehrt.. ;-)
//

//
getopt({
	validLong: { long: String.repeat(50, 'x') },
	longToLong: { long: String.repeat(51, 'x') }
});

