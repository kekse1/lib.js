#!/usr/bin/env node.js

//
const EOL = [ 1, 2 ];

//
const colormap = String.colormap;

for(const idx in colormap)
{
	const hex = colormap[idx];
	const rgb = [ color.rgb(hex[0]), color.rgb(hex[1]) ];
	const line = '\t[ ' + idx.pad(-20).bold.color(... hex) + ' ] ' + space(4) + hex[0].color(... hex) + space(4) + rgb[0].color(... rgb);
	process.stdout.write(line + eol(1));
}

