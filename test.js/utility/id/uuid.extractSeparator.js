#!/usr/bin/env node.js

const long = uuid(null, false, 'g');
const short = uuid.short(null, 'g');
const cmp = 'abcdedcba';

dir(long, 'uuid(null, false, "g")');
dir(short, 'uuid.short(null, "g")');
console.eol(4);

const resLong = uuid.extractSeparator(long);
const resShort = uuid.extractSeparator(short);
const resNull = uuid.extractSeparator(cmp);

dir(resLong, 'uuid.extractSeparator("' + long + '")');
dir(resShort, 'uuid.extractSeparator("' + short + '")');
dir(resNull, 'uuid.extractSeparator("' + cmp + '")');

