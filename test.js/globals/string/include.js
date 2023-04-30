#!/usr/bin/env node.js

const str = 'dies ist ein test';
const include  = [ 32, 't', 'tes' ];
const res = str.include(... include);

dir(res, str.quote() + '.include(32, "t", "tes")');

