#!/usr/bin/env node.js

const map = {
	'eins': 9,
	'zwei': 2,
	'drei': 12,
	'vier': 6,
	'five': 16,
	'six': 3,
	'seven': 2,
	'eight': 14,
	'nine': 7,
	'ten': 10,
	'elf': 8
};

dir(map, '(input map)');
console.eol(3);

const res1 = map.getSortedArray(true, true, false);
const res2 = map.getSortedArray(false, false, true);

dir(res1, '(map).getSortedArray(true, true, false)');
console.eol(2);
dir(res2, '(map).getSortedArray(false, false, true)');
console.eol();

