#!/usr/bin/env node.js

const a = 'rgb(10,20,30)';
const b = 'redd';
const c = 'brightred';
const d = [ 2, 4, 6 ];
const e = [ 2, 4 ];
const f = 'rgba(2, 4, 6, 0.5)';

const ra = color.type(a);
const rb = color.type(b);
const rc = color.type(c);
const rd = color.type(d);
const re = color.type(e);
const rf = color.type(f);

dir(ra, 'color.type("' + a + '")');
dir(rb, 'color.type("' + b + '")');
dir(rc, 'color.type("' + c + '")');
dir(rd, 'color.type([ 2, 4, 6 ])');
dir(re, 'color.type([ 2, 4 ])');
dir(rf, 'color.type("rgba(2, 4, 6, 0.5)")');

