#!/usr/bin/env node.js

//
const DELAY = 0;

function onKey(_key, _info, _sequence, _sequence_bytes, _id, _stream)
{
	dir('key (' + _key.string + ')', 'key @ ' + _id);
}

function onByte(_byte, _info, _sequence_bytes, _sequence, _id, _stream)
{
	dir('byte (' + _byte + ')', 'byte @ ' + _id);
}

function onResize(_size, _info, _sequence, _id, _stream)
{
	dir('resize', 'resize @ ' + _id);
}

function onMouse(_mouse, _info, _sequence, _id, _stream)
{
	dir('mouse', 'mouse @ ' + _id);
}

//
const keys = RAW.enable();
const eventKeys = {
	key: RAW.on('key', onKey),
	byte: RAW.on('byte', onByte),
	resize: RAW.on('resize', onResize),
	mouse: RAW.on('mouse', onMouse)
};

dir(keys, 'keys');
console.eol(3);
dir(RAW.rawType(), 'RAW.rawType()');
console.eol();
dir(RAW.rawType(null, ['key','mouse','screen']), 'RAW.rawType(null, ["key","mouse","screen"])');
console.eol(4);
console.info('% events set', 4);

setTimeout(() => {
	const a = RAW.disable(keys);
	const b = new Array(eventKeys.LEN);
	var c;

	for(const idx in eventKeys)
	{
		c = RAW.off(eventKeys[idx]);
		console.warn('RAW event \'%\' disabled (%)', idx, c);
	}

	console.info('% events disabled in total', b.length);
	console.dir(a, 'RAW mode disabled');

	console.eol(3);
	dir(RAW.rawType(), 'RAW.rawType()');
	console.eol();
	dir(RAW.rawType(null, ['key','mouse','screen']), 'RAW.rawType(null, ["key","mouse","screen"])');

	console.eol(3);
}, DELAY);

