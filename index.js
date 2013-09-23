var sublevel = require('level-sublevel'),
    es       = require('event-stream'),
    geoUtils = require('./lib/geo-utils'),
    rTree    = require('rtree');

module.exports = function (_db) {
  function Geo() {}

  _db = sublevel(_db);

  Geo.prototype = _db.sublevel('data');

  var _index    = _db.sublevel('index'),
      db        = new Geo(),
      rtree     = rTree();

  //
  // Load Index
  //
  _index.get('_index', function (err, val) {
    if (!err) {
      rtree.setTree(val);
    }
  });

  //
  // Override put
  //
  var put = db.put;
  db.put = function (key, val, cb) {
    if (geoUtils.isGeo(val)) {
      geoUtils.getGeoJSON(key, val, function (json) {
        rtree.geoJSON(json);
        _saveIndex();
      });
    }

    put.call(db, key, val, { valueEncoding: 'json'}, cb);
  };

  //
  // Override get
  //
  var get = db.get;
  db.get = function (key, cb) {
    get.call(db, key, { valueEncoding: 'json' }, cb);
  };


  //
  // Search Stream
  //
  db.createSearchStream = function (opts) {
    var results = rtree.bbox(opts.bbox || []);
    var ts = es.map(function (data, callback) {
      var self = this;
      var key = data.properties['_key'];
      db.get(key, function (err, value) {
        if (err) return callback(err);

        callback(null, { key: key, value: value });
      });
    });
    return es.readArray(results).pipe(ts);
  };

  //
  // Save index structure in db
  //
  function _saveIndex() {
    _index.put('_index', rtree.getTree(), function (err) {});
  }

  return db;
};

