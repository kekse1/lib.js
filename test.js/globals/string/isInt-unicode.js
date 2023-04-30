#!/usr/bin/env node.js

var string = String.fromCodePoint(256) + String.fromCodePoint(257) + String.fromCodePoint(258);

const resAlwaysTrue = string.isInt(256);
const resFalse1 = string.isInt(257);
const resFalse2 = string.isInt(258);
const resTrue = string.isInt(259);

string = string.toArray(true).toString({depth:1,colors:false});

dir(resAlwaysTrue, string + '.isInt(256)');
dir(resFalse1, string + '.isInt(257)');
dir(resFalse2, string + '.isInt(258)');
dir(resTrue, string + '.isInt(259)');

