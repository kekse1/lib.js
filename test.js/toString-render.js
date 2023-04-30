#!/usr/bin/env node.js

//
//TODO/!!!!!!!!!! (see below)
//

//
function testArguments()
{
	stdout(arguments.toString());
	stdout(arguments.toString(true));
	stdout(arguments.toString({ colors: true, radix: 2, typeOf: true }));
	stdout(arguments.toString({ depth: null, colors: true }));
}

console.line({ center: 'Arguments' });
console.eol();
testArguments('eins', 'zwei', 'drei');
console.eol();

//
const arr1 = [ 'eins', 'zwei' ];
const arr2 = [ ... arr1 ];
arr2.eins = 'EINS';
arr2.zwei = 'ZWEI';

console.line({ center: 'Array' });
console.eol();
stdout(arr1.toString());
stdout(arr1.toString(true));
stdout(arr2.toString({ colors: true, radix: 2 }));
stdout(arr2.toString({ radix: -3, depth: 1, index: true, colors: true }));
console.eol();

//
console.line({ center: 'BigInt' });
console.eol();
const big = 8192n;
stdout(big.toString(true));
stdout(big.toString({ colors: true, radix: '.,', bigint: true }));
stdout(big.toString({ radix: -3, typeOf: true, colors: true }));
console.eol();

//
console.line({ center: 'Boolean' });
console.eol();
const bool = true;
stdout(bool.toString());
stdout(bool.toString(true));
stdout(bool.toString({ colors: true, typeOf: true, true: 'YES', false: 'NO' }));
console.eol();

//
console.line({ center: 'Date' });
console.eol();
//TODO/
console.eol();

//
console.line({ center: 'Error' });
console.eol();
//TODO/
console.eol();

//
console.line({ center: 'Event' });
console.eol();
//TODO/
console.eol();

//
console.line({ center: 'Function' });
console.eol();
//TODO/
console.eol();

//
console.line({ center: 'Number' });
console.eol();
const num = 3.14;
stdout(num.toString());
stdout(num.toString(true));
//TODO/
console.eol();

//
console.line({ center: 'Object' });
console.eol();
//TODO/
console.eol();

//
console.line({ center: 'RegExp' });
console.eol();
const rx = /abcdef/gi;
stdout(rx.toString(true));
stdout(rx.toString({ colors: true, regexpModifierColor: false, typeOf: true }));
console.eol();

//
console.line({ center: 'String' });
console.eol();
const string = 'Dies ist ein Test'.toRandomCase();
stdout(string.toString());
stdout(string.toString({ encoding: 'base64' }));
stdout(string.toString(true));
stdout(string.toString({ colors: true, encoding: 'base64', radix: 'xyz', encodingBeforeRadix: true, typeOf: true }));
//TODO/
console.eol();

//
console.line({ center: 'TypedArray' });
console.eol();
const ta1 = new Uint8ClampedArray(4);
const ta2 = new BigUint64Array(4);
stdout(ta1.toString());
stdout(ta1.toString(true));
stdout(ta2.toString({ typeOf: true, radix: 16, colors: true }));
console.eol();

//

