#!/usr/bin/env node.js

const str = 'hello world!'.repeat(4);

const res1 = str.rainbowFG();
const res2 = str.rainbowBG().brightYellow;

log(res1);
log(res2);

