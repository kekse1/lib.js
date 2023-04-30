#!/usr/bin/env node.js

const err = new Error(String.fill(4096, 'abcdef'));

stdout(err.toString());
stdout(err.toString(true));

