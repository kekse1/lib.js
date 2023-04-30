#!/usr/bin/env node.js

//
function testing()
{
	dir(arguments.length, 'arguments.length @ testing()');
}

//
const eventing = new EVENT();

//
const id = eventing.on('test', testing, null, 2500);

//
eventing.emit('test', 1, 2, 3);
eventing.emit('test', 2, 4);

setTimeout(() => {
	eventing.emit('test');
}, 2000);

setTimeout(() => {
	eventing.emit('test');
}, 2500);

