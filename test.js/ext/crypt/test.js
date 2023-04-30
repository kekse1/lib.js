#!/usr/bin/env node.js

const ROUNDS = 16;
const clear = String.fill(1024, '0123456789abcdef');
const key = '0123456789abcdef';

const result = crypt.encrypt(clear, key, ROUNDS);

dir(result, 'crypt.encrypt(' + clear.quote('"') + ', ' + key.quote('"') + ')');

const back = crypt.decrypt(result, key, ROUNDS);

dir(back, 'crypt.decrypt(' + result.quote('"') + ', ' + key.quote('"') + ')');

