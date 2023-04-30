#!/usr/bin/env node.js

require('tty/vector');

dir(console.width, 'console.width');

dir(vector.x(0, 1, 2, 3), 'x(0, 1, 2, 3)');
dir(vector.x(-1, -2, -3, -4), 'x(-1, -2, -3, -4)');

