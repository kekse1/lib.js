#!/usr/bin/env node.js

const path = '/tmp/list-serialization-test.tmp';
const chunk = 8;

var res1, res2;

try
{
	res1 = LIST.createFromFile(path, { chunk });
	res2 = LIST.create({ array: path, chunk });
}
catch(_error)
{
	x(_error);
	//x('MAYBE you should first try "test.js/core/list/save{Regular,Numeric}ArrayToFile.js"..!?' + EOL + 'THEN the file \'%\' should exist.. ;-', null, path);
}

dir(res1.toString(), 'LIST.createFromFile({ array: "' + path + '", chunk: ' + chunk + ' })');
dir(res2.toString(), 'LIST.create("' + path + '", { chunk: ' + chunk + ' })');

console.eol(4);

dir(res1.array, '(list #1).array');
console.eol(2);
dir(res2.array, '(list #2).array');
console.eol();

