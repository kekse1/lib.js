#!/usr/bin/env node.js

//TODO/the rest Math.random.array.*() functions will be added soon..
//so here's just a BIT of testing... ^_^
//
//PS: negative _count is always be filled by Math.random.int() w/ min = 1, mostyle..
//

//
const res1 = Math.random.array(-16, true);
const res2 = Math.random.array.bool(-16, false);
const res3 = Math.random.array.int(8);
const res4 = Math.random.array.float(16, 64, 32, true);
const res5 = Math.random.array.bigint(4, 64, 0, true);

dir(res1, 'Math.random.array(-16, true)');
dir(res2, 'Math.random.array.bool(-16, false)');
dir(res3, 'Math.random.array.int(8)');
dir(res4, 'Math.random.array.float(16, 64, 32, true)');
dir(res5, 'Math.random.array.bigint(4, 64, 0, true)');

