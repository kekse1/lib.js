#!/usr/bin/env node.js

const url = '/tmp/test.log#hash';
const base = 'http://localhost:1234/';

var res = Uniform.create(url, base);

dir(res.href, 'Uniform.create(url, base)');

res = new Uniform(url, base, 'https');

dir(res.href, 'new Uniform(url, base, scheme)');

