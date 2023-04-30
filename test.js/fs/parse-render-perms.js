#!/usr/bin/env node.js

const fileMode = fs.mode(__filename);
const dirMode = fs.mode(__dirname);

const fileRes = fs.renderPerms(fileMode);
const dirRes = fs.renderPerms(dirMode);

dir(fileRes, 'fs.renderPerms(fs.mode(__filename) [== ' + fileMode.toString(8) + '])');
dir(dirRes, 'fs.renderPerms(fs.mode(__dirname) [== ' + dirMode.toString(8) + '])');

const res = [
	[ '7000', fs.renderPerms(0o7000) ],
	[ '6000', fs.renderPerms(0o6000) ],
	[ '5000', fs.renderPerms(0o5000) ],
	[ '4000', fs.renderPerms(0o4000) ],
	[ '3000', fs.renderPerms(0o3000) ],
	[ '2000', fs.renderPerms(0o2000) ],
	[ '1000', fs.renderPerms(0o1000) ],
	[ '0000', fs.renderPerms(0o0000) ]
];

for(const r of res)
{
	dir(r[1], 'fs.renderPerms(0o' + r[0] + ')');
}

//
console.eol(2);
const parse = [ 'drwxrwxrwt', dirRes, fileRes, ... res.select(1) ];
console.eol(4);

for(var i = 0; i < parse.length; ++i)
{
	parse[i] = [ parse[i], fs.parsePerms(parse[i]) ];
}

dir(parse, 'fs.parsePerms(...)');

