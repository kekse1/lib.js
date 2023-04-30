#!/usr/bin/env node.js

const list = LIST.create(new Uint32Array([ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192 ]));

dir(list.toString(true), 'LIST.create([ ... ])');

const path = '/tmp/list-serialization-test.tmp';
const overwrite = true;
const chunk = 8;//16384
const mode = 0o600;

function cb(_event)
{
	dir(_event, { compact: true, depth: 0, colors: true });
}

const result = list.saveArrayToFile(path, cb, overwrite, mode, chunk, true);

console.eol(4);
dir(result, 'list.saveArrayToFile("' + path + '", (callback), ' + overwrite + ', ' + chunk + ', true)');

