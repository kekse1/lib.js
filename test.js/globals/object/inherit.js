#!/usr/bin/env node.js

class superClass
{
	constructor()
	{
		dir('superClass::constructor()');
	}

	static superStaticFunction()
	{
		dir('superClass::superStaticFunction()');
	}

	static get superStaticGetMember()
	{
		dir('superClass::superStaticGetMember');
	}

	superFunction()
	{
		dir('superClass::superFunction()');
	}

	get superGetMember()
	{
		dir('superClass::superGetMember');
	}
}

class newClass
{
	constructor()
	{
		this.test();
	}

	test()
	{
		dir(Object.getOwnPropertyNames(this.__proto__), 'this.__proto__');
		dir(Object.getOwnPropertyNames(newClass), 'newClass');
	}
}

newClass.inherit(superClass);
new newClass();

