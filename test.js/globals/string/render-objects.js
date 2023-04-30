#!/usr/bin/env node.js

const RADIX = 2;

var o = {};
o.eins = 'eins';
Object.defineProperty(o, 'test', { get: function(){} });

var r = String.render(o, { colors: true, radix: RADIX });

stdout(r);

o = Object.null(o);
r = String.render(o, { colors: true, radix: RADIX });

stdout(r);

o = [ 'abc', 'def' ];
o.eins = 'eins';
Object.defineProperty(o, 'zwei', { get: function(){} });

r = String.render(o, { colors: true, radix: RADIX });

stdout(r);

o = [2,4,6];
r = String.render(o, true);

stdout(r);

o.test = 'TEST';
r = String.render(o, { colors: true, subtract: true });

stdout(r);

