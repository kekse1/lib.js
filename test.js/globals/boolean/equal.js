#!/usr/bin/env node.js

const res1 = Boolean.equal(false, false, true);
const res2 = Boolean.equal(false, false, false);

dir(res1, 'Boolean.equal(false, false, true)');
dir(res2, 'Boolean.equal(false, false, false)');

