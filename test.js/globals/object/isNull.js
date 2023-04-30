#!/usr/bin/env node.js

const o1 = { abc: 'def' };
const o2 = Object.null({ abc: 'DEF' });

dir(o1, '(object #1)');
dir(o2, '(object #2)');
console.eol(3);

dir(Object.isNull(o1), 'Object.isNull(object #1)');
dir(Object.isNull(o2), 'Object.isNull(object #2)');

