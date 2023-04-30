#!/usr/bin/env node.js

const str = 'ab c de f'.toRandomCase();

const res1 = str.only(' ', 'ab');
const res2 = str.only('a', 'b', 'c', 'de', 'f', 32);
const res3 = str.only('a', 'b', 'c', 'de', 'f', 32, false);
const res4 = str.only('ab', 'c', 32, 'd', 'e', 'f', " ");
const res5 = str.only('ab', 'c', 32, 'd', 'e', 'f', false);
const res6 = str.only(... str.toLowerCase().getAlphabet());
const res7 = str.only(... str.toUpperCase().getAlphabet(), false);

const s = str.quote();

//
dir(res1, s + '.only(" ", "ab") // false');
dir(res2, s + '.only("a", "b", "c", "de", "f", 32) // false');
dir(res3, s + '.only("a", "b", "c", "de", "f", 32, false) //. true');
dir(res4, s + '.only("ab", "c", 32, "d", "e", "f", " ") // false');
dir(res5, s + '.only("ab", "c", 32, "d", "e", "f", false) // true');
dir(res6, s + '.only(... ' + s + '.toLowerCase().getAlphabet()) // false');
dir(res7, s + '.only(... ' + s + '.toUpperCase().getAlphabet(), false) // true');

