#!/usr/bin/env node.js

//
function testing()
{
	dir(arguments.length, 'arguments.length @ testing()');
}

//
const eventing = new EVENT();

//
const id = eventing.once('test', testing);

//
eventing.emit('test', 1, 2, 3);
eventing.emit('test', 2, 4);

