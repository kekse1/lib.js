#!/usr/bin/env node.js

const a = ansi.none + ansi.none;
const b = ansi.none + 's';

dir(ansi.hasStrings(a), 'ansi.hasStrings(..)');
dir(ansi.hasStrings(b), 'ansi.hasStrings(...)');

