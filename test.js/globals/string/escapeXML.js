#!/usr/bin/env node.js

const str = '<big>hello && ..</big>';

const res1 = str.escapeXML();
const res2 = str.escapeXML(true);

dir(res1, str.toString('"') + '.escapeXML()');
dir(res2, str.toString('"') + '.escapeXML(true)');

console.eol();

const resa = res1.unescapeXML();
const resb = res2.unescapeXML();

dir(resa, '.unescapeXML()');
dir(resb, '.unescapeXML()');

