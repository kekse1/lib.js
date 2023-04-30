#!/usr/bin/env node.js

function test()
{
}

const res1 = test.toString();
const res2 = test.toString(true);
const res3 = test.toString({ colors: true, typeOf: true });
const res4 = test.toString(null);

stdout(res1);
stdout(res2);
stdout(res3);
stdout(res4);

