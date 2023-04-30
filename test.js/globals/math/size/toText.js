#!/usr/bin/env node.js

const size = Math.size.render(4096);

dir(size, 'Math.size.render(4096)');
dir(size.toText(), '.toText()');
log(size.toText(true));
log(size.toText(true, true));

