#!/usr/bin/env node.js

function callback(_event, _value)
{
	dir(_value, { text: _event.event.quote() + ' @ ' + _event.id, compact: true, depth: 1 });
	console.eol(4);
}

const res = RAW.enable({ screen: callback, key: callback });
dir(res, 'RAW.enable({ screen: 1 })');
console.eol();
dir(process.stdio[0].rawID, '[0]..rawID');
dir(process.stdio[1].rawID, '[1]..rawID');
dir(process.stdio[1].rawInfo, { text: '..rawInfo', depth: 1, compact: true });
dir(process.stdio[1].screenCallback, { text: '..screenCallback', depth: 1, compact: true });

console.eol(4);
//dir(RAW.disable(process.stdio[1].rawID));
//dir(RAW.disable(process.stdio[1].rawInfo));
//dir(RAW.disable(res));
//dir(RAW.disable(proRAW-ID!!
//dir(RAW.disable([process.stdio[0].rawID,process.stdio[1].rawID]));
//dir(RAW.disable([process.stdio[0],process.stdio[1]]));
console.eol(4);
console.info('try out the %.% options in this \'%\'', 'RAW', 'disable()', __filename);
console.eol(4);

//
process.stdin.resume();

