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

const res1 = prepareCall(str1, [ 'ONE M', 'TWO M' ], ctx);
const res2 = prepareCall(str1, [ 'EINS M', 'ZWEI M' ]);

dir(res1, 'prepareCall("' + str1 + '", [ (..) ], ctx)');
dir(res2, 'prepareCall("' + str1 + '", [ (...) ])');
console.eol(2);

const res3 = prepareCall(str2, [ 'MANUAL arg' ], null);
const res4 = prepareCall(str2, null, ctx);

dir(res3, 'prepareCall("' + str2 + '", [ (..) ], null)');
dir(res4, 'prepareCall("' + str2 + '", null, context)');
console.eol(2);

const res5 = prepareCall(ctx.func, [ 'aaa', 'bbb', 'ccc' ], null);
dir(res5, 'prepareCall((context).func, [ (...) ], null)');

