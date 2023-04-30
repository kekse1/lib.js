#!/usr/bin/env node.js

const symbols0 = Prompt.symbols();

dir(symbols0, 'Prompt.getSymbols()');
console.eol(3);

const symbols1 = Prompt.symbols(true);
const symbols2 = Prompt.symbols('');
const symbols3 = Prompt.symbols('high');
const symbols4 = Prompt.symbols('random8');
const symbols5 = Prompt.symbols('random');

const maxLen = Object.findLongestKeyLength(symbols0);

for(const idx in symbols1)
{
	stdout('[' + idx.pad(maxLen) + '] ' + symbols1[idx]);
}

console.eol();

for(const idx in symbols2)
{
	stdout('[' + idx.pad(maxLen) + '] ' + symbols2[idx]);
}

console.eol();

for(const idx in symbols3)
{
	stdout('[' + idx.pad(maxLen) + '] ' + symbols3[idx]);
}

console.eol();

for(const idx in symbols4)
{
	stdout('[' + idx.pad(maxLen) + '] ' + symbols4[idx]);
}

console.eol();

for(const idx in symbols5)
{
	stdout('[' + idx.pad(maxLen) + '] ' + symbols5[idx]);
}

console.eol();

