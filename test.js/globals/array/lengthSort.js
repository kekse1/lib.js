#!/usr/bin/env node.js
//

//these could be sub-array, too, E.G.. every item with '.length' priority (Number)
const a = [ 'eins zwei drei', 'abc', 'x y z d e f', 'absdfsdfsdfsdfsdfdsfdsf '];

dir(a, '(array)');

a.lengthSort();

dir(a, '(array).lengthSort()');

a.lengthSort(false);

dir(a, '(array).lengthSort(false)');

