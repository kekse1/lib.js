#!/usr/bin/env node.js

const str = 'hello';
const res = str.split('', 3, true);
dir(res, str.quote('"') + '.split("")');

