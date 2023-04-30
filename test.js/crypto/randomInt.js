#!/usr/bin/env node.js

function cb(... _args)
{
	dir(_args[0] + ' / ' + _args[1], _args.length);
}

const res1 = crypto.randomInt(200, 196, cb);
const res2 = crypto.randomInt(196, 200, cb);
const res3 = crypto.randomInt(10, cb);
const res4 = crypto.randomInt(200, 196);
const res5 = crypto.randomInt(10);

dir(res1, 'crypto.randomInt(200, 196, cb)');
dir(res2, 'crypto.randomInt(196, 200, cb)');
dir(res3, 'crypto.randomInt(10, cb)');
console.eol(2);
dir(res4, 'crypto.randomInt(200, 196)');
dir(res5, 'crypto.randomInt(10)');
console.eol(2);

