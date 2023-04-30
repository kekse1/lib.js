#!/usr/bin/env node.js


const text = '<b>dies ist ein <big>test</big>!! :D</b><span style="color: black;">BLACK TEXT</span>';

if(typeof bionic === 'undefined')
{
	require('utility/bionic');
}

stdout(bionic(text, 'html', 'html'));

