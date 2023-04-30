#!/usr/bin/env node.js

//
// 'String.render({ escape: .. })' uses:
// # String.prototype.{,un}escapeHex();
// # String.prototype.{,un}escapeCTRL();
// # String.prototype.{,un}escapeISO();
// # String.prototype.{,un}escapeC();
//

const str = String.fromCharCode(27) + 'ein\n\ttest' + String.fromCharCode(0);

const res1 = String.render(str, { escape: 'hex', colors: true, stringColors: false });
const res2 = String.render(str, { escape: 'ctrl', colors: true, stringColors: false });
const res3 = String.render(str, { escape: 'iso', colors: true, stringColors: false });
const res4 = String.render(str, { escape: 'c', colors: true, stringColors: false });

console.eol();
dir(str, '(string)');
console.eol(4);
console.log(res1);
console.eol();
console.log(res2);
console.eol();
console.log(res3);
console.eol();
console.log(res4);
console.eol(2);

