#!/usr/bin/env node.js
const res1 = uuid.crypto.short();
const res2 = uuid.short.crypto();
dir(res1 + '  // isUUID(): ' + isUUID(res1));
dir(res2 + '  // isUUID(): ' + isUUID(res2));
