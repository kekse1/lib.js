#!/usr/bin/env node.js

//
const COUNT = 8;

//
//const [ dimensions, coordinates ] = FIELD.getRandoms(3, 3, 2, false);
const dimensions = FIELD.getRandomDimensions(3, 3, 2, false);
const len = FIELD.getLength(dimensions);

//
dir(dimensions, 'dimensions');
console.eol(3);

//
var sub;

for(var i = 0; i < len; i++)
{
	sub = FIELD.getCoordinates(true, i, dimensions);
	stdout(' %  =>  [ ' + String.repeat(sub.length, '%, ') + ' ]', i, ... sub);
}

console.eol(2);
var tmp;

for(var i = 0; i < COUNT; i++)
{
	sub = FIELD.getIndex(true, dimensions, tmp = FIELD.getRandomCoordinates(null, false, dimensions));
	stdout(' [ %, %, % ]  =>  (%)', tmp[0], tmp[1], tmp[2], sub);
}

console.eol();

