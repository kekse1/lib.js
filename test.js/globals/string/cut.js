#!/usr/bin/env node.js

var str = '';

for(var i = 0; i < 128; ++i)
{
	str += Math.random.char();
}

dir(str);

const res = str.cut();

dir(res, '(' + (str.length) + ')..cut()');

