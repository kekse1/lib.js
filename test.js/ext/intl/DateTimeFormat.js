#!/usr/bin/env node.js

//
const opts = {
	year: '2-digit',
	month: 'short',
	day: '2-digit',
	hour: 'numeric',
	minute: 'numeric',
	weekday: 'long',
	hour12: true
};

//
const result = intl.DateTimeFormat(Date.now(), LANGUAGE, opts);
dir(result, 'intl.DateTimeFormat(Date.now(), "' + LANGUAGE + '", (options)');

