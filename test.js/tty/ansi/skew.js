#!/usr/bin/env node.js

const { width, height } = console.size;
const halfW = Math.round(width / 2);
const halfH = Math.round(height / 2);
const startByte = 33;
var currByte = startByte;

function nextChar()
{
	const result = String.fromCharCode(currByte);

	if(++currByte >= 127)
	{
		currByte = startByte;
	}

	return result;
}

function setPixel(_x, _y, _char)
{
	//
	_x = (_x % width) + 1;
	_y = (_y % height) + 1;

	if(! String.isString(_char))
	{
		_char = nextChar();
	}

	//
	ansi.cursor(_y + 1, _x + 1);

	//
	ansi.write(_char);

	//
	return { x: _x, y: _y };
}

function home()
{
	return ansi.cursor.home();
}

const min = Math.min(width, height);
const start = 1;
const stop = -2;

for(var i = 1; i < (min - start + stop); i++)
{
	setPixel(i, i);
}

home();

