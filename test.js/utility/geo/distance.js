#!/usr/bin/env node.js

//
const lat1 = 51.0676595;
const lon1 = 6.9990757;
const lat2 = 50.938;
const lon2 = 6.96;

//
console.eol();
dir(geo.distances, 'geo.distances (=> see also \'DEFAULT_DISTANCE_ALGORITHM\', on top of \'utility/geo\')');
console.eol();

//
dir(geo.distance(lat1, lon1, lat2, lon2), 'geo.distance(' + lat1 + ', ' + lon1 + ', ' + lat2 + ', ' + lon2 + ') //in metres');
console.eol();

