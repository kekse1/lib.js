#!/usr/bin/env node.js

const a = [
	{ eins: 'EINS', zwei: { a: 'aaa', b: 'bbb' } },
	{ eins: 'EINS', zwei: { a: 'ccc', b: 'ddd' } },
	{ eins: 'eins', zwei: { a: 'eee', b: 'fff' } },
	{ eins: 'eins', zwei: 'drei' },
	{ eins: 'eins', zwei: { x: 'xxx', y: 'yyy' } }
];

const map = a.index(['eins', 'zwei'], ['zwei.a', 'zwei.x']);

dir(a, '(array)');
dir(map, '(array).index(["eins", "zwei"], ["zwei.a", "zwei.x"])');

