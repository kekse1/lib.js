#!/usr/bin/env node.js

try
{
	dir(alphabet.getUnicodeAlphabet('abc'), 'alphabet.getUnicodeAlphabet("abc")');
}
catch(_error)
{
	console.warn('alphabet.getUnicodeAlphabet("abc") => %', 'ERROR'.bold.error);
}

try
{
	dir(alphabet.getUnicodeAlphabet(300), 'alphabet.getUnicodeAlphabet(300)');
}
catch(_error)
{
	console.warn('alphabet.getUnicodeAlphabet(300) => %', 'ERROR'.bold.error);
}

try
{
	dir(alphabet.getUnicodeAlphabet(-4), 'alphabet.getUnicodeAlphabet(-4) (== ' + 'reversed'.bold + ' ' + alphabet.toPositive(-4) + ')');
}
catch(_error)
{
	console.warn('alphabet.getUnicodeAlphabet(-4) => %', 'ERROR'.bold.error);
}


