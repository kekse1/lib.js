#!/usr/bin/env node.js

const uni = new Uniform();

uni.argv = [ 'eins', 'zwei=drei', 'vier=five=six' ];

dir(uni.toString());

const args = [ 'eins', 'zwei' ];
args.drei = 'vier=five=six';
args.vier = true;

uni.args = args;

dir(uni.toString());

