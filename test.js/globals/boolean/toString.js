#!/usr/bin/env node.js

const wahr = true;

const res1 = wahr.toString();
const res2 = wahr.toString(false);
const res3 = wahr.toString(true);
const res4 = wahr.toString({ true: 'wahr', false: 'falsch' });
const res5 = wahr.toString('falsch', 'wahr');
const res6 = wahr.toString({ colors: true, true: 'WAHR', typeOf: true });

stdout(res1);
stdout(res2);
stdout(res3);
stdout(res4);
stdout(res5);
stdout(res6);

