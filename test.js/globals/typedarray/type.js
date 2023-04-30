#!/usr/bin/env node.js

const c = Uint8ClampedArray;
const i = new c();

dir(c.type, c.name + '.type');
dir(i.type, 'new ' + c.name + '().type');

const r1 = TypedArray.type([]);
const r2 = TypedArray.type(c);
const r3 = TypedArray.type(i);

dir(r1, 'TypedArray.type([])');
dir(r2, 'TypedArray.type(Uint8ClampedArray)');
dir(r3, 'TypedArray.type(new Uint8ClampedArray())');

