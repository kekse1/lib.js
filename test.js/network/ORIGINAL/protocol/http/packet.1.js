#!/usr/bin/env node.js

const RES = '  HTTP/1.1     200     Test:   OK     ';
const REQ = '   GET   /path    HTTP/1.1   ';

const Packet = require('net/protocol/http/packet');
var packet = Packet.create(REQ);

dir(packet.request(), '.request() @ ' + REQ.toString('"'));

packet = Packet.create(RES);
dir(packet.response(), '.response() @ ' + RES.toString('"'));

//
packet.parseHeaderLine('  key:   value  value     value  ');
dir(packet.headers, 'header.headers @ ' + packet.headerLines + ' line(s)..');

