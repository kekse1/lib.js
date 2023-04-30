#!/usr/bin/env node.js

//
//GOOD NEWS: everything is fine with unicode strings... (at least it seems to be ;-)
//

//
var str = 'unicode 🌟 stern';

dir(str.length + ' // ' + str.unicodeLength, str.quote('"') + '.length // ' + str.quote('"') + '.unicodeLength');
console.eol(4);

//
var res = '';

for(var i = 0; i < str.length; ++i)
{
	res += str[i];
}

console.eol(3);
dir(res, 1);
console.eol(2);

for(var i = 0; i < str.length; ++i)
{
	if(res.at(i, '🌟'))
	{
		dir(i);
	}
}

console.eol(2);
str = str.quote('"');

for(var i = 0; i < str.length; ++i)
{
	dir(str.substr(i, 2), str + '.substr(' + i + ', 2)');
}

