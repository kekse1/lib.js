#!/usr/bin/env node.js

const regexp = RegExp.parse('/test/gi');
const clone = regexp.clone();

dir(regexp === clone, '(regexp) === (clone)');
dir(RegExp.equal(regexp, clone), 'RegExp.equal((regexp), (clone))');

