#!/usr/bin/env node.js

const list = dependency.require.list();
const tree = dependency.require.tree();

dir(list, 'list (' + list.length + ')');
dir(tree, 'tree (' + tree.LENGTH + ')');

if(list.length !== tree.LENGTH || list.length !== tree.LEN)
{
	console.eol(3);
	console.warn('List length is not equal to tree length/size!');
	console.debug('list.length: %', list.length);
	console.debug('tree.LENGTH: %', tree.LENGTH);
	console.debug('tree.LEN: %', tree.LEN);
}

