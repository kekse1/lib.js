#!/usr/bin/env node.js

const res1 = id.uuid(null, true, ':', false);
const res11 = id.isUUID(res1);
const res2 = uuid();
const res22 = isUUID(res2);
const res3 = isUUID('xyz');

dir(res1, 'id.uuid(null, true, ";", false)');
dir(res11, 'id.isUUID(...)');
console.eol(3);
dir(res2, 'uuid()');
dir(res22, 'isUUID(...)');
console.eol(3);
dir(res3, 'isUUID("xyz")');

