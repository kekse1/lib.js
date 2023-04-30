#!/usr/bin/env node.js
const gridString = 'ab	cd	ef' +
	EOL + 'dc	fe	ba' +
	EOL + 'ef	ab	cd' +
	EOL + 'ba	dc	fe' +
	EOL + 'cd	ef	ab' +
	EOL + 'fe	ba	dc';
//
const result = String.table(gridString);
console.eol();
process.stdout.write('_GRID_\n\t' + result.toString().split(EOL).join(EOL + '\t'));
console.eol(2);
dir(result, 'String.table(GRID-String)');
dir(result.toString(), '(GRID).toString()');
console.eol(2);
