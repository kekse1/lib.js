#!/usr/bin/env node.js

//
const e = new Error('test (' + 'TODO'.high + ': test.js/error/*)');

e.eins = 'eins zwei';
e.zwanzig = 3.14;
e.dreiszig = 'multi' + EOL + 'line..';

//e.stack = '	  #' + EOL +
//	  '  	^' + eol(2) + e.stack;

//
e.stack += EOL + '   at eins.zwei drei < vier fuenf [ sechs sieben:8:9 acht ] } neun zehn';
e.stack += EOL + '   at eins.zwei < drei vier ( fuenf sechs ) sieben > acht neun';
//e.stack += EOL + '   at eins zwei < drei < vier [ five { six } ) seven < < eight > nine';

//
//const obj = e.toObject();//true|false @ _colors;
process.stderr.write(e.toText(false));
process.stderr.write(e.toText(true));

