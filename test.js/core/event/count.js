#!/usr/bin/env node.js

//
function testing()
{
	dir(arguments.length, 'arguments.length @ testing()');
}

//
const eventing = new EVENT();

//
const id = eventing.on('test', testing, 2);

//
eventing.emit('test', 1, 2, 3);
eventing.emit('test', 2, 4);
eventing.emit('test', -1);

