#!/usr/bin/env node.js

const e = new Error("TEST-fehler");
e.item1 = 'item 1';
e.item2 = 3.14;

const r = e.toText(false);

dir(r, '(error).toText(false)');

