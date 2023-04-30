#!/usr/bin/env node.js

//
color = require('utility/color');
ansi = require('tty/ansi');

//
const str = (process.ARGV.join(' ') || 'hello world!');

const res = str.color('random', 'random4');

console.log(res);

