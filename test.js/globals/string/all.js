#!/usr/bin/env node.js

const str = 'abcdef  '.toRandomCase();

const res1 = str.all('ab', 'f', 32);//false
const res2 = str.all('ab', 'f', 33);//false

const res3 = str.all('ab', 'f', 32, false);//true
const res4 = str.all('ab', 'f', 33, false);//false

const res5 = str.all(... str.toLowerCase().getAlphabet());//false
const res6 = str.all(... str.toUpperCase().getAlphabet(), false);//true

const s = str.quote();

dir(res1, s + '.all("ab", "f", 32) // false');
dir(res2, s + '.all("ab", "f", 33) // false');
dir(res3, s + '.all("ab", "f", 32, false) // true');
dir(res4, s + '.all("ab", "f" 33, false) // false');
dir(res5, s + '.all(... ' + s + '.toLowerCase().getAlphabet()) // false');
dir(res6, s + '.all(... ' + s + '.toUpperCase().getAlphabet(), false) // true');

