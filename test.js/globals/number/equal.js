#!/usr/bin/env node.js

const res1 = Number.equal(1, 1, 2);
const res2 = Number.equal(1, 1, 1);

dir(res1, 'Number.equal(1, 1, 2)');
dir(res2, 'Number.equal(1, 1, 1)');

const res3 = BigInt.equal(0n, 0n, 1n);
const res4 = BigInt.equal(0n, 0n, 0n);

dir(res3, 'BigInt.equal(0n, 0n, 1n)');
dir(res4, 'BigInt.equal(0n, 0n, 0n)');

