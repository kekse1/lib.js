#!/usr/bin/env node.js

dir(Date.WEEKDAY(-1), 'Date.WEEKDAY(-1)');
dir(Date.WEEKDAY(0), 'Date.WEEKDAY(0)');
dir(Date.WEEKDAY(), 'Date.WEEKDAY()');
dir(Date.WEEKDAY(new Date()), 'Date.WEEKDAY(new Date())');
dir(Date.WEEKDAY(null, true), 'Date.WEEKDAY(null, true)');

