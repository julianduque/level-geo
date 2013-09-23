var test  = require('tape');
var level = require('level-test')({ mem: true });
var es    = require('event-stream');
var Geo   = require('../');
var db    = Geo(level());

// Data
var geoPoint = require('./fixtures/geo-point.json');
var points = [
  { name: 'Pedro', lat: 6.233608, lng: -75.577697 }, // Medellin
  { name: 'Juan', lat:  6.155215, lng: -75.60395 }, // Sabaneta
  { name: 'Mario', lat: 6.137221 , lng: -75.386350 }, // Rionegro
  { name: 'Camilo', lat: 26.832983, lng: -80.889393 } // USA
];

test('init', function (t) {
  var count = 0;
  points.forEach(function (d) {
    db.put('myIndex_' + count++, d, function (err) {});
    if (count == 4) {
      t.end();
    }
  });
});

test('core', function (t) {
  t.plan(7);

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


  var bbox = [[-75.86, 5.99], [-75.20, 6.35]];
  var result = db.createSearchStream({ bbox: bbox });
  result.pipe(es.writeArray(function (err, data) {
    t.deepEqual(data, [
      { 'key': 'myIndex_2', value: { name: 'Mario', lat: 6.137221 , lng: -75.386350 } },
      { 'key': 'myIndex_1', value: { name: 'Juan', lat:  6.155215, lng: -75.60395 } },
      { 'key': 'myIndex_0', value: { name: 'Pedro', lat: 6.233608, lng: -75.577697 } }
    ]);
  }));


});
