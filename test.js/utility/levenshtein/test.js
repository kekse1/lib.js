#!/usr/bin/env node.js

require('utility/levenshtein');

const args = getopt();
const reference = args.ARGV.shift();
const words = [];

while(args.ARGV.length > 0)
{
	words.push(args.ARGV.shift());
}

if(! String.isString(reference))
{
	console.error('Your first argument needs to be a reference word');
	process.exit(1);
}
else if(words.length === 0)
{
	console.error('After the reference word you should define all the words to compare against');
	process.exit(2);
}

const result = levenshtein(reference, ... words);
dir(result, 'levenshtein("' + reference + '", ... words(' + words.length + '))');
console.eol(4);
result.select(1, null, false);
dir(result, '...select(1)');

