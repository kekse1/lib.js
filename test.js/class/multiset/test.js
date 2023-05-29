#!/usr/bin/env node.js

const ms = new MultiSet();

//ms.negative = false;
//ms.floating = false;

ms.inc('test', 2);

dir(ms.has('test'), '(MultiSet).has("test")');
ms.dec('test');
dir(ms.get('test'), '...get("test") // the same');
ms.dec('test');
dir(ms.has('test'), '(after .dec("test"))');
ms.dec('test');
dir(ms.get('test'), '(after .dec("test"))');
ms.dec('test');
dir(ms.get('test'), '(after .dec("test"))');
ms.negative = true;
ms.dec('test');
dir(ms.get('test'), '(after .negative = true; .dec("test"))');

