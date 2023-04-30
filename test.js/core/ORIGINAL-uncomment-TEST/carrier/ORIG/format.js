#!/usr/bin/env node.js

const SIZE = 512;
const UNIT = 'KiB';

const carrier = CARRIER.create(null, './' + SIZE + '.' + UNIT, SIZE + UNIT, 256, false, 65536);

