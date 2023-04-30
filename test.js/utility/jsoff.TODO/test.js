#!/usr/bin/env node.js

const n = NODE.create();
n.eins = 'EINS';
n.zwei = [ 'eins', 'zwei', 3.14, 2048n ];
n.drei = { u: undefined, n: null, b: true, d: new Date() };
n.vier = () => { dir("ABC"); };
n.five = /regex/gi;
n.err = new Error('test-error');

dir(n, '(object/NODE)');
console.eol(4);

require('utility/jsoff');
const res = JSOFF.stringify(n);

dir(res, 'JSOFF.stringify(object/NODE)');

