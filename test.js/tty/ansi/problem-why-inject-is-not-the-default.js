#!/usr/bin/env node.js


INJECT = true;

log(('dies ' + ('ist ' + 'ein test'.brightRed + ' weitergehend').brightYellow + ' nunmehr...') + ' (with INJECT)');

INJECT = false;

log(('dies ' + ('ist ' + 'ein test'.brightRed + ' weitergehend').brightYellow + ' nunmehr...') + ' (without INJECT)');



console.eol(7);


const str = 'injection'.color('#f00');

const res1 = ansi.color24.fg('#ff0', str + ' (_inject = false)', null, true, false);
const res2 = ansi.color24.fg('#ff0', str + ' (_inject = true)', null, true, true);

process.stdout.write(res1 + EOL);
process.stdout.write(res2 + EOL);

