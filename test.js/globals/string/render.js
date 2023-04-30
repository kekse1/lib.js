#!/usr/bin/env node.js

//TODO/more options...

const nr = 3.14;
const str = 'string';

const res1 = String.render(nr);
const res2 = String.render(nr, { colors: true, radix: 'xy' });
const res3 = String.render(str);
const res4 = String.render(str, true );

log(res1);
log(res2);
log(res3);
log(res4);

