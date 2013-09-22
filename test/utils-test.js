var test = require('tape');
var geoUtils = require('../lib/geo-utils');

var noGeo = require('./fixtures/no-geo');
var geoPoint = require('./fixtures/geo-point');

test('utils', function (t) {
  t.plan(6);

  t.notOk(geoUtils.isGeo(null), 'not a geo object');
  t.notOk(geoUtils.isGeo(""), 'not a geo object');
  t.notOk(geoUtils.isGeo(6), 'not a geo object');
  t.notOk(geoUtils.isGeo([]), 'not a geo object');
  t.notOk(geoUtils.isGeo(noGeo), 'not a geo object');

  t.ok(geoUtils.isGeo(geoPoint), 'geo object');
});
