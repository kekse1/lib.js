#!/usr/bin/env node.js

var u;
const uni = Uniform.create(u = 'http://localhost?eins=zwei&drei=vier&q');

dir(uni.toString());
const res = uni.encode();

dir(res, '.encode()');

const inv = Uniform.decode(res);

dir(inv, '.decode()');

