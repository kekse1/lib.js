#!/usr/bin/env node.js

const title = process.ARGV.join(' ') || 'Test Title';

const str = ansi.title(title);
dir(str);

process.on('SIGINT', () => { process.exit(); });
process.stdin.resume();

info('to stop send a SIGINT (use <Ctrl>+<C>).. then the shell should restore it\'s own title again.. ;-)');

