#!/usr/bin/env node.js

const a = new Uint8Array(2);
a[0] = 100;
a[1] = 200;

stdout(a.toString());
stdout(a.toString(true));
stdout(a.toString(null));

