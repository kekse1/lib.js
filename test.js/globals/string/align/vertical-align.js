#!/usr/bin/env node.js

//
const REST = false;
const FILL = LINE;
const FULL_FILL = true;
const SPACE = 1;

//
const vector = [
	{
		value: String.fill(384, 'abcdef')
	},
	{
		value: String.fill(256, 'fedcba')
	},
	{
		value: String.fill(768, 'xyz')
	},
	{
		value: String.fill(512, '01')
	}
];

//
const res1 = String.align(... vector, { verticalAlign: 'top', fill: FILL, fullFill: FULL_FILL, space: SPACE, rest: REST });
const res2 = String.align(... vector, { verticalAlign: 'middle', fill: FILL, fullFill: FULL_FILL, space: SPACE, rest: REST });
const res3 = String.align(... vector, { verticalAlign: 'bottom', fill: FILL, fullFill: FULL_FILL, space: SPACE, rest: REST });

console.eol();
console.line({ center: ' { verticalAlign: "top" } ' });
console.eol();
stdout(res1);
console.eol();
console.line({ center: ' { verticalAlign: "middle" } ' });
console.eol();
stdout(res2);
console.eol();
console.line({ center: ' { verticalAlign: "bottom" } ' });
console.eol();
stdout(res3);
console.eol();

