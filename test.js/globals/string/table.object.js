#!/usr/bin/env node.js

//
const str = '	x1	y1	x2	y2' +
	EOL + '0	100	35	90	60' +
	EOL + '1	100	35	90	20' +
	EOL + '2	100	35	10	20' +
	EOL + '3	100	35	10	60' +
	EOL;

const map = String.table(str);
dir(map, 'String.table("...")');
console.eol(3);
process.stdout.write(map.toString());
console.eol(7);

//
for(var i = 0; i < map.length; i++)
{
	dir(map[i]);
}

