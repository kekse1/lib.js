#!/usr/bin/env node.js

const size = '1024.25Gi2!B';
const res1 = Math.size.parse(size);

dir(res1, 'Math.size.parse("' + size + '")');

const res2 = Math.size.parse(2, 'mib');
const res3 = Math.size.parse('2', 'mib');

dir(res2, 'Math.size.parse(2, "mib")');
dir(res3, 'Math.size.parse("2t", "mib")');

