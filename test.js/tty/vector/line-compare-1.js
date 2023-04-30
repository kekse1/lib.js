#!/usr/bin/env node.js
require('tty/vector');

const x1 = 2;
const y1 = 2;
const x2 = -3;
const y2 = 32;
const chars = '++++----';

function drawLine(_smooth)
{
	vector.line(x1, y1, x2, y2, false, chars, false, false, false, 0, true, _smooth, false);
}

ansi.clear();
setTimeout(() => { drawLine(true); }, 100);
setTimeout(() => { drawLine(false); }, 3000);

