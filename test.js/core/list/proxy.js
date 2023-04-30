#!/usr/bin/env node.js

const list = LIST.create(16, Uint32Array);

dir(list.toString(), 'LIST.create(16, Uint32Array)');
console.eol(4);

//
const res1 = list['  !12b4  +4   / 10 '];
const res2 = list['!8n3 +9 7 5 +3'];
const res3 = list['!8m2 14 // 10'];
const res4 = list[' 2 7 11/10'];
const res5 = list[' ! 11 -1'] = 255;
const res6 = list['!1 -1 -1'];
const res7 = list['-1 -1'] = 255;
const res8 = list['-1'];
const res9 = list['!1 -1'];
const res10 = list['-1'] = 255;
const res11 = list['!2 m -1 -1'] = 255;
const res12 = list['!2 m -1 -1'];
const res13 = list['+30'];
const res14 = list['30'];
const res15 = list['-1/10'];
const res16 = list['-1'] = 255;

dir(res1, '[  !12b4  +4   / 10 ]');
dir(res2, '[!8n3 +9 7 5 +3]');
dir(res3, '[!8m2 14 // 10]');
dir(res4, '[ 2 7 11/10]');
dir(res5, '[ ! 11 -1 ] = 255');
dir(res6, '[!1 -1 -1]');
dir(res7, '[-1 -1] = 255');
dir(res8, '[-1]');
dir(res9, '[!1 -1]');
dir(res10, '[-1] = 255');
dir(res11, '[!2 m -1 -1] = 255');
dir(res12, '[!2 m -1 -1]');
dir(res13, '[+30]');
dir(res14, '[30]');
dir(res15, '[-1/10]');
dir(res16, '[-1] = 255');

