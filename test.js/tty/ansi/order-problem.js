#!/usr/bin/env node.js

const res1 = '.warnBG.whiteFG'.warnBG.whiteFG;
const res2 = '.whiteFG.warnBG'.whiteFG.warnBG;

process.stdout.write(res1 + EOL);
process.stdout.write(res2 + EOL);

process.stdout.write(res1.escapeISO(true) + EOL);
process.stdout.write(res2.escapeISO(true) + EOL);

console.eol(4);

const split1 = ansi.split(res1);
const split2 = ansi.split(res2);

dir(split1, 'split1');
console.eol(2);
dir(split2, 'split2');

