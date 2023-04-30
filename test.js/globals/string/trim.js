#!/usr/bin/env node.js

const str1 = ansi.none + '  \t  &nbsp;abcdef<br />testing &nbsp;\t <br />';
const str2 = '  <b>  \ttest \t</b>\t\t';

const res1 = str1.trim(false);
const res2 = str1.trim(true);
const res3 = str1.trim({ ansi: true });
const res4 = str2.trim({ html: true });

var str = str1.quote('"');
dir(res1, str + '.trim(false)');
dir(res2, str + '.trim(true)');
dir(res3, str + '.trim({ ansi: true })');
str = str2.quote('"');
dir(res4, str + '.trim({ html: true })');

