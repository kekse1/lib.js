#!/usr/bin/env node.js

const array = new Uint8Array(8);
crypto.getRandomValues(array);
dir(array, array.length);

