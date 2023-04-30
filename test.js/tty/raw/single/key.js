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
	if(_event.byteCOUNT === 0)
	{
		_event.radix = 4;
	}
	else if(_event.byteCOUNT === 3)
	{
		_event.radix = 8;
	}
	else if(_event.byteCOUNT === 9)
	{
		_event.radix = 6;
	}

	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, depth: 1, compact: true });
	console.eol(2);
	dir(_event.byteSequence, { text: '.byteSequence w/ ' + _event.byteCount + ' / ' + _event.radix + ' (' + _event.byteCOUNT + ')', compact: true, depth: 1 });
	dir(_event.keySequence, { text: '.keySequence w/ ' + _event.keyCount + ' / ' + _event.radix + ' (' + _event.keyCOUNT + ')', compact: true, depth: 1 });
	console.eol(4);
}

//
const key = RAW.Key.enable();
const keyEventID = RAW.on('key', onKey);//same as '[RAW.]Key.on(..)'. ^_^
const byteEventID = RAW.on('byte', onByte);

console.eol(2);
console.high('RAW % enabled (%)', 'KEY', key);
console.info('% events set (% / %)', 2, keyEventID, byteEventID);
console.eol(4);

dir(process.stdio[0].rawID, '.rawID');
dir(process.stdio[0].rawType, '.rawType');
dir(Object.keys(process.stdio[0].rawInfo), 'Object.keys(.rawInfo)');
dir(Object.keys(process.stdio[0].rawInfo.key), 'Object.keys(.rawInfo.key)');
console.eol(7);

setTimeout(() => {
	const a = RAW.Key.disable(key);
	const b = RAW.off(keyEventID);
	const c = RAW.off(byteEventID);

	console.eol(4);
	console.warn('% events disabled (% / %)', 2, b, c);
	console.high('RAW % disabled (%)', 'KEY', a);
	console.eol(4);

	dir(process.stdio[0].rawID, '.rawID');
	dir(process.stdio[0].rawType, '.rawType');
	console.eol(3);
}, DELAY);

