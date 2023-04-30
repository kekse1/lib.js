#!/usr/bin/env node.js

//
const address = 'Sebas\\<tian <<kuchen@kekse.biz>>';
const invalidAddress = 'xx / ab';

//
const parsed = mail.parse(address);
const validated = mail.validate(address);
const result = mail(address);

//
dir(parsed, 'mail.parse("' + address + '")');
dir(validated, 'mail.validate("' + address + '")');
dir(result, 'mail("' + address + '")');
console.eol(3);

//
const invalidParsed = mail.parse(invalidAddress);
const invalidValidated = mail.validate(invalidAddress);
const invalidResult = mail(invalidAddress);

dir(invalidParsed, 'mail.parse("' + invalidAddress + '")');
dir(invalidValidated, 'mail.validate("' + invalidAddress + '")');
dir(invalidResult, 'mail("' + invalidAddress + '")');
console.eol(3);

const fullResult1 = mail(address, address, invalidAddress);
const fullResult2 = mail(true, address, address, invalidAddress);

dir(fullResult1, 'mail(...)');
dir(fullResult2, 'mail(true, ...)');

