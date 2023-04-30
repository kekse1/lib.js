#!/usr/bin/env node.js
//

if(typeof color === 'undefined')
{
	require('utility/color');
}

const f = color.random.floats();
const b = color.random.bytes();
const r = color.random.rgba();
const h = color.random.hex();

const rf = color.type(f);
const rb = color.type(b);
const rr = color.type(r);
const rh = color.type(h);

dir(f, rf);
dir(b, rb);
dir(r, rr);
dir(h, rh);

