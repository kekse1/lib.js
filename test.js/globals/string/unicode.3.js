#!/usr/bin/env node.js

//
//GOOD NEWS: everything is fine with unicode strings... (at least it seems to be ;-)
//

//
const str = 'unicode 🌟 stern';
dir(str.length + ' // ' + str.unicodeLength, str.quote('"') + '.length // ' + str.quote('"') + '.unicodeLength');
console.eol(4);

var res1 = '', res2 = '', res3 = '', res4 = '';

//
for(var i = 0; i < str.length; ++i)
{
	res1 += str[i];
	res2 += str.at(i);
	res3 += String.fromCharCode(str.charCodeAt(i));
	res4 += String.fromCodePoint(str.codePointAt(i));
}


//
dir(res1, '+= str[i] w/ ' + '.length'.underline.bold);
dir(res2, '+= str.at(i)  w/ ' + '.length'.underline.bold);
dir(res3, '+= String.fromCharCode(str.charCodeAt(i))  w/ ' + '.length'.underline.bold);
dir(res4, '+= String.fromCodePoint(str.codePointAt(i))  w/ ' + '.length'.underline.bold);

