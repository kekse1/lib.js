#!/usr/bin/env node.js

dir(Object.keys(network), 'before extra require()..');

require('network/');

dir(Object.keys(network), 'after second require("network/")');

