#!/usr/bin/env node.js

const PREC = 2;
const UNIT = 'mb';

//
const bytes = Math.size.parse('4000.75   mib');

const full = Math.size.render(bytes);//.toText();
const unit = Math.size.render(full.toText(), UNIT, 3);//.toText();
const half = Math.size.render(bytes, null, PREC);//.toText();

//
dir(bytes, 'Math.size.parse("4000.75 mib")');
console.eol(2);
dir(full, 'Math.size.render(' + bytes + ')');
dir(full.toText(), '..toText()');
console.eol(2);
dir(unit, 'Math.size.render("' + full.toText() + '", "' + UNIT + '", 3)');
dir(unit.toText(), '..toText()');
console.eol(2);
dir(half, 'Math.size.render(' + bytes + ', null, ' + PREC + ')');
dir(half.toText(), '..toText()');

