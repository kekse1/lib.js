#!/usr/bin/env node.js

const string1 = 'dies-ist-ein-test';
const string2 = 'DerZweiteTest';

require('utility/camel');

const res1 = camel.enable(string1);
const res2 = camel.enable(string2);
const res3 = camel.disable(string1);
const res4 = camel.disable(string2);
const res5 = camel.disable(string2[0].toLowerCase() + string2.substr(1));

dir(res1, 'camel.enable("' + string1 + '")');
dir(res2, 'camel.enable("' + string2 + '")');
dir(res3, 'camel.disable("' + string1 + '")');
dir(res4, 'camel.disable("' + string2 + '")');
dir(res5, 'camel.disable("' + (string2[0].toLowerCase() + string2.substr(1)) + '")');

