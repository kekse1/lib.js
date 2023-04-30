#!/usr/bin/env node.js

const o1 = { eins: { zwei: { drei: '123' }, vier: 'tre' } };
const o2 = { fuenf: { sechs: '14' } };

const r = TEXT.makeContext(o1, o2);

dir(o1, '(object #1)');
dir(o2, '(object #2)');
console.eol(4);
dir(r, 'TEXT.makeContext(#1, #2)', { depth: null });

