#!/usr/bin/env node.js

// see 'ansi.styles', etc..
//
// # bold
// # faint
// # italic
// # underline
// # blink
// # inverse
// # conceal
// # strike
//
dir(require('tty/vector').styles, 'vector.styles');

const byteFromArray = vector.style.byte([ 'bold', 'faint', 'italic', 'underline' ]);
const byteFromObject = vector.style.byte({ bold: true, faint: true, italic: true, underline: true, blink: false, inverse: false });//...

dir(byteFromArray, 'byteFromArray');
dir(byteFromObject, 'byteFromObject');

console.eol(3);

const arrayFromByte = vector.style.array(byteFromObject);
const objectFromByte = vector.style.object(byteFromArray);

dir(arrayFromByte, 'arrayFromByte');
console.eol();
dir(objectFromByte, 'objectFromByte');

