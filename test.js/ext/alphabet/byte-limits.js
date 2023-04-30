#!/usr/bin/env node.js

//
//sinn ist der, dass erstmal '.', dann '-', dann '+' in den radix < 256 reserviert wird,
//um eben flieszkommazahlen oder negative etc. "schnell" codieren zu koennen.. hoffe es geht (not tested very well..)
//

const alpha1 = alphabet(256);
const alpha2 = alphabet(255);
const alpha3 = alphabet(254);
const alpha4 = alphabet(253);

for(var i = 250; i < 256; i++)
{
	dir(alpha1.charCodeAt(i), 'alphabet(256)[' + i + ']');
	dir(alpha2.charCodeAt(i), 'alphabet(255)[' + i + ']');
	dir(alpha3.charCodeAt(i), 'alphabet(254)[' + i + ']');
	dir(alpha4.charCodeAt(i), 'alphabet(253)[' + i + ']');

	console.eol(4);
}

