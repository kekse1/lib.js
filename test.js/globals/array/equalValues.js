#!/usr/bin/env node.js

const arr1 = [ 1, 2, 3, 4 ];
const arr2 = [ 3, 1, 2, 4 ];
const arr3 = [ 1, 1, 2, 3, 4 ];
const arr4 = [ 9 ];
const arr5 = [ 2, 1, 4, 3 ];
const arr6 = [ 2, 1, 4, 3, 7, 8 ];
const arr7 = [ 2, 1, 4 ];
const arr8 = [ 2, 1, 4, 3, 3 ];
const arr9 = [ 9 ];
const arra = [ 1, 2, [ 3, 4, [ 5, 6 ] ] ];
const arrb = [ 1, 2, [ 3, 4, [ 6, 5 ] ] ];
const arrc = [ 1, 2, [ 3, 4, [ 5, 6, 7 ] ] ];

dir(arr1, '(a)', true);
dir(arr2, '(b)', true);
dir(arr3, '(c)', true);
dir(arr4, '(d)', true);
dir(arr5, '(e)', true);
dir(arr6, '(f)', true);
dir(arr7, '(g)', true);
dir(arr8, '(h)', true);
dir(arr9, '(i)', true);
dir(arra, '(j)', true);
dir(arrb, '(k)', true);
dir(arrc, '(l)', true);

console.eol(4);

const res1 = Array.equalValues(arr4, arr3);
const res2 = Array.equalValues(arr1, arr2);
const res3 = Array.equalValues(arr1, arr2, arr5);
const res4 = Array.equalValues(arr1, arr2, arr3);
const res5 = Array.equalValues(arr1, arr6);
const res6 = Array.equalValues(arr5, arr7);
const res7 = Array.equalValues(arr5, arr8);
const res8 = Array.equalValues(arr4, arr9);
const res9 = Array.equalValues(arra, arrb);
const resa = Array.equalValues(arra, arrc);
const resb = Array.equalValues(arra, arrb, null);
const resc = Array.equalValues(arra, arrc, null);

dir(res1, 'Array.equalValues(d, c) => false');
dir(res2, 'Array.equalValues(a, b) => true');
dir(res3, 'Array.equalValues(a, b, e) => true');
dir(res4, 'Array.equalValues(a, b, c) => false');
dir(res5, 'Array.equalValues(a, f) => false');
dir(res6, 'Array.equalValues(e, g) => false');
dir(res7, 'Array.equalValues(e, h) => false');
dir(res8, 'Array.equalValues(d, i) => true');
dir(res9, 'Array.equalValues(j, k) => false');
dir(resa, 'Array.equalValues(j, l) => false');
dir(resb, 'Array.equalValues(j, k, null) => true');
dir(resc, 'Array.equalValues(j, l, null) => false');

