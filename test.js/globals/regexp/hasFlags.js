#!/usr/bin/env node.js

const regexp = /test/gi;

const res1 = regexp.hasFlags('agi');
const res2 = regexp.hasFlags('gi');
const res3 = regexp.hasFlags('g');

dir(res1, '(' + regexp + ').hasFlags("agi")');
dir(res2, '(' + regexp + ').hasFlags("gi")');
dir(res3, '(' + regexp + ').hasFlags("g")');

