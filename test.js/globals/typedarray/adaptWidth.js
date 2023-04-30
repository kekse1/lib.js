#!/usr/bin/env node.js

// using 'Uint32Array' as _target is totally O.K.,
// also using an INSTANCE of such TypedArray, but
// also some own INTEGER for BYTES_PER_ELEMENT...
//
// we can use an existing TypedArray w/ prototype
// 'TypedArray.prototype.adaptByteLength(_target)',
// or just the *static* 'TypedArray.adaptByteLength(
// _length, _target)'.. jfyi. ^_^

const input = new Uint8Array(22);
const output = Uint32Array;

const result = input.adaptByteLength(output);

dir(input.byteLength, '(input).[byte]Length');
dir(result, '(input).adaptByteLength(Uint32Array)');

