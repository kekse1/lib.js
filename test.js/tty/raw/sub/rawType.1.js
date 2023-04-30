#!/usr/bin/env node.js

//
function checkRawType(_id_stream, _throw)
{
	const res1 = RAW.rawType(_id_stream, null, _throw);
	const res2 = RAW.rawType(_id_stream, 'key', _throw);
	const res3 = RAW.rawType(_id_stream, 'screen', _throw);
	const res4 = RAW.rawType(_id_stream.rawID, ['key','screen'], _throw);
	
	console.eol(6);
	dir(res1, 'eins');
	dir(res2, 'zwei');
	dir(res3, 'drei');
	dir(res4, 'vier');
	console.eol(4);
}

//
const DELAY = 0;

function onResize(_size, _info, _sequence, _id, _stream)
{
	dir(_info.count + ' / ' + _info.radix + ' (' + _info.COUNT + ')', 'resize @ ' + _id);
}

//
const screen = RAW.Screen.enable();
const resizeEventID = RAW.on('resize', onResize);//same as '[RAW.]Screen.on(..)'. ^_^

console.eol(2);
console.high('RAW % enabled (%)', 'SCREEN', screen);
console.info('% event set (%)', 1, resizeEventID);
console.eol(4);

checkRawType(process.stdio[1], true);

setTimeout(() => {
	const a = RAW.Screen.disable(screen);
	const b = RAW.off(resizeEventID);

	console.eol(4);
	console.warn('% event disabled (%)', 1, b);
	console.high('RAW % disabled (%)', 'SCREEN', a);

	checkRawType(process.stdio[1], false);
}, DELAY);

