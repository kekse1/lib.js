#!/usr/bin/env node.js

const o = [ { eins: { zwei: 4 } }, { eins: { zwei: 2 } } ];

dir(o, '(array)');

o.sort('eins.zwei');

dir(o, '(array).sort("eins.zwei")');

