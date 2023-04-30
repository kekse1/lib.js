#!/usr/bin/env node.js

const a = [ 1, 2, 3 ];
const b = [ 3, 4, 5 ];

a.merge({ eins: 'EINS', zwei: 'ZWEI', array: b });

const c = [ 5, 6, 7 ];

a.merge({ array: c });

dir(a);

