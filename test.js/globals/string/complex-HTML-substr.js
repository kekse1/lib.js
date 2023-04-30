#!/usr/bin/env node.js

const str = '<b>test</b>ing..';

const res = str.substr(2, 4, 'html');
dir(res, str.toString('"') + '.substr(2, 4, "html"); // => "stin"');

