#!/usr/bin/env node.js

const degrees = 90;
const radians = Math.deg2rad(degrees);
const compare = Math.rad2deg(radians);

dir(radians, 'Math.deg2rad(' + degrees + ')');
dir(compare, 'Math.rad2deg(' + radians + ')');

