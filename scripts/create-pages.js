#!/usr/bin/env node.js

const args = getopt({
	help: { short: '?', call: 'help' },
	encoding: { short: 'e', args: 1, default: encoding, parse: false, help: 'File encoding' },
	extensions: { short: 'x', args: 1, parse: false, help: 'Every single -x another ADDITIONAL file extension' },
	'no-default': { short: 'n', args: 0, parse: false, help: 'Do NOT use the configured extensions (see CONFIG.LOAD)' },
	delete: { short: 'd', args: 0, parse: false, help: 'Instead of creating all the items, just delete (unlink) \'em' }
});

const load = [ ... LOAD ];
const items = [];

if(load.length === 0)
{
	console.warn('No extensions specified in %[%]', null, 'CONFIG', 'LOAD');
	process.exit(1);
}
else if(args.argv.length === 0)
{
	console.error('Please argue with at least one item');
	process.exit(2);
}
else for(var i = 0; i < args.argv.length; ++i)
{
	items.pushUnique(path.basename(args.argv[i]));
}

if(args['no-default'])
{
	load.length = 0;
}

if(args.extensions)
{
	if(String.isString(args.extensions))
	{
		load.push((args.extensions[0] === '.' ? '' : '.') + args.extensions);
	}
	else if(Array.isArray(args.extensions))
	{
		load.concat(args.extensions);
	}
}

if(load.length === 0)
{
	console.error('No extensions defined');
	process.exit(3);
}
else for(var i = 0; i < load.length; ++i)
{
	if(load[i][0] !== '.')
	{
		load[i] = '.' + load[i];
	}
}

console.info('Loaded extensions (w/ %.%) are: [ % ]', 'CONFIG', 'LOAD', load.join(', '));
console.info('Items used: [ % ]', items.join(', '));

const rl = readline.createInterface({
	input: process.stdio[0],
	output: process.stdio[1]
});

const yes = () => {
	const dir = process.cwd();

	for(const i of items)
	{
		for(const e of load)
		{
			if(fs.exists(i + e))
			{
				if(args.delete)
				{
					fs.unlinkSync(i + e);
					console.debug('File \'%\' has been deleted..', i + e);
				}
				else
				{
					console.warn('File \'%\' already exists.. ignoring.', i + e);
				}
			}
			else
			{
				if(args.delete)
				{
					console.warn('File \'%\' not found, so it can\'t be deleted.', i + e);
				}
				else
				{
					fs.writeFileSync(i + e, '', { encoding: args.encoding });
					console.debug('File \'%\' created.', i + e);
				}
			}
		}
	}
};

const no = () => {
	console.warn('Aborting.. nothing created.');
	process.exit(255);
};

console.eol();

var question;

if(args.delete)
{
	question = 'Do you really want to ' + 'DELETE'.high.bold + ' all files (of ' + items.length.toText().colorizeAs('String') + ' items with ' + load.length.toText().colorizeAs('Number') + ' extensions [yes/no]? ';
}
else
{
	question = 'Do you want to continue with these ' + items.length.toText().colorizeAs('Number') + ' items and ' + load.length.toText().colorizeAs('Number') + ' extensions [yes/no]? ';
}

rl.question(question, (_answer) => {
	//
	rl.close();

	//
	if((_answer = _answer[0].toLowerCase()) === 'y')
	{
		yes();
	}
	else
	{
		no();
	}
});

