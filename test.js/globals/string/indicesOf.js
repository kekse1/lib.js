#!/usr/bin/env node.js

//
//TODO/test w/ (_complex = true); .. ;-)
//

const str = 'abc test def abc test def abc test def';

const res1 = str.indicesOf(['ABC', 'DEF']);
const res2 = str.indicesOf(['ABC', 'DEF'], false);
//const res3 = str.indicesOf(['ABC', 'DEF'], false, true);//TODO/

dir(res1, str.quote('"') + '.indicesOf([ "ABC", "DEF" ])');
dir(res2, str.quote('"') + '.indicesOf([ "ABC", "DEF" ], false)');
//dir(res3, str.quote('"') + '.indicesOf([ "ABC', "DEF' ], false, true)');

