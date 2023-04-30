#!/usr/bin/env node.js

const id = raw.enable({mouse:true,key:true});

raw.on('key', () => { dir('key'); });
raw.on('mouse', () => { dir('mouse'); });

dir(id);

setTimeout(() => {

	var r = raw.mouse.disable(id.mouse);

	dir(r, 'mouse.disable(' + id.mouse + ')');

	setTimeout(() => {

		r = raw.key.disable(id.key);

		dir(r, 'key.disable(' + id.key + ')');

	}, 5000);

}, 5000);

