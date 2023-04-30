#!/usr/bin/env node.js

//
const value1 = 65535;
const value2 = 65536;

//
const bits1 = DISK.toBits(value1);
const bits2 = DISK.toBits(value2);

const bytes1 = DISK.toBytes(value1);
const bytes2 = DISK.toBytes(value2);

//
const inval1 = DISK.fromBits(bits1);
const inval2 = DISK.fromBytes(bytes2);

//
const res1 = DISK.bitsToBytes(bits1);
const res2 = DISK.bytesToBits(bytes1);
const res3 = DISK.bitsToBytes(bits2);
const res4 = DISK.bytesToBits(bytes2);

//
dir(value1, 'value #1');
dir(value2, 'value #2');
console.eol(4);

dir(bits1, '.toBits(#1, true)');
dir(bits2, '.toBits(#2, true)');
console.eol(2);
dir(bytes1, '.toBytes(#1)');
dir(bytes2, '.toBytes(#2)');
console.eol(3);

dir(inval1, '.fromBits(.toBits(#1))');
dir(inval2, '.fromBytes(.toBytes(#2))');
console.eol(3);

dir(res1, '.bitsToBytes(.toBits(#1))');
dir(res2, '.bytesToBits(.toBytes(#1))');
dir(res3, '.bitsToBytes(.toBits(#2))');
dir(res4, '.bytesToBits(.toBytes(#2))');

