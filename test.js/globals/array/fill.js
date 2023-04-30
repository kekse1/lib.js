#!/usr/bin/env node.js

const res1 = Array.fill(8, 'string');
const res2 = Array.fill(8, 20);
const res3 = Array.fill(8, 20n);
const res4 = Array.fill(8, ['+','-']);
const res5 = Array.fill(8, [[]]);
const res6 = Array.fill(8, [[]], false);

dir(res1, 'Array.fill(8, "string")');
dir(res2, 'Array.fill(8, 20)');
dir(res3, 'Array.fill(8, 20n)');
dir(res4, 'Array.fill(8, ["+","-"])');

res5[0][0] = '@ _clone = true';
res6[0][0] = '@ _clone = false';

dir(res5, 'Array.fill(8, [[]])');//wichtig _clone = true.. sonst alles selbe inhalte..
dir(res6, 'Array.fill(8, [[]], false)');


