#!/usr/bin/env node.js

const max = 7;
const pad = true;
var string = ansi.bold('dies ist ein test') + '.. abc, def.. h';
const lines = string.adaptLength(max, pad, true, '.', ' >> ', ' << ');

dir(lines, string.quote() + '.adaptLength(' + max + ', ' + pad + ', true, ".", " >> ", " << ")');

