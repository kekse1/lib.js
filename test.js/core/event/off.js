#!/usr/bin/env node.js
//
var count = 0;
const e = new EVENT();
const cb = () => { process.stdio[1].write("CB => " + (++count) + ' .. '); };

const uuid = e.on('one', cb); stdout('uuid = e.on("one", cb)');
e.on('two', cb); stdout('@ e.on("two", cb)');
e.on('three', cb); stdout('@ e.on("three", cb)');
e.on('four', cb); stdout('@ e.on("four", cb)');

//
console.eol();
e.emit(uuid); stdout('@ e.emit(uuid = ' + uuid + ')');

//
console.eol();
e.emit('one'); stdout('@ e.emit("one")');
e.emit('two'); stdout('@ e.emit("two")');
e.emit('three'); stdout('@ e.emit("three")');
e.emit('four'); stdout('@ e.emit("four")');

//
console.eol();
e.off(uuid); stdout('@ e.off(uuid = ' + uuid + ')');
e.emit('one'); stdout('@ e.emit("one")');
e.emit('two'); stdout('@ e.emit("two")');

//
console.eol();
e.off('two'); stdout('@ e.off("two")');
e.emit('two'); stdout('@ e.emit("two")');
e.emit('three'); stdout('@ e.emit("three")');

//
console.eol();
e.off(cb); stdout('@ e.off(cb)');
e.emit('two'); stdout('@ e.emit("two")');
e.emit('three'); stdout('@ e.emit("three")');
e.emit('four'); stdout('@ e.emit("four")');

//

