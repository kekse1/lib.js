#!/usr/bin/env node.js
require('utility/levenshtein');

const first = 'git';
const second = 'gitz';
const caseSensitive = true;

const result = levenshtein.compare(first, second, caseSensitive);

dir(result, 'levenshtein.compare("' + first + '", "' + second + '", ' + caseSensitive.toString() + '")');

