#!/usr/bin/env node.js

ansi.cursor(-1, -7);
ansi.write('-1/-7');

ansi.cursor(-10, -10);
ansi.write('-10/-10');


ansi.cursor('75%', '25%');
ansi.write('75%/25%');

ansi.cursor('-75%', '-25%');
ansi.write('-75%/-25%');

ansi.cursor.home();

