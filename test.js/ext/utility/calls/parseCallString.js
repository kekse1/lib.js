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

const res1 = parseCallString(str1, null, false);
const res2 = parseCallString(str1);

dir(res1, 'parseCallString("' + str1 + '", null, false)');
dir(res2, 'parseCallString("' + str1 + '")');
console.eol(2);

const res3 = parseCallString(str2, null, false);
const res4 = parseCallString(str2, ctx);

dir(res3, 'parseCallString("' + str2 + '", null, false)');
dir(res4, 'parseCallString("' + str2 + '", context)');

