#!/usr/bin/env node.js

//
// Argument(s) possible: Object, StringS, ArrayS, Uint8ArrayS...! ;-)
//

//
const args1 = [ 'abc', 'de' ];
const args2 = [ [97,'b'], 'def'.toUint8Array() ];
const args3 = [ { 'a': 100, b: 'e' } ];

//
var str = 'azbycxdwev';

//
const res1 = str.map(... args1);
const res2 = str.map(... args2);
const res3 = str.map(... args3);

str = str.toString('"');

dir(res1, str + '.map("abc", "de")');
dir(res2, str + '.map([97,"b"], "def".toUint8Array())');
dir(res3, str + '.map({ "a": 100, b: "e" })');

