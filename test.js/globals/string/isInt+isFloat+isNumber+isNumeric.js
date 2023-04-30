#!/usr/bin/env node.js

//int, float, number, numeric

const intHexStr = 'ff';
const floatStr = '3.14';
const bigBinTrue = '1001n';
const bigBinFalse = '1201n';
const bigBin = '11n';
const binary = String.fromCharCode(255);

const res0 = intHexStr.isInt();//false
const res1 = intHexStr.isInt(16);//true
const res2 = intHexStr.isFloat(16);//false
const res3 = floatStr.isInt();//false
const res4 = floatStr.isFloat();//true
const res5 = bigBinTrue.isNumeric(2);//true
const res6 = bigBinFalse.isNumeric(2);//false
const res7 = bigBin.isNumber(2);//false
const res8 = intHexStr.isNumber(16);//true
const res9 = intHexStr.isNumber();//false
const resA = binary.isNumber(256);//true
const resB = binary.isInt(256);//true
const resC = binary.isFloat(256);//false
const resD = binary.isNumeric(256);//true

dir(res0, intHexStr.toString('"') + '.isInt()   // false');
dir(res1, intHexStr.toString('"') + '.isInt(16)   // true');
dir(res2, intHexStr.toString('"') + '.isFloat(16)   // false');
dir(res3, floatStr.toString('"') + '.isInt()   // false');
dir(res4, floatStr.toString('"') + '.isFloat()   // true');
dir(res5, bigBinTrue.toString('"') + '.isNumeric(2)   // true');
dir(res6, bigBinFalse.toString('"') + '.isNumeric(2)   // false');
dir(res7, bigBin.toString('"') + '.isNumber(2)   // false');
dir(res8, intHexStr.toString('"') + '.isNumber(16)   // true');
dir(res9, intHexStr.toString('"') + '.isNumber()   // false');
dir(resA, binary.toString('"') + '.isNumber(256)   // true');
dir(resB, binary.toString('"') + '.isInt(256)   // true');
dir(resC, binary.toString('"') + '.isFloat(256)   // false');
dir(resD, binary.toString('"') + '.isNumeric(256)   // true');

