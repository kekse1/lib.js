#!/usr/bin/env node.js

const pathA = '/tmp/test';
const pathB = '/tmp/.test';
const pathC = '/abc/.def/.ghi/jkl/test';

dir(path.withDotFile(pathA), 'path.withDotFile("' + pathA + '")');
dir(path.withDotFile(pathB), 'path.withDotFile("' + pathB + '")');
dir(path.withDotFile(pathC), 'path.withDotFile("' + pathC + '")');

