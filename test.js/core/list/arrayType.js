#!/usr/bin/env node.js

const list = LIST.create(new Uint8Array([ 2, 4, 6, 8 ]));

dir(list.array, list.arrayType);

list.arrayType = 'array';

dir(list.array, list.arrayType);

