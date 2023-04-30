#!/usr/bin/env node.js

const str = 'dies ist ein test\nzweite zeile\ndrei\nvier five six\n';
const res = str.lineMax(7);

dir(res, str.quote('"') + '.lineMax(7)');

