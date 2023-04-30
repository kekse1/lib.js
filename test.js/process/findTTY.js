#!/usr/bin/env node.js

const res = process.findTTY();

if(res)
{
	dir(res.name, 'name');
	dir(res.index, 'index');
}
else
{
	dir(res);
}

