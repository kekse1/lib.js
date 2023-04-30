#!/usr/bin/env node.js

const time = (1000 * 12345 + 6789);

const res1 = Math.time.render(time);
const res2 = Math.time.render(time, true);
const res3 = Math.time.render.short(time);
const res4 = Math.time.render.short(time, true);

stdout(res1);
stdout(res2);
stdout(res3);
stdout(res4);

