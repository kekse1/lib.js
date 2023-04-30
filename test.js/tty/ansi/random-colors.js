#!/usr/bin/env node.js

const string1 = ansi.color([[255,127],[255,127],[255,127]], null, 'STRING #1');
const string2 = 'STRING #2'.color([[255,127],[255,127],[255,127]]);
const string3 = 'STRING #3'.color([255,127]);

log(string1);
log(string2);
log(string3);

