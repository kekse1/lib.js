#!/usr/bin/env node.js

const val = time.milliseconds(250) + time.seconds(40) + time.minutes(20) + time.hours(1);
const res = Math.time(val, true, false, true);

dir(res, 'time.milliseconds(250) + time.seconds(40) + time.minutes(20) + time.hours(1)');

