#!/usr/bin/env node.js

const a = new Uint8Array([1,3,5,7,9]);
const b = a.toUint32Array();

dir(a, 'new Uint8Array([...])');
dir(b, '(uint8array).toUint32Array()');

const c = a.to('float32array');
const d = a.to(Float64Array);

dir(c, '(uint8array).to("uint32floatarray")');
dir(d, '(uint8array).to(Uint64FloatArray)');

