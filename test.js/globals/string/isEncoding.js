#!/usr/bin/env node.js

const enc1 = null;
const enc2 = 'base64';
const enc3 = 2;
const enc4 = 'abcdef';

const is1 = String.isEncoding(enc1, true);
const is2 = String.isEncoding(enc2, true);
const is3 = String.isEncoding(enc3, true, true);
const is4 = String.isEncoding(enc4, true, true);
const is5 = String.isEncoding(enc4, true, false);

dir(is1, 'true');
dir(is2, 'true');
dir(is3, 'true');
dir(is4, 'true');
dir(is5, 'false');

