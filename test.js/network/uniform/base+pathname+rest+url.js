#!/usr/bin/env node.js

const url = 'tcp://localhost:1234/test.abc?search#fragment';
const uni = Uniform.create(url);

dir(uni.base, 'Uniform.create("' + url + '").base @ "' + uni.toString() + '"');
dir(uni.pathname, '.pathname');
dir(uni.rest, '.rest');
dir(uni.url, '.url');

