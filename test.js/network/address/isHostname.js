#!/usr/bin/env node.js

const hostTrue = 'opladen.leverkusen';
const hostFalse = 'opladen.leverkusen:1234';

const resTrue = address.isHostname(hostTrue);
const resFalse = address.isHostname(hostFalse);
const resHost = address.isHost(hostFalse);

dir(resTrue, 'address.isHostname("' + hostTrue + '")');
dir(resFalse, 'address.isHostname("' + hostFalse + '")');
dir(resHost, 'address.isHost("' + hostFalse + '")');

