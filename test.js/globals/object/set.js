#!/usr/bin/env node.js

const o = {};
const p = 'eins.zwei.2.-4';//negative int entsprechen [0], falls array w/o .length (bzw. == 0);
const v = 'ABC';

Object.set(p, v, o);

dir(o, 'Object.set("' + p + '", "' + v + '", {})', {depth:null});

