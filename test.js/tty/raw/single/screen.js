#!/usr/bin/env node.js

//
const DELAY = 5000;

function onResize(_event, _value)
{
	if(_event.COUNT === 0)
	{
		_event.radix = 4;
	}
	else if(_event.COUNT === 3)
	{
		_event.radix = 8;
	}
	else if(_event.COUNT === 9)
	{
		_event.radix = 6;
	}

	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, compact: true, depth: 1 });
	console.eol(2);
	dir(_event.sequence, { text: _event.count + ' / ' + _event.radix + ' (' + _event.COUNT + ')', compact: true, depth: 1 });
	console.eol(4);
}

//
const screen = RAW.Screen.enable();
const resizeEventID = RAW.on('resize', onResize);//same as '[RAW.]Screen.on(..)'. ^_^

console.eol(2);
console.high('RAW % enabled (%)', 'SCREEN', screen);
console.info('% event set (%)', 1, resizeEventID);
console.eol(4);

dir(process.stdio[1].rawID, '.rawID');
dir(process.stdio[1].rawType, '.rawType');
dir(Object.keys(process.stdio[1].rawInfo), 'Object.keys(.rawInfo)');
dir(Object.keys(process.stdio[1].rawInfo.screen), 'Object.keys(.rawInfo.screen)');
console.eol(7);

setTimeout(() => {
	const a = RAW.Screen.disable(screen);
	const b = RAW.off(resizeEventID);

	console.eol(4);
	console.warn('% event disabled (%)', 1, b);
	console.high('RAW % disabled (%)', 'SCREEN', a);
	console.eol(4);

	dir(process.stdio[1].rawID, '.rawID');
	dir(process.stdio[1].rawType, '.rawType');
	console.eol(3);
}, DELAY);

