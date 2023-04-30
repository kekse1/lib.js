#!/usr/bin/env node.js

//
const UNREF = true;

//
function testing()
{
	dir(arguments.length, 'arguments.length @ testing()');
}

//
const eventing = new EVENT();

eventing.unref = UNREF;

//
const id = eventing.on('test', testing, null, 2000);

//
eventing.emit('test', 1, 2, 3);
eventing.emit('test', 2, 4);

//
//eventing.getEvent(id).unref();
console.eol(3);
const ev = eventing.getEvent(id);
dir(Object.keys(ev), 'getEvent("' + id + '"');

//
//SWITCH THIS TO TEST MORE..!!
//
//ev.ref = true;
//

console.eol(4);

(setTimeout(() => {
	eventing.emit('test');
}, 1000)).unref();

(setTimeout(() => {
	eventing.emit('test');
}, 2500)).unref();

