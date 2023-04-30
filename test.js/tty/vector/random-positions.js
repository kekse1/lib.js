#!/usr/bin/env node.js

//
const DEFAULT_AMOUNT = 2048;

//
var AMOUNT = 0;

for(var i = 0; i < process.ARGV.length; i++)
{
	if(process.ARGV[i].isInt())
	{
		AMOUNT += parseInt(process.ARGV[i]);
	}
}

if(AMOUNT === 0)
{
	console.warn('Using default amount of pixels: %', AMOUNT = DEFAULT_AMOUNT);
}
else
{
	console.info('Using your new amount of pixels: %', AMOUNT);
}

sleep(2000);

//
const CHAR = null;// 'XYZ';
const FG = 'random';//const FG = '#ff0';
const BG = 'random';//const BG = '#00f';
const STYLES = 11;//['bold','underline']//{bold: true, underline: true};//
const RANDOM = true
const END = false;

//
require('tty/vector');

ansi.clear();
Math.crypto = false;

for(var i = 0; i < AMOUNT; i++)
{
	// vector.pixel(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true);
	vector.pixel(Math.random(), Math.random(), true, CHAR, BG, FG, STYLES, RANDOM, END, false);
}

sleep(3000);
ansi.clear();
Math.crypto = true;

for(var i = 0; i < AMOUNT; i++)
{
	// vector.pixel(_x, _y, _ratio = false, _char, _bg, _fg, _styles = 0, _random = true, _end = true, _state = true);
	vector.pixel(Math.random(), Math.random(), true, CHAR, BG, FG, STYLES, RANDOM, END, false);
}

ansi.home();
ansi.reset();

