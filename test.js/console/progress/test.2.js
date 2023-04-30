#!/usr/bin/env node.js
console.progress({
	center: true,
	width: '75%',
	height: 7,
	value: -0.75,
	clear: true,
	left: 'dieses ist\nein test\nzwei',
	top: [ 'Where do you want to go today? ^_^', 'testing..' ],
	bottom: [ '%\\%', String.printf('% / % %', 12288, 16384n, 'files') ],
	right: Math.time.render.short(12345678, true) + '\n' + 'testing..\neins!',
	rightSpace: 3, leftSpace: 3, topSpace: 2, bottomSpace: 2
});

