#!/usr/bin/env node.js

const item1 = 3.14;
const item2 = true;
const item3 = /test/g;

// on multiple arguments (only then!), an array is being returned!
var res = String.colorize(item1, item2, item3);

for(var i = 0; i < res.length; i++)
{
	console.log(res[i]);
}

res = String.colorize(1024n);

console.log(res);

