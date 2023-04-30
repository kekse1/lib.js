#!/usr/bin/env node.js

const CHAR = 'X';
const FG = 'random';
const BG = 'random';
const STYLES = 13;//['bold','italic','underline']//{bold: true, italic: true, underline: true};//
const RATIO = true;
const RANDOM = true;
const END = false;


require('tty/vector');

ansi.clear();

for(var i = 5; i < (Math.min(console.width, console.height) - 5); i++)
{
	// vector.pixel(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true);
	vector.pixel(i / vector.width, i / vector.height, true, CHAR, BG, FG, STYLES, RANDOM, END, false);
}

ansi.reset();
ansi.home();

