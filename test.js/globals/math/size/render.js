#!/usr/bin/env node.js

//const OBJ = true;
const OBJ = false;

const UNIT = null;
const PREC = 1;
const PAD = false;
const BASE = null;
const RADIX = 10;
const LONG = true;
const THROW = true;
const COLOR = true;

//const value = ( 1024 * 1024 * 1024 * 4.75 );
const value = '4.75gib';

var res;

if(OBJ)
{
	res = Math.size.render({
		value,
		unit: UNIT,
		precision: PREC,
		pad: PAD,
		base: BASE,
		radix: RADIX,
		long: LONG,
		throw: THROW,
		color: COLOR
	});
}
else
{
	res = Math.size.render(value, UNIT, PREC, PAD, BASE, RADIX, LONG, THROW);
}

dir(res, 'Math.size.render(' + value + ', ...) [it even rounds, and shows decimal commas.. ;-]');
log(res.toText(true, true, 8, true) + ' [..toText(true, true, 8, true)]');

