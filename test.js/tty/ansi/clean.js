#!/usr/bin/env node.js

//
function ANSI(_seq)
{
	return (ESC + _seq + NUL);
}

var str = ANSI('[41m') + ANSI('[42m') + 'green-bg' + ANSI('[0m') + ' ' + ANSI('[4m') + ANSI('[1m') + 'bold+underline' + ANSI('[9m') + ANSI('[0m') + ANSI('[0m');

console.eol(2);
log(str);
console.eol(3);

var split = ansi.split(str);
dir(split, 'ansi.split() BEFORE ansi.clean() => length: ' + split.length);

//
str = ansi.clean(str);
console.eol(2);
warn('ansi.clean() should cause following changes (in ansi.split() output(s)):' + EOL
	+ EOL + '# "[41m" goes away (%)'
	+ EOL + '# "[9m" goes away (%)'
	+ EOL + '# "[0m" is 2 times at the end -> should stay one time only (%)' + EOL
	+ EOL + '.. so i think length was % and should be % after ansi.split()!',
	'color.bg.4.red', 'style.strike', 'clear.reset', split.length, split.length - 3);

//
split = ansi.split(str);
console.eol(2);
dir(split, 'ansi.split() AFTER ansi.clean() => length: ' + split.length);
console.eol(3);
log(str);

//
console.eol(2);

