#!/usr/bin/env node.js

//
// if (stdin) is getting it's data from a pipe!!
//
//you can also test  `echo | ./STDIN.js`.. [BUT '|', NEVER '>' pls x).. ;-)
//

dir(process.STDIN, 'process.STDIN');

