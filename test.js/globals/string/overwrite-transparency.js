#!/usr/bin/env node.js

const string = 'Dies ist Ein Transparenz-Test..! :)~';
const overwrite = 'HIER \0\0\0 ein \0\0\0\0\0\0\0\0\0\0\0 TEST..! ^_^';

const result1 = string.overwrite(overwrite, 0, false, 0);
const result2 = string.overwrite(overwrite, null, true, '\0');

dir(result1, string.quote('"') + '.overwrite("' + overwrite + '", 0, false, 0)');
dir(result2, string.quote('"') + '.overwrite("' + overwrite + '", null, true, "\\0")');

