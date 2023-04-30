#!/usr/bin/env node.js

const test = [ 'vi', 'bash', 'sh', 'vim', 'nano' ];
const result = {};

//
for(const t of test)
{
	dir(fs.where(t, false), 'fs.where("' + t + '", false)');
}

console.eol(4);

for(const t of test)
{
	dir(fs.where(t), 'fs.where("' + t + '")');
}

console.eol(4);

for(const t of test)
{
	dir(fs.where(t, 1), 'fs.where("' + t + '", 1)');
}

console.eol(2);

for(const t of test)
{
	dir(fs.where(t, -1), 'fs.where("' + t + '", -1)');
}

