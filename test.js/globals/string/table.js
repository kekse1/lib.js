#!/usr/bin/env node.js
//TODO/ESCAPING '\t'!!! muss auch als wert moeglich werden.. EBENSO '\n' bzw. EOL!!!! ;*-/
//verwende bis dahin einfach base64-werte-codierung oder so.. xD~
const objString = '	a	b	c	d' +
	EOL + 'x	ax	bx	cx	dx' +
	EOL + 'y	ay	by	cy	dy' +
	EOL + 'z	az	bz	cz	dz';
const arrString = 'ab	cd	ef' +
	EOL + 'dc	fe	ba' +
	EOL + 'ef	ab	cd' +
	EOL + 'ba	dc	fe' +
	EOL + 'cd	ef	ab' +
	EOL + 'fe	ba	dc';
//
const result1 = String.table(objString);
console.eol();
process.stdout.write('_OBJECT_\n\t' + result1.toString().split(EOL).join(EOL + '\t'));
console.eol(2);
dir(result1, 'String.table(OBJECT-String)');
//console.log(result1.toString());
console.eol(4);
const result2 = String.table(arrString);
console.eol();
process.stdout.write('_ARRAY_\n\t' + result2.toString().split(EOL).join(EOL + '\t'));
console.eol(2);
dir(result2, 'String.table(ARRAY-String)');
//console.log(result2.toString());
console.eol(2);
