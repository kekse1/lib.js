#!/usr/bin/env node.js

//
const res = fs.chunkWrite(path.join(__dirname, 'example-dimensions.uint32.tmp'), new Uint32Array([2,2,2,2]), { overwrite: true });
dir(res, 'fs.chunkWrite("example-dimensions.uint32.tmp", new Uint32Array([2,2,2,2]))');
console.eol(3);

//
var field = FIELD.create({ dimensions: path.join(__dirname, 'example-dimensions.uint32.tmp') });

dir(field.toString());

const fh = fs.openSync(path.join(__dirname, 'example-dimensions.uint32.tmp'), 'r');
dir(fh, 'fs.openSync(...)');

field = FIELD.create({ dimensions: fh });

dir(field.toString());

