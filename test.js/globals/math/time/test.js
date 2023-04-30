#!/usr/bin/env node.js

var ms = Math.time.milliseconds(600)	// 600 ms
	+ time.seconds(50)		// 50 sec
	+ time.minutes(40)		// 40 min
	+ time.hours(3)			// 3 hour
	+ time.days(2);			// 2 days

const res1 = Math.time(ms);
const res2 = Math.time(ms, true);

dir(res1, 'Math.time(' + ms + ')');
console.eol(3);
dir(res2, 'Math.time(' + ms + ', true)');
console.eol(7);

//
ms = Math.time.years(3) + time.minutes(1) + time.milliseconds(200);

const res3 = Math.time(ms, true);
dir(res3, 'Math.time(' + ms + ', true)');
console.eol(4);

ms = (3n * BigInt.from(ms));

const res4 = Math.time(ms);
dir(res4, 'Math.time(' + ms + 'n)');
console.eol(3);

ms = time.years(100) + time.minutes(2) + time.seconds(1);

const res5 = Math.time(ms);
dir(res5, 'Math.time(' + ms + ')');

