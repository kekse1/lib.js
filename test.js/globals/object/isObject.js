#!/usr/bin/env node.js

const o1 = {};
const o2 = Object.create(null);
const o3 = [];
const o4 = null;

log('(%) => regular object', 'object #1');
log('(%) => null object (Object.create(null) or Object.null(...))', 'object #2');
log('(%) => array object (typeof => object, usually ;-)', 'object #3');
log('(%) => (null) itself.. typeof => object - but not here! :-)', 'object #4');
console.eol(3);

dir(Object.isObject(o1), '[Object.]isObject(object #1)');
dir(isObject(o2), '[Object.]isObject(object #2)');
dir(isObject(o3), '[Object.]isObject(object #3)');
dir(isObject(o3, false), 'isObject(object #3, false)');
dir(Object.isObject(o4), 'isObject(object #4)');

