#!/usr/bin/env node.js

const dimensions = [ 3, 3, 3 ];

// this will be a check of all (3**3) [3^3]... so we'll receive (FIELD.getLength(.., [ 3, 3, 3 ]))
// ==> (27) coordinates @ [a, b, c] .. ^_^

console.eol(2);
console.line({ left: ' Ternary radix field conversions as example.. ', center: ' ... with 3x digits in [ 0, 1, 2 ] range. ' });
const numberLength = FIELD.getLength(false, dimensions);
const bigLength = FIELD.getLength(true, dimensions);
console.eol();
debug('check calculation: (%) or (%) == (%)', '3**3', '3^3', 27);
console.eol();
dir(numberLength, 'FIELD.getLength(false, [ 3, 3, 3 ])');
dir(bigLength, 'FIELD.getLength(true, [ 3, 3, 3 ])');
console.eol(2);
log('Kinda \'%\' function, compared to \'%\'.. so calculating here the % for all [%-%] %! %', 'inverse', 'ternary-INDEX.js', 'COORDINATES', 0, 26, 'INDICES', '^_^'.highBG);
console.eol(1);

for(var i = 0; i < numberLength; i++)
{
	stdout(' %  =>  [ %, %, % ]', i.toText().pad(2, ' '), ... FIELD.getCoordinates(false, i, dimensions));
	//stdout(' %  =>  [ %, %, % ]', i.toText().pad(2, ' '), ... FIELD.getCoordinates(i, dimensions));
	//stdout(' %  =>  [ %, %, % ]', i.toText().pad(2, ' '), ... FIELD.getCoordinates(i, false, dimensions));
}

//
//TODO/try with bigger i[ndex] values than the .getLength()... and think further then (.pages, matybe modulo, etc.. ;-)
//TODO/also FIELD.getCoordinates(FALSE.. for this situation (also higher index ;-)
//TODO/AND/PLUS: test also the commented lines (2 and 3) above (in the loop), where we permutate/replace some arguments...
//

//
console.eol();

