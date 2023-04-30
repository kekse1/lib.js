#!/usr/bin/env node.js

const PATH = path.resolve(process.ARGV[0] || './example.xyz');
const Parser = require('script/parse/parser');

const script = Parser.create(null, PATH);
const result = script.parse();

dir(result, 'script(' + PATH + '): ' + script.size);

