#!/usr/bin/env node.js

const radix1 = 256;
const radix2 = 16;
const space = '32 TiB';
const bytes = Math.size.parse(space);

dir(bytes, 'Bytes @ "' + space + '"');

const result1 = FIELD.maxDepth(bytes, radix1, false);
const result2 = FIELD.maxDepth(space, radix2, true);

dir(result1, 'FIELD.maxDepth(' + bytes + ', ' + radix1 + ', false)');
dir(result2, 'FIELD.maxDepth("' + space + '", ' + radix2 + ', true)');

