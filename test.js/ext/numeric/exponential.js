#!/usr/bin/env node.js

const f1 = ('-1234.5678E6');
const f2 = ('1234.5678E-6');
const i1 = '-1234e6';
const i2 = '1234e-6';

dir(numeric.fromExponential(i1), 'numeric.fromExponential(' + i1 + ') == ' + _parseInt(i1));//!?
dir(numeric.fromExponential(i2), 'numeric.fromExponential(' + i2 + ') == ' + _parseInt(i2));//..
dir(numeric.fromExponential(f1), 'numeric.fromExponential(' + f1 + ') == ' + _parseFloat(f1));//?
dir(numeric.fromExponential(f2), 'numeric.fromExponential(' + f2 + ') == ' + _parseFloat(f2));//?!

