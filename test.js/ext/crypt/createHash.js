#!/usr/bin/env node.js

const preSharedKey = 'Passwort';

const withoutSHA = crypt.createHash(preSharedKey, false);
const withSHA = crypt.createHash(preSharedKey, true);

dir(withoutSHA.toString(null), 'crypt.createHash("' + preSharedKey + '", false)');
dir(withSHA.toString(null), 'crypt.createHash("' + preSharedKey + '", true)');

