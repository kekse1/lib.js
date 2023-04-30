#!/usr/bin/env node.js

try
{
	dir(alphabet.getAlphabet('abc'), 'alphabet.getAlphabet("abc")');
}
catch(_error)
{
	console.warn('alphabet.getAlphabet("abc") => %', 'ERROR'.bold.error);
}

try
{
	dir(alphabet.getAlphabet(300), 'alphabet.getAlphabet(300)');
}
catch(_error)
{
	console.warn('alphabet.getAlphabet(300) => %', 'ERROR'.bold.error);
}

try
{
	dir(alphabet.getAlphabet(-4), 'alphabet.getAlphabet(-4) (== ' + 'reversed'.bold + ' ' + alphabet.toPositive(-4) + ')');
}
catch(_error)
{
	console.warn('alphabet.getAlphabet(-4) => %', 'ERROR'.bold.error);
}

try
{
	dir(alphabet.getAlphabet(-4, false), 'alphabet.getAlphabet(-4, false) (== ' + 'reversed'.bold + ' ' + alphabet.toPositive(-4) + ')');
}
catch(_error)
{
	console.warn('alphabet.getAlphabet(-4, false) => %', 'ERROR'.bold.error);
}

