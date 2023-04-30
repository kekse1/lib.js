#!/usr/bin/env node.js

dir(Object.keys(Object.getPrototypesOf(process.stdin)), '(process.stdin)');
dir(Object.keys(Object.getPrototypesOf(process.stdout)), '(process.stdout)');

