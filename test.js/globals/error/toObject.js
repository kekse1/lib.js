#!/usr/bin/env node.js

const e = new Error("TEST-fehler");
e.item = 3.14;
const r = e.toObject(false);

dir(r, '(error).toObject(false)');

