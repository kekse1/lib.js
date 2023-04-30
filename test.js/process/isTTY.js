#!/usr/bin/env node.js

//if ANY process.stdio[] .isTTY.. you'll get back it's index.
//counted from (1), so stdin won't count
//therefore see 'process.STDIN'! ;-)

dir(process.isTTY, 'process.isTTY');

