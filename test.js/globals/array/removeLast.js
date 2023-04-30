#!/usr/bin/env node.js

const arr1 = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

dir(arr1, '(array #1)');
console.eol(2);

const res1 = arr1.removeLast(3);
dir(res1, '(array #1).removeLast(3)');
console.eol();
dir(arr1, '(array #1) after removeLast(3)');

console.eol(4);

const arr2 = [ 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c' ];

dir(arr2, '(array #2)');
console.eol(2);

const res2 = arr2.removeLast(6, 'a', 'b');
dir(res2, '(array #2).removeLast(6, "a", "b")');
console.eol();
dir(arr2, '(array #2) after removeLast(6, "a", "b")');

