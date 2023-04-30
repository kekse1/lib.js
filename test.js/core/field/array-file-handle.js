#!/usr/bin/env node.js

const fh = fs.openSync(__filename, 'r');
dir(fh, 'fs.openSync(__filename, "r")');

const field = FIELD.create({ array: fh });

dir(field.array);

