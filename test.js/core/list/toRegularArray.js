#!/usr/bin/env node.js

const list = LIST.create(new Uint32Array([32,64]));

dir(list.toString(), 'LIST.create(new Uint32Array([32,64]))');

dir(list.array, 'list.array BEFORE conversion');

list.toRegularArray(true);

dir(list.array, 'list.array AFTER .toRegularArray(true)');

