var test = require('tape');
var level = require('level-test')({ mem: true });
var Geo = require('../');

var geoPoint = require('./fixtures/geo-point.json');

test('core', function (t) {
  t.plan(6);
  var db = Geo(level());

  db.put("pepe", "sanchez", function (err) {
    t.error(err);

    db.get("pepe", function (err, val) {
      t.error(err);

      t.equal('sanchez', val);
    });
  });

  db.put("geo", geoPoint, function (err) {
    t.error(err);

    db.get("geo", function (err, val) {
      t.error(err);

      t.deepEqual(geoPoint, val);
    });
  });

});
