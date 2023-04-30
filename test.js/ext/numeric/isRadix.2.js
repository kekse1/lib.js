#!/usr/bin/env node.js

//
const UNICODE_LIMITED = false;
const UNICODE_UNLIMITED = true;

//
const rdx = [
	0,
	-17,
	62,
	-63,
	-64,
	'abcdefff',
	'\ndefff',
	'xz  z',
	'abbb',
	32768,
	-32769,
	'abcd.ghi',
	'---+xyzvv'
];

const limited = new Array(rdx.length);
const unlimited = new Array(rdx.length);

for(var i = 0; i < rdx.length; ++i)
{
	limited[i] = rdx[i] + ' => ' + isRadix(rdx[i], true, UNICODE_LIMITED) + ' (limited)';
	unlimited[i] = rdx[i] + ' => ' + isRadix(rdx[i], false, UNICODE_UNLIMITED) + ' (UN-limited)';
}

//
console.eol();
dir(rdx, '(radix)');
console.eol(7);
dir(limited, '(limited)');
console.eol(3);
dir(unlimited, '(unlimited)');
console.eol();

