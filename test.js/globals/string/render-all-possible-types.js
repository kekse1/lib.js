#!/usr/bin/env node.js

const COLORS = true;
const TYPE_OF = true;

const obj = [
	'mein-string',	// String
	undefined,	// Undefined
	null,		// Null
	3.14,		// Number
	NaN,		// NaN == Number
	Infinity,	// Infinity == Number
	true,		// Boolean
	() => {},	// Function
	new Date(),	// Date
	/regexp/gi,	// RegExp
	new TypeError('a test error'),// Error
	Object.null(),	// Object (null)
	{a:'A',b:'B'},	// Object
	[2,4,6]		// Array
];

const res = new Array(obj.length);
var renderedPad = 0;
var typeOfPad = 0;

for(var i = 0; i < obj.length; ++i)
{
	res[i] = String.render(obj[i], { colors: COLORS, typeOf: TYPE_OF });
	obj[i] = Object.typeOf(obj[i]);

	renderedPad = Math.max(renderedPad, res[i].textLength);
	typeOfPad = Math.max(typeOfPad, obj[i].textLength);
}

renderedPad += 4;
typeOfPad += 4;

//
dir(obj, '(various objects)');
console.eol(4);


for(var i = 0; i < res.length; ++i)
{
	stdout(res[i].pad(renderedPad) + space(8) + obj[i].pad(typeOfPad) + EOL);
}

