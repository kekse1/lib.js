#!/usr/bin/env node.js

const field = FIELD.create(4, 4, Uint32Array);

dir(field.toString(), 'FIELD.create(4, 4, Uint32Array)');
console.eol(4);

//
const res1 = field['  !12b4  +4   / 10 '];
const res2 = field['!8n3 +9 7 5 +3'];
const res3 = field['!8m2 14 // 10'];
const res4 = field[' 2 7 11/10'];
const res5 = field[' ! 11 -1'] = 255;
const res6 = field['!1 -1 -1'];
const res7 = field['-1 -1'] = 255;
const res8 = field['-1'];
const res9 = field['!1 -1'];
const res10 = field['-1'] = 255;
const res11 = field['!2 m -1 -1'] = 255;
const res12 = field['!2 m -1 -1'];
const res13 = field['+30'];
const res14 = field['30'];
const res15 = field['-1/10'];
const res16 = field['-1'] = 255;

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

