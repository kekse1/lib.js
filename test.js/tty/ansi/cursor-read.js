#!/usr/bin/env node.js

const cb = (_event) => {
	dir(_event, { compact: true, depth: 1, text: '[0] _event' });
};

ansi.read(cb);

