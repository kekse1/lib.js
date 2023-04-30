#!/usr/bin/env node.js

const REVERSE = false;
const DELAY = 100;
const ADD = 0.05;

console.progress({
	/*y: 0.75,*/
	//x: 10,
	//width: 0.5,
	//width: 0.50,
	//height: 0.5,
	center: true,
	width: '75%',
	clear: true,
	timeout: DELAY,
	animation: (REVERSE ? -ADD : ADD),
	value: (REVERSE ? 1 : 0),
	//height: 3,
	//clear: true,
	left: 'dieses ist\nein test\nzwei',
	top: [ 'Where do you want to go today? ^_^' ],
	//bottom: [ '%\\%', String.printf('% / % %', 12288, 16384n, 'files') ],
	bottom: '%\\%',
	right: Math.time.render.short(12345678, true) + '\n' + 'testing..\neins!',
	rightSpace: 4, leftSpace: 4, topSpace: 2, bottomSpace: 2
});

