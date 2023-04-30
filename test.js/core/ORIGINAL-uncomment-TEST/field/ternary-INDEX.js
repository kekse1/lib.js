#!/usr/bin/env node.js

const dimensions = [ 3, 3, 3 ];

// this will be a check of all (3**3) [3^3]... so we'll receive (FIELD.getLength(.., [ 3, 3, 3 ]))
// ==> (27) coordinates @ [a, b, c] .. ^_^

console.eol();
console.line({ left: ' Ternary radix field conversions as example.. ', center: ' ... with 3x digits in [ 0, 1, 2 ] range. ' });
const numberLength = FIELD.getLength(false, dimensions);
const bigLength = FIELD.getLength(true, dimensions);
console.eol();
debug('check calculation: (%) or (%) == (%)', '3**3', '3^3', 27);
console.eol();
dir(numberLength, 'FIELD.getLength(false, [ 3, 3, 3 ])');
dir(bigLength, 'FIELD.getLength(true, [ 3, 3, 3 ])');
console.eol(3);
info('Here are all the indices by their coordinates, generated as the ternary radix encodes (0-2) values (here 3x times, as [ 3, 3, 3 ] dimensions)');
info('For the resulting FIELD indices we\'re using: \'%\'', 'FIELD.getIndex(false, [ 3, 3, 3 ], a, b, c)');
debug('Whereas [ %, %, % ] are generated by a % from \'%\' OUTside to \'%\' INside.. :-)', 'a', 'b', 'c', '3x depth loop'.high, 'c', 'a');
console.eol(2);

for(var c = 0; c < dimensions[0]; c++)
{
	for(var b = 0; b < dimensions[1]; b++)
	{
		for(var a = 0; a < dimensions[2]; a++)
		{
			stdout('[ %, %, % ]  =>  %', a, b, c, FIELD.getIndex(false, dimensions, a, b, c).toText().pad(2, ' '));
		}
	}
}

console.eol(1);

