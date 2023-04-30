#!/usr/bin/env node.js

const arr = [
	[ [ 'eins', 'zwei' ] ],
	[ [ 'drei', 'vier' ] ],
	[ [ 'five', 'six' ] ]
];

const res1 = arr.select('0.2', true);//true is 3rd param, but can also be 2nd, if not using _function (as below)
const res2 = arr.select('0.1', (_value, _key) => { return (_value + ' @ ' + _key).toRandomCase(); });

dir(res1, 'arr.select("0.2", true)');
dir(res2, 'arr.select(0.1, (_value, _key) => { return (_value + \' @ \' + _key).toRandomCase(); })');

