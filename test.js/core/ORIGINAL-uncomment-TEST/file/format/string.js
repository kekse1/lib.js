#!/usr/bin/env node.js

const path = './test-string-format.tmp';
const size = '64 bytes';
const radix = 'xyz';
const random = true;
const random_crypto = true;
const buffer = 512;

const fh = FILE.format(path, size, radix, random, random_crypto, buffer);

dir(fh);

