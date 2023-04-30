#!/usr/bin/env node.js

//
const lines1 = [
	'  HTTP/1.1    200     dies ist ok...    ;-)  ',
	'  key:     val..    ...ue  !  '
];

var lines2 = [ '     GET    /test?abc=def&yvw&ghi=jkl#fragment  HTTP/1.1  ' ];
lines2[1] = lines1[1];
// and one time as pure text..
lines2 = lines2.join('\r');//e.g.. ;-D
//lines2 = lines2.join(require('net/protocol/http/http').EOL);

//
const Packet = require('net/protocol/http/packet');

//
var packet = Packet.create(lines1);
console.info('[' + packet.type + ']' + EOL + packet.render(2048, true));

console.eol(2);
packet.info('testing first header');
console.eol(4);

//
packet = Packet.create(lines2);
console.info('[' + packet.type + ']' + EOL + packet.render(4096, true));

console.eol(2);
packet.info('testing');
console.eol(4);

//
dir(packet.getHeader('content-length'), 'content-length');

