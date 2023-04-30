#!/usr/bin/env node.js

const over = 'Welcome!';
const str = 'dies ist ein test';

const offA = 0;
const offB = -4;

const res1 = str.overwrite(over, offA);
const res2 = str.overwrite(over, offB, true);
const res3 = str.overwrite(over, offB, false);

const o = over.quote();
const s = str.quote();

dir(res1, s + '.overwrite(' + o + ', ' + offA + ')');
dir(res2, s + '.overwrite(' + o + ', ' + offB + ', true)');
dir(res3, s + '.overwrite(' + o + ', ' + offB + ', false)');

