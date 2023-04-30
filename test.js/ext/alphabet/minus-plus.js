#!/usr/bin/env node.js

const positive = 256;
const negative = -257;

const res1 = alphabet.toNegative(positive);
const res2 = alphabet.toPositive(negative);

dir(res1, 'alphabet.toNegativeRadix(' + positive + ')');
dir(res2, 'alphabet.toPositiveRadix(' + negative + ')');

