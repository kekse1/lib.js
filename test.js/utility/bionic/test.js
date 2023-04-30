#!/usr/bin/env node.js

const ROWS = 25;
const COLUMNS = 60;

const text = Math.random.text(ROWS, COLUMNS);

if(typeof bionic === 'undefined')
{
	require('utility/bionic');
}

stdout(bionic(text));

