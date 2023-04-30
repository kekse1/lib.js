#!/usr/bin/env node.js

//
const DELAY = 5000;

function onKey(_event, _value)
{
	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, depth: 1, compact: true });
	console.eol(4);
}

function onByte(_event, _value)
{
	dir(_value, _event.event.quote() + ' @ ' + _event.id);
	console.eol(4);
}

function onResize(_event, _value)
{
	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, compact: true, depth: 1 });
	console.eol(4);
}

function onMouse(_event, _value, _state)
{
	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, compact: true, depth: 1 });
	console.eol(4);
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

	dir(process.stdio[0].rawID, '.rawID (unset!)');
	dir(process.stdio[0].rawType, '.rawType (unset!)');
	console.eol(3);
}, DELAY);

