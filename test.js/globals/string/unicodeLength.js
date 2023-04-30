#!/usr/bin/env node.js

const uniStr = '🌟';

dir(uniStr + ': ' + uniStr.length, '🌟'.quote('"') + '.length');
dir(uniStr + ': ' + uniStr.unicodeLength, '🌟'.quote('"') + '.unicodeLength');

