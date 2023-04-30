#!/usr/bin/env node.js

var float = 0.25;
var alpha = false;

for(var i = 0; i < 2; i++)
{
	for(var idx in color.floating)
	{
		dir(color.floating[idx](float, alpha), 'color.floating["' + idx + '"](' + float + ', ' + alpha + ')');
	}

	alpha = !alpha;
}

