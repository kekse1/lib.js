#!/usr/bin/env node.js

const c = Uint8ClampedArray;
const i = new c();

const r0 = TypedArray.typeOf([]);
const r1 = TypedArray.typeOf(c);
const r2 = TypedArray.typeOf(i);
const r3 = i.typeOf();

dir(r0, 'TypedArray.typeOf([])');
dir(r1, 'TypedArray.typeOf(Uint8ClampedArray)');
dir(r2, 'TypedArray.typeOf(new Uint8ClampedArray())');
dir(r3, 'new Uint8ClampedArray().typeOf()');

