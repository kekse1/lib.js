#!/usr/bin/env node.js

require('tty/vector');

vector.line(7, 7, 7, 28, false, 'ab', 'random', 'random', false, 0, true, false, false);
vector.line(7, 7, 28, 7, false, 'xy', 'random', 'random', true, 0, true, false, false);
vector.line(9, 9, 9, 9, false, 'cz', '#fff', '#000', true, 0, true, false, false);

