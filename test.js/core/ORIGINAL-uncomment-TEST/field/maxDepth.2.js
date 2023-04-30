#!/usr/bin/env node.js

const radix = 10;
const space = '32 TiB';
const bytes = Math.size.parse(space);

dir(bytes, 'Bytes @ "' + space + '"');

const result = FIELD.maxDepth(space, radix);

dir(result, 'FIELD.maxDepth("' + space + '", ' + radix + ')');

