#!/usr/bin/env node.js


var str = ' abc ';

const big = str.toBigInt();
str = String.fromBigInt(big);

dir(big, str.toString('"') + '.toBigInt()');

