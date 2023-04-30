#!/usr/bin/env node.js

const path1 = '/tmp/dir/file.tmp';
const path2 = './tmp/test.tmp';
const path3 = 'tmp/test-dir/';

const parsed1 = path.parse(path1);
const rendered1 = path.render(parsed1);

dir(parsed1, 'path.parse("' + path1 + '")');
dir(rendered1, 'path.render(...)');

const parsed2 = path.parse(path2);
const rendered2 = path.render(parsed2);

dir(parsed2, 'path.parse("' + path2 + '")');
dir(rendered2, 'path.render(...)');

const parsed3 = path.parse(path3);
const rendered3 = path.render(parsed3);

dir(parsed3, 'path.parse("' + path3 + '")');
dir(rendered3, 'path.render(...)');

