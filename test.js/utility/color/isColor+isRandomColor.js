#!/usr/bin/env node.js

const a = 'red';
const b = 'brightRed';
const c = 'brightred';
const d = 'asdasdasd';
const e = '#f00';
const f = 'random';
const g = '';
const h = 'rgba(200)';
const i = '#f';
const j = 'rgba(200, 100, 0, 0.25)';

const ra = color.isColor(a);
const rb = color.isColor(b);
const rc = color.isColor(c);
const rd = color.isColor(d);
const re = color.isColor(e);
const rf = color.isColor(f);
const rg = color.isColor(g);
const rh = color.isColor(h);
const ri = color.isColor(i);
const rj = color.isColor(j);

const rra = color.isRandomColor(a);
const rrb = color.isRandomColor(b);
const rrc = color.isRandomColor(c);
const rrd = color.isRandomColor(d);
const rre = color.isRandomColor(e);
const rrf = color.isRandomColor(f);
const rrg = color.isRandomColor(g);
const rrh = color.isRandomColor(h);
const rri = color.isRandomColor(i);
const rrj = color.isRandomColor(j);

dir(ra, 'color.isColor("red")');
dir(rb, 'color.isColor("brightRed")');
dir(rc, 'color.isColor("brightred")');
dir(rd, 'color.isColor("asdasdasd")');
dir(re, 'color.isColor("#f00")');
dir(rf, 'color.isColor("random8")');
dir(rg, 'color.isColor("")');
dir(rh, 'color.isColor("rgba(200)")');
dir(ri, 'color.isColor("#f")');
dir(rj, 'color.isColor("rgba(200, 100, 0, 0.25)")');
console.eol(2);
dir(rra, 'color.isRandomColor("red")');
dir(rrb, 'color.isRandomColor("brightRed")');
dir(rrc, 'color.isRandomColor("brightred")');
dir(rrd, 'color.isRandomColor("asdasdasd")');
dir(rre, 'color.isRandomColor("#f00")');
dir(rrf, 'color.isRandomColor("random8")');
dir(rrg, 'color.isRandomColor("")');
dir(rrh, 'color.isRandomColor("rgba(200)")');
dir(rri, 'color.isRandomColor("#f")');
dir(rrj, 'color.isRandomColor("rgba(200, 100, 0, 0.25)');

