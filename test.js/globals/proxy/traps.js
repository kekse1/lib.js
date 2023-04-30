#!/usr/bin/env node.js

const traps = Proxy.trap;
console.info('Proxy.trap:');

for(const t of traps)
{
	console.log(t);
}

