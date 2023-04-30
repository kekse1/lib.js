#!/usr/bin/env node.js

const string = 'eIn TEst-sTRinG';
const needle = 'test';

const res1 = string.includes(needle);
const res2 = string.includes(needle, null, false);

dir(res1, string.quote('"') + '.includes("' + needle + '")');
dir(res2, string.quote('"') + '.includes("' + needle + '", null, false)');

