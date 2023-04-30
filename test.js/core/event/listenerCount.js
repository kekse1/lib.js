#!/usr/bin/env node.js

const e = EVENT.create();
const func = () => {};

e.on('test1', func);
e.once('test2', func);

dir(e.listenerCount(func), '.listenerCount(function)');
dir(e.listenerCount(), '.listenerCount()');

e.off(func);

dir(e.listenerCount(func), '.listenerCount(function) AFTER e.off(function)');
dir(e.listenerCount(), '.listenerCount() AFTER e.off(function)');

