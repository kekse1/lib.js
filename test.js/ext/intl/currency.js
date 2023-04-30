#!/usr/bin/env node.js

const value = 4.90;

const result1 = intl.currency(value, 'USD', 'en');
const result2 = intl.currency(value, 'EUR', 'de');

dir(result1, 'intl.currency(' + value + ', "USD", "en")');
dir(result2, 'intl.currency(' + value + ', "EUR", "de")');

