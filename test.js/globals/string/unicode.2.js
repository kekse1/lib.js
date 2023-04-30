#!/usr/bin/env node.js

//
//GOOD NEWS: everything is fine with unicode strings... (at least it seems to be ;-)
//

//
var str = 'unicode 🌟 stern';

dir(str.length + ' // ' + str.unicodeLength, str.quote('"') + '.length // ' + str.quote('"') + '.unicodeLength');
console.eol(3);
const s = str.quote('"');

for(var i = 0; i < str.length; ++i)
{
	dir(str.at(i), s + '.at(' + i + ')');
}

console.eol(2);

for(var i = 0; i < str.length; ++i)
{
	dir(str.codePointAt(i), s + '.codePointAt(' + i + ')');
}

