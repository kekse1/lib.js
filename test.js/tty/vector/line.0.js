#!/usr/bin/env node.js
require('tty/vector');

const x1 = 3;
const y1 = 3;
const x2 = -3;//-2;//42
const y2 = -3;//22;//42
//const chars = alphabet.LOWER;
const chars = '++--';

function drawLine(_smooth)
{
	return dir(vector.line(x1, y1, x2, y2, false, chars, false, false, false, 0, true, _smooth, false), 'vector.line(..)');
}

ansi.clear();
setTimeout(() => { drawLine(true); }, 100);
setTimeout(() => { drawLine(false); }, 3000);

