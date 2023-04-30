#!/usr/bin/env node.js

//
const url = 'tcp://localhost:1234/test.abc?search#fragment';
const uni = Uniform.create(url);

const resArray = uni.split();
const resObject = uni.split(true);

//
dir(url, '(URL)');
console.eol(4);
dir(resArray, '(URL).split()');
console.eol(2);
dir(resObject, '(URL).split(true)');

