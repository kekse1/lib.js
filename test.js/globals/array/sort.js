#!/usr/bin/env node.js
//

//these could be sub-array, too, E.G.. every item with '.length' priority (Number)
const a = [ 'eins zwei drei', 'abc', 'x y z d e f', 'absdfsdfsdfsdfsdfdsfdsf '];

dir(a, '(array)');

a.sort();

dir(a, '(array).sort()');

a.sort(null, false);

dir(a, '(array).sort(null, false)');

