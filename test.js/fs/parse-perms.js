#!/usr/bin/env node.js

const r1 = fs.parsePerms('drwxr-xr-x');
const r2 = fs.parsePerms('drwxr-xr-x', true);
dir(r1);
dir(r2);

