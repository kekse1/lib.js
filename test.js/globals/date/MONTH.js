#!/usr/bin/env node.js

dir(Date.MONTH(-1), 'Date.MONTH(-1)');
dir(Date.MONTH(0), 'Date.MONTH(0)');
dir(Date.MONTH(), 'Date.MONTH()');
dir(Date.MONTH(new Date()), 'Date.MONTH(new Date())');
dir(Date.MONTH(null, true), 'Date.MONTH(null, true)');

