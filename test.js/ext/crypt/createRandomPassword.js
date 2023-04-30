#!/usr/bin/env node.js

const res1 = crypt.createRandomPassword();
const res2 = crypt.createRandomPassword(8);
const res3 = crypt.createRandomPassword(KEYS);

dir(res1, 'crypt.createRandomPassword()');
dir(res2, 'crypt.createRandomPassword(8)');
dir(res3, 'crypt.createRandomPassword(KEYS)');

