#!/usr/bin/env node.js

//
const string = '0123456789abcd';

//
dir(string.toString('"') + '.reverse(_a, _b)', 'Length: ' + string.length);
console.eol(3);

//
const format = '(%2, %2)  "%"';

for(var a = 0; a <= 3; a++)
{
	for(var b = 0; b <= 3; b++)
	{
		stdout(format, +a, +b, string.reverse(+a, +b));

		if(a === 0 && b === 0)
		{
			continue;
		}

		if(b !== 0)
		{
			stdout(format, +a, -b, string.reverse(+a, -b));
		}

		if(a === 0 || b === 0)
		{
			continue;
		}

		stdout(format, -a, +b, string.reverse(-a, +b));
		stdout(format, -a, -b, string.reverse(-a, -b));
	}

	console.eol();
}

