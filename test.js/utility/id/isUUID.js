#!/usr/bin/env node.js

dir(id.uuid.getScheme(false), '..getScheme(false)');
dir(id.uuid.getScheme(true), '..getScheme(true)');
console.eol(6);

const idTrue = uuid();
const idFalse = String.fill(idTrue.length, 'x');
const idShort = uuid(null, true);
const idShortTwo = uuid.short();
const idCmp1 = String.fill(idShort.length, 'y').splice(4, 1, '-');
const idCmp2 = String.fill(idShort.length, 'a').splice(4, 1, '_');
const idCmp3 = String.fill(idShort.length, 'a').splice(4, 1, 'F');

const id1 = '5797c0a9-b05b-42e7-aeec+651adf1b1727';
const id2 = '5797c0a9Fb05bF42e7FaeecF651adf1b1727';
const id3 = '5797c0a9xb05bx42e7xaeecx651adf1b1727';

const resTrue = isUUID(idTrue);
const resFalse = isUUID(idFalse);
const resShort = isUUID(idShort);
const resShortTwo = isUUID(idShortTwo);
const resCmp1 = isUUID(idCmp1);
const resCmp2 = isUUID(idCmp2);
const resCmp3 = isUUID(idCmp3);

console.eol(3);

dir(resTrue, 'isUUID("' + idTrue + '") // true');
dir(resFalse, 'isUUID("' + idFalse + '") // false');
dir(resShort, 'isUUID("' + idShort + '") // true');
dir(resShortTwo, 'isUUID("' + idShortTwo + '") // true');
dir(resCmp1, 'isUUID("' + idCmp1 + '") // false');
dir(resCmp2, 'isUUID("' + idCmp2 + '") // true');
dir(resCmp3, 'isUUID("' + idCmp3 + '") // false');

console.eol(2);

const res1 = isUUID(id1);
const res2 = isUUID(id2);
const res3 = isUUID(id3);

dir(res1, 'isUUID("' + id1 + '") // false');
dir(res2, 'isUUID("' + id2 + '") // false');
dir(res3, 'isUUID("' + id3 + '") // true');

