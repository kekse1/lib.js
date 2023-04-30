#!/usr/bin/env node.js

const uni1 = 'https://localhost///tmp//test.tmp';
const uni2 = 'http://localhost:1234';

const res1 = path.isValid(uni1, true);
const res2 = path.isValid(uni1, false);
const res3 = path.isValid(uni2, true);
const res4 = path.isValid(uni2 + '/', true);

dir(res1, 'path.isValid(' + uni1.quote('"') + ', true) //true');
dir(res2, 'path.isValid(' + uni1.quote('"') + ', false) //false');
dir(res3, 'path.isValid(' + uni2.quote('"') + ', true) //false');
dir(res4, 'path.isValid(' + (uni2 + '/').quote('"') + ', true) //true');

