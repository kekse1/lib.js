#!/usr/bin/env node.js

const progress = (_event) => {
	dir(_event, _event.percent + '%');
	sleep(1000);
};

DISK.format(path.join(__dirname, 'format.tmp'), '1kib', 126, 32, false, 200, progress);

