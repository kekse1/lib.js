#!/usr/bin/env node.js

var str = 'hello world!';

var to = 'hex';
var from = 'utf8';

var old = str;
var res = str.recode(to, from);
dir(res, old.toString('"') + '.recode("' + to + '", "' + from + '")');

from = 'hex';
to = 'base64';

old = res;
res = res.recode(to, from);
dir(res, old.toString('"') + '.recode("' + to + '", "' + from + '")');

from = 'base64';
to = 'utf8';

old = res;
res = res.recode(to, from);
dir(res, old.toString('"') + '.recode("' + to + '", "' + from + '")');

from = 256;
to = 2;

old = res;
res = res.recode(to, from);
dir(res, old.toString('"') + '.recode(' + to + ', ' + from + ')');

from = 2;
to = 16;

old = res;
res = res.recode(to, from);
dir(res, old.toString('"') + '.recode(' + to + ', ' + from + ')');

