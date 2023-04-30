#!/usr/bin/env node.js

const fig1 = Figure.parse('8.00125');
const fig2 = parseFigure('4.75');

dir(fig1 + ' * ' + fig2);

fig1.add(fig2);

dir(' = ' + fig1);

