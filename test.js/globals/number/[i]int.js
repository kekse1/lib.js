#!/usr/bin/env node.js

// 'Iint' for 'inverse int'..

const test1 = 2.4;
const test2 = 2.6;
const test3 = -2.4;
const test4 = -2.6;

const int1 = test1.int;
const int2 = test1.iint;

const int3 = test2.int;
const int4 = test2.iint;

const int5 = test3.int;
const int6 = test3.iint;

const int7 = test4.int;
const int8 = test4.iint;

dir(int1, '(2.4).int');
dir(int2, '(2.4).iint');

dir(int3, '(2.6).int');
dir(int4, '(2.6).iint');

dir(int5, '(-2.4).int');
dir(int6, '(-2.4).iint');

dir(int7, '(-2.6).int');
dir(int8, '(-2.6).iint');

