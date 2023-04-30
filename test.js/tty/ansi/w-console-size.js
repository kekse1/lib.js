#!/usr/bin/env node.js

const width = console.width;
const height = console.height;

for(var i = 1; i <= height; i++)
{
	ansi.cursor(i, i);
	ansi.write(alphabet.LETTER[i - 1]);
}

for(var i = 1; i <= width; i++)
{
	ansi.cursor(0 - i, 0 - i);
	ansi.write(alphabet.LETTER[i - 1]);
}

/*
for(var i = 1; i <= width; i++)
{
	ansi.cursor(0 - i, 0 - i);
	ansi.write(alphabet.LETTER[i - 1]);
}

for(var i = 1; i <= height; i++)
{
	ansi.cursor(i, i);
	ansi.write(alphabet.LETTER[i - 1]);
}*/

ansi.cursor.home();

