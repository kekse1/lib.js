#!/usr/bin/env node.js

const e = EVENT.create();

e.on('test1', () => {});
const test2ID = e.once('test2', () => {});

dir(e.listeners(), 'e.listeners()');
dir(e.listeners('test2'), 'e.listeners("test2")');

e.off('test1');
dir(e.listeners().length, '(1)');
e.off(test2ID);
dir(e.listeners().length, '(2) [after .off()]');

