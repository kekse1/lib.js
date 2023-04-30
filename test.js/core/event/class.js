#!/usr/bin/env node.js

class MyClass extends EVENT
{
	constructor()
	{
		//
		super();

		//
		this.once('test', this.test);

		//
		this.emit('test');
		this.emit('test');

		//
		this.on('test2', this.test2, 2);

		//
		this.emit('test2');
		this.emit('test2');
		this.emit('test2');
	}

	ontest()
	{
		dir('ontest()');
	}

	test()
	{
		dir('test()');
	}

	test2()
	{
		dir('test2()');
	}
}

const mc = new MyClass();

