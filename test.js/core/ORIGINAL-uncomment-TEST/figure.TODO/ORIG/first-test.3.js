#!/usr/bin/env node.js

const fig1 = Figure.parse('88.124');
const fig2 = parseFigure('3.0028');

dir(fig1 + ' * ' + fig2);

fig1.add(fig2);

dir(' = ' + fig1);

