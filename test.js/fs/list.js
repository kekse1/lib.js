#!/usr/bin/env node.js

const PATH = __dirname;
const DEPTH = 2;
const HIDDEN = true;

const list = fs.list(PATH, DEPTH, HIDDEN);

dir(list, 'fs.list("' + PATH + '", ' + DEPTH + ', ' + HIDDEN + ')');

