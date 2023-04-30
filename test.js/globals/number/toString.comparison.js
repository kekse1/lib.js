#!/usr/bin/env node.js

//
const DEFAULT_RADIX_LIMIT = true;

//
var rounds = 20;
var radix = null;

//
if((process.ARGV[0] || '').isInt())
{
	rounds = parseInt(process.ARGV[0]);
}

if((process.ARGV[1] || '').isInt())
{
	radix = parseInt(process.ARGV[1]);
}
else if(String.isString(process.ARGV[1]))
{
	radix = process.ARGV[1];
}

//
var result, compare;

//
console.info('Test mode with % rounds', rounds);
console.warn('Radix limit is % % ... % % due to comparison with original JavaScript function', '[', 2, 36, ']');
console.debug('Changing between % and % value every %%..', 'Integer', 'Float', '%', 2);
console.eol(3);

//
var rdx;

for(var i = 0; i < rounds; ++i)
{
	if(i % 2 === 0)
	{
		value = Math.random.int();
	}
	else
	{
		value = Math.random.float();
	}

	if(radix === null)
	{
		if(DEFAULT_RADIX_LIMIT)
		{
			rdx = Math.random.int(36, 2);
		}
		else
		{
			rdx = Math.random.int(62, 0);
		}
	}
	else
	{
		rdx = radix;
	}
	
	console.log('[ % / % ] Converting % to a % with radix = %', i + 1, rounds, value, 'string', rdx);
	
	result = value.toString(rdx);
	compare = ((rdx >= 2 && rdx <= 36) ? value._toString(rdx) : null);

	if(compare === null)
	{
		console.log('          %', compare);
	}
	else
	{
		console.log(' Library: %', result);
		console.log('Original: %', compare);
	}

	console.eol();
}

