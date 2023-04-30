#!/usr/bin/env node.js

const str = '1,024.5';

const res = str.switch(',', '.');

dir(res, str.toString('"') + '.switch(",", ".")');

