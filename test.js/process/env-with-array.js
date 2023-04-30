#!/usr/bin/env node.js

const arr = [ 'eins', 'zwei' ];

process.setEnv('array', arr);

dir(process.env.array, 'process.env.array');

const res1 = process.getEnv('array');
const res2 = process.env.array;

dir(res1, 'process.getEnv("array")');
dir(res2, 'process.env.array');

