#!/usr/bin/env node.js

const path = './test-byte-format.tmp';
const size = '64 bytes';
const radix = 256;
const random = false;
const random_crypto = true;
const buffer = 512;

const fh = FILE.format(path, size, radix, random, random_crypto, buffer);

dir(fh);

