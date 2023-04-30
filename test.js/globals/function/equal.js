#!/usr/bin/env node.js

function eins() {};
const zwei = eins.bind(null);

const res1 = Function.equal(eins, eins, eins);
const res2 = Function.equal(eins, eins, zwei);

dir(res1, 'Function.equal(eins, eins, eins)');
dir(res2, 'Function.equal(eins, eins, zwei)');

