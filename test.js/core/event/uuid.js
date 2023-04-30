#!/usr/bin/env node.js

//
function testing()
{
	dir(arguments.length, 'arguments.length @ testing()');
}

//
const eventing = new EVENT();

//
const id = eventing.on('test', testing);

//
eventing.emit('test', 1, 2, 3);
eventing.emit('test', 2, 4);

eventing.emit(id, 1, 2, 3, 4, 5, 6, 7, 8);

//
eventing.emit('test', 7);
dir(eventing.listenerCount(), '.listeners');

dir(eventing.hasEvent(id), '.hasEvent("' + id + '")');

eventing.off(id);
dir(eventing.listenerCount(), '.listeners');

dir(eventing.hasEvent(id), '.hasEvent("' + id + '")');

eventing.emit('test', 7);
dir(id, '(id)');

