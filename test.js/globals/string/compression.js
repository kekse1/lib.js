#!/usr/bin/env node.js

//const text = Math.random.text(40, 80);
const text = 'Hello, World!';
const alpha = text.getAlphabet();


dir(alpha);
console.eol(3);

const a = parseBigInt(text, alpha);
const b = a.toString(alpha);


dir(a);
dir(b);



process.exit(22);


//
const compression = text.compress();

dir(compression, 'alphabet: ' + compression.alphabet.toString('"'));
console.eol(4);

//dir(compression.string.toRadix(compression.alphabet));
dir(compression.string.decompress(compression.alphabet), 'alphabet: ' + compression.alphabet.toString('"'));

