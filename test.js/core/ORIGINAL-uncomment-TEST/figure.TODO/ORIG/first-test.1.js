#!/usr/bin/env node.js

const fig1 = parseFigure('1.234');
const fig2 = Figure.parse('7.89');

//
dir(fig1.render() + ' + ' + fig2.toString());

fig1.add(fig2);

dir(' = ' + fig1);

