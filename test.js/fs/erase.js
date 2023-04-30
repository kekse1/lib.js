#!/usr/bin/env node.js

const S = 1024;
const P = path.join(__dirname, 'erase-test.tmp');

if(fs.exists(P))
{
	fs.unlinkSync(P);
}

fs.touch(P, null, S);

var s = fs.size(P);

dir(s, 'fs.size("' + P + '")');

const r = fs.erase(P);
s = fs.size(P);

dir(r, 'fs.erase("' + P + '")');
dir(s, 'fs.size(...) AFTER \'fs.erase(..)\'');

