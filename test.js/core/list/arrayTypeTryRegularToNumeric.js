#!/usr/bin/env node.js

const list = LIST.create([ 2, 4, 6, 8, 'eins', 'zwei', 'drei', 'vier', 200, 300, 400, 500, 600 ]);

dir(list.array);

list.arrayType = Uint8ClampedArray;

dir(list.array);

