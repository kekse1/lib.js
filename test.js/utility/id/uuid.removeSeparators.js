#!/usr/bin/env node.js

const long = uuid(null, false, 'g');
const short = uuid.short(null, 'g');
const cmp = 'abcdedcba';

dir(long, 'uuid(null, false, "g")');
dir(short, 'uuid.short(null, "g")');
console.eol(4);

const resLong = uuid.removeSeparators(long);
const resShort = uuid.removeSeparators(short);
const resNull = uuid.removeSeparators(cmp);

dir(resLong, 'uuid.removeSeparator("' + long + '")');
dir(resShort, 'uuid.removeSeparator("' + short + '")');
dir(resNull, 'uuid.removeSeparator("' + cmp + '")');

