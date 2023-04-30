#!/usr/bin/env node.js

const ctx = { 
	func: function(... _args)
	{
		dir('(context).func(' + _args.length + ')');
		return _args.length;
	},
	eins: 'EINS!!!'
};

global.func = function(... _args)
{
	dir('global.func(' + _args.length + ')');
	return _args.length;
}


const str1 = 'func';
const str2 = 'func(  "null",  eins ,  zwei , 3.14, "4096n")';

const res1 = tryCall(str1, [ 'manual argument..', '2nd...' ], null);
const res2 = tryCall(str1, [ 'appending arguments...' ]);

dir(res1, 'tryCall("' + str1 + '", [ (..) ], null)');
dir(res2, 'tryCall("' + str1 + '", [ (...) ])');
console.eol(2);

const res3 = tryCall(str2, null, null);
const res4 = tryCall(str2, null, ctx);

dir(res3, 'tryCall("' + str2 + '", null)');
dir(res4, 'tryCall("' + str2 + '", context)');

