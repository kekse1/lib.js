#!/usr/bin/env node.js

const str = 'hello world!';

const res1 = str.colorizeFG();
const res2 = str.colorizeBG().black;

process.stdout.write(res1 + EOL);
process.stdout.write(res2 + EOL);

