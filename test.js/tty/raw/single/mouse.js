#!/usr/bin/env node.js

//
const DELAY = 10000;

function onMouse(_event, _value, _state)
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
const mouse = RAW.Mouse.enable();
const mouseEventID = RAW.on('mouse', onMouse);//same as '[RAW.]Screen.on(..)'. ^_^

console.eol(2);
console.high('RAW % enabled (%)', 'MOUSE', mouse);
console.info('% event set (%)', 1, mouseEventID);
console.eol(4);

dir(process.stdio[0].rawID, '.rawID');
dir(process.stdio[0].rawType, '.rawType');
dir(Object.keys(process.stdio[0].rawInfo), 'Object.keys(.rawInfo)');
dir(Object.keys(process.stdio[0].rawInfo.mouse), 'Object.keys(.rawInfo.mouse)');
console.eol(7);

setTimeout(() => {
	const a = RAW.Mouse.disable(mouse);
	const b = RAW.off(mouseEventID);

	console.eol(4);
	console.warn('% event disabled (%)', 1, b);
	console.high('RAW % disabled (%)', 'MOUSE', a);
	console.eol(4);

	dir(process.stdio[0].rawID, '.rawID');
	dir(process.stdio[0].rawType, '.rawType');
	console.eol(3);
}, DELAY);

