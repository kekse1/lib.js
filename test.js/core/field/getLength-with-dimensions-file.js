#!/usr/bin/env node.js

dir(FIELD.getLength(path.join(__dirname, 'example-dimensions.json')));
dir(fs.readFileSync(path.join(__dirname, 'example-dimensions.json'), { encoding }));

