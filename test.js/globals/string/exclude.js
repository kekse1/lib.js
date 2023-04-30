#!/usr/bin/env node.js

const str = 'dies ist ein test'.toRandomCase();
const exclude  = [ 32, 't', 'tes' ];
const res1 = str.exclude(... exclude);
const res2 = str.exclude(... exclude, false);

dir(res1, str.quote() + '.exclude(32, "t", "tes")');
dir(res2, str.quote() + '.exclude(32, "t", "tes", false)');

