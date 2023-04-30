#!/usr/bin/env node.js

//
const x = -1;
const y = -1;
const bg = '';
const fg = '';
const char = '';
const state = true;
const stream = 0;

//
ansi.setPixel(x, y, bg, fg, char, state, stream);

//
log('setPixel(%, %, %, %, %, %, %)', x, y, bg, fg, char, state, stream);

