#!/usr/bin/env node.js

const o = [4,8];
o.eins = 'EINS';

const f = () => { dir("TEST-FUNC"); };
f.zwei = 'ZWEI';

const r0 = Object.getOwnPropertyNames(o, true, false);
const r1 = Object.getOwnPropertyNames(null);
const r2 = Object.getOwnPropertyNames(f);
const r3 = Object.getOwnPropertyNames(false);
const r4 = Object.getOwnPropertyNames(undefined);

dir(r0, '(Array)');
dir(r1, '(null)');
dir(r2, '(function)');
dir(r3, '(false)');
dir(r4, '(undefined)');

