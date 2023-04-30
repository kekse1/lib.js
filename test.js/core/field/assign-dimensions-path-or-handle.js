#!/usr/bin/env node.js

const p = path.join(__dirname, 'example-dimensions.json');
const field = FIELD.create();

dir(field.toString(), 'FIELD.create()');

field.dimensions = p;

dir(field.toString(), '(field) AFTER .dimensions = "' + p + '"');

field.dimensions = null;

dir(field.toString(), '(field) AFTER removing dimensions');

const fh = fs.openSync(p, 'r');

field.dimensions = fh;

dir(field.toString(), '(field) AFTER .dimensions = ' + fh + ' (file handle)');

fs.closeSync(fh);

