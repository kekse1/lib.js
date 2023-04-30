#!/usr/bin/env node.js

const res1 = Stream.isStream(process.stdin);
const res2 = Stream.isReadStream(process.stdin);
const res3 = Stream.isWriteStream(process.stdin);
const res4 = Stream.isReadStream(process.stdout);
const res5 = Stream.isWriteStream(process.stdout);

dir(res1, 'Stream.isStream(process.stdin)');
dir(res2, 'Stream.isReadStream(process.stdin)');
dir(res3, 'Stream.isWriteStream(process.stdin)');
dir(res4, 'Stream.isReadStream(process.stdout)');
dir(res5, 'Stream.isWriteStream(process.stdout)');

