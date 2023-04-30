#!/usr/bin/env node.js

//'FIELD.getRandomDimensions()' and 'FIELD.getRandomCoordinates()' *BOTH* are being called
//by 'FIELD.getRandoms()', if you want a result [ randomDimensions, randomCoordinates ]..! ;-)
//
//so here we test both in just one call of 'getRandoms()' (respective two times tested here,
//one with an done without floating point numbers.. IF i'll allow them l8rs.. to see, to do..

//
const [ floatDimensions, floatCoordinates ] = FIELD.getRandoms(8, 10, 2, true);
const [ intDimensions, intCoordinates ] = FIELD.getRandoms(8, 10, 2, false);

//
console.eol(2);
console.line({ left: ' FIELD.getRandoms(8, 10, 2, true) ', eol: 3 });
dir(floatDimensions, '(floating point) DIMENSIONS');
console.eol();
dir(floatCoordinates, '(floating point) COORDINATES');
console.eol(4);
console.line({ left: ' FIELD.getRandoms(8, 10, 2, false) ', eol: 3 });
dir(intDimensions, '(integer) DIMENSIONS');
console.eol();
dir(intCoordinates, '(integer) COORDINATES');
console.eol(2);
console.line({ eol: 2 });

