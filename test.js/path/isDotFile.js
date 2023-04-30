#!/usr/bin/env node.js

const pathA = '.test';
const pathB = '/tmp/.test';
const pathC = '/tmp/test';

dir(path.isDotFile(pathA), 'path.isDotFile("' + pathA + '")');
dir(path.isDotFile(pathB), 'path.isDotFile("' + pathB + '")');
dir(path.isDotFile(pathC), 'path.isDotFile("' + pathC + '")');

