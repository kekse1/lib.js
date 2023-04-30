#!/usr/bin/env node.js

//
const original = 'Candara, Open Sans, Source Code Pro';

if(typeof fonts === 'undefined')
{
	require('utility/fonts');
}

//
const array = fonts.toArray(original);
const string = fonts.toString(array);
//
const array2 = fonts.toArray(array);
const string2 = fonts.toString(string);

//
dir(array, 'fonts.toArray(string)');
dir(string, 'fonts.toString(array)');

console.eol(2);

dir(array2, 'fonts.toArray(array)');
dir(string2, 'fonts.toString(string)');

console.eol(4);

dir(fonts.count(string2), 'fonts.count(...)');

