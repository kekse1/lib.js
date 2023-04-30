#!/usr/bin/env node.js
require('tty/vector');

const x1 = 2;
const y1 = 2;
const x2 = 12;
const y2 = 2;
const chars = '++++----';

function drawLine(_smooth)
{
	vector.line(x1, y1, x2, y2, false, chars, false, false, false, 0, true, _smooth, false);
}

ansi.clear();
setTimeout(() => { drawLine(true); }, 100);
setTimeout(() => { drawLine(false); }, 3000);

