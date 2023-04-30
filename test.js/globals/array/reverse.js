#!/usr/bin/env node.js

//
const array = '0123456789abcd'.split('');

//
dir('[ ' + array.join(', ') + ' ].reverse(_a, _b)', 'Length: ' + array.length);
console.eol(3);

//
const format = '(%2, %2)  [ % ]';

for(var a = 0; a <= 3; a++)
{
	for(var b = 0; b <= 3; b++)
	{
		stdout(format, +a, +b, array.reverse(+a, +b).join(', '));

		if(a === 0 && b === 0)
		{
			continue;
		}

		if(b !== 0)
		{
			stdout(format, +a, -b, array.reverse(+a, -b).join(', '));
		}

		if(a === 0 || b === 0)
		{
			continue;
		}

		stdout(format, -a, +b, array.reverse(-a, +b).join(', '));
		stdout(format, -a, -b, array.reverse(-a, -b).join(', '));
	}

	console.eol();
}

