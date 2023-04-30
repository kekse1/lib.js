#!/usr/bin/env node.js

const res1 = FIELD.index([1,1,1,1], path.join(__dirname, 'example-dimensions.json'));
const res2 = FIELD.coordinates(15, path.join(__dirname, 'example-dimensions.json'));

dir(res1, 'FIELD.index([ 1,1,1,1 ], "example-dimensions.json")');
dir(res2, 'FIELD.coordinates(15, "example-dimensions.json")');

