#!/usr/bin/env node.js
console.progress({
	y: 10,
	value: -0.25,
	height: 1,
	center: true,
	width: 0.5,
	clear: true,
	left: '',
	top: [ 'Where do you want to go today? ^_^' ],
	bottom: [ '%\\%', String.printf('% / % %', 12288, 16384n, 'files') ],
	right: ' ' + Math.time.render.short(Math.random.int(1234567, 12345), true)
});
