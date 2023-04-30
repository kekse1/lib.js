#!/usr/bin/env node.js

const mx = MATRIX.create(3, 6, 'Uint8ClampedArray');

mx.setAt(255, 2, 5);

dir(mx.array, 'MATRIX.create(3, 6, Uint8ClampedArray); .. after (matrix).setAt(255, 2, 5) .. @ arrayType = ' + mx.arrayType);

console.eol(3);

dir(mx.getAt(2, 5), 'mx.getAt(2, 5)');

console.eol(3);

log(mx.toTableString());

console.eol(2);

for(var i = 3; i >= -8; i -= 2)
{
	dir(mx.getCoordinates(i), 'mx.getCoordinates(' + i + ')', {compact:true});
}

