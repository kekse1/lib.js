#!/usr/bin/env node.js

/*
/ ich moechte das call-argument parsen...
/
/ und falls ein string oder string-array bei result[0],
/ gucke ich, ob diese strings in 'getopt.call' definiert
/ sind, um sie dort zu starten...
/
/ diese werden dann heraus gefiltert, um den rest noch
/ zu starten zu versuchen, der nicht unter 'getopt.call'
/ liegt (also @ tryCall())...
/
/ am ende habe ich entweder alle (undefined), und somit
/ (undefined)-rueckgabe (und damit keine result-adaption),
/ oder das result-array, falls mehr als eine funktion(!);
/
/ etc...
 */

//
function call(_event, ... _args)
{
	if(_args.length === 0)
	{
		return String.render(_event.value) + ' (-/-)';
	}
	else for(var i = 0; i < _args.length; ++i)
	{
		stdout('[%] %', i, _args[i]);
	}

	return String.render(_event.value) + ' (' + _args.length + ')';
}

global.testFunc = call;

//
const call0 = 'testFunc';
const call1 = 'testFunc(eins, zwei, 3.14)';
const call2 = [ 'testFunc', 'eins', 'zwei' ];
const call3 = call;
const call4 = null;//[ call, 'echt' ];

//
const nullDefault = [ 'EINS', 'ZWEI', 'DREI', 'VIER', 'FIVE', 'SIX', 'SEVEN' ];

const args = getopt({
	call0: { short: 0, call: call0, args: 0, null: nullDefault },
	call1: { short: '1', call: call1, args: 1, null: nullDefault },
	call2: { short: '2', call: call2, args: 2, null: nullDefault },
	call3: { short: '3', call: call3, args: 3, null: nullDefault },
	call4: { short: 4, call: call4, args: 4, null: nullDefault },
});

//
dir(args.RESULT, 'args.RESULT');
dir(args.CALL, 'args.CALL');

