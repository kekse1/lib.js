#!/usr/bin/env node.js

const hue = 30;
const lightness = [ 70, 40 ];
const saturation = [ 0.3, 0.1 ];

const result0 = color.hsl.random(hue, lightness, saturation);
const result1 = color.hsl/*.create*/(180, 0.2, 80);

dir(result0, 'color.hsl.random(30, [ 70, 40 ], [ 0.3, 0.1 ])');
dir(result1, 'color.hsl.create(180, 0.2, 80)');

