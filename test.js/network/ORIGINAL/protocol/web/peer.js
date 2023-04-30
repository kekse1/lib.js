#!/usr/bin/env node.js

WEB = require('net/protocol/web/');

const peer = WEB.Peer.create({ host: '127.0.0.1' });

peer.server.start();

