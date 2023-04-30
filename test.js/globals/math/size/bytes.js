#!/usr/bin/env node.js

var bytes = 0;
var result = Math.size.render(bytes);

dir(result, 'Math.size.render(' + bytes + ')');
dir(result.toString(), '..toString()');

bytes = 1;
result = Math.size.render(bytes);

dir(result, 'Math.size.render(' + bytes + ')');
dir(result.toString(), '..toString()');

