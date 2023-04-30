#!/usr/bin/env node.js

const a = 'test';
const b = 'TEST';
const c = 'abc';

const res1 = String.equal(a, b);
const res2 = String.equal(false, a, b);
const res3 = String.equal(a, b, c, false);

dir(res1, 'String.equal("test", "TEST")');
dir(res2, 'String.equal(false, "test", "TEST")');
dir(res3, 'String.equal("test", "TEST", "abc", false)');

