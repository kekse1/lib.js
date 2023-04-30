#!/usr/bin/env node.js

//this makes it easier to interprete (string).matchAll(..)/

const regexp = /test/i;

const string = 'dieser test ist ein test';

const result = string.matches(regexp);

dir(result, string.toString('"') + '.matches(' + regexp + ')');

