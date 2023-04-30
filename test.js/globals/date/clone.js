#!/usr/bin/env node.js

const a = new Date();
const b = a.clone();

dir(a, a.getTime());
dir(b, b.getTime());

