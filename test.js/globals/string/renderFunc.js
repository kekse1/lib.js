#!/usr/bin/env node.js

//TODO/more options...

function testFunc()
{
}

const res1 = String.render(testFunc);
const res2 = String.render(testFunc, { colors: true, typeOf: true });
const res3 = String.render(() => {}, { colors: true, typeOf: true });

log(res1);
log(res2);
log(res3);

