#!/usr/bin/env node.js

const lines = [ 'erste zeile', 'zweite zeile', '', 'vierte zeile' ];
const string = lines.join(EOL);

const result = string.prefix(' => ').suffix(' <= ');

log(result);

