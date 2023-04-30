#!/usr/bin/env node.js

//
// (short = null) will ALWAYS use "auto short" feature.. even if (DEFAULT_AUTO_SHORT{,_TWO} == false)! ;-)
//
getopt({
	eins: { short: null },
	zwei: { short: null },
	drei: {},	// should be enabled by default.. see DEFAULT_AUTO_SHORT{,_TWO}!
	vier: { short: null }
});

