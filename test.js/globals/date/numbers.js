#!/usr/bin/env node.js

const items = [ 'weekInYear', 'isLeapYear', 'daysInYear', 'daysInMonth', 'dayInYear', 'dayByYear', 'yearPercent', 'years', 'year', 'months', 'month', 'days', 'day', 'hours', 'hour', 'minutes', 'minute', 'seconds', 'second' ];
const item = new Date();

for(var i = 0; i < items.length; i++)
{
	dir(item[items[i]], items[i]);
}

