#!/usr/bin/env node.js
const string = '';
const result = string.hash('sha3-512', null);
dir(result.toString(null), { compact: true, depth: 1, text: string.quote('"') + '.hash("sha3-512", null)' });
