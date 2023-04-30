#!/usr/bin/env node.js

dir(keyLength(String.fill(KEYS, 'abcdef')));
dir(keyLength('', false));
keyLength('', true);

