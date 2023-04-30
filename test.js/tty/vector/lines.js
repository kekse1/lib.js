#!/usr/bin/env node.js
require('tty/vector');

//
const x1 = 0.5;
const y1 = 0.5;
const CHANGE = false;
const DELAY = 200;
const COUNT = 200;
const CHARS = '-+';//'01'//'abcdef';
const BG = false;
const FG = false;
const RAINBOW = true;
const STYLES = 0;
const ANSI_ALIASING = true;
const SMOOTH = false;

//
const str = `\t++\t+-\t-+\t--
x2	0.75	0.75	0.25	0.25
y2	0.75	0.25	0.75	0.25`;
const map = String.table(str);

//
var STOP = false;
var count = 0;

function draw()
{
	//
	ansi.clear();

	//
	for(var idx in map.x)
	{
		//
		const { x2, y2 } = map.x[idx];

		// vector.line(_x1, _y1, _x2, _y2, _ratio = false, _chars, _bg, _fg, _rainbow = false, _styles = 0, _anti_aliasing = true, _state = true);
		vector.line(x1, y1, x2, y2, true, CHARS, BG, FG, RAINBOW, STYLES, ANTI_ALIASING, SMOOTH, false);
	}
	
	//
	if(CHANGE)
	{
		SMOOTH = !SMOOTH;
	}
	
	//
	if(++count >= COUNT)
	{
		STOP = true;
	}
	else if(! STOP)
	{
		setTimeout(draw, DELAY);
	}
}

draw();

