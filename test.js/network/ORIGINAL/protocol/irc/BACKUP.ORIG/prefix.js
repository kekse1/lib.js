#!/usr/bin/env node.js

const Prefix = require('net/protocol/irc/prefix');

const p1 = 'kekse.biz';
const p2 = ':kekse.biz';
const p3 = 'nick!~user';
const p4 = ':nick!user@kekse.biz';

const r1 = Prefix(p1);
const r2 = Prefix(p2);
const r3 = Prefix(p3);
const r4 = Prefix(p4);

dir(r1, '"kekse.biz"');
dir(r2, '":kekse.biz"');
dir(r3, '"nick!~user"');
dir(r4, '":nick!user@localhost"');

console.eol(4);

dir(r1.toString(), '..toString() @ ' + r1.verified + ' w/ ' + r1.isServer);
dir(r2.toString(), '..toString() @ ' + r2.verified + ' w/ ' + r2.isServer);
dir(r3.toString(), '..toString() @ ' + r3.verified + ' w/ ' + r3.isServer);
dir(r4.toString(), '..toString() @ ' + r4.verified + ' w/ ' + r4.isServer);

