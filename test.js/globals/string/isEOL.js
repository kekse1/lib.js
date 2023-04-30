#!/usr/bin/env node.js

var str = 'abc<br />\r\nabc\r';

//
const res0 = str.isEOL(3, true);//
const res1 = str.isEOL(3);	//'<br >\r\n'
const res2 = str.isEOL(9);	//'\r\n'
const res3 = str.isEOL(10);	//'\n'
const res4 = str.isEOL(-1);	//'\r'
const res5 = str.isEOL(-2);	//''

//
str = str.escapeC().toString('"');

//
dir(res0, str + '.isEOL(3, true); // "<br />\r\n"');
dir(res1, str + '.isEOL(3);  // ""');
dir(res2, str + '.isEOL(9);  // "\r\n"');
dir(res3, str + '.isEOL(10); // "\n"');
dir(res4, str + '.isEOL(-1); // "\r"');
dir(res5, str + '.isEOL(-2); // ""');

