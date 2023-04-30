#!/usr/bin/env node.js

dir(path.depth(''), 'path.depth("")');
dir(path.depth('/'), 'path.depth("/")');
dir(path.depth('/tmp//'), 'path.depth("/tmp//")');

