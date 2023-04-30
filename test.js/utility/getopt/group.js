#!/usr/bin/env node.js

if(typeof ansi === 'undefined')
{
	require('tty/ansi');
}

const args = getopt({
	help: { short: '?', call: 'help' },
	bold: { short: 'b', group: 'styles', help: 'Using ANSI escape sequence:\n# ansi.style.bold()' },
	blink: { short: 'B', group: 'styles', help: 'Using ANSI escape sequence:\n# ansi.style.blink()' },
	underline: { short: 'u', group: 'styles', help: 'Using ANSI escape sequence:\n# ansi.style.underline()' },
	conceal: { short: 'c', group: 'styles' }
});

if(args.COUNT === 0)
{
	console.warn('No arguments specified (see % / % help output of getopt)', '--help', '-?');
}
else if(args.ARGV.length === 0)
{
	console.warn('Missing an arbitrary text to handle ansi styles on it');
}
else
{
	var text = args.ARGV.join(' ');

	for(const g in args.GROUP.styles)
	{
		if(!!args.GROUP.styles[g])
		{
			text = ansi.style[g](text);
		}
	}

	console.log(text);
}

