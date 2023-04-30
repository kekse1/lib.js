#!/usr/bin/env node.js

const fh = fs.openSync(__filename, 'r');
dir(fh, 'fs.openSync(__filename, "r")');

const list = LIST.createFromFile(fh);

dir(list.toString());

