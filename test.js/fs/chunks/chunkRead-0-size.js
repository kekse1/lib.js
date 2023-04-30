#!/usr/bin/env node.js

const p = path.join(__dirname, 'empty.tmp');

if(fs.exists(p, null, true))
{
	fs.unlinkSync(p);
}

fs.touch(p, null, 0);
dir(fs.size(p), 'fs.size("' + p + '")');

const cb = (_event) => {
	dir(_event.buffer, '.size = ' + _event.size + ', .finish = ' + _event.finish);
	console.eol(3);
};

const res = fs.chunkRead(p, cb, { encoding });
dir(res, 'fs.chunkRead("' + p + '", cb, { encoding })');
console.eol(3);

