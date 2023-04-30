#!/usr/bin/env node.js

//check re-assign
//%{key/radix}

const format = 'ein %{test.test2.2/ab} zwei';
const ctx = {//Object.null({
	test: {
		test2: [ 'TESTING', 'EINS-ZWEI' ]
	}
};

const res = format.print({}, ctx);

dir(ctx, format.toString('"'));
console.eol(2);
log(res);

