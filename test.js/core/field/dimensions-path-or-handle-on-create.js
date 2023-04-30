#!/usr/bin/env node.js

var field = FIELD.create({ dimensions: path.join(__dirname, 'example-dimensions.json') });

dir(field.toString());

const fh = fs.openSync(path.join(__dirname, 'example-dimensions.json'), 'r');
dir(fh, 'fs.openSync(...)');

field = FIELD.create({ dimensions: fh });

dir(field.toString());

