#!/usr/bin/env node.js

const res1 = isRadix(10);
const res2 = isRadix('abc');
const res3 = isRadix('abc', true);
const res4 = isRadix(10, true);
const res5 = isRadix(256);
const res6 = isRadix(256, true);
const res7 = isRadix(65536);
const res8 = isRadix(65536, true);
const res9 = isRadix('\n\r');
const resa = isRadix('\n\r', true);

dir(res1, 'isRadix(10)');
dir(res2, 'isRadix("abc")');
dir(res3, 'isRadix("abc", true)');
dir(res4, 'isRadix(10, true)');
dir(res5, 'isRadix(256)');
dir(res6, 'isRadix(256, true)');
dir(res7, 'isRadix(65536)');
dir(res8, 'isRadix(65536, true)');
dir(res9, 'isRadix("\\n\\r")');
dir(resa, 'isRadix("\\n\\r", true)');

